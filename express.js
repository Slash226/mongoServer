let express = require('express')
// 连接数据库 用于保存图片地址信息
var mongoose = require('mongoose');
const path = require('path')
const cors = require('cors');
const app = express()
let upload = require('./src/upload')
// let getImglist = require('./src/getImgList')
app.use(cors()); // 解决跨域问题

// 1、连接数据库
mongoose.connect('mongodb://localhost/kmdb',{ useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once("open", () => {
    console.log('数据库链接成功，库名：kmdb')
})

app.use(express.static(path.join(__dirname,'static/images')))
app.use(express.static(path.join(__dirname,'pages')))
// app.use(express.static(path.join(__dirname, 'static')))
console.log(path.join(__dirname,'static'))

app.get('/api',(req,res)=>{
    res.send({
        text: 'You are Success!'
    })
})

// 上传图片
app.use('/upload', upload.router);

// 获取图片列表
app.use('/getImglist', (req,res)=>{
    upload.imgModel.find({},{key:1,_id:0,url:1},(err, docs) => {  //定义查询结果显示字段
        if(!err) {
            console.log(docs)
            res.send(docs)
        } else {
            throw err
        }
    })
})

app.listen('1111', ()=>{
    console.log('正在监听1111')    
})