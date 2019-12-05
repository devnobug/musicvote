// 引用expess框架
const express = require('express');
const fs = require('fs');
const path = require('path');
// 引入formidable
const formidable = require('formidable');
const badwords = require('../Tools/badwords.js');


// 引入模型
const { Music } = require('../model/music');
const { Vote } = require('../model/vote');
const { Wish } = require('../model/wish');
// 创建博客展示页面路由
const music = express.Router();
// 获取到当前访问者的ip
// ::1
// ::ffff:192.168.31.170

// 增加投票功能
music.get('/vote/:id', async (req, res) => {
    const music_id = req.params.id;
    var index = req.ip.lastIndexOf(':');
    var ip = (req.ip.substr(index+1) != '1') ? req.ip.substr(index+1) : '127.0.0.1';
    // 投票之前先检查一下ip地址，如果已经投过了则不能再投票了
    // 每个ip对当前歌曲最多能投5票
    let maxVote = 5;
    let isVote = await Vote.findOne({
        ip:ip,
        music:music_id,
        votenum:{$gte:maxVote}
    });
    // console.log(isVote);
    // return res.send();
    if(isVote){
        return res.status(400).send(`您已经投过票了,每首歌最多能投${maxVote}票`);
    }
    // 把当前歌曲的投票数据加一
    let music = await Music.findOneAndUpdate({_id:music_id}, {
        $inc:{
            vote:1
        }
    }, { new: true });
    // 把当前投票信息写入到数据库
    await Vote.findOneAndUpdate({
        ip:ip,
        music:music_id,
    }, {
        $inc:{votenum: 1}
    }, {
        // 不存在则新建
        upsert:true,
        setDefaultsOnInsert:true
    });
    return res.send(music);
});

// 获取歌曲列表，返回歌曲投票信息
music.get('/list', async (req, res) => {
    let musicList = await Music.find({isplayed:false}).sort('-vote');
    return res.send(musicList);
});
// 导入歌曲功能，自动读取歌单，要求歌单每行数据为：歌曲名-歌手
music.get('/import', async (req, res) => {
    if(req.ip != '::1'){
        return res.status(400).send('当前功能只能在本机运行');
    }
    let musicFile = path.join(__dirname, '../', 'music.txt');
    let musicContent = fs.readFileSync(musicFile, 'utf-8');
    let musicList = musicContent.split(/\r\n/);
    for (var i = 0; i < musicList.length; i++) {
		var tmp = musicList[i].split('-');
        await Music.create({
            name:tmp[0],
            singer:tmp[1]
        });
	}
    return res.send(`成功录入${musicList.length}首歌曲`);
});
// 添加一首歌曲
music.post('/add', async (req, res) => {
    // if(req.ip != '::1'){
    //     return res.status(400).send('当前功能只能在本机运行');
    // }
    var index = req.ip.lastIndexOf(':');
    let isAdd = null;
    // 查询当前IP是否已经点过歌了
    try {
        isAdd = await Music.findOne({
            ip:(req.ip.substr(index+1) != '1') ? req.ip.substr(index+1) : '127.0.0.1'
        });
        // return res.send(isAdd); 
    } catch (error) {
        return res.send(error.message);   
    }
    
    if(isAdd){
        return res.status(400).send('当前IP已经点过歌了');
    }
    // 创建表单解析对象
    const form = new formidable.IncomingForm();
    // 配置上传文件的存放位置
    form.uploadDir = path.join(__dirname, '../', 'public', 'uploads');
    // 保留上传文件的后缀
    form.keepExtensions = true;
    // 最大图片4M
    form.maxFieldsSize = 8 * 1024 * 1024;
    // 解析表单
    form.parse(req, async(err, fields, files) => {
        await Music.create({
            ip:(req.ip.substr(index+1) != '1') ? req.ip.substr(index+1) : '127.0.0.1',
            name:fields.name,
            singer:fields.singer,
            avatar:(files.avatar && files.avatar.size != 0) ? files.avatar.path.split('public')[1] : null
        });        
        return res.redirect('/');
    })
    
});


// 根据歌曲id来获取歌曲详细信息
music.get('/info/:id', async (req, res) => {
    const music_id = req.params.id;
    info = await Music.findById(music_id);
    let wishlist = [];
    if(typeof(info) == 'object'){  
        wishlist = await Wish.find({music:music_id});
    }
     
    return res.send({info,wishlist});
});
// 送祝福
music.post('/wish', async (req, res) => {
    let body = req.body;    
    // 检测违禁词，如果违禁直接屏蔽掉
    if(badwords(req.body.content)){
        return res.status(400).send('法海无边回头是岸');
    }
    // 在祝福之前先去根据ip和歌曲id查询一下是否留过言
    var index = req.ip.lastIndexOf(':');
    let isWish = await Wish.findOne({
        ip:(req.ip.substr(index+1) != '1') ? req.ip.substr(index+1) : '127.0.0.1',
        music:body.music_id,
    });
    if (!isWish){
        await Wish.create({
            ip:(req.ip.substr(index+1) != '1') ? req.ip.substr(index+1) : '127.0.0.1',
            music:body.music_id,
            content:body.content
        });
        return res.send({ip:(req.ip.substr(index+1) != '1') ? req.ip.substr(index+1) : '127.0.0.1'});
    }
    return res.status(400).send('当前IP已经留过言了');
});
// 歌曲下的祝福列表 暂时用不到
music.get('/wish/:id', async (req, res) => {
    let wishList = await Wish.find({music:req.query.music_id}).sort('-vote');
    return res.send(wishList);
});
// 随机选取十条祝福作为弹幕数据
music.get('/roundwish', async (req, res) => {
    // var max = await Wish.countDocuments();
    // var skip = Math.floor(Math.random()*(max+1));
    // let wishList = await Wish.find().populate('music').skip(skip).limit(10);
    let wishList = await Wish.find().populate('music');
    // console.log(wishList);
    
    let items = [];
    for(var index in wishList){
        // 如果歌曲已经被删除了，则不显示对应弹幕信息
        if(wishList[index].music){
            items.push({
                img:(wishList[index].music && wishList[index].music.avatar)?wishList[index].music.avatar:'/images/mary.png', //图片 
                info: wishList[index].music.name + '@' + wishList[index].ip + '❤' +  wishList[index].content, //文字 
                href:'http://localhost', //链接 
                close:true, //显示关闭按钮 
                speed:10, //延迟,单位秒,默认6 
                // bottom:70, //距离底部高度,单位px,默认随机 
                color:'#FFC0CB', //颜色,默认白色 
                old_ie_color:'#000000', //ie低版兼容色,不能与网页背景相同,默认黑色 
            });
        }
        
    }
    return res.send(items);
});

// 根据时间获取最新的祝福
music.get('/wishtime/:time', async (req, res) => {
    let wishList = await Wish.find({addtime:{$gte: req.params.time}}).populate('music');
    res.send(wishList);
});

// 已播放功能
music.get('/played/:id', async (req, res) => {
    
    if(req.ip != '::1'){
        return res.status(400).send('当前功能只能在本机运行');
    }
    await Music.updateOne({_id:req.params.id}, {isplayed:true});
    return res.send('已设置播放');
});
module.exports = music;