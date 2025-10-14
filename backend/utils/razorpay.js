const Razorpay = require('razorpay');
const dotenv = require('dotenv');
dotenv.config();

let instance = null;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
  } else {
    console.warn('Razorpay credentials not found. Payment functionality disabled.');
  }
} catch (error) {
  console.error('Failed to initialize Razorpay:', error.message);
}

module.exports = instance;
