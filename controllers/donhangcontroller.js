var bangdonhang = require('../models/donhangmodel');
module.exports.select = async function(sodh)
{
    var dsdonhang=await bangdonhang.select({sodh:sodh});
    dsmh = dsdonhang.dsmh;
}

module.exports.insert = async function(dh)
{
    createdh = await bangdonhang.insert(dh);
    return createdh;
}