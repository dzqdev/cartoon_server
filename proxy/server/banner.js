const models = require('../../models');
const Banner = models.Banner;


//添加一个banner
exports.saveBanner = function(bannerParams,callback){
    let banner = new Banner(bannerParams);
    banner.save(callback);
}

//查询所有的banner
exports.findBannerByCondition = function(condition,callback){
    Banner.find(condition).exec(callback);
}

//根据id查询一条banner记录
exports.findBannerById = function(id,callback){
    Banner.findById(id,callback);
}

//更新banner
exports.update = function(condition,update,callback){
    Banner.update(condition,update,callback);
}

//删除一个Banner
exports.remove = function(condition,callback){
    Banner.remove(condition,callback);
}