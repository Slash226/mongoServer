//  连接数据库  试验区 导入区

let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/kmdb");
mongoose.connection.once("open", () => {
    console.log('数据库链接成功，库名：kmdb')
})


//2.创建Schema（模型对象）
let Schema = mongoose.Schema;
let personSchema = new Schema({
    name: String,
    phone: String,
    date: String,
    principal: String,
    gift1: String,
    gift2: String,
    gift3: String,
    comment: String
});

//3.创建Model对象

let personModel = mongoose.model("consumer",personSchema);

// 3.1 增加
personModel.create([], (err) => {
    if(!err) {
        console.log('插入成功')
    } else {
        throw err;
    }
})
