var express = require('express');
var app = express();
var router = express.Router();
var load = require('express-load');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var session = require('express-session');

var hbs = require('hbs');

// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.engine('html', hbs.__express);
app.set('view engine', 'html');

// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('manager'));
app.use(express.static(path.join(__dirname, 'public')));

app.set('router', router);

load('models')
.then('services')
.then('controllers')
.then('routes')
.into(app);

app.use(router);

// register view partials
var partialsDir = __dirname + '/views/partials';
var filenames = fs.readdirSync(partialsDir);
filenames.forEach(function (filename) {
  var matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }
  var name = matches[1];
  var template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  hbs.registerPartial(name, template);
});

  hbs.registerHelper("statusHelper", function(val) {
    if(val == 0) {
      console.log(val);
      return new hbs.SafeString("<td><span class='label label-warning'>on time</span><td>")
    }else if(val < 0) {
      return new hbs.SafeString("<td><span class='label label-danger'>late</span></td>")
    }else {
      return new hbs.SafeString("<td><span class='label label-success'>ok</span></td>")
    }
          
  });

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
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
