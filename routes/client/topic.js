// 请求主页推荐显示的内容
var express = require('express');
var router = express.Router();

const TopicController = require('../../controllers/client/TopicController');
//图片插件
const ImageUtil = require('../../services/imageUtil');

//保存topic
router.post('/saveTopic',function(req,res,next){
    TopicController.saveTopic(req,res,next);
});

router.get('/findAllExitComment/:user_id',function(req,res,next){
    TopicController.findAllExitComment(req,res,next);
});

router.get('/findByIdHaveComment/:topic_id/:user_id',function(req,res,next){
    TopicController.findByIdHaveComment(req,res,next);
});

//获取关注的用户的所有topic
router.get('/findUserAttention/:user_id',function(req,res,next){
    TopicController.findUserAttention(req,res,next);
});

//上传topic所需的图片
router.post('/upload/image',ImageUtil('/community').any(),function(req,res,next){
    let destination = req.files[0].destination;
    let filename = req.files[0].filename;
    let convertPath = destination.substring(destination.indexOf('upload')-1,destination.length) + filename; 
    let params = {img_url:convertPath}
    res.send({params});
});

//为某一个话题点赞
router.post('/agreeTopic',function(req,res,next){
    TopicController.agree(req,res,next);
});


module.exports = router;