var express = require('express');
var router = express.Router();

let CartoonController = require('../../controllers/server/cartoonController');
let UserController = require('../../controllers/client/userController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/group', function(req, res, next) {
  CartoonController.groupByCategoryAndCount(req,res,next);
});

//根据分组获取用户
router.get('/groupByRegMonth',function(req,res,next){
  UserController.groupByRegMonth(req,res,next);
})

module.exports = router;
