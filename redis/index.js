const redis = require('redis'),
      RDS_PORT = '6379',
      RDS_HOST = '127.0.0.1',
      RDS_PSW = '123456',
      RDS_OPS = {auth_pass:RDS_PSW}


const client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPS);

client.on('ready',function(res){
    console.log('ready');
});

//设置字段到redis
exports.saveItem = function(key,value,exprires){
    client.set(key,value);
    if(exprires){
        client.expire(key, exprires);
    }
}

//获取字段
exports.getItem = function(key, cb) {
    client.get(key, cb)
}

//删除key对应的字段
exports.removeItem = function(key,cb){
    client.del(key,cb);
}
