const kmData = require('./kmdata.json');
const fs = require('fs');
const json2xls = require('json2xls');

let jsonArray = [];
kmData.forEach(function(item){
  let temp = {
    '日期': item.date,
    '姓名': item.name,
    '手机号': item.phone,
    '门市': item.principal,
    '户外帐篷': item.gift1,
    '拉杆箱': item.gift2,
    '溜娃神器': item.gift3,
    '状态': item.status,
    '备注': item.comment
  }
  jsonArray.push(temp);
});

let xls = json2xls(jsonArray);

fs.writeFileSync('static/excel/test.xlsx', xls, 'binary');

