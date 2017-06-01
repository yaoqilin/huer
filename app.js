const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const routes = require('./routes/index');
/*var users = require('./routes/users');*/
//引入数据库配置文件
const settings = require('./setting');
//引入flash插件
const flash = require('connect-flash');
//引入会话插件
const session = require('express-session');
//把session存放在数据库 保证服务器崩溃的时候数据不丢失
const MongoStore = require('connect-mongo')(session);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//ejs模板引擎
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'plugins')));
//使用flash插件
app.use(flash());
//使用session会话
app.use(session({
    secret:settings.cookieSecret,
    key:settings.db,
    cookies:{maxAge:1000*60*60*24*30},
    store: new MongoStore({
        url:'mongodb://localhost/simple'
    }),
    resave:false,
    saveUninitialized:true
}))


/*app.use('/', routes);
app.use('/users', users);*/
//将app这个应用传入到routes函数里面进行处理.
routes(app);

// catch 404 and forward to error handler
app.use((req, res, next)=>{
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next)=> {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next)=>{
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
//让整个应用启动起来
app.listen(3010,()=>{
    console.log('node is OK');
})
module.exports = app;
