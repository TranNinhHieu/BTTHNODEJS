var mongoose = require('mongoose');
var db = require('../controllers/database');
var userSchema = new mongoose.Schema({
    sodh: Number,
    hoten: String,
    diachi: String,
    dienthoai: String,
    email: String,
    dsmh:[{mahoa:String, tenhoa:String, soluong:Number, dongia:Number, thanhtien:Number}]
});

userTabledonhang = mongoose.model('donhang', userSchema);
module.exports.select = async function(query)
{
    var bangdonhang = await userTabledonhang.find(query);
    return bangdonhang;
}

module.exports.insert = async function(newdonhang)
{
    var bangdonhang = await userTabledonhang.find().sort({sodh:1}).limit(1);
    var sodh = 1;
    if(bangdonhang.length>0)
        sodh = sodh + bangdonhang[0].sodh;
    const donhang = new userTabledonhang({
        sodh:sodh,
        hoten:newdonhang.hoten,
        diachi:newdonhang.diachi,
        dienthoai:newdonhang.dienthoai,
        email:newdonhang.email,
        dsmh:newdonhang.dsmh
    });
    var userData = await donhang.save();
    return userData;
}