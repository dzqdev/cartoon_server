//负责topic的crud
const model = require('../../models');
const Topic = model.Topic;

exports.save = function(params,callback){
    let topic = new Topic(params);
    topic.save(callback);
}

//根据条件查询表
exports.findByCondition = function(condition,callback){
    Topic.find(condition).populate({
        path:'user_id',
        select:['_id','user_name','user_img'],
        model:'User'
    }).sort({"post_time":-1}).exec(callback);
}

//更新话题表
exports.updateByCondition = function(condition,update,callback){
    Topic.update(condition,update,callback);
}

//根据条件删除一条topic
exports.removeByCondition = function(condition,callback){
    Topic.remove(condition,callback);
}

