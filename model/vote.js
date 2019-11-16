// 数据库操作
const mongoose = require('mongoose');

// 文章模型规则
const voteSchema = new mongoose.Schema({
    // 歌曲名
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

// 导出模块成员
module.exports = {
	Vote
}
