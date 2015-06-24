// clase 7 (56:23 y 59:00)

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var _ = require('lodash');
var debug = require('debug')('pizzeria:passport');

var User = require('../models/user.model');

// Esta funcion serializa un objeto usuario para que solo se incluye el nombre
passport.serializeUser(function(user, done) {
	done(null, user._id);
})

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		// Eliminamos la contraseña del objeto para no enviarla
		var userInfo = _.pick(user, 'username', 'email', '_id', 'rol'); // ver libreria lodash (https://lodash.com/docs#pick). Tambien underscore.js
		done(err, userInfo);
	});
});

passport.use(new LocalStrategy({
	usernameField: 'user', // atributo 'name' de campo que representa el nombre de usuario en el formulario de login (login.jade)
	passwordField: 'password' // atributo 'name' de campo que representa la contraseña en el formulario de login (login.jade)
}, function(username, password, done) {
	User.findByUsername(username, function(err, user) {
		if (err) done(new Error("Error de autenticación"));
		if (!user) {
			return done(null, false, {mensaje: "El usuario " + username + " no existe"});
		}
		if (user.password != password) {
			return done(null, false, {mensaje: "La contraseña introducida no es válida"});
		}
		debug("Usuario " + username + " autenticado");
		return done(null, _.pick(user, 'username', 'email', '_id'));
	})
}));

module.exports = passport;