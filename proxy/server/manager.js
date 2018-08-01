const models = require('../../models');
const Manager = models.Manager;


//添加一个管理员
exports.save = function(params,callback){
    let manager = new Manager(params);
    manager.save(callback);
}

//查找若干个匹配condition的记录
exports.find = function(condition,callback){
    Manager.find(condition,callback);
}

//
exports.findOne = function(condition,callback){
    Manager.findOne(condition,callback);
}