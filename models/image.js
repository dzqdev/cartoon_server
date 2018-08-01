const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    img_url:{
        type:String
    }
});

const Image = mongoose.model('Image',ImageSchema,'image');

module.exports = Image;