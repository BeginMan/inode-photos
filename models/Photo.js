// photo模型定义
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/photo_app');

var schema = new mongoose.Schema({
    name: String,       // 处理过的名字(uuid)
    path: String,       // 存储路径
    size: Number,       // 大小
    oriName: String,    // 文件原名
    type: String,       // 类型
    extName: String     // 文件扩展名

});

module.exports = mongoose.model('Photo', schema);


/*
    Mongoose的模型上有所有的CRUD方法(Photo.create, Photo.update,
    Photo.remove, Photo.find等)
 */