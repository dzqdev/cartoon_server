const imageProxy = require('../../proxy/server/image');

exports.saveImage = function(req,res,next){
    if (req.files[0].path) {
        let originalPath = req.files[0].path;
        let index = originalPath.indexOf("\\");
        let convertPath = originalPath.substring(index,originalPath.length);
        let params = {img_url:convertPath}
        imageProxy.saveImage(params,function(err,doc){
            let msg = {};
            if(err){
                console.log(err);
                msg['status'] = "error";
                msg['text'] = "上传失败";
            }else{
                msg['status'] = "ok";
                msg['text'] = doc['_id'];
            }
            res.send(msg);
        });
    }else{
        res.send({"status":"error","text":"上传失败"});
    }
}