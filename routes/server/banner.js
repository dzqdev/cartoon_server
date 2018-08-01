var express = require('express');
var router = express.Router();

var path = require('path');

var imageUtil = require('../../services/imageUtil');
const bannerController = require('../../controllers/server/bannerConntroller');


/**
 * 静态转发 
 * */

//获取添加banner的界面
router.get('/addBanner',function(req,res,next){
    res.render('banner/addBanner');    
});

/**
 * 动态转发
 * */

//添加banner到数据库
router.post('/addBanner',function(req,res,next){
    bannerController.saveBanner(req,res,next);
});

//获取所有的banner
router.get('/allBanner',function(req,res,next){
    bannerController.findAll(req,res,next);
});

//删除一张banner记录
router.get('/remove/:bannerId',function(req,res,next){
    bannerController.remove(req,res,next);
});

//跳转到修改banner的界面
router.get('/editBanner/:bannerId',function(req,res,next){
    bannerController.findBannerById(req,res,next);
});

//完成banner的修改
router.post('/editBanner',function(req,res,next){
    bannerController.updateById(req,res,next);
});


//上传轮播图片
router.post('/uploadImg',imageUtil('/banner').any(),function (req, res, next) {
    let destination = req.files[0].destination;
    let filename = req.files[0].filename;
    let convertPath = destination.substring(destination.indexOf('upload')-1,destination.length) + filename; 
    let params = {img_url:convertPath}
    res.send({params});
});



module.exports = router;