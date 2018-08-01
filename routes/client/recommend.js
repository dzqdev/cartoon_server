// 请求主页推荐显示的内容
var express = require('express');
var router = express.Router();

const bannerController = require('../../controllers/client/bannerController');

router.get('/allBanner',function(req,res,next){
    bannerController.findAllBanner(req,res,next);
});

module.exports = router;