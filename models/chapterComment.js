const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/***
 * 评论id
 * 评论内容
 * 评论用户id
 * 评论点赞数 
 * 点赞的用户id
 */

const ChapterCommentSchema = new Schema({
    comment_content:{
        type:String
    },
    post_userid:{
        type:String,
        ref:'User'
    },
    agree:{
        type:Number
    },
    post_time:{
        type:Date
    },
    agreeUserList:[{type:String,ref:'User'}]
});

const ChapterComment = mongoose.model('ChapterComment',ChapterCommentSchema,'chapter_comment');

module.exports = ChapterComment;