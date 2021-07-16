var express = require('express');
var app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.set('view engine', 'ejs');
var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

var session = require('express-session');
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: '1234567abc',
  cookie: {
    maxAge: 60000
  }
}));
var nodemailer = require('nodemailer');
const flowertype = require('./controllers/loaihoacontroller');
const flower = require('./controllers/hoacontroller');
const customers = require('./controllers/khachhangcontroller');
const orders = require('./controllers/donhangcontroller');
const { render } = require('ejs');
const fileUpload = require('express-fileupload');
app.use(fileUpload());
var cartlocation = 0;
//-------------------- Mail ----------------------------------//

function SendMail(tomail, title, content)
{
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'banhangnodejs@gmail.com',
      pass: 'node123$%^'
    }
  });

  var mailOptions = {
    from: 'banhangnodejs@gmail.com',
    to: tomail,
    subject: title,
    html: content
  };

  transporter.sendMail(mailOptions, function(error, info){
    if(error) {
      console.log(error);
    }
    else{
      console.log('Email sent: ' + info.response);
    }
  });
}
//-------------------- Trang Chủ -----------------------------//
    async function Display(req, res, typecode) {
        var cusname = `<a href="/login">   
                          <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" class="svg-inline--fa fa-user fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>
                          <span>Tài khoản</span>
                      </a>`;
        var flowertypelist = await flowertype.select();
        var flowerlist = await flower.select(typecode);
        var ttgh = CartInfo(req);
        if(req.session.customer != undefined && req.session.customer != '')
        {
          cusname = `<a href="/account">   
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" class="svg-inline--fa fa-user fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>
                        <span>`+req.session.customer.hoten+`</span>
                    </a>`;
        }
        res.render('Main_Page',{dslh:flowertypelist, dshoa:flowerlist, tenkh:cusname, ttgh:ttgh});
    };
//------------------------ Trang chi tiết ---------------------//
  async function DisplayFlower(req, res, flowercode) {
    var cusname = `<a href="/login">   
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" class="svg-inline--fa fa-user fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>
                      <span>Tài khoản</span>
                  </a>`;
    var flowerdetail = await flower.selectdetail(flowercode);
    var ttgh = CartInfo(req);
    if(req.session.customer != undefined && req.session.customer != '')
    {
      cusname = `<a href="/account">   
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" class="svg-inline--fa fa-user fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>
                    <span>`+req.session.customer.hoten+`</span>
                </a>`;
    }
    res.render('Detail_Page', {
    chitiethoa: flowerdetail,
    tenkh:cusname,
    ttgh:ttgh
  });
};

