const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
    date: Date,
    status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' },
    pricePaid: Number,
    paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
    razorpayOrderId: String,
    razorpayPaymentId: String
});
module.exports = mongoose.model('Booking', bookingSchema);
