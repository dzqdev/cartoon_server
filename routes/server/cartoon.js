var express = require('express');
var router = express.Router();

//文件上传
var imageUtil = require('../../services/imageUtil');

const cartoonController = require('../../controllers/server/cartoonController');

//动态转发
//获取所有漫画的界面
router.get('/allCartoon/:page',function(req,res,next){
    cartoonController.allCartoon(req,res,next);
});

//搜索
router.get('/allCartoon/:page/:cartoon_name',function(req,res,next){
    cartoonController.allCartoon(req,res,next);
});

//跳转到添加漫画的界面
router.get('/addCartoon',function(req,res,next){
    cartoonController.getAddCartoonPage(req,res,next);
});

//添加漫画到数据库
router.post('/addCartoon',function(req,res,next){
    cartoonController.saveCartoon(req,res,next);
});

//跳转到编辑漫画的页面
router.get('/editCartoon/:cartoon_id',function(req,res,next){
    cartoonController.findById(req,res,next);
});

//完成漫画的修改
router.post('/editCartoon',function(req,res,next){
    cartoonController.updateByCartoonId(req,res,next);
});

//上传漫画封面
router.post('/addCover', imageUtil('/cartoon_cover').any(), function (req, res, next) {
    // imageController.saveImage(req, res, next);
    let destination = req.files[0].destination;
    let filename = req.files[0].filename;
    let convertPath = destination.substring(destination.indexOf('upload')-1,destination.length) + filename; 
    let params = {img_url:convertPath}
    res.send({params});
});

//上传漫画封面
router.post('/addBill', imageUtil('/cartoon_bill').any(), function (req, res, next) {
    // imageController.saveImage(req, res, next);
    let destination = req.files[0].destination;
    let filename = req.files[0].filename;
    let convertPath = destination.substring(destination.indexOf('upload')-1,destination.length) + filename; 
    let params = {img_url:convertPath}
    res.send({params});
});


//静态转发


module.exports = router;