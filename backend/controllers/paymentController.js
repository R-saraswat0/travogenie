const razorpay = require('../utils/razorpay');
const Booking = require('../models/Booking');

exports.createOrder = async (req, res) => {
    const { amount } = req.body;
    const order = await razorpay.orders.create({
        amount: amount * 100,
        currency: "INR"
    });
    res.json(order);
};

exports.verifyPayment = async (req, res) => {
    const { orderId, paymentId, bookingId } = req.body;
    const booking = await Booking.findById(bookingId);
    booking.paymentStatus = "paid";
    booking.razorpayOrderId = orderId;
    booking.razorpayPaymentId = paymentId;
    await booking.save();
    res.json({ message: "Payment verified and booking confirmed" });
};
