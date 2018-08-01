const models = require('../../models');
const Recommend = models.Recommend;

//添加一条推荐
exports.save = function(params,callback){
    let recommend = new Recommend(params);
    recommend.save(callback);
}

//查询推荐
exports.find = function(condition,fields,callback){
    Recommend.find(condition,fields,callback);
}

//按照id查询一条推荐记录
exports.findById = function(id,callback){
    Recommend.findById(id,callback);
}

//删除一条推荐
exports.remove = function(condition,callback){
    Recommend.remove(condition,callback);
}

//查询所有的推荐以及对应的漫画信息
exports.findAll = function(condition,options,callback){
    if(options.limit){
        Recommend.find(condition).populate({
            path:'cartoon_Id',
            select:['_id','cartoon_name','author','cartoon_desc','cartoon_cover','cartoon_tag','cartoon_category','cartoon_showImg'],
            model:'Cartoon',
            populate:{
                path:'cartoon_tag',
                model:'Tag'
            }
        }).sort({"recommend_time":-1}).limit(options.limit).exec(callback);
    }else{
        Recommend.find(condition).populate({
            path:'cartoon_Id',
            select:['_id','cartoon_name','author','cartoon_desc','cartoon_cover','cartoon_tag','cartoon_popVal','cartoon_showImg'],
            model:'Cartoon',
            populate:{
                path:'cartoon_tag',
                model:'Tag'
            }
        }).sort({"recommend_time":-1}).exec(callback);
    }
    
}

//查询所有的推荐限制数量
// exports.findByCondition = function(){}