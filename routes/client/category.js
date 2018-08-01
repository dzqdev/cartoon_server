// 请求主页推荐显示的内容
var express = require('express');
var router = express.Router();

var CategoryController = require('../../controllers/client/categoryController');

//注册
router.get('/allCategory',function(req,res,next){
    CategoryController.findAll(req,res,next);
});

module.exports = router;