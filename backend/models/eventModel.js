const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String },
  ticket_price: { type: Number, required: true },
  images: [{ type: String, required: true }],
  category: {
    type: String,
    required: true,
    enum: ['Movie', 'Concert', 'Festival', 'Sports', 'Other']
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token_name: { type: String, required: true, unique: true },
  total_tickets: { type: Number, required: true, default: 0 },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true }
  },
  available_tickets: { type: Number, default: 0 },
  audience: [
    {
      attendee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      tickets_bought: { type: Number, default: 0 }
    }
  ],
  date_time: { type: Date, required: true },
  listed_at: { type: Date, default: Date.now }
});

const event = mongoose.model('Event', eventSchema);
module.exports = event;
