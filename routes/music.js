// 引用expess框架
const express = require('express');
const fs = require('fs');
const path = require('path');

// 引入模型
const { Music } = require('../model/music');
const { Vote } = require('../model/vote');
// 创建博客展示页面路由
const music = express.Router();
// 获取到当前访问者的ip
// ::1
// ::ffff:192.168.31.170

// 增加投票功能
music.get('/vote/:id', async (req, res) => {
    const music_id = req.params.id;
    var index = req.ip.lastIndexOf(':');
    var ip = req.ip.substr(index+1) != '1' ? req.ip.substr(index+1) : '127.0.0.1';
    // 投票之前先检查一下ip地址，如果已经投过了则不能再投票了
    // 每个ip对当前歌曲最多能投10票
    let maxVote = 10;
    let isVote = await Vote.findOne({
        ip:ip,
        music:music_id,
        votenum:{$gte:maxVote}
    });
    console.log(isVote);
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
    return res.send(`助力成功，当前一共${music.vote}个赞`);
});

// 获取歌曲列表，返回歌曲投票信息
music.get('/list', async (req, res) => {
    let musicList = await Music.find().sort('-vote');
    return res.send(musicList);
});
// 添加歌曲功能，自动读取歌单，要求歌单每行数据为：歌曲名-歌手
music.get('/add', async (req, res) => {
    if(req.ip != '::1'){
        return req.status(400).send('当前功能只能在本机运行');
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
module.exports = music;