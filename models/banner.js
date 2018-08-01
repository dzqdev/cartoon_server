const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BannerSchema = new Schema({
    //banner描述文本
    banner_title:{
        type:String
    },
    //图片地址
    banner_url:{
        type:String
    },
    //图片不存在时的显示图片
    error_img:{
        type:String
    },
    //点击时的链接
    link:{
        type:String
    },
    //是否显示该Banner
    is_display:{
        type:Boolean
    }
});

const Banner = mongoose.model('Banner',BannerSchema,'banner');

module.exports = Banner;