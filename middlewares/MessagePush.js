const events = require('events');
//定义一个监听事件
var emitter = new events.EventEmitter();


const BookShelfProxy = require('../proxy/server/bookshelf');
const UserProxy = require('../proxy/server/user');
const FriendDynamicMessageProxy = require('../proxy/server/FriendDynamicMessage');

/**更新章节时通知收藏该漫画的用户
 *漫画章节更新时修改收藏表里面所有漫画id为更新章节的漫画的状态为已经更新
 *章节更新后通知所有的收藏用户,更新收藏表的相关字段
 */
emitter.on('chapter_update',function(cartoonId,chapter){
    let condition = {"cartoon_id":cartoonId};
    let update = {"is_update":true};
    let options =  { multi: true };
    BookShelfProxy.updateBookShelfRecord(condition,update,options,function(err,update){
        if(err){
            console.log("推送失败");
            throw err;
        }else{
            console.log("推送成功");
            console.log("update",update);
        }
    });
});

//发表话题时通知所有的关注自己的用户
/**
 * topicId 话题id
 * userId  触发(发表的用户)
 */
emitter.on('topic_update',function(topicId,userId){
    //查询当前用户的所有关注者（关注该用户的其他用户）
    //查询关注当前用户的关注人
    let findUserAllAttention = new Promise((resolve, reject)=>{
        let condition = {'_id':userId};
        UserProxy.find(condition,function(err,user){
            resolve(user[0]);
        });
    });

    //查询该用户关注的所有用户的topic
    Promise.all([findUserAllAttention]).then(values => {
        //查询我的所有粉丝
        let attention_meArray = values[0].attention_me;
        if(attention_meArray != null && attention_meArray.length > 0){
            let messages = [];
            for(let i = 0; i < attention_meArray.length; i++ ){
                messages.push({
                    "message_sender":userId,
                    "message_reciever":attention_meArray[i],
                    "topic_id":topicId,
                    "message_is_read":false,
                    "send_time":new Date()
                });
            }
            FriendDynamicMessageProxy.insertMany(messages,function(err,result){
                let msg = {};
                if(err){
                    msg['status'] = 'error';
                    throw err;
                }
                msg['status'] = 'ok';

                return msg;
            })
        }
    });
});


module.exports = emitter;

