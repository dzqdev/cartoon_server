const UserProxy = require('../../proxy/server/user');
const TokenUtil = require('../../utils/TokenUtil');
const TopicProxy = require('../../proxy/server/topic');
const FriendDynamicMessageProxy = require('../../proxy/server/FriendDynamicMessage');
//发送短息
const MessageSendUtil = require('../../services/messageSendUtil');
//生成随机数
const randomNumber = require('../../utils/randomNumber');
//设置到redis中
const redisClient = require('../../redis/index');


//获取验证码
exports.getCheckCode = function(req,res,next){
    //获取手机号码
    let phone = req.body.phone;
    let code = randomNumber.getRandomNumber(6);
    //验证手机号码是否注册过
    let condition = {"user_phone":phone};
    UserProxy.findOne(condition,function(err,user){

        if(err){
            res.send({status:"error"});
            throw err;
        }
        //没有错误
        if(user){
            //存在用户
            res.send({"status":"exits"});
        }else{
            //用户没有注册过
            redisClient.removeItem(phone,function(error, repl){
            });
            //发送信息
            MessageSendUtil.sendSMS(phone,code,function(response){
                //获取发送的状态以及发送的验证码
                let msg = {};
                let {Code}=response;
                if (Code === 'OK') {
                    redisClient.saveItem(phone,code,60*10);
                    //返回发送结果
                    msg['status'] = 'ok';
                }else{
                    msg['status'] = 'error';
                }
                res.send(msg);
            },function(err){
                res.send({"status":"error"});
                console.log(err);
            });
        }
    });
}

//验证验证码的正确性
exports.checkCode = function(req,res,next){
    let phone = req.body.phone;
    let code = req.body.code;

    redisClient.getItem(phone,function(err,data){
        let msg = {};
        if(err){
            //查询失败
            msg['status'] = 'error';
            console.log("err",err);
            throw err;
        }else{
            console.log("data",data);
            //验证码一致
            if(data == code){
                //将redis中的key删除
                msg['status'] = 'ok';
            }else{
                //验证码不一致
                msg['status'] = 'error';
            }
            
        }
        res.send(msg);
    });
}


//用户注册
exports.register = function(req,res,next){
    //用户名
    let user_name = req.body.user_name;
    //密码
    let user_password = req.body.user_password;
    //手机号码
    let user_phone = req.body.user_phone;
    let user_img = '/upload/user_cover/default.jpg';
    let reg_date = new Date();

    let params = {user_name,user_password,user_phone,user_img,reg_date};

    console.log("params",params);
    //加入数据库
    UserProxy.save(params,function(err,user){
        let msg = {};
        if(err){
            console.log("saveUserErr",err);
            throw err;
        }else{
            redisClient.removeItem(user_phone,function(error, repl){
                if(err){
                    msg['delete'] = false;
                }else{
                    msg['delete'] = true;
                }
            });
            msg['status'] = 'ok';
            msg['text'] = user;
        }
        res.send({msg});
    });
}

//用户登录
exports.login = function(req,res,next){
    let user_phone = req.body.user_phone;
    let user_password = req.body.user_password;
    let params = {user_phone,user_password};


    UserProxy.findOne(params,function(err,user){
        let msg = {};
        if(err){
            console.log("loginErr",err);
            throw err;
        }
        
        if(user == null){
            msg['status'] = 'error';
            msg['text'] = '用户名或密码错误';
        }else{
            let token = TokenUtil.createToken(user,1000*60*60);
            msg['status'] = 'ok';
            msg['text'] = user;
            msg['token'] = token;
        }
        res.send({msg});
    });
}

//用户关注
exports.attention = function(req,res,next){
    //当前用户Id
    let userId = req.body.userId;
    //关注的用户的id
    let attentionUserId = req.body.attentionUserId;

    //在当前用户的关注列表中加入attentionUser
    let currentUserAddAttention = new Promise((resolve, reject)=>{
        let condition = {'_id':userId};
        let update = {$push:{"attention_user":attentionUserId}};

        UserProxy.updateByCondition(condition,update,function(err,result){
            resolve(result);
        });
    });


    //在attention用户数组中加入当前用户
    let AttentionUserAddCurrentUser = new Promise((resolve, reject)=>{
        //
        let condition = {"_id":attentionUserId};
        let update = {$push:{"attention_me":userId}};
        UserProxy.updateByCondition(condition,update,function(err,result){
            resolve(result);
        });
    });

    Promise.all([currentUserAddAttention,AttentionUserAddCurrentUser]).then(values => {
        let msg = {};
        //当前关注用户添加结果
        let currentUserAddAttention = values[0];
        //被关注的用户添加粉丝
        let AttentionUserAddCurrentUser = values[1];

        if(currentUserAddAttention.ok == 1 && AttentionUserAddCurrentUser.ok ==1){
            msg['status'] = 'ok';
        }else{
            msg['status'] = 'error';
        }
       
        res.send({msg});
    });
}

//查询关注的用户
exports.findAttentionUser = function(req,res,next){
    //获取当前用户id
    let userId = req.params.userId;
    let condition = {'_id':userId};
    let fields = {"_id":1,"user_name":1,"user_img":1}

    UserProxy.findAttention(condition,fields,function(err,attention){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            throw err;
        }

        msg['status'] = 'ok';
        msg['text'] = attention[0];

        res.send({msg});
    });
}

