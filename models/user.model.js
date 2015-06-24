var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var userSchema = new Schema({
	username: {
		type: String,
		required: true, // para evitar username vacio
		unique: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	rol: {
		type: String,
		enum: ['cliente', 'admin'],
		required: true	
	}
})

// Metodo estatico para buscar por nombre de usuario
userSchema.statics.findByUsername = function(username, cb) {
	this.model('user').findOne({username: username}, cb);
};

module.exports = mongoose.model('user', userSchema);

/*
 * Uso: var User = require('../models/user.model.js');
 * en vez de: var User = mongoose.model('user', userSchema);
 */