const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  bookPackage,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getAllBookings,
  getBookingStats
} = require('../controllers/bookingsController');

// User routes
router.post('/', authenticate, bookPackage);
router.get('/my', authenticate, getUserBookings);
router.get('/:id', authenticate, getBookingById);
router.put('/cancel/:id', authenticate, cancelBooking);

// Admin routes
router.get('/', authenticate, authorize('admin'), getAllBookings);
router.put('/:id/status', authenticate, authorize('admin'), updateBookingStatus);
router.get('/stats/overview', authenticate, authorize('admin'), getBookingStats);

module.exports = router;