const models = require('../../models');
const Comment = models.Comment;


//添加一条评论
exports.save = function(params,callback){
    let comment = new Comment(params);
    comment.save(callback);
}

//查询评论
exports.find = function(condition,callback){
    Comment.find(condition,callback);
}

//更新评论的状态
exports.update = function(condition,update,callback){
    Comment.update(condition,update,callback);
}

//删除一条评论
exports.remove = function(condition,callback){
    Comment.remove(condition,callback);
}



