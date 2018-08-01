var express = require('express');
var router = express.Router();
//cartoonController
var recommendController = require('../../controllers/server/recommendController');

/**
 * 动态转发
 * */

//跳转到添加推荐页面
router.get('/addRecommend',function(req,res,next){
    recommendController.recommendPage(req,res,next);
});

//添加一条推荐的记录
router.post('/addRecommend',function(req,res,next){
    recommendController.saveRecommend(req,res,next);
});

//跳转到已经推荐的漫画的界面
router.get('/allRecommend',function(req,res,next){
    //查询推荐表
    recommendController.findAll(req,res,next);
});

//取消漫画的推荐
router.post('/removeRecommend',function(req,res,next){
    recommendController.removeRecommend(req,res,next);
});


//静态转发
//跳转到某一本漫画的添加章节页面



module.exports = router;