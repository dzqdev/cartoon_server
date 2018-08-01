var express = require('express');
var router = express.Router();

const bookShelfController = require('../../controllers/server/bookShelfController');

//动态转发

//收藏一本漫画
router.get('/userRegister',function(req,res,next){
    res.render('test/userRegister');
});

router.get('/cartoonCollect',function(req,res,next){
    res.render('test/cartoonCollect');
});

module.exports = router;