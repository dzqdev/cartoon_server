const ChapterProxy = require('../../proxy/server/chapter');
const ChapterCommentProxy = require('../../proxy/server/chapterComment');

//根据id查询一个章节的内容
exports.findChapterById = function(req,res,next){
    let chapterId = req.params.chapterId;
    let userId = req.params.userId;
    

    //查询该章节的信息
    let chapterFind = new Promise((resolve, reject)=>{
        let condition = {'_id':chapterId};
        ChapterProxy.findByCondition(condition,(err,chapter)=>{
            resolve(chapter);
        });
    });


    //查询该章节的评论的信息并排序
    Promise.all([chapterFind]).then(values => { 
        let chapter = values[0][0];
        //查看当前用户是否已经点赞
        let agreeUser = chapter.chapter_agree_User;
        console.log(agreeUser);
        let isAgree = false;
        if(agreeUser.length == 0){
            isAgree = false;
        }else{
            for(let i = 0; i < agreeUser.length; i++){
                console.log("agreeUser[i]",agreeUser[i]);
                console.log("userId",userId);
                if(agreeUser[i] == userId){
                    isAgree = true;
                    break;
                }
            }
        }

        //评论列表
        let commentList = chapter.chapter_comment; 
        let condition = {'_id':{$in:commentList}}
        let sortCondition = {"agree":-1};
        let limit = 3;
        ChapterCommentProxy.find(condition,sortCondition,function(err,comments){
            //每一条评论的id以及该评论的点赞是否为该用户
            let commentsResult = [];
            //评论列表
            if(comments.length > 0){
                for(let i = 0; i < comments.length; i++){
                    let comment = comments[i];
                    if(comment.agreeUserList.indexOf(userId) > -1){
                        //获取当前用户在当前章节里面点赞过的评论id
                        commentsResult.push(comment._id);
                    }
                }
            }

            let msg = {};
            if(err){
                msg['status'] = 'error';
                msg['text'] = err;
                throw err;
            }
            
            msg['status'] = 'ok';
            msg['chapter'] = chapter;
            msg['comment'] = comments;
            msg['is_agree_chapter'] = isAgree;
            msg['commentsResult'] = commentsResult;

            res.send({msg});
        });
    });
}

//为某个章节点赞
exports.agreeChapter = function(req,res,next){
    let agreeUser = req.body.userId;
    let chapterId = req.body.chapterId;
    let condition = {"_id":chapterId};
    let update = {$inc:{'chapter_agree':1},$push:{"chapter_agree_User":agreeUser}};

    ChapterProxy.updateContent(condition,update,function(err){
        let msg = {};
        if(err){
            msg['status'] = 'err';
            throw err;
        }

        msg['status'] = 'ok';

        res.send({msg});
    });
}

//取消对该章节的点赞
exports.cancelAgreeChapter = function(req,res,next){
    let agreeUser = req.body.userId;
    let chapterId = req.body.chapterId;
    
    let condition = {"_id":chapterId};
    let update = {$inc:{'chapter_agree':-1},$pull:{"chapter_agree_User":agreeUser}};

    ChapterProxy.updateContent(condition,update,function(err){
        let msg = {};
        if(err){
            msg['status'] = 'err';
            throw err;
        }

        msg['status'] = 'ok';

        res.send({msg});
    });
}