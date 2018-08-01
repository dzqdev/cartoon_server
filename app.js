var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//自添加组件
var expressSession = require('express-session');
var passport = require('passport');
var flash = require('express-flash');
//redis
var redis = require('./redis/index');

var managerPassport = require('./middlewares/managerPassport');

//后台路由
var index = require('./routes/server/index');
var user = require('./routes/server/user');
var cartoon = require('./routes/server/cartoon');
var tag = require('./routes/server/tag');
var category = require('./routes/server/category');
var chapter = require('./routes/server/chapter');
var banner = require('./routes/server/banner');
var recommend = require('./routes/server/recommend');
var bookShelf = require('./routes/server/bookShelf');
var manager = require('./routes/server/manager');
//测试
var test = require('./routes/server/test');

//前台请求路由
var recommendApi = require('./routes/client/recommend');
var userApi = require('./routes/client/user');
var cartoonApi = require('./routes/client/cartoon');
var categoryApi = require('./routes/client/category');
var bookShelfApi = require('./routes/client/bookShelf');
var topicApi = require('./routes/client/topic');
var topicCommentApi = require('./routes/client/topicComment');
var tokenUtil = require('./utils/TokenUtil');


var app = express();
//模板引擎
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//中间件
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
  secret: '12345',
  name: 'testapp',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
  cookie: {maxAge: 1000*60*60*24 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
  resave: false,
  saveUninitialized: true
}));
app.use(express.static(path.join(__dirname, 'public')));
//添加passport验证
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next){ 
  res.locals.session = req.session;
  next();
});

app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
  else  next();
});

//管理员登录拦截
app.all('/api*',function(req,res,next){
  let url = req.originalUrl;
  //访问登录页面
  //访问的是登录页面以及提交页面时不进行拦截
  if (url.indexOf("/api/manager/login") > -1) {
    next();
  }else{
    managerPassport.userRequired(req,res,next);
  }
});

//后台导航
app.use('/api', index);
app.use('/api/cartoon', cartoon);
app.use('/api/user', user);
app.use('/api/tag',tag);
app.use('/api/category',category);
app.use('/api/chapter',chapter);
app.use('/api/banner',banner);
app.use('/api/recommend',recommend);
app.use('/api/bookShelf',bookShelf);
app.use('/api/manager',manager);
app.use('/api/test',test);

//前台登录拦截
app.all('/client*',function(req, res, next){
  let token = req.headers.authorization;
  let url = req.originalUrl; 
    /**
   * token存在，验证token的正确性
   * token过期，访问login界面，放行
   * token过期，访问非login界面,返回401
  */
  //存在token
  if(token){
    let flag = tokenUtil.checkToken(token);
    if(!flag){
      //过期
      //访问登录或者注册
      console.log(url);
      if(url.indexOf('login') > -1 || url.indexOf('register') > -1){
        next();
      }else{
        res.status(401).send({"expire":"expire"});
      }
    }else{
      //没有过期
      next();
    }
  }else{
    //没有token，访问登录
    if(url.indexOf('login') > -1){
      next();
    }else{
      res.status(401).send({"expire":"expire"});
    }
  }
});

//前台请求数据返回
app.use('/client/recommend',recommendApi);
app.use('/client/user',userApi);
app.use('/client/cartoon',cartoonApi);
app.use('/client/category',categoryApi);
app.use('/client/bookShelf',bookShelfApi);
app.use('/client/topic',topicApi);
app.use('/client/topicComment',topicCommentApi);

//404处理
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
