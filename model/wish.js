// 数据库操作
const mongoose = require('mongoose');

// 文章模型规则
const wishSchema = new mongoose.Schema({
    // 留言ip
    ip: {
        type: String,
        required: true
    },
    // 歌曲id
    music:{
        type: mongoose.Schema.Types.ObjectId,
		ref: 'Music',
    },
    content:{
        type:String
    },    
	// 祝福时间
	addtime: {
		type: Date,
		default: Date.now
	}
});

const Wish = mongoose.model('Wish', wishSchema);

async function deleteTestWish(){
    // 把本机测试评论删除
    await Wish.deleteMany({ip:'127.0.0.1'});
}
// deleteTestWish();

// 导出模块成员
module.exports = {
	Wish
}
