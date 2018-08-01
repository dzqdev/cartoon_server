const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/***
 * 评论id
 * 评论内容
 * 评论用户id
 * 评论点赞数 
 * 点赞的用户id
 */

const TopicCommentSchema = new Schema({
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

const TopicComment = mongoose.model('TopicComment',TopicCommentSchema,'topic_comment');

module.exports = TopicComment;