const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const controller = require('../controllers/paymentController');

router.post('/create-order', protect, controller.createOrder);
router.post('/verify', protect, controller.verifyPayment);

module.exports = router;
