var flower_type_table = require('../models/loaihoamodel');
/*module.exports.select = async function(req, res){
    var data = await bangloaihoa.select();
    res.render('mhloaihoa')
    return data;
}*/
module.exports.select = async function () {
    var data = await flower_type_table.selectFlowerType();
    var result = "";
    for (i = 0; i < data.length; i++) {
        result = result + "<li><a href='/" + data[i].maloai + "'>" + data[i].tenloai + "</a></li>";
    }
    return result;
}

module.exports.showcombo = async function () {
    var listtypeflower = await flower_type_table.selectFlowerType();
    var result = "";
    for(i = 0; i<listtypeflower.length; i++) {
        result = result + "<option value='"+listtypeflower[i].maloai+"'>"+listtypeflower[i].tenloai+"</option>";
    }
    return result;
}