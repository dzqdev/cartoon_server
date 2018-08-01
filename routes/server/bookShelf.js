var express = require('express');
var router = express.Router();

const bookShelfController = require('../../controllers/server/bookShelfController');

//动态转发

//收藏一本漫画
router.post('/collectCartoon',function(req,res,next){
    bookShelfController.saveBookShelf(req,res,next);
});

module.exports = router;