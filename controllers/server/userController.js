const userProxy = require('../../proxy/server/user');
const passport = require('passport');
const managerPassport = require('../../middlewares/managerPassport');

exports.register = function(req,res){
    let user_name = req.body.username;
    let user_password = req.body.password;
    let params = {user_name,user_password};
    userProxy.save(params,function(err,user){
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

//用户登录
exports.login = function (req, res,next) {
    console.log('进入controller');
    let user = {username:req.body.username,password:req.body.password};
    passport.authenticate('local', function(err, user, info) {
        let msg = {};
        if (err) return next(err);
        if (!user) {
            msg['status'] = "error";
            msg['text'] = "用户名或密码错误!!";
            res.send({msg});
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            //登录成功
            //将用户写入session
            req.session.user = user;
            msg['status'] = "ok";
            msg['text'] = "登录成功!!";
            res.send({msg});
        });
      })(req, res, next)
};

exports.logout = function(req,res,next){
    managerPassport.logOut(req,res);
}
