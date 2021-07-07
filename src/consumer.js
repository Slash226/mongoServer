var express = require('express');
var mongoose = require('mongoose');
var router = express.Router(); // 输出一个路由中间件

// 2、创建 schema
let Schema = mongoose.Schema;
let consumerInfo = new Schema({
    date: String,
    name: String,
    phone: String,
    gift1: String,
    gift2: String,
    gift3: String,
    comment: String,
    principal: String,
    status: String
});

// 3、 创建Model 对象
let consumer = mongoose.model("consumer", consumerInfo)
console.log('执行')

router.get('/', function(req, res, next) {
    let query = req.query
        // pages->  page,pageNum,total
        // query-> name phone date keyword
    let { name, date, phone, status } = query;
    let qq = { name, date, phone, status };
    for (const key in query) {
        if (query[key].trim() == '') {
            delete qq[key]
        }
    }
    consumer.find(qq, {}, (err, docs) => { //定义查询结果显示字段
        if (!err) {
            let pages = {
                page: query.page,
                pageNum: query.pageNum,
                total: docs.length
            }
            let list = [];
            if (query.keyWord.trim() !== '') {
                docs.forEach((ele) => {
                    let str = ele.name + '' + ele.phone + '' + ele.comment + '' + ele.principal;
                    // let str = ele.comment;
                    if (!(str.indexOf(query.keyWord) === -1)) {
                        list.push(ele)
                    }
                })
                pages.total = list.length;
            } else {
                list = docs.reverse();
            }
            list = list.splice((query.page - 1) * query.pageNum, query.pageNum);
            res.send({ list, pages })
            next();
        } else {
            throw err
        }
    })
});

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

// 修改用户信息
router.post('/editInfo', function(req, res, next) {
    console.log(req.body);
    let query = req.body;
    consumer.updateOne({ _id: query._id }, {...query }, function(err, resp) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('成功', resp)
        consumer.find({ _id: query._id }, {}, (err, docs) => {
            res.send({ docs, code: 200 })
            next();
        })
    })
})

// 新增用户信息
router.post('/addConsumer', function(req, res, next) {
    console.log(req.body);
    let query = req.body;
    consumer.create([query], (err) => {
        if (!err) {
            console.log('添加成功')
            consumer.find({...query }, {}, (err, docs) => {
                res.send({ docs, code: 200 })
                next();
            })
        } else {
            throw err;
        }
    })
})




// 导出模块（在 app.js 中引入）
module.exports = { router, consumer };