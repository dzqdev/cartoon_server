const BookShelfProxy = require('../../proxy/server/bookshelf');
const JsonFieldFilter = require('../../utils/JsonFieldFilter');
const CartoonProxy = require('../../proxy/server/cartoon');

//收藏一本漫画
exports.saveCartoonFromBookShelf = function(req,res,next){
    let cartoon_id = req.body.cartoon_id;
    let user_id = req.body.user_id;
    let collect_time = new Date();
    let is_update = false;
    let last_watch = req.body.last_watch;

    //查询漫画的第一章的id
    let cartoonFind = new Promise((resolve, reject)=>{
        let condition = {'_id':cartoon_id}
        CartoonProxy.findWithOutChapter(condition,(err,cartoon)=>{
            resolve(cartoon[0]);
        })
    });

    Promise.all([cartoonFind]).then(values => { 
        //如果是第一次收藏,last_watch为空,判断是否有章节。如果有，收藏.没有，不能收藏
        if(last_watch == ''){
            if(values[0].cartoon_chapter.length == 0){
                res.send({msg:{status:'no_chapter'}});
            }else{
                last_watch = values[0].cartoon_chapter[0];
            }
        }

        let params = {cartoon_id,user_id,collect_time,is_update,last_watch};

        BookShelfProxy.saveBookShelfRecord(params,function(err,bookshelf){
            let msg = {};
            if(err){
                msg['status'] = 'error';
                throw err;
            }

            msg['status'] = 'ok';

            res.send({msg});
        });
    });
}

//取消收藏
exports.removeCartoonFromBookShelf = function(req,res,next){
    //获取用户Id以及漫画id
    let cartoon_id = req.body.cartoon_id;
    let user_id = req.body.user_id;

    let condition = {cartoon_id,user_id}

    BookShelfProxy.removeBookShelfRecord(condition,function(err){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            throw err;
        }

        msg['status'] = 'ok';

        res.send({msg});
    });
}

//查询某一个收藏
exports.findBookShelfByCartoonId = function(req,res,next){
    let cartoon_id = req.params.cartoon_id;

    let condition = {cartoon_id}

    BookShelfProxy.findByCondition(condition,function(err,record){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            console.log(err);
            throw err;
        }

        if(record == null){
            msg['status'] = 'ok';
            msg['text'] = 'unCollect';
        }else{
            msg['status'] = 'ok';
            msg['text'] = record;
        }

        res.send({msg});
       
    });
}

//查询所有的收藏
exports.findBookShelf = function(req,res,next){
    let condition = {user_id:req.params.user_id}
    BookShelfProxy.findAll(condition,function(err,bookShelf){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            throw err;
        }

        let convert = bookShelf;
        let needFieldArray = ['cartoon_cover','cartoon_name','_id'];
        for(let i = 0; i < convert.length; i++){
            console.log("convert[i].cartoon_id",convert[i].cartoon_id);
            console.log("typeof convert[i].cartoon_id", typeof convert[i].cartoon_id);
            let result = JsonFieldFilter.needField(needFieldArray,convert[i].cartoon_id);
            convert[i].cartoon_id = result;
        }
        msg['status'] = 'ok';
        msg['text'] = convert;
        
        res.send({msg});
    });
}

//修改收藏漫画的最后观看记录
exports.updateLastWatch = function(req,res,next){
    //用户id
    let user_id = req.body.user_id;
    //漫画id
    let cartoon_id = req.body.cartoon_id;
    //最后观看的章节id
    let last_watch = req.body.last_watch;

    let condition = {"cartoon_id":cartoon_id,"user_id":user_id};
    let update = {"last_watch":last_watch};

    BookShelfProxy.updateBookShelfRecord(condition,update,{},function(err){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            throw err;
        }

        msg['status'] = 'ok';

        res.send({msg});
    });
}

//修改漫画的更新信息
exports.updateStatus = function(req,res,next){
    let bookShelfId = req.body.bookShelfId;
    let condition = {'_id':bookShelfId};
    let update = {is_update:false};
    BookShelfProxy.updateBookShelfRecord(condition,update,function(err){
        let msg = {};
        if(err){
            msg['status'] = 'error';
            throw err;
        }

        msg['status'] = 'ok';

        res.send({msg});
    });
}

//获取书架的更新信息
exports.getBookCaseUpdateInfo = function(req,res,next){
    //用户id
    let user_id = req.params.user_id;
    let condition = {'user_id':user_id,'is_update':true};
    BookShelfProxy.findByCondition(condition,function(err,bookShelf){
        let msg = {};
        if(err){
            msg['status'] = false;
            throw err;
        }   

        if(bookShelf && bookShelf.length > 0){
            msg['status'] = true;
        }else{
            msg['status'] = false;
        }
        res.send({msg});
    });
}