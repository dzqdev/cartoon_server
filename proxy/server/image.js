const models = require('../../models');
const Image = models.Image;

//保存一张图片
exports.saveImage = function(imageParams,callback){
    let image = new Image(imageParams);
    image.save(callback);
}

//批量保存图片
exports.saveMany = function(dataArray,callback){
    Image.collection.insert(dataArray,{},callback);
}