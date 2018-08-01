let BannerProxy = require('../../proxy/server/banner');

exports.findAllBanner = function(req,res,next){
    let condition = {"is_display":true};
    BannerProxy.findBannerByCondition(condition,function(err,banners){
        if(err){
            throw err;
        }else{
            res.send({banners});
        }
    });
}