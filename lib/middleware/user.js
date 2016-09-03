/**
 * User中间件, 用户信息保存在req.user, 后续的中间件和路由,模板等都可访问这个属性.
 */
var User = require('../user');

module.exports = function (req, res, next) {
    var uid = req.session.uid;
    if (!uid) return next();
    User.get(uid, function (err, user) {
        if (err) return next(err);
        req.user = res.locals.user = user;
        next();
    });
};

