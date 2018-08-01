var express = require('express');
var router = express.Router();
//categoryController
var categoryController = require('../../controllers/server/categoryController');

//动态转发
router.post('/addCategory',function(req,res,next){
    categoryController.saveCategory(req,res,next);
});

router.get('/allCategory',function(req,res,next){
    categoryController.findAll(req,res,next);
});

router.get('/editCategory/:id',function(req,res,next){
    categoryController.findById(req,res,next);
})

router.post('/editCategory',function(req,res,next){
    categoryController.updateById(req,res,next);
})



//静态转发
router.get('/addCategory',function(req,res,next){
    res.render('category/addCategory');
});

module.exports = router;