// Aqui configuramos la aplicacion y exportamos dicha configuracion (module.exports)

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
//var orders = require('./routes/orders');

var passport = require('./config/passport');

var app = express();

// view engine setup
//__dirname es la ruta atual (donde estamos ejecutando)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev')); //'production'
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Creamos una clave para desencriptar las cookies de sesion y la metemos en la sesion
app.use(session({secret: 'my_secret_key_to_decrypt_session_cookies'}));

// Inicializamos la sesion de Passport y lo conectamos con la sesion de Express
app.use(passport.initialize());
app.use(passport.session());

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) return next();
	return res.redirect('/user/login');
}

function ensureAdmin(req, res, next) {
	console.log("Rol:", req.user.rol);
	if (req.user.rol == "admin") return next();
	return res.redirect('/');
}

// Asocia rutas a enrutadores
app.use('/', routes);
app.use('/user', users);
app.use('/order', require('./routes/orders')); //orders
app.use('/admin', ensureAuthenticated, ensureAdmin, require('./routes/admin')); //orders

// catch 404 and forward to error handler
// Como las rutas se procesan secuencialmente, esta ruta siempre la ponemos al final, a modo de "else"
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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
