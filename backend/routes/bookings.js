const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const controller = require('../controllers/bookingsController');

router.post('/', protect, controller.bookPackage);
router.get('/', protect, controller.getMyBookings);
router.put('/cancel/:id', protect, controller.cancelBooking);

module.exports = router;
