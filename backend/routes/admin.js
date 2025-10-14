const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllBookingsAdmin,
  createPackageAdmin,
  updatePackageAdmin,
  deletePackageAdmin,
  getRevenueReport
} = require('../controllers/adminController');

// Admin middleware
const adminAuth = [authenticate, authorize('admin')];

// Dashboard & Analytics
router.get('/dashboard/stats', adminAuth, getDashboardStats);
router.get('/reports/revenue', adminAuth, getRevenueReport);

// User Management
router.get('/users', adminAuth, getAllUsers);
router.put('/users/:id/status', adminAuth, updateUserStatus);

// Booking Management
router.get('/bookings', adminAuth, getAllBookingsAdmin);

// Package Management
router.post('/packages', adminAuth, createPackageAdmin);
router.put('/packages/:id', adminAuth, updatePackageAdmin);
router.delete('/packages/:id', adminAuth, deletePackageAdmin);

module.exports = router;