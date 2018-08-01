const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//漫画id
//收藏用户id
//是否更新
//最后看到的章节id
//收藏时间

const BookShelfSchema = new Schema({
    cartoon_id:{
        type:String,
        ref:'Cartoon'
    },
    user_id:{
        type:String
    },
    is_update:{
        type:Boolean
    },
    last_watch:{
        type:String,
        ref:'Chapter'
    },
    collect_time:{
        type:Date
    }
});


const BookShelf = mongoose.model('Bookshelf',BookShelfSchema,'bookshelf');

module.exports = BookShelf;