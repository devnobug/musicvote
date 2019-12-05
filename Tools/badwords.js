const FastScanner = require('fastscan');
const fs = require('fs');
const aes = require('./aes.js');
const path = require('path');
// 定义违禁词
// var words = ["今日头条","微信", "支付宝"]
// var words = eval(fs.readFileSync('./badwords.txt', 'utf-8'));
// var scanner = new FastScanner(words);
// // 要校验的内容
// var content = "这枪官僚主义是来源不明罪弹药"
// // 搜索违禁词
// var offWords = scanner.search(content)
// console.log(offWords)
// // 统计命中次数
// var hits = scanner.hits(content)
// console.log(hits)
module.exports = function(content){
    var words = eval(aes.decryption(fs.readFileSync(path.join(__dirname, 'badwords.aes'), 'utf-8')));  
    var scanner = new FastScanner(words);
    // 搜索违禁词
    var offWords = scanner.search(content);
    if(offWords.length != 0){
        // 检测到违禁词
        return true;
    } else {
        return false;
    }
}