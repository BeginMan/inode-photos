// valid中间件


function getFiled(req, fields) {
    var requiredFields = [];
    fields.forEach(function (field) {
        if (!req.body[field]) {
            requiredFields.push(field);
        }
    });
    return requiredFields;
}

exports.required = function (fields) {
    // 每次收到请求都检查输入域是否有值
    return function (req, res, next) {
        var requiredFields = getFiled(req, fields);
        if (!requiredFields.length) {
            next();     // 如果有则进入下一个中间件
        } else {
            res.error(requiredFields.join(' ') + ' is required');
            res.redirect('back');
        }
    }
};

exports.lengthAbove = function (field, len) {
    // 字段长度检查
    return function (req, res, next) {
        if (req.body[field].length > len) {
            next();
        } else {
            res.error(field+ ' must have more that'
                + len + ' characters');
            res.redirect('back');
        }
    }
};

