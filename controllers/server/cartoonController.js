const CartoonProxy = require('../../proxy/server/cartoon');
const CategoryProxy = require('../../proxy/server/category');
const TagProxy = require('../../proxy/server/tag');
//utils
const ArrayString2Object = require('../../utils/ArrayString2Object');


//添加一条漫画数据
exports.saveCartoon = function(req,res,next){
    let cartoon_name = req.body.cartoon_name;
    let author = req.body.author;
    let cartoon_desc = req.body.cartoon_desc;
    let cartoon_cover = req.body.cartoon_cover;
    let cartoon_category = req.body.cartoon_category;
    let cartoon_updateTime = req.body.cartoon_updateTime;
    let cartoon_isEnd = req.body.cartoon_isEnd;
    let source = req.body.cartoon_tag;
    let cartoon_showImg = req.body.cartoon_showImg;
    let cartoon_tag = ArrayString2Object.StringConvertArray(source);
    let recently_time = new Date();
    
    let cartoonParams = {cartoon_name,author,cartoon_desc,cartoon_cover,cartoon_tag,cartoon_showImg,cartoon_category,cartoon_updateTime,cartoon_isEnd,recently_time};

    CartoonProxy.saveCartoon(cartoonParams,function(err,cartoon){
        let msg = {};
        if(err){
            console.log(err);
            msg['status'] = "error";
            msg['text'] = "添加失败";
        }else{
            msg['status'] = "ok";
            msg['text'] = "添加成功";
        }
        res.send({msg});
    });
};


//获取相关信息跳转到添加漫画页面
exports.getAddCartoonPage = function(req,res,next){
    //类别查询
    let categoryFind = new Promise((resolve, reject)=>{
        CategoryProxy.findAll((err,categories)=>{
            resolve(categories);
        });
    });

    //标签查询
    let tagFind = new Promise((resolve, reject)=>{
        TagProxy.findAll((err,tags)=>{
            resolve(tags);
        });
    });
    
    Promise.all([categoryFind, tagFind]).then(values => { 
        let result = {};

        result['categories'] = values[0];

        result['tags'] = values[1];

        res.render('cartoon/addCartoon',{result});
    });
}

//查询所有的漫画,单纯显示
exports.allCartoon = function(req,res,next){

    let page;
    if(!req.params.page){
        page = 0;
    }else{
        page = (req.params.page-1) ;
    }

    page = page * 5;

    let cartoonByPage = new Promise((resolve, reject)=>{
        let params = req.params.cartoon_name;
        console.log("params",params);
        let condition;
        if(params == undefined){
            condition = {};
        }else{
            let query= new RegExp(params, 'i');
            condition = {"cartoon_name":{ $regex: query }};
        }
        console.log("condition",condition);
        CartoonProxy.findAll(condition,page,(err,doc)=>{
            resolve(doc);
        });
    });

    let cartoonCount = new Promise((resolve, reject)=>{
        CartoonProxy.count({},(err,count)=>{
            resolve(count);
        });
    });

    Promise.all([cartoonByPage,cartoonCount]).then(values => { 
        let msg = {};
        msg['text'] = values[0];
        msg['count'] = values[1];
        console.log("msg",msg);
        res.render('cartoon/allCartoon',{msg:msg});
    });
}

exports.findById = function(req,res,next){
    let cartoonFind = new Promise((resolve, reject)=>{
        let cartoon_id = req.params.cartoon_id;
        CartoonProxy.findById(cartoon_id,(err,cartoon)=>{
            resolve(cartoon);
        });
    });

     //类别查询
     let categoryFind = new Promise((resolve, reject)=>{
        CategoryProxy.findAll((err,categories)=>{
            resolve(categories);
        });
    });

    //标签查询
    let tagFind = new Promise((resolve, reject)=>{
        TagProxy.findAll((err,tags)=>{
            resolve(tags);
        });
    });
    
    Promise.all([cartoonFind,categoryFind, tagFind]).then(values => { 
        let result = {};
        let checkTag = [];
        result['cartoon'] = values[0];

        result['categories'] = values[1];

        result['tags'] = values[2];

        
        //将漫画已有的标签的id存放到数组
        for(let i = 0 ; i < values[0]['cartoon_tag'].length;i++){
            checkTag.push(JSON.stringify(values[0]['cartoon_tag'][i]['_id']));
        }

        result['checkTag'] = checkTag;

        res.render('cartoon/editCartoon',{result});
    });
}

//更新漫画的信息
exports.updateByCartoonId = function(req,res,next){
    //查询参数
    let cartoonId = req.body.cartoonId;
    //更新参数
    let cartoon_name = req.body.cartoon_name;
    let author = req.body.author;
    let cartoon_desc = req.body.cartoon_desc;
    let cartoon_cover = req.body.cartoon_cover;
    let cartoon_category = req.body.cartoon_category;
    let cartoon_updateTime = req.body.cartoon_updateTime;
    let cartoon_isEnd = req.body.cartoon_isEnd;
    let source = req.body.cartoon_tag;
    let cartoon_tag = ArrayString2Object.StringConvertArray(source);
    let cartoon_showImg = req.body.cartoon_showImg;

    let update;

    let condition = {"_id":cartoonId};

    if(cartoon_cover == ''){
        update = {
            cartoon_name,author,cartoon_desc,cartoon_tag,
            cartoon_category,cartoon_updateTime,cartoon_isEnd};
    }else{
        update = {
            cartoon_name,author,cartoon_desc,cartoon_cover,cartoon_tag,
            cartoon_category,cartoon_updateTime,cartoon_isEnd};
    }


    if(cartoon_showImg != ''){
        update.cartoon_showImg = cartoon_showImg;
    }

    CartoonProxy.update(condition,update,function(err,cartoon){
        let msg = {};
        if(err){
            msg['status'] = "error";
            msg['text'] = "修改失败!";
            console.log("err",err);
            throw err;
        }else{
            msg['status'] = "ok";
            msg['text'] = "修改成功";
        }
        res.send({msg});
    })
}

//按照分类分组查询漫画数量
exports.groupByCategoryAndCount = function(req,res,next){
    //查询系统所有分类
    let CategoryFind = new Promise((resolve, reject)=>{
        CategoryProxy.findAll(function(err,categories){
            resolve(categories);
        });
    });

    //查询有漫画的分类
    let CategoryGroupFind = new Promise((resolve, reject)=>{
        CartoonProxy.groupByCategoryAndCount({},function(err,group){
            resolve(group);
        });
    });

    //对比得出结论
    Promise.all([CategoryFind,CategoryGroupFind]).then(values => {
        let allCategory = values[0];
        let groups = values[1];
        let result = [];
        for(let i = 0; i < allCategory.length; i++){
            let isMatch = false;
            for(let j = 0; j < groups.length; j++){
                if(allCategory[i]._id == groups[j]._id){
                    result.push({
                        _id:allCategory[i]._id,
                        category_name:allCategory[i].category_name,
                        count:groups[j].count
                    });
                    isMatch = true;
                    break;
                }
            }
            if(!isMatch){
                result.push({
                    _id:allCategory[i]._id,
                    category_name:allCategory[i].category_name,
                    count:0
                });
            }
        }

        
        res.send({msg:result});
    });
}
