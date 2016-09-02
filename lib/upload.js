//upload.js

var formidable = require('formidable'),
    uuid = require('node-uuid'),
    fs = require('fs'),
    path = require('path');

var uploadDir = path.join(__dirname, '../public/photos/');

module.exports = function (req, options, next) {
    if (typeof options === 'function') {
        next = options;
        options = {};
    }

    // 创建上传表单
    var form = new formidable.IncomingForm();
    // 编码设置
    form.encoding = options.encoding || 'utf-8';
    // 设置上传目录
    form.uploadDir = options.uploadDir || uploadDir;
    // 文件大小
    form.maxFieldsSize = options.maxFieldsSize || 10 * 1024 * 1024;
    // 解析
    form.parse(req, function (err, fields, files) {
        if (err) return next(err);
        for (x in files) {
            if (parseInt(files[x].size) > 0) {
                // 后缀名
                var extName = /\.[^\.]+/.exec(files[x].name);
                var ext = Array.isArray(extName) ? extName[0] : '';
                // 重命名,防止文件重复
                var fileName = uuid() + ext;
                // save
                var newPath = form.uploadDir + fileName;
                fs.renameSync(files[x].path, newPath);
                // 构造返回信息
                fields[x] = {
                    size: files[x].size,
                    path: newPath,
                    oriName: files[x].name,
                    name: fileName,
                    type: files[x].type,
                    extName: ext
                };
            } else {
                fs.unlink(files[x].path);//删除临时文件
            }

        }
        next(null, fields);
    })
};