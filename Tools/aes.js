var crypto = require('crypto')
/**
 * AES加密的配置
 * 1.密钥
 * 2.偏移向量
 * 3.算法模式CBC
 * 4.补全值
 */
var AES_conf = {
    key: 'musicvote@nodejs', //16位密钥
    iv: 'authorfromchenxq', //偏移向量
    padding: 'PKCS7Padding' //补全值
}
var aes = {
    /**
     * AES_128_CBC 加密
     * 128位
     * return base64
     */
 
    encryption: function (data) {
        let key = AES_conf.key;
        let iv = AES_conf.iv;
        // let padding = AES_conf.padding;
        var cipherChunks = [];
        var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        cipher.setAutoPadding(true);
        cipherChunks.push(cipher.update(data, 'utf8', 'base64'));
        cipherChunks.push(cipher.final('base64'));
        return cipherChunks.join('');
    },
 
    /**
     * 解密
     * return utf8
     */
    decryption: function (data) {
        let key = AES_conf.key;
        let iv = AES_conf.iv;
        // let padding = AES_conf.padding;
        var cipherChunks = [];
        var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        decipher.setAutoPadding(true);
        cipherChunks.push(decipher.update(data, 'base64', 'utf8'));
        cipherChunks.push(decipher.final('utf8'));
        return cipherChunks.join('');
    }
}
 
// console.log(aes.encryption('hello world'));
// console.log(aes.decryption('OCGiTQwHgZOUi8C30QG7XA=='));
// const fs = require('fs');
// const path = require('path');
// fs.writeFileSync('badword.aes', aes.encryption(fs.readFileSync('./badwords.txt')))
// console.log(typeof(aes.decryption(fs.readFileSync(path.join(__dirname, 'badwords.aes'), 'utf-8'))))
module.exports = aes;