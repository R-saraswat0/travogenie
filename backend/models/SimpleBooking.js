const mongoose = require('mongoose');

const simpleBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  dates: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  travelers: {
    adults: { type: Number, default: 1 },
    children: { type: Number, default: 0 },
    infants: { type: Number, default: 0 }
  },
  pricing: {
    totalAmount: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
    default: 'Confirmed'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SimpleBooking', simpleBookingSchema);