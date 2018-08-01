// 请求主页推荐显示的内容
var express = require('express');
var router = express.Router();

var UserController = require('../../controllers/client/userController');
var TopicController = require('../../controllers/client/TopicController');
//图片插件
const ImageUtil = require('../../services/imageUtil');

//发送验证码
router.post('/register/sendSMS',function(req,res,next){
    UserController.getCheckCode(req,res,next);
});

//检查验证码是否正确
router.post('/register/checkCode',function(req,res,next){
    UserController.checkCode(req,res,next);
});

//注册
router.post('/register',function(req,res,next){
    UserController.register(req,res,next);
});

//登录
router.post('/login',function(req,res,next){
    UserController.login(req,res,next);
});

//关注用户
router.post('/attention',function(req,res,next){
    UserController.attention(req,res,next);
});

//查询用户关注的用户
router.get('/findAttentionUser/:userId',function(req,res,next){
    UserController.findAttentionUser(req,res,next);
});

//取消关注某个用户
router.post('/cancelAttentionUser',(req,res,next)=>{
    UserController.cancelAttentionUser(req,res,next);
})

//个人空间
router.get('/meSpace/:userId',(req,res,next)=>{
    UserController.meSpace(req,res,next);
});

//查询某个用户的所有topic
router.get('/meTopic/:user_id',(req,res,next)=>{
    UserController.findTopicByUserId(req,res,next);
})

//查询某个用户的所有消息
router.get('/findMessageByUserId/:user_id',(req,res,next)=>{
    UserController.findMessageByUserId(req,res,next);
});

//更新消息状态
router.post('/updateMessageStatus',(req,res,next)=>{
    UserController.updateMessageStatus(req,res,next);
});

//删除某一条消息
router.post('/deleteMsg',(req,res,next)=>{
    UserController.deleteMsg(req,res,next);
});

//上传用户头像
//上传topic所需的图片
router.post('/upload/image',ImageUtil('/user_cover').any(),function(req,res,next){
   UserController.updateUserImg(req,res,next);
});

//添加历史记录
router.post('/addHistory',function(req,res,next){
    UserController.addHistory(req,res,next);
});


module.exports = router;