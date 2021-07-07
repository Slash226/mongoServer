
var express = require('express');
var mongoose = require('mongoose');
var router = express.Router(); // 输出一个路由中间件

// 2、创建 schema
let Schema = mongoose.Schema;
let consumerInfo = new Schema({
  name: String,
  phone: String,
  gift1: String,
  gift2: String,
  gift3: String,
  comment: String,
  principal: String,
});

// 3、 创建Model 对象
let consumer = mongoose.model("consumer", consumerInfo)
console.log('执行')

router.get('/', function(req, res, next) {
  let query = req.query
  // pages->  page,pageNum,total
  // query-> name phone date keyword
  let {name,date,phone} = query;
  let qq = {name,date,phone};
  for (const key in query) {
    if(query[key].trim()=='') {
      delete qq[key]
    }
  }
  consumer.find(qq,{_id:0},(err, docs) => {  //定义查询结果显示字段
    if(!err) {
        let pages = {
          page: query.page,
          pageNum: query.pageNum,
          total:docs.length
        }
        let list = [];
        if(query.keyWord.trim() !== '') {
          docs.forEach((ele)=>{
            let str = ele.name+''+ele.phone+''+ele.comment+''+ele.principal;
            if(!(str.indexOf(query.keyWord)===-1)) {
              list.push(ele)
            }
          })
          pages.total = list.length;
        } else {
          list = docs;
        }
        list = list.splice((query.page-1)*query.pageNum,query.pageNum);
        res.send({list,pages})
    } else {
        throw err
    }
  })
});




// 导出模块（在 app.js 中引入）
module.exports = {router,consumer};