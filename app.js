
var express = require('express');
//var session = require('express-session');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var fs= require('fs');
var accessLog = fs.createWriteStream('access.log',{flags:'a'});
var errorLog = fs.createWriteStream('error.log',{flags:'a'});
var app = express();

var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var flash = require('connect-flash');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var users = require('./routes/user');

var crypto = require('crypto');
var User = require('./models/user.js');

// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.logger({stream:accessLog}));
app.use(express.bodyParser({keepExtensions:true,uploadDir:'./public/images'}));


app.use(express.static(path.join(__dirname, 'public')));
app.use(function(err,req,res,next){
	var meta = '['+new Date()+ ']'+req.url+'\n';
	errorLog.write(meta+err.stack+'\n');
	next();
})

app.use(express.methodOverride());
app.use(express.cookieParser());

app.use(express.session({
	secret:settings.cookieSecret,
	key:settings.db,
	cookie:{
		maxAge:100*60*60*24*30
	},
	resave: false,
	store:new MongoStore({
		db:settings.db,
		host:'localhost',
		port:'27017',
		url: 'mongodb://localhost:27017'
	})
}))
app.use(flash());//顺序太重要了！！！！！！！！！！！！！
app.use(app.router); //这个中间件要放session之后，一定

//app.get('/', routes.index);
//app.get('/users', users.list);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//module.exports = app; 用这个代码启动DEBUG=my-application ./bin/www
http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

routes(app);

