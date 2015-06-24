var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var orderSchema = new Schema({
	customer: {
		type: Schema.Types.ObjectId,
		ref: "user"
	},
	state: {
		type: String,
		enum: ['pending', 'coooking', 'ready'],
		default: 'pending'
	},
	pizza: {
		type: String
	},
	order_date: {
		type: Date,
		default: Date.now
	},
	email: String,
	email_on_ready: {
		type: Boolean,
		default: false
	}
})

module.exports = mongoose.model('order', orderSchema);
