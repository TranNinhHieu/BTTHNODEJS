var mongoose = require('mongoose');
var db = require('../controllers/database');

var useSchema = new mongoose.Schema({
    maloai: String,
    tenloai: String,
});

const userTable = mongoose.model('loaihoa', useSchema);
module.exports.selectFlowerType = async function(){
    var userData = await userTable.find({});
    return userData;
}