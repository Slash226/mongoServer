// upload.js

var express = require('express');
var mongoose = require('mongoose');
var router = express.Router(); // 输出一个路由中间件

// 2、创建 schema
let Schema = mongoose.Schema;
let imgInfo = new Schema({
    key: String,
    url: String
})

// 3、 创建Model 对象
let imgModel = mongoose.model("kmImages", imgInfo)


var fs = require('fs');
var multer  = require('multer');

// 使用硬盘存储模式设置存放接收到的文件的路径以及文件名
var storage = multer.diskStorage({
    destination: function (req, files, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, './static/images');    
    },
    filename: function (req, files, cb) {
        // console.log(files,'文件信息')
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, Date.now() + "-" + files.originalname);  
    }
});

// 创建文件夹
var createFolder = function(folder){
    try{
        // 测试 path 指定的文件或目录的用户权限,我们用来检测文件是否存在
        // 如果文件路径不存在将会抛出错误"no such file or directory"
        fs.accessSync(folder); 
    }catch(e){
        // 文件夹不存在，以同步的方式创建文件目录。
        fs.mkdirSync(folder);
    }  
};

var uploadFolder = './static/images';
createFolder(uploadFolder);

// 创建 multer 对象
var upload = multer({ storage: storage });

let fileInfo = {};
/* POST upload listing. */
//  这里   files   是前端formdata append的文件名
router.post('/', upload.array('files',8), function(req, res, next) {
    var files = req.files;
    // console.log(req.files,'上传的图片')
    let params = []
    files.forEach((ele,index)=>{
        params.push({
            key: ele.filename,
            url: ele.path
        })
    })
    imgModel.create(params, (err) => {
        if(!err) {
            console.log('插入成功')
        } else {
            throw err;
        }
    })
    fileInfo = files
    // 接收文件成功后返回数据给前端
    res.json({res_code: '0',fileInfo: files});
});

// 导出模块（在 app.js 中引入）
module.exports = {router,imgModel};