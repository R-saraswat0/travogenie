const router = require('express').Router();
const { authenticate } = require('../middleware/auth');
const {
  createPaymentOrder,
  verifyPayment,
  generateInvoice
} = require('../controllers/paymentController');

// Payment routes
router.post('/create-order', authenticate, createPaymentOrder);
router.post('/verify', authenticate, verifyPayment);
router.get('/invoice/:bookingId', authenticate, generateInvoice);

module.exports = router;