const models = require('../../models');
const Category = models.Category;

exports.saveCategory = function(categoryParams,callback){
    let category = new Category(categoryParams);
    category.save(callback);
}

exports.findAll = function(callback){
    Category.find({},callback);
}

exports.findById = function(id,callback){
    Category.findById(id,callback);
}

exports.updateById = function(conditions,update,callback){
    Category.update(conditions,update,callback);
}