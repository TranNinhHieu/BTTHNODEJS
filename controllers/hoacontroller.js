const { model } = require('mongoose');
var flowerTable = require('../models/hoamodel');

//------------------index.js--------------------------------//
module.exports.select = async function (flowertypecode) {

    var flowerlist = await flowerTable.select(flowertypecode);
    var result = ""
    for(i = 0; i < flowerlist.length; i++)
    {
        result = result + `<div class='section__article-container-flower'>
                                <div class='section__article-container-img'>
                                    <img src='/images/`+flowerlist[i].hinh+`'>
                                    <div class='section__article-flower-detail'>
                                        <a href='/`+flowerlist[i].maloai+`/`+flowerlist[i].mahoa+`'>Chi tiết</a>
                                    </div>
                                </div>
                                <div class='section__article-flower-name'>
                                    <span style='color: #000;'>`+flowerlist[i].tenhoa+`</span><br>
                                    <span>Giá bán: `+flowerlist[i].giaban+` VND</span>
                                </div>
                                <a href='/purchase/`+flowerlist[i].mahoa+`' class='section__article-container-flower-cart'><svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='cart-plus' class='svg-inline--fa fa-cart-plus fa-w-18' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'><path fill='currentColor' d='M504.717 320H211.572l6.545 32h268.418c15.401 0 26.816 14.301 23.403 29.319l-5.517 24.276C523.112 414.668 536 433.828 536 456c0 31.202-25.519 56.444-56.824 55.994-29.823-.429-54.35-24.631-55.155-54.447-.44-16.287 6.085-31.049 16.803-41.548H231.176C241.553 426.165 248 440.326 248 456c0 31.813-26.528 57.431-58.67 55.938-28.54-1.325-51.751-24.385-53.251-52.917-1.158-22.034 10.436-41.455 28.051-51.586L93.883 64H24C10.745 64 0 53.255 0 40V24C0 10.745 10.745 0 24 0h102.529c11.401 0 21.228 8.021 23.513 19.19L159.208 64H551.99c15.401 0 26.816 14.301 23.403 29.319l-47.273 208C525.637 312.246 515.923 320 504.717 320zM408 168h-48v-40c0-8.837-7.163-16-16-16h-16c-8.837 0-16 7.163-16 16v40h-48c-8.837 0-16 7.163-16 16v16c0 8.837 7.163 16 16 16h48v40c0 8.837 7.163 16 16 16h16c8.837 0 16-7.163 16-16v-40h48c8.837 0 16-7.163 16-16v-16c0-8.837-7.163-16-16-16z'></path></svg></a>
                            </div>`
        
    }
    return result;
}

