const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//用户

const UserSchema = new Schema({
    user_name:{
        type:String
    },
    user_phone:{
        type:String
    },
    user_password:{
        type:String
    },
    user_img:{
        type:String
    },
    attention_user:[{type:String,ref:'User'}],
    attention_me:[{type:String,ref:'User'}],
    history:[{
        cartoon:{
            type:String,
            ref:"Cartoon"
        },
        date:{
            type:Date
        }
    }],
    reg_date:{
        type:Date
    }
});

const User = mongoose.model('User',UserSchema,'user');

module.exports = User;