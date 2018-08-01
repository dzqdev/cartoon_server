var express = require('express');
var router = express.Router();

var managerController = require('../../controllers/server/managerController');

//跳转到登录页面
router.get('/login', function(req, res, next) {
    res.render('login');
  });
  
//管理员登录提交
router.post('/login', function(req, res, next) {
    console.log("管理员登录");
    managerController.login(req,res,next);
});
  
//管理员提交
router.post('/register', function(req, res, next) {
    managerController.register(req,res);
});

//管理员退出登录
router.get('/logout',function(req,res,next){
    managerController.logout(req,res);
});


module.exports = router;