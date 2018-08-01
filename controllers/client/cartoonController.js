const CartoonProxy = require('../../proxy/server/cartoon');
const BookShelfProxy = require('../../proxy/server/bookshelf'); 
let RecommendProxy = require('../../proxy/server/recommend');
const JsonFieldFilter = require('../../utils/JsonFieldFilter');

exports.index = function(req,res,next){
    //查询系统推荐
    let recommendFind = new Promise((resolve, reject)=>{
        let options = {limit:4};
        RecommendProxy.findAll({},options,function(err,recommends){
            resolve(recommends);
        });
    });

    //查询热门佳作
    let hot_cartoon_Find = new Promise((resolve, reject)=>{
        let options = {limit:6,sort:{cartoon_grade:1}};
        CartoonProxy.findAllByConditionWithoutPopulate({},null,options,function(err,cartoons){
            resolve(cartoons);
        });
    });

    //查询完结作品
    let end_cartoon_Find = new Promise((resolve, reject)=>{
        let condition = {"cartoon_isEnd":true};
        let options = {limit:6,sort:{cartoon_grade:1}};
        CartoonProxy.findAllByConditionWithoutPopulate(condition,null,options,function(err,cartoons){
            resolve(cartoons);
        });
    });

    //返回数据
    Promise.all([recommendFind,hot_cartoon_Find,end_cartoon_Find]).then(values => { 
        let msg = {};
       //推荐
        msg['recommend'] = values[0];
       //热门
        msg['hot_cartoon_Find'] = values[1];
       //完结
       msg['end_cartoon_Find'] = values[2];

       res.send(msg);
    });
}

//根据漫画id查询漫画,查询漫画是否被收藏
exports.findById = function(req,res,next){
    let cartoonFind = new Promise((resolve, reject)=>{
        let cartoonId = req.params.cartoonId;
        CartoonProxy.findById(cartoonId,(err,cartoon)=>{
            resolve(cartoon);
        });
    });

    //查询是否被收藏
    let collectFind = new Promise((resolve, reject)=>{
        let cartoon_id = req.params.cartoonId;
        let user_id = req.params.userId;
        let condition = {cartoon_id,user_id}
        BookShelfProxy.findByCondition(condition,function(err,record){
            resolve(record);
        });
    });

    //添加点击量
    let cartoon_popValInsert = new Promise((resolve, reject)=>{
        let cartoonId = req.params.cartoonId;
        let condition = {"_id":cartoonId};
        let update = {$inc:{"cartoon_popVal":1}};
        CartoonProxy.update(condition,update,(err,update)=>{
            resolve(update);
        });
    });

    
    
    Promise.all([cartoonFind,collectFind,cartoon_popValInsert]).then(values => { 
        let msg = {};
        //收藏信息
        let collect = values[1];
        //查询是否评分
        let userId = req.params.userId;
        let cartoonRateList = values[0].rater_users;

        for(let i = 0; i < cartoonRateList.length; i++){
            if(cartoonRateList[i]._id == userId){
                msg['rater'] = cartoonRateList[i];
            }else{
                msg['rater'] = null;
            }
        }
        //所有的评论
        let isCollect = collect.length>0?true:false;
        msg['cartoon'] = values[0];
        msg['isCollect'] = isCollect;
        msg['collect'] = collect;
        res.send(msg);
    });
}

//查询所有的漫画
exports.findAll = function(req,res,next){
    CartoonProxy.find({},function(err,cartoons){
        if(err){
            throw err;
        }
        res.send({cartoons});
    });
}

//点击分类过滤漫画信息
exports.findByCondition = function(req,res,next){
    let categoryId = req.params.categoryId;
    let isEnd = req.params.isEnd;
    let condition = {};
    //类别
    if(categoryId != 'all'){
        condition.cartoon_category = categoryId;
    }

    //是否完结
    if(isEnd != 'all'){
        condition.cartoon_isEnd = isEnd;
    }

    CartoonProxy.find(condition,function(err,cartoons){
        if(err){
            console.log(err);
            throw err;
        }
        res.send({cartoons});
    });
}

//按照更新日期查看漫画信息
exports.findByUpdateDate = function(req,res,next){
    let condition = {cartoon_updateTime:req.params.update_time};
    CartoonProxy.find(condition,function(err,cartoons){
        if(err){
            console.log(err);
            throw err;
        }
        res.send({cartoons});
    });
}

//为漫画评分
exports.rater = function(req,res,next){
    //获取评分的用户id
    let user_id = req.body.user_id;
    //获取分数
    let score = req.body.score;
    score = parseInt(score);
    //获取评分的漫画id
    let cartoon_id = req.body.cartoon_id;

    //获取当前的漫画
    let cartoonFind = new Promise((resolve, reject)=>{
        let condition = {"_id":cartoon_id}
        CartoonProxy.findScoreByCartoonId(condition,function(err,cartoons){
            resolve(cartoons);
        });
    });

    Promise.all([cartoonFind]).then(values => { 
        //
        let cartoon = values[0][0];

        //获取漫画评分的人数以及当前的评分
        let personCount = cartoon.rater_users.length;
        //原本的分数
        let originScore = cartoon.cartoon_grade==undefined?0:cartoon.cartoon_grade;
        let newsScore = (originScore * personCount + score)/(personCount+1);
        newsScore = Math.round(newsScore*Math.pow(10, 1))/Math.pow(10, 1);    
        let condition = {"_id":cartoon_id};
        let update = {$push:{"rater_users":{"_id":user_id,"score":score}},cartoon_grade:newsScore};
        
        CartoonProxy.update(condition,update,function(err){
            let msg = {};
            if(err){
                msg['status'] = 'error';
                console.log(err);
                throw err;
            }

            msg['status'] = 'ok';

            res.send({msg});
        });
    });
}


//通过名称查询对应的作品
exports.search = function(req,res,next){
    let keyWord = req.params.key;
    let regExp = new RegExp(keyWord,'i');
    let condition = {"cartoon_name":regExp};
    let fields = {"cartoon_name":1,"author":1,"_id":1};
    CartoonProxy.findAllByConditionWithoutPopulate(condition,fields,null,function(err,data){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            msg['text'] = err;
            console.log(err);
            throw err;
        }
        msg['status'] = 'ok';
        msg['text'] = data;
        res.send({msg});
    });
}

//查询所有推荐
exports.getAllRecommend = function(req,res,next){
    let condition = {};
    let options = {};
    RecommendProxy.findAll(condition,options,function(err,recommends){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            msg['text'] = err;
            console.log(err);
            throw err;
        }
        msg['status'] = 'ok';
        msg['text'] = recommends;
        res.send(recommends);
    });
}

//查询所有的热门漫画
exports.getAllHot = function(req,res,next){
    let options = {sort:{"cartoon_popVal":-1}};
    CartoonProxy.findOnlyTag({},options,function(err,cartoons){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            msg['text'] = err;
            console.log(err);
            throw err;
        }
        msg['status'] = 'ok';
        msg['text'] = cartoons;
        res.send(cartoons);
    });
}


//查询所有的完结漫画
