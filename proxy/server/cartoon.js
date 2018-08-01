const models = require('../../models');
const Cartoon = models.Cartoon;


exports.saveCartoon = function(cartoonParams,callback){
    let cartoon = new Cartoon(cartoonParams);
    cartoon.save(callback);
}

//后台查询所有的漫画
//查询类别,封面图片地址,标签信息
//查询所有的章节
exports.findAll = function(condition,start,callback){
    Cartoon.find(condition).populate('cartoon_category').populate('cartoon_tag').populate('cartoon_chapter').skip(start).limit(5).exec(callback);
}

exports.update = function(condition,update,callback){
    Cartoon.update(condition,update,callback);
}

//根据id查询某一本漫画
exports.findById = function(cartoon_id,callback){
    Cartoon.findById(cartoon_id).populate('cartoon_category').populate('cartoon_tag').populate('cartoon_chapter').exec(callback);
}

//查询漫画不查询章节
exports.findWithOutChapter = function(condition,callback){
    Cartoon.find(condition).exec(callback);
}

//计算漫画的数量
exports.count = function(condition,callback){
    Cartoon.count(condition,callback);
}

//前台查询漫画信息
exports.find = function(condition,callback){
    Cartoon.find(condition).populate('cartoon_category').populate('cartoon_tag').populate('cartoon_chapter').exec(callback);
}

//根据id查询某一本漫画的分数信息
exports.findScoreByCartoonId = function(condition,callback){
    Cartoon.find(condition).exec(callback);
}

//按照条件查询漫画（简单查询，只返回图片名称描述等基本信息，不涉及嵌套查询）
exports.findAllByConditionWithoutPopulate = function(condition,fields,options,callback){
    Cartoon.find(condition,fields,options,callback);
}

//查询漫画只包括标签信息
exports.findOnlyTag = function(condition,options,callback){
    if(!options.limit){
        Cartoon.find(condition).populate({
            path:'cartoon_tag',
            model:'Tag'
        }).sort(options.sort).exec(callback);
    }else{
        Cartoon.find(condition).populate({
            path:'cartoon_tag',
            model:'Tag'
        }).sort(options.sort).limit(options.limit).exec(callback);
    }   
}

//聚合查询
exports.groupByCategoryAndCount = function(condition,callback){
    Cartoon.aggregate([
        {
            $group:{
                _id:"$cartoon_category",
                count:{$sum:1}
            }
        }
    ]).exec(callback);
}





