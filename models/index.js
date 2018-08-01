//mongodb连接程序
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cartoon_db',{
    server: {poolSize: 20}
},(err)=>{
    if(err){
        console.log("数据库连接失败!");
    }else{
        console.log("数据库连接成功!");
    }
});

exports.Cartoon = require('./cartoon');
exports.Chapter = require('./chapter');
exports.User = require('./user');
exports.Tag = require('./tag');
exports.Category = require('./category');
exports.Image = require('./image');
exports.Banner = require('./banner');
exports.Recommend = require('./recommend');
exports.BookShelf = require('./bookshelf');
exports.Manager = require('./manager');
exports.Comment = require('./comment');
exports.Topic = require('./topic');
exports.TopicComment = require('./topicComment');
exports.FriendDynamicMessage = require('./FriendDynamicMessage');
exports.ChapterComment = require('./chapterComment');


