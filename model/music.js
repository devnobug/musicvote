// 数据库操作
const mongoose = require('mongoose');

// 文章模型规则
const musicSchema = new mongoose.Schema({
	// 歌曲名
	name: {
        type: String,
        required: true
    },
    // 歌手信息
    singer:{
        type:String,
        required: true
    },
    // 得票
    vote:{
        type: Number,
        default: 0
    },
    // 歌手头像或者专辑封面
    avatar:{
        type: String,
        default: null
    },
	// 创建时间
	addtime: {
		type: Date,
		default: Date.now
    },
    // 是否播放，默认false未播放，true为已播放
    isplay:{
        type:Boolean,
        default:false
    }
});

const Music = mongoose.model('Music', musicSchema);

// 导出模块成员
module.exports = {
	Music
}
