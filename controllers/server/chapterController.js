const async = require('async');
const chapterProxy = require('../../proxy/server/chapter');
const cartoonProxy = require('../../proxy/server/cartoon');
//解压文件并返回图片地址数组
const zipUtil = require('../../services/zipUtils');
//
const imageProxy = require('../../proxy/server/image');

//事件发送器
const emitter = require('../../middlewares/MessagePush');

//添加一本漫画的章节
//上传章节的图片并返回路径
//添加图片到数据库
//添加章节的标题等信息
//添加章节的content，即漫画图片id
exports.insertChapter = function(req,res,next){
    let imageInsertPromise = new Promise((resolve, reject)=>{
        
        let imageArray = zipUtil(req,res);
        resolve(imageArray);
        
    });

    Promise.all([imageInsertPromise]).then(values => { 
        let imageArray = values[0];
        let dataArray = [];
        for(let i = 0; i < imageArray.length; i++){
            dataArray.push({"image_url":imageArray[i]});
        }
        imageProxy.saveMany(dataArray,function(err, imageDocs){
            console.log("dataArray",dataArray);
            console.log("imageDocs",imageDocs);
            let cartoonId = req.body.cartoonId;
            let chapter_title = req.body.chapter_title;
            let chapter_number = req.body.chapter_number;
            let chapter_updateDate = new Date();
            let chapter_content = [];
            for(let j = 0; j < imageDocs['ops'].length; j++){
                chapter_content.push(imageDocs.ops[j]['_id']);
            }
            console.log("chapter_content",chapter_content);
            let chapterParams = {chapter_title,chapter_updateDate,chapter_content,chapter_number};
            //将章节添加到章节表
            chapterProxy.insertChapter(chapterParams,function(insertChapter_err,insertChapter){
                console.log("添加后的章节id ",insertChapter['_id']);
                console.log("漫画的id",cartoonId);
                //将刚添加完的章节和漫画进行关联
                cartoonProxy.update({"_id":cartoonId},{$push:{"cartoon_chapter":insertChapter['_id']},recently_time:new Date()},function(updateCartoon_err,result){
                    let msg = {};
                    if(updateCartoon_err){
                        msg['text'] = "上传失败";
                        console.log(updateCartoon_err);
                    }else{
                        msg['text'] = "上传成功";
                        //推送更新消息给用户
                        emitter.emit('chapter_update',req.body.cartoonId,insertChapter['_id']);
                    }
                    res.render('message',{msg});
                });
            })
        });
    });
}

//获取需要添加章节的漫画并跳转到对应的添加页面
exports.insertChapterPage = function(req,res,next){
    let cartoonId = req.params.cartoonId;
    cartoonProxy.findById(cartoonId,function(err,cartoon){
        let msg = {};
        if(err){
            msg['status'] = "error";
            msg['text'] = "请点击正确的漫画";
        }else{
            msg['status'] = "ok";
            msg['text'] = cartoon;
        }
        res.render('cartoon/addChapter',{msg});
    });
}


//查看漫画某一章节的信息
exports.findChapterInfoById = function(req,res,next){
    let chapterId = req.params.chapterId;
    chapterProxy.findById(chapterId,function(err,chapter){
        let msg = {};
        if(err){
            console.log(err);
            msg['status'] = "error";
            msg['text'] = "查询出错";
        }else{
            //查询成功
            msg['status'] = "ok";
            msg['text'] = JSON.stringify(chapter);
        }
        res.render('cartoon/chapterInfo',{msg});
    });
}