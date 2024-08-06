const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
	title: { type: String, required: true },
	desc: { type: String, required: true },
	ticket_price: { type: Number, required: true },
	images: [{ type: String, required: true }],
	owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	token_name: { type: String, required: true, unique: true },
	total_tickets: { type: Number, required: true, default: 0 },
	audience: [
		{
			investor: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
			no_of_tickets: { type: Number, default: 0 },
		},
	],
	listed_at: { type: Date, default: Date.now },
});

const event = mongoose.model('Event', eventSchema);
module.exports = event;
