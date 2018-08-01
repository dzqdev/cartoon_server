const managerProxy = require('../../proxy/server/manager');
const passport = require('passport');
const managerPassport = require('../../middlewares/managerPassport');

exports.register = function(req,res){
    let manager_name = req.body.manager_name;
    let manager_password = req.body.manager_password;
    let params = {manager_name,manager_password};
    managerProxy.save(params,function(err,manager){
        let msg = {};
        if(err){
            console.log("注册失败!");
            msg['text'] = "注册失败";
            throw err;
        }else{
            console.log("注册成功!");
            msg['text'] = "注册成功";
        }
        res.render('message',{msg});
    });
}

//管理员登录
exports.login = function (req,res,next) {
    let manager = {manager_name:req.body.username,manager_password:req.body.password};
    console.log("manager",manager);
    passport.authenticate('local', function(err, manager, info) {
        let msg = {};
        if (err) return next(err);
        if (!manager) {
            msg['status'] = "error";
            msg['text'] = "用户名或密码错误!!";
            res.send({msg});
        }
        req.logIn(manager, function(err) {
            if (err) return next(err);
            //登录成功
            //将用户写入session
            req.session.manager = manager;
            msg['status'] = "ok";
            msg['text'] = "登录成功!!";
            res.send({msg});
        });
    })(req, res, next)
};

exports.logout = function(req,res,next){
    managerPassport.logOut(req,res);
}
