const models = require('../../models');
const User = models.User;

//添加一个用户
//value()
exports.save = function(params,callback){
    let user = new User(params);
    user.save(callback);
}

//查询一个
exports.findOne = function(condition,callback){
    User.findOne(condition,{"_id":1,"user_name":1,"user_phone":1,"user_img":1,"attention_user":1},callback);
}

//查询多个
exports.find = function(condition,callback){
    User.find(condition).exec(callback);
}

exports.updateByCondition = function(condition,update,callback){
    User.update(condition,update,callback);
}

//查询用户关注的用户
exports.findAttention = function(condition,fields,callback){
    User.find(condition,fields).populate({
        path:'attention_user',
        select:['_id','user_name','user_img'],
        model:'User'
    }).exec(callback);
}

//返回数量
exports.groupByRegMonth = function(fromDate,endDate,callback){
    User.aggregate([
        {
            $match: {  
                reg_date: { $gte: fromDate, $lte: endDate }  
            }  
        },
        {  
            $group: {  
               _id:{reg_date:{month:{$month:"$reg_date"}}},
               count:{$sum:1}
            }  
        }
    ]).exec(callback);
}




