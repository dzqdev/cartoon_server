const categoryProxy = require('../../proxy/server/category');

//增加分类
exports.saveCategory = function(req,res,next){
    let category_name = req.body.category_name;
    let category_desc = req.body.category_desc;
    let categoryParams = {category_name,category_desc};

    categoryProxy.saveCategory(categoryParams,function(err,doc){
        let msg = {};
        if(err){
            msg['status'] = "error";
            msg['text'] = "添加分类失败";
        }else{
            msg['status'] = "ok";
            msg['text'] = "添加分类成功";
        }
        res.send({msg});
    });
}

//查询所有的分类
exports.findAll = function(req,res,next){
    categoryProxy.findAll(function(err,doc){
        let msg = {};
        if(err){
            console.log("err",err);
            msg['status'] = "error";
            msg['text'] = "查询所有分类失败";
        }else{
            msg['status'] = "ok";
            msg['doc'] = doc;
        }
        res.render('category/allCategory',{msg});
    });
}

//根据id查询单个分类
exports.findById = function(req,res,next){
    let category_id = req.params.id;
    categoryProxy.findById(category_id,function(err,doc){
        let msg = {};
        if(err){
            msg['status'] = "error";
            msg['text'] = "查询单个分类失败";
        }else{
            msg['status'] = "error";
            msg['doc'] = doc;
        }
        console.log("msg",msg);
        res.render('category/editCategory',{msg});
    });
}

exports.updateById = function(req,res,next){
    let category_id = req.body.category_id;
    let category_name = req.body.category_name;
    let category_desc = req.body.category_desc;
    let update = {category_name,category_desc};
    let condition = {"_id":category_id};
    categoryProxy.updateById(condition,update,function(err){
        let msg = {};
        if(err){
            msg['status'] = "error";
            msg['text'] = "修改分类出错!";
        }else{
            msg['text'] = "修改分类成功";
            msg['status'] = "ok";
        }
        res.send({msg:msg});
    });
}