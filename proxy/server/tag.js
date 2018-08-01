const models = require('../../models');
const Tag = models.Tag;

exports.saveTag = function(tagParams,callback){
    let tag = new Tag(tagParams);
    tag.save(callback);
}

exports.findAll = function(callback){
    Tag.find({},callback);
}

exports.findById = function(id,callback){
    Tag.findById(id,callback);
}

exports.updateById = function(conditions,update,callback){
    Tag.update(conditions,update,callback);
}