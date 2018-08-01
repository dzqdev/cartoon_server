const TopicProxy = require('../../proxy/server/topic');
const TopicCommentProxy = require('../../proxy/server/topicComment');
const UserProxy = require('../../proxy/server/user');
//消息通知
const emitter = require('../../middlewares/MessagePush');

//保存一条topic
exports.saveTopic = function(req,res,next){
    let user_id = req.body.user_id;
    let text_content = req.body.text_content;
    let image_content = req.body.image_content;
    let post_time = new Date();

    if(image_content){
        image_content = eval ("(" + image_content+ ")");
    }

    console.log("image_content",image_content);
    let params = {user_id,text_content,post_time,image_content};

    TopicProxy.save(params,function(err,result){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            console.log("保存topic出错" ,err);
            throw err;
        }
        //通知所有关注的用户
        let notifyResult = emitter.emit('topic_update',result._id,user_id);
        console.log("notifyResult",notifyResult);
        if(notifyResult == true){
            msg['status'] = 'ok';
        }else{
            msg['status'] = 'error';
        }
        res.send({msg});
    });
}

//查询未关注区域的topic
exports.findAllExitComment = function(req,res,next){
    let userFind = new Promise((resolve, reject)=>{
        //获取当前登录的用户的id
        //查询当前用户的所有关注用户的id
        let currentUserId = req.params.user_id;
        let condition = {'_id':currentUserId};
        UserProxy.find(condition,function(err,user){
            resolve(user[0]);
        });
    });

    Promise.all([userFind]).then(values => { 
        //查找到当前用户关注的所有用户
        let attention = values[0].attention_user;
        let condition = {"user_id":{$nin:attention}};
        console.log(condition);
        //查找到除了当前关注的用户之外其他用户发表的话题
        TopicProxy.findByCondition(condition,function(err,result){
            let msg = {};
            if(err){
                msg['status'] = 'error';
                throw err;
            }

            msg['status'] = 'ok';
            msg['topic'] = result;

            res.send({msg});
        });
    });
}

//根据id查询某一条topic
exports.findByIdHaveComment = function(req,res,next){

    //查询id为xxx的某条topic
    let TopicFindPromise = new Promise((resolve, reject)=>{
        TopicProxy.findByCondition({'_id':req.params.topic_id},function(err,result){
            resolve(result);
        });
    });

    Promise.all([TopicFindPromise]).then(values => { 
        //获取该topic的所有评论
        console.log('values',values)
        let commentList = values[0][0].comment;

        //查询到该话题的所有评论id，进行深度查询
        if(commentList.length > 0 && commentList != null){
            let condition =  {'_id':{$in:commentList}};
            TopicCommentProxy.findByCondition(condition,function(err,list){
                //查询到所有的话题的评论
                let msg = {};
                if(err){
                    msg['status'] = 'error';
                    console.log('查询话题的评论时出错,',err);
                    throw err;
                }

                //该话题的所有评论
                //查询所有评论，判断当前用户是否已经为该条评论点过赞
                //获取当前登录的用户
                let userId = req.params.user_id;
                for(let i = 0; i < list.length; i++){
                    if(list[i].agreeUserList.indexOf(userId) > -1){
                        //该用户点过赞
                        list[i].agreeUserList = true;
                    }else{
                        list[i].agreeUserList = false;
                    }
                }

                msg['status'] = 'ok';
                msg['topic'] = values[0][0];
                msg['comment'] = list;

                res.send({msg});
            });
        }else{
            let msg = {};

            msg['status'] = 'ok';
            msg['topic'] = values[0][0];
            res.send({msg});
        }
    });
}

//查询关注区域所有的topic
exports.findUserAttention = function(req,res,next){
    //获得当前用户关注的用户id
    let userAttentionFind = new Promise((resolve, reject)=>{
        //获取当前登录的用户的id
        //查询当前用户的所有关注用户的id
        let currentUserId = req.params.user_id;
        let condition = {'_id':currentUserId};
        UserProxy.find(condition,function(err,user){
            resolve(user[0]);
        });
    });

    //查询该用户关注的所有用户的topic
    Promise.all([userAttentionFind]).then(values => {
        let attentionUserList = values[0].attention_user;

        if(attentionUserList.length < 0){
            let msg = {};
            msg['status'] = 'ok';
            msg['topic'] = null;
        }else{
            //说明该用户有关注的用户
            let condition = {"user_id":{$in:attentionUserList}};
            TopicProxy.findByCondition(condition,function(err,topics){
                let msg = {};
                if(err){
                    console.log('err',err);
                    msg['status'] = 'error';
                    msg['topic'] = null;
                    throw err;
                }

                msg['status'] = 'ok';
                msg['topic'] = topics;

                res.send({msg});
            });
        }
    });
}


//根据id删除某一条topic
exports.remove = function(req,res,next){
    let topicId = req.params.topic_id;
    let condition = {'_id':topicId};
    TopicProxy.removeByCondition(condition,function(err){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            throw err;
        }
        msg['status'] = 'ok';

        res.send({msg});
    });
}

//为某一个话题点赞
exports.agree = function(req,res,next){
    let topicId = req.body.topic_id;
    let userId = req.body.user_id;
    let condition = {'_id':topicId};
    let update = {$inc:{'agree':1},$push:{"agree_list":userId}};

    TopicProxy.updateByCondition(condition,update,function(err){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            throw err;
        }
        msg['status'] = 'ok';

        res.send({msg});
    })
}

//