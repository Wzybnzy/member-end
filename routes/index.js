var express = require('express');
var router = express.Router();
var mongodb = require('mongodb-curd');
var dbBase = 'school';
var dbColl = 'user';
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});


//添加接口
router.post('/api/add', function(req, res, next) {
    var params = req.body;
    var name = params.name,
        age = params.age,
        phone = params.phone,
        address = params.address,
        card = params.card; //身份证号
    if (!name || !card) {
        res.send({ code: 2, message: "请完善信息" });
    } else { //判断该用户是否存在
        getIsHas();
    }

    function getIsHas() {
        mongodb.find(dbBase, dbColl, { card: card }, function(result) {
            if (result.length > 0) { //该用户已经存在
                res.send({ code: 3, message: "该用户已经存在" });
            } else { //添加
                addUser();
            }
        });
    }

    function addUser() {
        mongodb.insert(dbBase, dbColl, params, function(result) {
            if (result) {
                res.send({ code: 0, message: "插入成功" });
            } else {
                res.send({ code: 1, message: "插入失败" });
            }
        });
    }

});

//查看列表
router.get('/api/list', function(res, res, next) {
    mongodb.find(dbBase, dbColl, function(result) {
        console.log(result);
        if (result.length > 0) {
            res.send({ code: 0, data: result });
        } else {
            res.send({ code: 1, message: "查询列表失败" });

        }
    });
});
//查看详情
router.get('/api/detail/', function(req, res, next) {
    var id = req.query.id; // _id
    mongodb.find(dbBase, dbColl, { _id: id }, function(result) {
        console.log(result);
        if (result.length > 0) {
            res.send({ code: 0, data: result });
        } else {
            res.send({ code: 1, message: "查询失败" });

        }
    });

});

// 删除
router.get('/api/del/', function(req, res, next) {
    var id = req.query.id;
    mongodb.remove(dbBase, dbColl, { _id: id }, function(result) {
        console.log(result);
        if (result.deletedCount == 1) {
            res.send({ code: 0, message: "删除成功" });
        } else {
            res.send({ code: 1, message: "删除失败" });
        }
    });
});

//修改
router.post('/api/update/', function(req, res, next) {
    var params = req.body,
        id = params.id;
    mongodb.update(dbBase, dbColl, [{ _id: id }, params], function(result) {
        if (result) {
            res.send({ code: 0, message: "修改成功" });
        } else {
            res.send({ code: 1, message: "修改失败" });
        }
    });
});
module.exports = router;