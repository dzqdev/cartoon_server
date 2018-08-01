const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
评论的内容
评论的用户
评论的章节的id
评论的时间
评论的点赞数量
评论举报
*/

const CommentSchema = new Schema({
    comment_content:{
        type:String
    },
    comment_user:{
        type:String,
        ref:"User"
    },
    comment_chapter:{
        type:String,
        ref:'Chapter'
    },
    agree:{
        type:Number
    },
    save_time:{
        type:String
    }
});