//-------------------------------Thêm hoa ---------------------------------//
async function AddFlower(req, res) {
  var cusname = `<a href="/login">   
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" class="svg-inline--fa fa-user fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>
                  <span>Tài khoản</span>
                </a>`;
    var flowertypelist = await flowertype.showcombo();
    var ttgh = CartInfo(req);
    if(req.session.customer != undefined && req.session.customer != '')
    {
      cusname = `<a href="/account">   
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" class="svg-inline--fa fa-user fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>
                    <span>`+req.session.customer.hoten+`</span>
                </a>`;
    }
    res.render('AddFlower_Page',{dslh:flowertypelist, tenkh:cusname, ttgh:ttgh});
}
  //------------------------- Tìm kiếm -----------------------------------//
  async function Search(req, res, key) {
    var cusname = `<a href="/login">   
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" class="svg-inline--fa fa-user fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>
                      <span>Tài khoản</span>
                  </a>`;
    var find = await flower.search(key);
    var ttgh = CartInfo(req);
    if(req.session.customer != undefined && req.session.customer != '')
    {
      cusname = `<a href="/account">   
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" class="svg-inline--fa fa-user fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>
                        <span>`+req.session.customer.hoten+`</span>
                    </a>`;
    }
    res.render('Search_Page', {kqtk: find, tenkh:cusname, ttgh:ttgh});
  };

  //--------------------------- Người dùng ---------------------------//
  async function Account(req, res) {
    var ttgh = CartInfo(req);
    var user = `<div class="section__article-detail-container">

                  <div class="section__article-detail-img">
                      <img src="/images/logo.png" width="150px" height="200px">
                  </div>

                  <div class="section__article-detail-info">
                    <span><b>Tên người dùng: </b>`+req.session.customer.hoten+`</span>
                    <span><b>Tài khoản: </b>`+req.session.customer.tendn+`</span>
                    <span><b>Địa chỉ: </b>`+req.session.customer.diachi+`</span>
                    <span><b>Email: </b>`+req.session.customer.email+`</span>
                    <span><b>Số điện thoại: </b>`+req.session.customer.dienthoai+`</span>
                    <a href='/logout'>Đăng xuất</a>
                  </div>

                  <div class="section__article-detail-bottom"></div>
              </div>`;
  
    var cusname = `<a href="/account" class="header__active">   
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" class="svg-inline--fa fa-user fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>
                        <span>`+req.session.customer.hoten+`</span>
                    </a>`;
    res.render('User', {user: user, tenkh:cusname, ttgh:ttgh});
  };
  //------------------------- Thông tin giỏ hàng -----------------------//
  function CartInfo(req) {
    var sl = 0;
    if( req.session.cart != undefined)
    {
      for(i=0; i<req.session.cart.length;i++)
      {
        sl = sl + req.session.cart[i].soluong;
      }
    }
    return sl;
  }
  //------------------------------ Thông tin chi tiết giỏ hàng ---------------------//
  async function DetailedCartInfo(req, res) {
    var giohang = req.session.cart;
    var total = 0;
    var cusname = `<a href="/login">   
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" class="svg-inline--fa fa-user fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>
                      <span>Tài khoản</span>
                  </a>`;
    var ttgh = CartInfo(req);
    var ttctgh = "";
    var update = "";
    var order = "";
    if( giohang != undefined)
    {
      if(giohang.length != 0)
      {
        for(i=0; i<giohang.length; i++)
        {
          ttctgh = ttctgh + `<div class="section__article-cart-info">
                                <div class="section__article-cart-img">
                                    <img src="/images/`+giohang[i].hinh+`">
                                </div>
                                <div class="section__article-cart-label">
                                    <label>Tên hoa: `+giohang[i].tenhoa+`</label>
                                    <div>
                                        <label>Số lượng: </label>
                                        <input type="number" min="1" name="txtnumber`+giohang[i].mahoa+`" value="`+giohang[i].soluong+`">
                                    </div>
                                    <label>Đơn giá: `+giohang[i].giaban+` VND</label>
                                </div>
                                <div class="section__article-cart-remove">
                                    <a href="/remove/`+giohang[i].mahoa+`">Xóa</a>
                                </div>
                            </div>`;
          total = total + giohang[i].soluong*1*giohang[i].giaban;
        }
        update = update + `<h3>Tổng cộng: `+total+` VND</h3>
                          <button type="submit">Cập Nhật</button>`;
        order = order + `<form name="form2" action="/order-product" method="POST">
                            <h3>Giao đến địa chỉ: </h3>
                            <textarea id='address_cus' name='address_cus' required></textarea>
                            <button type="submit">Đặt Hàng</button>
                        </form>`;
      }
      else
      {
        update = "";
        ttctgh = "<div><h2>Không có sản phẩm</h2></div>";
        order = "";
      }
    }
    else
    {
      ttctgh = ttctgh + "<div><h2>Không có sản phẩm</h2></div>";
    }
    if(req.session.customer != undefined && req.session.customer != '')
    {
      cusname = `<a href="/account">   
                        <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" class="svg-inline--fa fa-user fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>
                        <span>`+req.session.customer.hoten+`</span>
                    </a>`;
    }
    res.render('Cart_Page',{tenkh: cusname, ttgh: ttgh, ttctgh: ttctgh, update:update, order:order});
  };
    
    //------------------------ Tìm kiếm --------------------------------//

    app.post('/search', (req, res) => {
      var info = req.body;
      var key = info.keyword;
      Search(req, res, key);
    });
  //------------------------ Đăng nhập --------------------------//
  app.get('/login', (req, res) => {
    res.render('Login_Signup',{notice:''});
  });

  app.post('/login', async (req, res) => {
    var info = req.body;
    username = info.username;
    password = info.password;
    var cus = await customers.login(username, password);
    if(cus != "")
    {
      req.session.customer = cus;
      if(cartlocation == 0)
        res.redirect('/');
      else
        res.redirect('/cart');
    }
    else
      res.render('Login_Signup',{notice:'Tên đăng nhập hoặc mật khẩu không đúng!!!'});
  });
  //------------------------------- Đăng ký -----------------------------//
  app.get('/signup', (req, res) => {
    res.render('Sign_up',{notice:''});
  });

  app.post('/signup', async (req, res) => {
    var info = req.body;
    username = info.username;
    password = info.password;
    password1 = info.password1;
    fullname = info.fullname;
    email = info.email;
    phone = info.tel;
    address = info.address;
    var check = await customers.check(username);
    if(check == "existed")
    {
      res.render('Sign_up', {notice:'Tên người dùng đã tồn tại!!!'});
    }
    else
    {
      if(password1 == password)
      {
        cus = await customers.insert({tendn: username,matkhau: password,hoten: fullname, diachi: address,dienthoai: phone,email: email});
        if(!cus){ return; }
        cus = await customers.login(username, password);
        req.session.customer = cus;
        res.redirect('/');
      }
      else
        res.render('Sign_up', {notice:'Mật khẩu xác nhận không trùng khớp!!!'});
    }
  });
  //--------------------------- Người dùng ---------------------------//
    app.get('/account', (req, res) => {
      Account(req, res);
    });
    app.get('/logout', function (req, res) {
      req.session.customer = undefined;
      req.session.cart = null;
      res.redirect('/');
    });
  //----------------------------------Thêm hoa ------------------------//
  app.post('/addnewflower', (req, res) => {
    var info = req.body;
    console.log(info);
    let sampleFile;
    let uploadPath;
    sampleFile = req.files.file
    newflower = {tenhoa:info.nameflower, maloai:info.typeflower, hinh:sampleFile.name, giaban:info.cost, mota:info.description};
    flower.insert(newflower);
    if(!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were upload.');
    }
    uploadPath = __dirname + '/public/images/' + sampleFile.name;
    sampleFile.mv(uploadPath, function(err){
      if(err)
        return res.status(500).send(err);
      res.redirect('/'+info.typeflower);
    })
  })
    //--------------------------- Mua hoa -------------------------//
  app.get('/purchase/:mahoa', async (req, res) => {
    var flowercode = req.params.mahoa;
    fc = await flower.selectByCode(flowercode);
    if(req.session.cart == undefined)
    {
      req.session.cart = [];
      var f = {mahoa: flowercode, tenhoa: fc.tenhoa, giaban: fc.giaban, hinh: fc.hinh, soluong: 1};
      req.session.cart[0] = f;
    }
    else
    {
      var yes = 0;
      for(i=0; i<req.session.cart.length; i++)
        if(req.session.cart[i].mahoa == flowercode)
        {
          req.session.cart[i].soluong++;
          yes = 1;
          break;
        }
      if(yes == 0)
      {
        var f = {mahoa: flowercode, tenhoa: fc.tenhoa, giaban: fc.giaban, hinh: fc.hinh, soluong: 1};
        req.session.cart[req.session.cart.length] = f;
      }
    }
    res.redirect('/' + fc.maloai);
  });
  //-----------------------Thêm hoa------------------------------//
  app.get('/addflower', (req, res) => {
    AddFlower(req, res);
        
  })
  //------------------------ Trang giỏ hàng --------------------//
  app.get('/cart', (req, res) => {
    DetailedCartInfo(req, res);
  });

  app.get('/remove/:mahoa', (req, res) => {
    var flowercode = req.params.mahoa;
    for(i=0; i<req.session.cart.length; i++)
      if(req.session.cart[i].mahoa == flowercode)
      {
        req.session.cart.splice(i, 1);
        break;
      }
      res.redirect('/cart');
  });

  app.post('/update', (req, res) => {
    var info = req.body;
    for(i=0; i<req.session.cart.length; i++)
    {
      req.session.cart[i].soluong = eval("info.txtnumber"+req.session.cart[i].mahoa)*1;
    }
    res.redirect('/cart');
  });

  app.post('/order-product', (req, res) => {
    if(req.session.customer == undefined)
    {
      cartlocation = 1;
      res.redirect('/login');
    }
    else
    {
      cartlocation = 0;
      var info = req.body;
      fullname = req.session.customer.hoten;
      address = info.address_cus;
      phone = req.session.customer.dienthoai;
      email = req.session.customer.email;
      var dh = {sodh:1, hoten:fullname, diachi:address, dienthoai:phone, email:email};
      dh.dsmh = req.session.cart;
      gh = req.session.cart;
      result = orders.insert(dh);
      ttctdh = "<h1 align='center'>Thông Tin Đơn Hàng</h1>";
      ttctdh = ttctdh + "<p>Họ Tên: "+fullname+"</p>";
      ttctdh = ttctdh + "<p>Địa Chỉ Giao Hàng: "+address+"</p>";
      ttctdh = ttctdh + "<p>Điện Thoại: "+phone+"</p>";
      ttctdh = ttctdh + "<p>Email: "+email+"</p>";
      ttctdh = ttctdh + "<table width='80% cellspacing='0' cellpadding='2' border='1' align='center'>"
      ttctdh = ttctdh + "<tr align='center'><td width='10%'>STT</td><td width='10%'>Mã Hoa</td><td width='30%'>Tên Hoa</td><td width='10%'>Số Lượng</td><td width='15%'>Đơn Giá</td><td>Thành Tiền</td></tr>";
      var stt = 1;
      var tongtien = 0;
      for(i=0; i<gh.length; i++)
      {
        ttctdh = ttctdh + "<tr align='center'><td>"+stt+"</td><td>"+gh[i].mahoa+"</td><td>"+gh[i].tenhoa+"</td><td>"+gh[i].soluong+"</td><td>"+gh[i].giaban+" VND</td><td>"+gh[i].soluong*gh[i].giaban*1+" VND</td></tr>";
        stt++;
        tongtien = tongtien + gh[i].soluong*gh[i].giaban*1;
      }
      ttctdh = ttctdh + "<tr><td colspan='7' align='right'>Tổng Tiền: "+tongtien+" VND</td></tr></table>";
      ttctdh = ttctdh + "<p>Cảm ơn quý khách đã đặt hàng, đơn hàng sẽ chuyển đến quý khách trong thời gian sớm nhất!</p>";
      SendMail(email, "Đơn hàng Shop bán hoa", ttctdh);
      if(result);
        req.session.cart = null;
      res.redirect('/');
    }
  })
  //----------------------Trang chủ-----------------------------//
  app.get('/', (req, res) => {
    Display(req, res, 'Hoa-Cuc');
  });

  app.get('/:maloai', (req, res) => {
    Display(req, res, req.params.maloai);
  });
  //-------------------------- Trang chi tiết ---------------------------//
  app.get('/:maloai/:mahoa', (req, res) => {
    DisplayFlower(req, res, req.params.mahoa);
  });

app.listen(8080);