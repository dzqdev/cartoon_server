const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CartoonSchema = new Schema({
    cartoon_name:{
        type:String
    },
    author:{
        type:String
    },
    cartoon_desc:{
        type:String
    },
    cartoon_chapter:[{ type: String, ref: 'Chapter' }],
    cartoon_cover:String,
    cartoon_tag:[{ type: String, ref: 'Tag' }],
    cartoon_category:{
        type:String,
        ref:'Category'
    },
    //人气值
    cartoon_popVal:{
        type:Number
    },
    cartoon_agree:{
        type:Number
    },
    cartoon_showImg:{
        type:String
    },
    //总分数
    cartoon_grade:{
        type:Number
    },
    cartoon_topic:{
        type:Array
    },
    cartoon_updateTime:{
        type:Number
    },
    cartoon_isEnd:{
        type:Boolean
    },
    //发表时间
    recently_time:{
        type:Date
    },
    //评分的用户列表
    rater_users:[{
        _id:{type:String},
        score:{type:Number}
    }]
});

const Cartoon =  mongoose.model('Cartoon',CartoonSchema,"cartoon");

module.exports = Cartoon;