//取消关注用户
exports.cancelAttentionUser = function(req,res,next){
    let attentionUserId = req.body.attentionId;
    let userId = req.body.userId;
    let condition = {"_id":userId};
    let update = {$pull:{"attention_user":attentionUserId}};

    UserProxy.updateByCondition(condition,update,(err)=>{
        let msg = {};
        if(err){
            msg['status'] = 'error';
            throw err;
        }

        msg['status'] = 'ok';

        res.send({msg});
    })
}

//用户个人空间
exports.meSpace = function(req,res,next){
    let userId = req.params.userId;

    //查询关注数量
    let attentionCountFind = new Promise((resolve, reject)=>{
        let condition = {"_id":userId};
        UserProxy.findOne(condition,function(err,user){
            resolve(user);
        });
    });

    //查询发表的话题
    let topicFind = new Promise((resolve, reject)=>{
        let condition = {"user_id":userId};
        TopicProxy.findByCondition(condition,function(err,topics){
            resolve(topics);
        });
    });

    let userFind = new Promise((resolve, reject)=>{
        let condition = {"_id":userId};
        UserProxy.findOne(condition,function(err,user){
            resolve(user);
        });
    });
    
    Promise.all([attentionCountFind,topicFind]).then(values => { 
        let attentionCountResult = values[0].attention_user;
        let topicResult = values[1];
        let user = {"_id":values[0]._id,"user_name":values[0].user_name,"user_img":values[0].user_img}
        let msg = {};

        msg['attentionCount'] = attentionCountResult;
        msg['topics'] = topicResult;
        msg['user'] = user;

        res.send({msg});
    });
}

//查询某个用户的所有topic
exports.findTopicByUserId = function(req,res,next){
    let userId = req.params.user_id;

    let condition = {'user_id':userId};

    TopicProxy.findByCondition(condition,function(err,topics){
        let msg = {};
        if(err){
            msg['status'] = 'error;'
            throw err;
        }

        msg['status'] = 'ok';
        msg['text'] = topics;
        
        res.send({msg});
    });
}

//根据用户id查询该用户的所有消息
exports.findMessageByUserId = function(req,res,next){
    let condition = {'message_reciever':req.params.user_id};

    FriendDynamicMessageProxy.findByCondition(condition,function(err,messages){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            throw err;
        }
        let unRead = 0;
        for(let i = 0; i < messages.length; i++){
            if(messages[i].message_is_read == false){
                unRead++;
            }
        }
        msg['status'] = 'ok';
        msg['text'] = messages;
        msg['unRead'] = unRead;

        res.send({msg});
    });
}

//删除消息
exports.deleteMsg = function(req,res,next){
    //删除的消息id
    let msgId = req.body.msgId;
    let condition = {"_id":msgId};
    FriendDynamicMessageProxy.remove(condition,function(err){
        let msg = {};
        if(err){
            msg['status'] = 'error;'
            throw err;
        }
        msg['status'] = 'ok';
        res.send({msg});
    });
}

//修改消息的状态为已读
exports.updateMessageStatus = function(req,res,next){
    let messageId = req.body.messageId;

    let condition = {"_id":messageId};
    let update = {"message_is_read":true};

    FriendDynamicMessageProxy.updateByCondition(condition,update,function(err,result){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            throw err;
        }

        msg['status'] = 'ok';

        res.send({msg});
    });
}

//修改用户头像
exports.updateUserImg = function(req,res,next){
    //上传后的用户头像
    let destination = req.files[0].destination;
    let filename = req.files[0].filename;
    let convertPath = destination.substring(destination.indexOf('upload')-1,destination.length) + filename; 
    //需要更新的用户id
    let user_id = req.body.user_id;    
    console.log("user_id",user_id);
    let condition = {'_id':user_id};
    let update = {"user_img":convertPath};

    UserProxy.updateByCondition(condition,update,function(err){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            throw err;
        }

        msg['status'] = 'ok';
        msg['img_url'] = convertPath;

        res.send(msg);
    });
}

//添加历史记录
exports.addHistory = function(req,res,next){
    //用户id
    let user_id = req.body.user_id;
    //漫画id
    let cartoon = req.body.cartoon_id;
    let date = new Date();

    let params = {cartoon,date};

    let condition = {"_id":user_id};
    let update = {$push:{"history":params}};

    UserProxy.updateByCondition(condition,update,function(err){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            throw err;
        }

        msg['status'] = 'ok';

        res.send(msg);
    });
}

//根据条件获取每个月的用户增长情况
exports.groupByRegMonth = function(req,res,next){
    let endDate = new Date();
    let year = endDate.getFullYear()-1;
    let month = endDate.getMonth();
    let day = endDate.getDate();
    let fromDate = year + "-" + month + '-' + day;
    console.log(fromDate,endDate);
    UserProxy.groupByRegMonth(fromDate,endDate,function(err,users){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            throw err;
        }

        msg['status'] = 'ok';
        msg['users'] = users;

        res.send(msg);
    });
}