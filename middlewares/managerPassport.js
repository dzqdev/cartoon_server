const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//引入proxy
const ManagerProxy = require('../proxy/server/manager');

passport.serializeUser((manager, done) => {

  done(null, manager);//保存user到session中
});

//user：上一步保存在session中的值
passport.deserializeUser((manager, done) => {
  done(null, manager);//把user赋给`req.user`
});

//管理员登录中间件
passport.use(new LocalStrategy((username, password, done) => {
  ManagerProxy.findOne({manager_name:username}, (err, manager) => {
      if (err) { return done(err); }
      if (!manager) {
          return done(null, false, { msg: `用户名 ${username} not found.` });
      }
      ManagerProxy.findOne({manager_name:username,manager_password:password}, (err, isMatch) => {
          if (err) { return done(err); }
          if (isMatch) {
              return done(null, manager);
          }
          return done(null, false, { msg: 'Invalid email or password.' });
      });
  });
}));

//登录拦截
exports.userRequired = function (req, res, next) {
  //passport扩展了HTTP request，添加了isAuthenticated()方法
  if (!req.isAuthenticated()) {
    return res.render('login');
  }
  next();
};

//退出登录
exports.logOut = function (req, res) {
  //logOut()：别名为logout()作用是登出用户，删除该用户session。不带参数,由passport扩展了HTTP request。
  req.logOut();
  res.redirect('/api/');
};
