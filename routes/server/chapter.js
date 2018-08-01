var express = require('express');
var router = express.Router();
//文件上传
var imageUtil = require('../../services/imageUtil');

//categoryController
var chapterController = require('../../controllers/server/chapterController');

//动态转发
router.post('/addChapter', imageUtil('/cartoon').single('chapter'), function (req, res, next) {
    chapterController.insertChapter(req,res,next);
});

//静态转发

//跳转到某一本漫画的添加章节页面
router.get('/addChapter/:cartoonId',function (req, res, next) {
   chapterController.insertChapterPage(req,res,next);
});

//查询某章节的信息
router.get('/findChapter/:chapterId',function(req,res,next){
    chapterController.findChapterInfoById(req,res,next);
});


module.exports = router;