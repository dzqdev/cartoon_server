const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*
话题id
发表用户id
发表的文本
发表的图片(集合)
评论（集合）
*/
const TopicSchema = new Schema({
    user_id:{
        type:String,
        ref:'User'
    },
    text_content:{
        type:String
    },
    post_time:{type:Date},
    image_content:[{type:String}],
    agree:{type:Number},
    comment:[{
        type:String,
        ref:'TopicComment'
    }],
    agree_list:[{
        type:String,
        ref:"User"
    }]
});

const Topic = mongoose.model('Topic',TopicSchema,'topic');

module.exports = Topic;