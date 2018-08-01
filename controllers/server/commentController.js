const CommentProxy = require('../../proxy/server/comment');

//保存一条评论
exports.saveComment = function(req,res,next){
    let comment_content = req.body.comment_content;
    let user_id = req.body.user_id;
    let chapter_id = req.body.chapter_id;
    let save_time = new Date();
    let params = {};
    CommentProxy.save(params,function(err,comment){
        let msg  = {};
        if(err){
            throw err;
        }else{

        }
    });
}

