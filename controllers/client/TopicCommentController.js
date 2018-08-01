const TopicCommentProxy = require('../../proxy/server/topicComment');
const TopicProxy = require('../../proxy/server/topic');

//保存
exports.save = function(req,res,next){
    let comment_content = req.body.comment_content;
    let post_userid = req.body.post_userid;
    let agree = 0;
    let post_time = new Date();

    let params = {comment_content,post_userid,agree,post_time}

    let TopicCommentSavePromise = new Promise((resolve, reject)=>{
        TopicCommentProxy.saveTopicComment(params,function(err,comment){
            resolve(comment);    
        });
    });

    Promise.all([TopicCommentSavePromise]).then(values => { 
        //添加完的评论的id
        console.log('values[0]',values[0]);
        let commentId = values[0]._id;
        //修改的话题id
        let condition = {"_id":req.body.topic_id};
        //更新操作
        let update = {$push:{"comment":commentId}};

        TopicProxy.updateByCondition(condition,update,function(err){
            let msg = {};
            if(err){
                msg['status'] = 'error';    
                console.log(err);
                throw err;
            }

            msg['status'] = 'ok';

            res.send({msg});
        });
    });
}

//删除一条评论
exports.removeById  = function(req,res,next){
    let topicCommentId = req.body.commentId;
    
    let condition = {'_id':topicCommentId};

    TopicCommentProxy.remove(condition,function(err){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            throw err;
        }

        msg['status'] = 'ok';

        res.send({msg});
    });
}

/**
 * 评论点赞功能的实现
 */
exports.agree = function(req,res,next){
    let commentId = req.params.commentId;
    let commentUserId = req.params.userId;
    let condition = {'_id':commentId};
    let update = {$inc:{'agree':1},$push:{"agreeUserList":commentUserId}};

    TopicCommentProxy.updateByCondition(condition,update,function(err){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            throw err;
        }

        msg['status'] = 'ok';

        res.send({msg});

    });
}

//针对评论的评论的实现
