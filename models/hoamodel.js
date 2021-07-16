var mongoose = require('mongoose');
var db = require('../controllers/database');

var useSchema = new mongoose.Schema({
    mahoa: String,
    maloai: String,
    tenhoa: String,
    giaban: String,
    hinh: String,
    mota: String
});

userTableFlower = mongoose.model('hoa', useSchema);


module.exports.select = async function (flowertypecode) {
    var userData = await userTableFlower.find({
        maloai: flowertypecode
    });
    return userData;
}

module.exports.selectflowerDetail = async function (flowercode) {
    var userData = await userTableFlower.find({
        mahoa: flowercode
    });
    return userData;
}

module.exports.search = async function (key) {
    var userData = await userTableFlower.find({
        $or: [{
            tenhoa: new RegExp(key, 'i'),
        }, {
            mota: new RegExp(key, 'i'),
        }]
    });
    return userData;
}

module.exports.insert = async function (newhoa) {
    var flowerTable = await userTableFlower.find();
    var flowercode = 1;
    if(flowerTable.length>0)
        flowercode = flowercode*1+ flowerTable.length*1;
    const h = new userTableFlower({
        mahoa: flowercode,
        tenhoa: newhoa.tenhoa,
        maloai: newhoa.maloai,
        hinh: newhoa.hinh,
        giaban: newhoa.giaban,
        mota: newhoa.mota
    });

    var userData = await h.save();
    return userData;
}