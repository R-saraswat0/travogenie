const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');

// Initialize Razorpay only if not in demo mode
let razorpay;
if (process.env.PAYMENT_MODE !== 'demo') {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// Create payment order
const createPaymentOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    
    // Demo mode for testing
    if (process.env.PAYMENT_MODE === 'demo') {
      res.json({
        success: true,
        orderId: `demo_order_${Date.now()}`,
        amount: amount * 100,
        currency: 'INR',
        key: 'rzp_test_demo'
      });
      return;
    }
    
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Payment order creation error:', error);
    res.status(500).json({ success: false, message: `Payment order creation failed: ${error.message}` });
  }
};

// Verify payment
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
    
    // Demo mode - always verify successfully
    if (process.env.PAYMENT_MODE === 'demo') {
      await Booking.findByIdAndUpdate(bookingId, {
        'payment.status': 'Paid',
        'payment.transactionId': razorpay_payment_id || 'demo_payment_123',
        'payment.paymentDate': new Date(),
        status: 'Confirmed'
      });
      res.json({ success: true, message: 'Payment verified successfully (Demo Mode)' });
      return;
    }
    
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Update booking status
      await Booking.findByIdAndUpdate(bookingId, {
        'payment.status': 'Paid',
        'payment.transactionId': razorpay_payment_id,
        'payment.paymentDate': new Date(),
        status: 'Confirmed'
      });

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ success: false, message: 'Payment verification failed' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Payment verification error' });
  }
};

// Generate invoice
const generateInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('package', 'title destination')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const invoice = {
      invoiceNumber: `INV-${booking.bookingId}`,
      date: new Date(),
      customer: {
        name: booking.user.name,
        email: booking.user.email
      },
      package: {
        title: booking.package.title,
        destination: booking.package.destination
      },
      amount: booking.pricing.totalAmount,
      status: booking.payment.status
    };

    res.json({ success: true, invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Invoice generation failed' });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  generateInvoice
};