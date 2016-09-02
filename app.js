var express = require('express');

// 下面是各种中间件
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// 路由控制
var photos = require('./routes/photos');

// ========================================================
var app = express();

// view试图引擎设置
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 其他自定义
app.set('title', 'MyAPP');
app.set('author', 'BeginMan');


// 打印app.locals 变量
// console.log(app.locals);


// 使用中间件
//favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));

//日志打印,有颜色
app.use(logger('dev'));

// 请求体解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// cookie解析
app.use(cookieParser());

// 静态资源
app.use(express.static(path.join(__dirname, 'public')));

// 路由控制
app.use('/', photos);


// 404异常处理中间件
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);        // 注意这里有 next
});



// 错误处理 error handlers
// 开发环境下: 堆栈踪迹
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// 生成环境下: 不打印堆栈踪迹
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


// 导出app
// 可供bin/www 导入进行启动等处理
module.exports = app;
