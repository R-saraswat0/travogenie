const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  logout
} = require('../controllers/authController');
const { authenticate, rateLimitSensitive } = require('../middleware/auth');

// Public routes
router.post('/register', rateLimitSensitive, register);
router.post('/login', rateLimitSensitive, login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', rateLimitSensitive, forgotPassword);
router.post('/reset-password', rateLimitSensitive, resetPassword);

// Protected routes
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

module.exports = router;