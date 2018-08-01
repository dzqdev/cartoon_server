const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const TagSchema = new Schema({
    tag_name:{
        type:String
    },
    is_discard:{
        type:Boolean
    },
    color:{
        type:String
    }
});

const Tag = mongoose.model('Tag',TagSchema,'tag');

module.exports = Tag;