module.exports.selectdetail = async function (flowercode) {

    var flowerlist = await flowerTable.selectflowerDetail(flowercode);
    var result = "";
    result = result + `<div class="section__article-detail-container">

                            <div class="section__article-detail-img">
                                <img src="/images/`+flowerlist[0].hinh+`">
                            </div>

                            <div class="section__article-detail-info">
                                <span><b>Tên hoa: </b>`+flowerlist[0].tenhoa+`</span>
                                <span><b>Giá bán: </b>`+flowerlist[0].giaban+` VND</span>
                                <span><b>Thành phần chính: </b>`+flowerlist[0].mota+`</span>
                                <div  class="icon-shopping-cart"><a href="/purchase/`+flowerlist[0].mahoa+`"><svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='cart-plus' class='svg-inline--fa fa-cart-plus fa-w-18' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'><path fill='currentColor' d='M504.717 320H211.572l6.545 32h268.418c15.401 0 26.816 14.301 23.403 29.319l-5.517 24.276C523.112 414.668 536 433.828 536 456c0 31.202-25.519 56.444-56.824 55.994-29.823-.429-54.35-24.631-55.155-54.447-.44-16.287 6.085-31.049 16.803-41.548H231.176C241.553 426.165 248 440.326 248 456c0 31.813-26.528 57.431-58.67 55.938-28.54-1.325-51.751-24.385-53.251-52.917-1.158-22.034 10.436-41.455 28.051-51.586L93.883 64H24C10.745 64 0 53.255 0 40V24C0 10.745 10.745 0 24 0h102.529c11.401 0 21.228 8.021 23.513 19.19L159.208 64H551.99c15.401 0 26.816 14.301 23.403 29.319l-47.273 208C525.637 312.246 515.923 320 504.717 320zM408 168h-48v-40c0-8.837-7.163-16-16-16h-16c-8.837 0-16 7.163-16 16v40h-48c-8.837 0-16 7.163-16 16v16c0 8.837 7.163 16 16 16h48v40c0 8.837 7.163 16 16 16h16c8.837 0 16-7.163 16-16v-40h48c8.837 0 16-7.163 16-16v-16c0-8.837-7.163-16-16-16z'></path></svg></a></div>
                                <a href="/`+flowerlist[0].maloai+`">Quay lại</a>
                            </div>

                            <div class="section__article-detail-bottom"></div>
                        </div>`
    return result;
}
module.exports.search = async function(key) {
    var flowerlist = await flowerTable.search(key);
    var result = "";
    if(flowerlist.length == 0)
	{
		if(key != "Null")
        result = result + `<div class="section__article-search-not-find">
                                <span>không tìm thấy <b>`+key+`</span></b>
                            </div>`;
	}
	else
	{
		for(i=0;i<flowerlist.length;i++)
		{
			result = result + `<div class="section__article-detail-container">

                                    <div class="section__article-detail-img">
                                        <img src="/images/`+flowerlist[i].hinh+`">
                                    </div>

                                    <div class="section__article-detail-info">
                                        <span><b>Tên hoa: </b>`+flowerlist[i].tenhoa+`</span>
                                        <span><b>Giá bán: </b>`+flowerlist[i].giaban+` VND</span>
                                        <span><b>Thành phần chính: </b>`+flowerlist[i].mota+`</span>
                                        <div  class="icon-shopping-cart"><a href="/purchase/`+flowerlist[i].mahoa+`"><svg aria-hidden='true' focusable='false' data-prefix='fas' data-icon='cart-plus' class='svg-inline--fa fa-cart-plus fa-w-18' role='img' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'><path fill='currentColor' d='M504.717 320H211.572l6.545 32h268.418c15.401 0 26.816 14.301 23.403 29.319l-5.517 24.276C523.112 414.668 536 433.828 536 456c0 31.202-25.519 56.444-56.824 55.994-29.823-.429-54.35-24.631-55.155-54.447-.44-16.287 6.085-31.049 16.803-41.548H231.176C241.553 426.165 248 440.326 248 456c0 31.813-26.528 57.431-58.67 55.938-28.54-1.325-51.751-24.385-53.251-52.917-1.158-22.034 10.436-41.455 28.051-51.586L93.883 64H24C10.745 64 0 53.255 0 40V24C0 10.745 10.745 0 24 0h102.529c11.401 0 21.228 8.021 23.513 19.19L159.208 64H551.99c15.401 0 26.816 14.301 23.403 29.319l-47.273 208C525.637 312.246 515.923 320 504.717 320zM408 168h-48v-40c0-8.837-7.163-16-16-16h-16c-8.837 0-16 7.163-16 16v40h-48c-8.837 0-16 7.163-16 16v16c0 8.837 7.163 16 16 16h48v40c0 8.837 7.163 16 16 16h16c8.837 0 16-7.163 16-16v-40h48c8.837 0 16-7.163 16-16v-16c0-8.837-7.163-16-16-16z'></path></svg></a></div>
                                    </div>

                                    <div class="section__article-detail-bottom"></div>
                                </div>`
		}
	}
    return result;
}

module.exports.selectByCode = async function (flowercode) {
    var flowerlist = await flowerTable.selectflowerDetail(flowercode)
    if (flowerlist.length > 0)
        return flowerlist[0];
    return "";
}

module.exports.insert = async function (newflower) {
    createdflower = await flowerTable.insert(newflower);
    return createdflower;
}