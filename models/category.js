const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    category_name:{
        type:String
    },
    category_desc:{
        type:String
    }
});

const Category =  mongoose.model('Category',CategorySchema,'category');

module.exports = Category;