// 请求主页推荐显示的内容
var express = require('express');
var router = express.Router();
//漫画
var CartoonController = require('../../controllers/client/cartoonController');
//章节
var chapterController = require('../../controllers/client/chapterController');
//评论
var chapterCommentController = require('../../controllers/client/chapterCommentController');

//漫画查询操作
//首页查询
router.get('/index',function(req,res,next){
    CartoonController.index(req,res,next);
});

//查询所有的推荐漫画
router.get('/getAllRecommend',function(req,res,next){
    CartoonController.getAllRecommend(req,res,next);
});

//按照热度查询所有的漫画
router.get('/getAllHot',function(req,res,next){
    CartoonController.getAllHot(req,res,next);
});

//获取某一本漫画的信息
router.get('/getCartoon/:cartoonId/:userId',function(req,res,next){
    CartoonController.findById(req,res,next);
});

//查询所有的漫画
router.get('/allCartoon',function(req,res,next){
    CartoonController.findAll(req,res,next);
});

//查询某个分类下的完结漫画
router.get('/allCartoon/:categoryId/:isEnd',function(req,res,next){
    CartoonController.findByCondition(req,res,next);
});

//按照更新时间查询漫画
router.get('/findByUpdateTime/:update_time',function(req,res,next){
    CartoonController.findByUpdateDate(req,res,next);
});

//用户为漫画评分
router.post('/rater',function(req,res,next){
    CartoonController.rater(req,res,next);
});

//模糊查询漫画
router.get('/search/:key',function(req,res,next){
    CartoonController.search(req,res,next);
});

//章节操作

//根据id查询漫画的一个章节
router.get('/chapter/:chapterId/:userId',(req,res,next)=>{
    chapterController.findChapterById(req,res,next);
});

//为某个章节点赞
router.post('/chapter/agree',(req,res,next)=>{
    chapterController.agreeChapter(req,res,next);
});

//取消对某个章节的点赞
router.post('/chapter/cancelAgree',(req,res,next)=>{
    chapterController.cancelAgreeChapter(req,res,next);
});

//在章节下添加一条评论
router.post('/chapter/saveComment',function(req,res,next){
    chapterCommentController.save(req,res,next);
});

//为章节下的某一条评论点赞
router.post('/chapter/agreeComment',function(req,res,next){
    chapterCommentController.agree(req,res,next);
});




module.exports = router;