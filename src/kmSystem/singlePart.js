// 单套系用户信息路由
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router(); // 输出一个路由中间件
const fs = require('fs');
const json2xls = require('json2xls'); //生成excel

// 2、创建 schema
let Schema = mongoose.Schema;
let consumerInfo = new Schema({
  name: String,
  sex: Number,
  birthday: String,
  phone: String,
  orderDate: String,
  orderPrice: String,
  comment: String,
});


// 3、 创建Model 对象
let consumer = mongoose.model("singlePartConsumer", consumerInfo)
const token = 'f84d78f03d6c375a3558c02888803f148ddcff3a80f4189ca1c9d4d902c3c909';

router.all('*', function (req, res, next) {
  let nowDate = new Date();
  let year = nowDate.getFullYear();
  let month = nowDate.getMonth() * 1 + 1;
  let day = nowDate.getDate();
  let kmToken = token + year + month + day;
  if (req.headers.authorization == kmToken) {
    next();
  } else {
    res.send({ code: 401, msg: '未登入' })
  }
})

// 查询列表
router.get('/', function (req, res, next) {
  let query = req.query
  // pages->  page,pageNum,total
  // query-> name phone date keyword
  let { name, phone } = query;
  let qq = { name, phone };
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
          let str = ele.name + '' + ele.phone + '' + ele.comment;
          // let str = ele.comment;
          if (!(str.indexOf(query.keyWord) === -1)) {
            // list.push(ele);
            list.unshift(ele);  //倒序
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

// 导出excel
router.get('/exportExcel', function (req, res, next) {
  let query = req.query
  // pages->  page,pageNum,total
  // query-> name phone date keyword
  let { name, phone } = query;
  let qq = { name, phone };
  for (const key in query) {
    if (query[key].trim() == '') {
      delete qq[key]
    }
  }
  consumer.find(qq, {}, (err, docs) => { //定义查询结果显示字段
    if (!err) {
      let jsonArray = [];
      if (query.keyWord.trim() !== '') {
        docs.forEach((ele) => {
          let str = ele.name + '' + ele.phone + '' + ele.comment;
          // let str = ele.comment;
          if (!(str.indexOf(query.keyWord) === -1)) {
            let temp = {
              '姓名': ele.name,
              '性别': ele.sex == 1 ? '男' : ele.sex == 0 ? '女' : '',
              '生日': ele.birthday,
              '手机号': ele.phone,
              '订单日期': ele.orderDate,
              '套系金额': ele.orderPrice,
              '备注': ele.comment
            }
            jsonArray.push(temp)
          }
        })
      } else {
        docs.forEach(ele => {
          let temp = {
            '姓名': ele.name,
            '性别': ele.sex == 1 ? '男' : ele.sex == 0 ? '女' : '',
            '生日': ele.birthday,
            '手机号': ele.phone,
            '订单日期': ele.orderDate,
            '套系金额': ele.orderPrice,
            '备注': ele.comment
          }
          jsonArray.push(temp)
        })
      }
      let xls = json2xls(jsonArray);
      let date = (new Date().getMonth() + 1) + '-' + new Date().getDate();
      fs.writeFileSync('static/excel/singlePart' + date + '.xlsx', xls, 'binary');
      //  res.send({ url: 'http://127.0.0.1:1111/' + 'singlePart' + date + '.xlsx' }); // 本地环境
      res.send({ url: 'http://suezp.cn:1111/' + 'singlePart' + date + '.xlsx' });  //线上环境
      next();
    } else {
      throw err
    }
  })
});


//  POST请求处理
router.use(express.json())
router.use(express.urlencoded({ extended: true }))

// 修改用户信息
router.post('/editInfo', function (req, res, next) {
  console.log(req.body);
  let query = req.body;
  consumer.updateOne({ _id: query._id }, { ...query }, function (err, resp) {
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
router.post('/addConsumer', function (req, res, next) {
  let query = req.body;
  console.log(query.phone);
  consumer.find({ phone: query.phone }, {}, (err, docs) => {
    if (docs.length === 0 || query.phone.trim() == '') {
      consumer.create([query], (err) => {
        if (!err) {
          console.log('添加成功')
          consumer.find({ ...query }, {}, (err, docs) => {
            res.send({ docs, code: 200 })
            return
          })
        } else {
          throw err;
        }
      })
    } else {
      res.send({ code: 302, msg: '已有改手机号的用户数据' });
    }
  })
})


// 导出模块（在 app.js 中引入）
module.exports = { router, consumer };