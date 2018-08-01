var express = require('express');
var router = express.Router();

var userController = require('../../controllers/server/userController');

//跳转到登录页面
router.get('/login', function(req, res, next) {
  res.render('login');
});

//用户登录提交
router.post('/login', function(req, res, next) {
  userController.login(req,res,next);
});


//用户注册提交
router.post('/register', function(req, res, next) {
  userController.register(req,res);
});

//用户退出登录
router.get('/logout',function(req,res,next){
  userController.logout(req,res);
});

module.exports = router;
