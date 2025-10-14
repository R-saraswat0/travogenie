const express = require('express');
const router = express.Router();
const {
  updateProfile,
  changePassword,
  deleteAccount,
  getUserBookings,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserStats
} = require('../controllers/userController');
const { authenticate, authorize, requireEmailVerification, rateLimitSensitive } = require('../middleware/auth');

// User routes (protected)
router.put('/profile', authenticate, updateProfile);
router.put('/change-password', authenticate, rateLimitSensitive, changePassword);
router.delete('/account', authenticate, rateLimitSensitive, deleteAccount);
router.get('/bookings', authenticate, requireEmailVerification, getUserBookings);

// Admin routes (admin only)
router.get('/all', authenticate, authorize('admin'), getAllUsers);
router.get('/stats', authenticate, authorize('admin'), getUserStats);
router.get('/:id', authenticate, authorize('admin'), getUserById);
router.put('/:id/role', authenticate, authorize('admin'), updateUserRole);
router.delete('/:id', authenticate, authorize('admin'), rateLimitSensitive, deleteUser);

module.exports = router;