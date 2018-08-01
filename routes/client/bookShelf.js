// 请求主页推荐显示的内容
var express = require('express');
var router = express.Router();

var BookShelfController = require('../../controllers/client/bookShelfController');


router.post('/collect',function(req,res,next){
    BookShelfController.saveCartoonFromBookShelf(req,res,next);
});

router.post('/unCollect',function(req,res,next){
    BookShelfController.removeCartoonFromBookShelf(req,res,next);
});

router.get('/findBookShelf/:user_id',function(req,res,next){
    BookShelfController.findBookShelf(req,res,next);
});

//更新该漫画最后阅读的章
router.post('/updateLastWatch',function(req,res,next){
    BookShelfController.updateLastWatch(req,res,next);
});

//更新书架中该漫画的更新状态为false
router.post('/updateStatus',function(req,res,next){
    BookShelfController.updateStatus(req,res,next);
});

//获取当前用户收藏的漫画是否有更新
router.get('/getBookCaseUpdateInfo/:user_id',function(req,res,next){
    BookShelfController.getBookCaseUpdateInfo(req,res,next);
});

module.exports = router;