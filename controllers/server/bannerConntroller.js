let BannerProxy = require('../../proxy/server/banner');

//添加一条banner记录
exports.saveBanner = function(req,res,next){
    //获取banner
    let banner_title = req.body.banner_title;
    let banner_url = req.body.banner_url;
    let link = req.body.link;
    let is_display = req.body.is_display;

    let params = {banner_title,banner_url,link,is_display};

    BannerProxy.saveBanner(params,function(err,doc){
        let msg = {};
        if(err){
            msg['status'] = "error";
            msg['text'] = "添加失败";
            console.log("err",err);
            throw err;
        }else{
            //查询成功
            //返回提示
            msg['status'] = "ok";
            msg['text'] = "添加成功";
        }
        res.send({msg});
    });
}

//查询所有轮播
exports.findAll = function(req,res,next){
    BannerProxy.findBannerByCondition({},function(err,banners){
        let msg = {};
        if(err){
            msg['status'] = "error";
            msg['text'] = "查询失败!";
            console.log(err);
            throw err;
        }else{
            msg['status'] = "ok";
            msg['text'] = banners;
        }
        res.render('banner/allBanner',{msg});
    })
}

//根据id获取一条banner信息
exports.findBannerById = function(req,res,next){
    let bannerId = req.params.bannerId;

    BannerProxy.findBannerById(bannerId,function(err,banner){
        let msg = {};
        if(err){
            msg['status'] = "error";
            msg['text'] = "查询失败!";
            console.log(err);
            throw err;
        }else{
            msg['status'] = "ok";
            msg['text'] = banner;
        }
        res.render('banner/editBanner',{msg});
    })
}

//删除某一个轮播
exports.remove = function(req,res,next){
    let bannerId = req.params.bannerId;
    console.log("bannerId",bannerId);
    BannerProxy.remove({"_id":bannerId},function(err){
        let msg = {};
        if(err){
            msg['status'] = "error";
            msg['text'] = "查询失败!";
            console.log("err",err);
            throw err;
        }else{
            msg['status'] = "ok";
            msg['text'] = "删除成功";
        }
        res.send({msg});
    });
}

//更新一个banner记录
exports.updateById = function(req,res,next){
    let paramsObject = req.body;
    let update;
    if(paramsObject.banner_url == ''){
        update = {"banner_title":paramsObject.banner_title,"link":paramsObject.link,"is_display":paramsObject.is_display};
    }else{
        update = {"banner_title":paramsObject.banner_title,"link":paramsObject.link,"banner_url":paramsObject.banner_url,"is_display":paramsObject.is_display};
    }
    console.log('paramsObject.is_display',paramsObject.is_display);
    let condition = {"_id":paramsObject.bannerId};
    BannerProxy.update(condition,update,function(err,banner){
        let msg = {};
        if(err){
            msg['status'] = "error";
            msg['text'] = "修改失败!";
            console.log("err",err);
            throw err;
        }else{
            msg['status'] = "ok";
            msg['text'] = "修改成功";
        }
        res.send({msg});
    })
}

