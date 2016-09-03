/**
 * Created by fangpeng on 16/9/3.
 */

var bcrypt = require('bcrypt');

var redis = require("redis"),
    PORT = 6379,
    HOST = '127.0.0.1',
    PWD = '2015yunlianxiQAZWSX',
    DB = 0,
    OPTS = {auth_pass: PWD, selected_db:DB},
    client = redis.createClient(PORT, HOST, OPTS);

// redis 链接错误
client.on("error", function(error) {
    console.log(error);
});

//认证
client.auth(PWD,function(){
    console.log('Redis Auth Successful! > redis_db:'+ DB);
});

var db = client;

module.exports = User;

function User(obj) {
    for (var key in obj) {
        this[key] = obj[key];
    }
}

User.prototype.save = function (fn) {
    if (this.id) {      // 如果用户存在
        this.update(fn)
    } else {
        var user = this;
        db.incr('user:ids', function (err, id) {
            if (err) return fn(err);
            user.id = id;
            user.hashPassword(function (err) {
                if (err) return fn(err);
                user.update(fn);
            });
        });
    }
};

User.prototype.update = function (fn) {
    var user = this;
    var id = user.id;
    db.set('user:id:' + user.name, id, function (err) {
        if (err) return fn(err);
        db.hmset('user:' + id, {
            name: user.name,
            id: user.id,
            pass:user.pass,
            salt:user.salt
        }, function (err) {
            fn(err);
        })
    })
};


// bcrypt加密
User.prototype.hashPassword = function (fn) {
    var user = this;
    // 对每个用户生成不同的12个字符的盐
    bcrypt.genSalt(12, function (err, salt) {
        if (err) return fn(err);
        user.salt = salt;   // 保持用户的盐
        bcrypt.hash(user.pass, salt, function (err, hash) {
            // 生成哈希,密文保存替换明文
            if (err) return fn(err);
            user.pass = hash;
            fn();
        })
    })
};

User.getByName = function (name, fn) {
    User.getId(name, function (err, id) {
        if (err) return fn(err);
        User.get(id, fn);
    })
};

User.getId = function (name, fn) {
    db.get('user:id:' + name, fn)
};

User.get = function (id, fn) {
    db.hgetall('user:' + id, function (err, user) {
        if (err) return fn(err);
        fn(null, new User(user));
    })
};

User.authenticate = function (name, pass, fn) {
    User.getByName(name, function (err, user) {
        if (err) return fn(err);
        if (!user.id) return fn();      // 用户不存在
        // hash 匹配
        bcrypt.hash(pass, user.salt, function (err, hash) {
            if (err) return fn(err);
            if (hash == user.pass) return fn(null, user);
            fn();
        })
    })
};