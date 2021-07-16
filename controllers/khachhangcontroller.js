var customerTable = require('../models/khachhangmodel');

//--------------------------------- index ------------------------------------//
module.exports.login = async function (username, password) {
    var cusList = await customerTable.select({
        tendn: username,
        matkhau: password
    });
    if (cusList.length > 0)
        return cusList[0];
    return "";
}

module.exports.check = async function(username) {
    var cusList = await customerTable.select({
        tendn: username,
    });
    if (cusList.length > 0)
        return "existed";
    return "";
}

module.exports.insert = async function (newkhachhang) {
    createdcus = await customerTable.insert(newkhachhang);
    return createdcus;
}