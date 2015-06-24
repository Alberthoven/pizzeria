
var express = require('express');
var Order = require('../models/order.model');
var nodemailer = require('nodemailer');

var router = express.Router();

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'mail@gmail.com',
		pass: 'password'
	}
});

//https://github.com/andris9/Nodemailer#using-gmail -> https://github.com/andris9/nodemailer-smtp-transport#authentication

// setup e-mail data with unicode symbols
var mailOptions = {
	from: 'Pizzería Cóndor ✔ <mail@gmail.com>', // sender address
	to: '', // list of receivers
	subject: 'Su pedido está listo', // Subject line
	text: '' // plaintext body
	//html: '<b>Hello world ✔</b>' // html body
};

router.get('/', function(req, res, next) {
	Order.find({})
		.populate('customer')
		.exec(function(err, orders) {
			if (err) throw err;
			res.render('admin', {orders: orders});
		});
});

router.get('/order/:order/:state', function(req, res, next) {
	Order.update({_id: req.params.order}, {"$set": {state: req.params.state}})
		.exec(function(err, updated) {
			if (err) throw err;
			if (req.params.state == "ready") {
				// Enviamos mail
				Order.findOne({_id: req.params.order})
					.populate('customer')
					.exec(function(err, info) {
						if (err) throw err;
						if (order.email_on_ready) {
							//mailOptions.to = "mail@gmail.com";
							mailOptions.to = order.customer.email;
							mailOptions.text = "Hola " + order.customer.username + " su pedido está listo. Puede pasar a recogerlo cuando quiera.";
							transporter.sendMail(mailOptions, function(err, info) {
								if (err) throw err;
								console.log("Info email:", info);
							});
						} else {
							console.log("El usuario " + order.customer.username + " no quiere recibir notificaciones por email");
						}
				});
			}
			res.redirect('/admin');
		});
});

module.exports = router;
