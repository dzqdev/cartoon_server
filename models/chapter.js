const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChapterSchema = new Schema({
    chapter_title:{
        type:String
    },
    chapter_number:{type:Number},
    chapter_content:[{ type: String, ref: 'Image' }],
    chapter_comment:[{ type: String ,ref:'ChapterComment'}],
    chapter_updateDate:{
        type:Date
    },
    chapter_agree:{
        type:Number
    },
    chapter_agree_User:[{type:String,ref:'User'}]
});

const Chapter = mongoose.model('Chapter',ChapterSchema,'chapter');

module.exports = Chapter;