const multer = require('multer');
const md5 = require('md5');
const fs = require('fs');


let uploadFile = function(path){
    if(!path){
        path = '';
    }
    let uploadPath = process.cwd() + '/public/upload' + path;
    //创建文件夹
    fs.exists(uploadPath,function(exists){
        //不存在时自动创建文件夹
        if(!exists){
            fs.mkdir(uploadPath,err => {
                console.log("创建文件夹err",err);
                throw err;
            });
        }
    });
    var storage = multer.diskStorage({
        //设置上传文件路径,以后可以扩展成上传至七牛,文件服务器等等
        //Note:如果你传递的是一个函数，你负责创建文件夹，如果你传递的是一个字符串，multer会自动创建
        destination: function (req, file, cb) {
            cb(null, './public/upload' + path);    // 保存的路径，备注：需要自己创建
        },
        //TODO:文件区分目录存放
        //获取文件MD5，重命名，添加后缀,文件重复会直接覆盖
        filename: function (req, file, cb) {
            var fileFormat =(file.originalname).split(".");
            cb(null, path + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1]);
        }
    });
    
    //添加配置文件到muler对象。
    var upload = multer({
        storage: storage,
        //其他设置请参考multer的limits
        //limits:{}
    });

    return upload;
}

//导出对象
module.exports = uploadFile;
