const models = require('../../models');
const FriendDynamicMessage = models.FriendDynamicMessage;


//添加一条好友动态到数据库
exports.save = function(params,callback){
    let friendDynamicMessage = new FriendDynamicMessage(params);
    friendDynamicMessage.save(callback);
}

//批量添加
exports.insertMany = function(paramsArray,callback){
    FriendDynamicMessage.insertMany(paramsArray,callback);
}

//查询好友动态
exports.findByCondition = function(condition,callback){
    FriendDynamicMessage.find(condition).populate({
        path:'message_sender',
        select:['_id','user_name','user_img'],
        model:'User'
    }).populate('topic_id').sort({"send_time":-1}).exec(callback);
}

//动态修改
exports.updateByCondition = function(condition,update,callback){
    FriendDynamicMessage.update(condition,update,callback);
}

//删除某一条消息
exports.remove = function(condition,callback){
    FriendDynamicMessage.remove(condition,callback);
}