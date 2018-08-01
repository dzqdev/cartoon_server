const CategoryProxy = require('../../proxy/server/category');


exports.findAll = function(req,res,next){
    CategoryProxy.findAll(function(err,categories){
        if(err){
            throw err;
        }
        res.send({categories});
    });
}