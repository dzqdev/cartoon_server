const models = require('../../models');
const ChapterComment = models.ChapterComment;

//添加一条章节评论
exports.save = function(params,callback){
    let chapterComment = new ChapterComment(params);
    chapterComment.save(callback);
}

//查询章节评论
exports.find = function(condition,sortCondition,callback){
    ChapterComment.find(condition).populate({
        path:'post_userid',
        select:['_id','user_name','user_img'],
        model:'User'
    }).sort(sortCondition).exec(callback);
}

//更新章节评论
exports.update = function(condition,update,callback){
    ChapterComment.update(condition,update,callback);
}