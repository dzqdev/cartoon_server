var express = require('express');
var router = express.Router();
//tagController
var tagController = require('../../controllers/server/tagController');

//动态转发
router.get('/allTag', function(req, res, next) {
    tagController.findAll(req,res,next);
});

router.get('/editTag/:id',function(req,res,next){
    tagController.findById(req,res,next);
});

router.post('/addTag',function(req,res,next){
    tagController.saveTag(req,res,next);
});

router.post('/editTag',function(req,res,next){
    tagController.updateById(req,res,next);
});





//静态转发
router.get('/addTag',function(req,res,next){
    res.render('tag/addTag');
});

module.exports = router;