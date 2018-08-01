// 请求主页推荐显示的内容
var express = require('express');
var router = express.Router();

const TopicCommentController = require('../../controllers/client/TopicCommentController');

//添加评论
router.post('/saveTopicComment',function(req,res,next){
    TopicCommentController.save(req,res,next);
});

//点赞
router.get('/agree/:commentId/:userId',function(req,res,next){
    TopicCommentController.agree(req,res,next);
});


module.exports = router;