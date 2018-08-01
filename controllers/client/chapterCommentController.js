//章节评论
const ChapterCommentProxy = require('../../proxy/server/chapterComment');
const ChapterProxy = require('../../proxy/server/chapter');

//添加章节评论
exports.save = function(req,res,next){
    //获取评论的章节id
    let chapterId = req.body.chapterId;
    //评论的信息
    let comment_content = req.body.comment_content;
    let post_userid = req.body.post_userid;
    let agree = 0;
    let post_time = new Date();

    //添加评论
    let chapterCommentInsert = new Promise((resolve, reject)=>{
        let chapterCommentCondition = {comment_content,post_userid,agree,post_time};
        ChapterCommentProxy.save(chapterCommentCondition,function(err,chapterComment){
            resolve(chapterComment);
        });
    });

    //评论添加完成后,将评论id添加到章节的数组中
    Promise.all([chapterCommentInsert]).then(values => { 
        console.log(values);
        let chapterComment = values[0];
        let condition = {'_id':chapterId};
        let update = {$push:{"chapter_comment":chapterComment._id}}
        console.log("condition",condition);
        console.log("update",update);
        ChapterProxy.updateContent(condition,update,function(err,update){
            let msg = {};
            if(err){    
                msg['status'] = 'error';
                msg['text'] = err;
                throw err;
            }

            msg['status'] = 'ok';

            res.send({msg});
        });
    });
}

//为某一个评论点赞
exports.agree = function(req,res,next){
    let commentId = req.body.commentId;
    let userId = req.body.userId;
    let condition = {"_id":commentId};
    let update = {$inc:{"agree":1},$push:{"agreeUserList":userId}};

    ChapterCommentProxy.update(condition,update,function(err,update){
        let msg = {};
        if(err){    
            msg['status'] = 'error';
            msg['text'] = err;
            throw err;
        }

        msg['status'] = 'ok';

        res.send({msg});
    });
}