const fs = require('fs');
const process = require('process');
const unzip = require('unzip');
const async = require('async');
//添加到image表
const imageProxy = require('../proxy/server/image');

//解压zip文件
let unZip = function(req,res){
    return new Promise((resolve,reject)=>{
        //压缩文件上传后的地址
        let cartoonId = req.body.cartoonId;
        //需要解压的文件地址
        let uploadZipPath = process.cwd() + '/' + req.file.path;
        console.log("需要解压的文件地址",uploadZipPath);
        let originalname =  req.file.originalname.split('.')[0];
        //该压缩包应该解压到的地址
        let willZipDir = process.cwd() + '/public/upload/cartoon/' + cartoonId;
        
        //根据漫画id判断之前是否上传过，如果该漫画之前上传过章节，则将内容上传到漫画对应的文件夹下面
        //如果没有对应的文件夹,说明该漫画是第一次上传章节，根据漫画id自动创建一个目录,将漫画章节压缩包解压到这里
        fs.exists(willZipDir,function(exists){
            console.log(willZipDir + " 是否存在? " + exists);
            //不存在时自动创建文件夹
            if(!exists){
                fs.mkdir(willZipDir);
            }
            
            //进行解压操作
            //解压文件到哪个路径
            fs.createReadStream(uploadZipPath).pipe(unzip.Extract({ path: willZipDir})).on('close',function(status){
                //需要进行读取文件的文件夹
                let willReadDir = willZipDir + '/' +originalname;
                //最终返回的图片在项目中的地址
                let urlInProject = '/upload/cartoon/' + cartoonId + '/' + originalname;
                fs.readdir(willReadDir,function(err,files){
                    let filesArray = [];
                    if(err){
                        console.log(err);
                        return null;
                    }
                    //获取该文件的绝对路径
                    files.forEach(function(filename){
                        let eachFileAbsolutePath = urlInProject + "/" + filename;
                        filesArray.push(eachFileAbsolutePath);
                    })
                    resolve(filesArray);
                });
            });
        });
    })
   /*  fs.createReadStream(uploadZipPath).pipe(unzip.Extract({ path: process.cwd()  + '\\public\\upload' }));*/
} 

async function getData(req,res) {
    let data = await unZip(req,res);
    console.log("data",data);
    return data;
}


module.exports = getData;