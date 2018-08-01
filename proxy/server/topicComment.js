const models = require('../../models');
const TopicComment = models.TopicComment;

// {name:a,price:12}
//保存一条评论
exports.saveTopicComment = function(params,callback){
    let topicComment = new TopicComment(params);
    topicComment.save(callback);
}

//根据条件查询评论
exports.findByCondition = function(condition,callback){
    TopicComment.find(condition).populate({
        path:'post_userid',
        select:['_id','user_name','user_img'],
        model:'User'
    }).sort({'post_time':-1}).exec(callback);
}

//更新
exports.updateByCondition = function(condition,update,callback){
    TopicComment.update(condition,update,callback);
}

//删除一条评论
exports.remove = function(condition,callback){
    TopicComment.remove(condition,callback);
}
