// 引入express框架
const express = require('express');
// 引入数据库处理模块
const mongoose = require('mongoose');
// 引入路径处理模块
const path = require('path');
// 引入session模块
var session = require('express-session');

// web服务器
const app = express();
// 设置获取ip地址的配置
app.set('trust proxy', true);
// 开放静态资源
app.use(express.static(path.join(__dirname, 'public')));
// session配置
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

// 数据库连接
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost:27017/musicvote', { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
	.then(() => console.log('数据库连接成功'))
    .catch(() => console.log('数据库连接失败'));

// 路由
const music = require('./routes/music');
app.use('/music', music);
// 返回系统监听
app.listen(80, () => console.log('服务器启动成功'));
