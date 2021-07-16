var mongoose = require('mongoose');
var db = require('../controllers/database');
var userSchema = new mongoose.Schema({
    tendn: String,
    matkhau: String,
    hoten: String,
    diachi: String,
    dienthoai: String,
    email: String,
});
userCusTab = mongoose.model('khachhang', userSchema);

module.exports.select = async function (query) {
    var userData = await userCusTab.find(query);
    return userData;
}

module.exports.insert = async function (newkhachhang) {
    const cus = new userCusTab({
        tendn: newkhachhang.tendn,
        matkhau: newkhachhang.matkhau,
        hoten: newkhachhang.hoten,
        diachi: newkhachhang.diachi,
        dienthoai: newkhachhang.dienthoai,
        email: newkhachhang.email,
    });
    var userData = await cus.save();
    return userData; 
}

module.exports.check = async function (query) {
    var userData = await userCusTab.find(query);
    return userData;
}