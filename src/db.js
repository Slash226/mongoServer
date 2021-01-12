//  连接数据库

let mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/kmdb");
mongoose.connection.once("open", () => {
    console.log('数据库链接成功，库名：kmdb')
})


//2.创建Schema（模型对象）
let Schema = mongoose.Schema;
let personSchema = new Schema({
    name: String,
    age: Number,
    sex: {
        type: String,
        default: "男"
    }
});

//3.创建Model对象

let personModel = mongoose.model("student",personSchema);

// 3.1 增加
personModel.create([
    {name: "马红灯", age: 19, chat: "红灯1992"},
    {name: "龚志敏", age: 42, chat: "龚1992"},
    {name: "李发华", age: 32, chat: "发华1992"},
    {name: "李建华", age: 22, chat: "建华1992"},
    {name: "依依", age: 22, chat: "依依1992", sex: "女"},
], (err) => {
    if(!err) {
        console.log('插入成功')
    } else {
        throw err;
    }
})
