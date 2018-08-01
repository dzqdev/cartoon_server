//好友动态消息
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * 消息内容
 * 消息发送人
 * 消息接收人
 * 消息类别(friend表示好友消息,system表示系统消息)
 * 是否已读
 * 消息外链
 * 外链类别(评论,话题)
 * 消息发送时间
 * 消息
 */

const FriendDynamicMessageSchema = new Schema({
    message_content:{
        type:String
    },
    //发送者，即更新动态的用户id
    message_sender:{
        type:String,
        ref:'User'
    },
    //接收人（接到更新通知的用户id）
    message_reciever:{
        type:String,
        ref:'User'
    },
    //话题id
    topic_id:{
        type:String,
        ref:'Topic'
    },
    //是否已读
    message_is_read:{
        type:Boolean
    },
    //更新时间
    send_time:{
        type:Date
    }
});

const FriendDynamicMessage = mongoose.model('FriendDynamicMessage',FriendDynamicMessageSchema,'friend_dynamic_message');

module.exports = FriendDynamicMessage;