const RecommendProxy = require('../../proxy/server/recommend');
const cartoonProxy = require('../../proxy/server/cartoon');

//添加一条推荐记录
exports.saveRecommend = function(req,res,next){
    //漫画的id
    let cartoon_Id = req.body.cartoonId;
    let recommendReason = req.body.recommendReason;
    let recommend_time = new Date();
    let params = {cartoon_Id,recommendReason,recommend_time};
    RecommendProxy.save(params,function(err,recommend){
        //保存后的回调
        let msg = {};
        if(err){
            msg['status'] = 'error';
            msg['text'] = '推荐失败';
            throw err;
        }else{
            msg['status'] = 'ok';
            msg['text'] = '推荐成功';
        }
        res.send({msg});
    });
}

//查询已经推荐的推荐
exports.findAll = function(req,res,next){
    RecommendProxy.findAll({},{},function(err,recommends){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            msg['text'] = '查询失败';
            throw err;
        }else{
            msg['status'] = 'ok';
            msg['text'] = recommends;
        }
        res.render('recommend/allRecommend',{msg});
    });
}

//删除一条推荐的记录
exports.removeRecommend = function(req,res,next){
    let recommend_Id = req.body.recommend_Id;
    let condition = {'_id':recommend_Id};
    RecommendProxy.remove(condition,function(err){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            msg['text'] = '取消失败';
            throw err;
        }else{
            msg['status'] = 'ok';
            msg['text'] = '取消成功';
        }
        res.send({msg});
    });
}

//跳转到添加推荐页面
//查询所有还未推荐的漫画
exports.recommendPage = function(req,res,next){
    //查询推荐表获取所有已经推荐漫画的id
    RecommendProxy.find({},{ cartoon_Id: 1, _id:0 },function(recommend_err,cartoon_ids){
        if(recommend_err){
            console.log("recommend_err",recommend_err);
            throw recommend_err;
        }else{
            let alreayRecommend = [];
            for(let i = 0; i < cartoon_ids.length; i++){
                alreayRecommend.push(cartoon_ids[i]['cartoon_Id']);
            }
            //遍历漫画表,查询所有不在上一步查询结果中的id
            cartoonProxy.find({'_id':{$nin:alreayRecommend}},function(err,cartoons){
                let msg = {};
                if(err){
                    msg['status'] = 'error';
                    msg['text'] = '查询失败';
                    throw err;
                }else{
                    msg['status'] = 'ok';
                    msg['text'] = cartoons;
                }
                res.render('recommend/addRecommend',{msg});
            })
        }
    })

   
}
