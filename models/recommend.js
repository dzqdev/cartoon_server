//推荐表
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecommendSchema = new Schema({
    cartoon_Id:{
        type:String,
        ref:'Cartoon'
    },
    recommendReason:{
        type:String
    },
    recommend_time:{
        type:Date        
    }
});

const Recommend = mongoose.model('Recommend',RecommendSchema,'recommend');

module.exports = Recommend;