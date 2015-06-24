
var express = require('express');
var Order = require('../models/order.model');

var router = express.Router();

function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) return next();
	return res.redirect('/user/login');
}

router.get('/', ensureAuthenticated, function(req, res) {
	res.render('order', {user: req.user});
});

// Consultar estado de pedido
router.get('/:order', ensureAuthenticated, function(req, res) {
	Order.findOne({_id: req.params.order, customer: req.user._id})
		.populate('customer')
		.exec(function(err, order) {
			if (err) throw err;
			if (order) res.render('ordered', {order: order});
			res.redirect('/');
		});
});

router.post('/submit', ensureAuthenticated, function(req, res) {
	var user = req.user;
	var form = req.body;
	form.customer = user; // Evitamos que alguien modifique el campo hidden (podriamos eliminar el campo hidden)

	if (form.customer && form.pizza) {
		Order.create(form, function(err, created) {
			if (err) throw err;
			console.log("created:", created);
			//console.log("form:", form);
			//res.json(created);
			//res.render('ordered', {order: created});
			res.redirect('/order/' + created._id);
		});

	} else {
		res.redirect('/order');
	}
});

module.exports = router;
