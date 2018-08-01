const tagProxy = require('../../proxy/server/tag');

exports.findAll = function(req,res,next){
    tagProxy.findAll((err,doc)=>{
        let msg = {};
        if(err){
            msg['text'] = "查询出错!";
        }else{
            msg['text'] = "查询成功";
            msg['doc'] = doc;
        }
        res.render('tag/allTag',{msg});
    });
}

exports.findById = function(req,res,next){
    let tag_id = req.params.id;
    tagProxy.findById(tag_id,function(err,doc){
        let msg = {};
        if(err){
            msg['text'] = "查询单个标签出错!";
        }else{
            msg['text'] = "查询单个标签成功";
            msg['doc'] = doc;
        }
        res.render('tag/editTag',{msg});
    });
}

exports.updateById = function(req,res,next){
    let tag_id = req.body.tag_id;
    let tag_name = req.body.tag_name;
    let is_discard = req.body.is_discard;
    let color = req.body.color;
    let update = {tag_name,is_discard,color};
    let condition = {"_id":tag_id};
    tagProxy.updateById(condition,update,function(err){
        let msg = {};
        if(err){
            msg['status'] = "error";
            msg['text'] = "修改标签出错!";
        }else{
            msg['text'] = "修改标签成功";
            msg['status'] = "ok";
        }
        res.send({msg:msg});
    });
}

exports.saveTag = function(req,res,next){
    let tag_name = req.body.tag_name;
    let is_discard = req.body.is_discard;
    let color = req.body.color;
    let tagParams = {tag_name,is_discard,color};
    tagProxy.saveTag(tagParams,(err,response)=>{
        const msg = {};
        if(err){
            console.log("tag err",err);
            msg.text = "添加标签出错!";
        }else{
            console.log("success",response);
            msg['text'] = "添加标签成功";
            msg['status'] = "ok";
        }
        res.send({msg:msg});
    });
}