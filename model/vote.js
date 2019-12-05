// 数据库操作
const mongoose = require('mongoose');

// 文章模型规则
const voteSchema = new mongoose.Schema({
    // 投票ip
    ip: {
        type: String,
        required: true
    },
    // 歌曲id
    music:{
        type: mongoose.Schema.Types.ObjectId,
		ref: 'Music',
    },
    // 当前歌曲已投票数目
    votenum:{
        type: Number,
        // 同一个人对同一首歌最多只能投10票
        max:10,
        default:0
    },
	// 投票时间
	addtime: {
		type: Date,
		default: Date.now
	}
});

const Vote = mongoose.model('Vote', voteSchema);
async function deleteTestVote(){
    // 把本机测试评论删除
    await Vote.deleteMany({ip:'127.0.0.1'});
}
// deleteTestVote();


// 导出模块成员
module.exports = {
	Vote
}
