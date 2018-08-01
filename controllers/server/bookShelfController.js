const BookShelfProxy = require('../../proxy/server/bookshelf');

//保存一条收藏记录
exports.saveBookShelf = function(req,res,next){
    let cartoon_id = req.body.cartoon_id;
    let user_id = req.body.user_id;
    let is_update = false;
    let collect_time = new Date();

    let params = {cartoon_id,user_id,is_update,collect_time};

    BookShelfProxy.saveBookShelfRecord(params,function(err,record){
        let msg = {};
        if(err){
            console.log("加入书架失败");
            msg['text'] = "加入书架失败";
            throw err;
        }else{
            console.log("加入成功");
            msg['text'] = "加入书架成功";
        }
        res.render('message',{msg});
    });
}

