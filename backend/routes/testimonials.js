const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  createTestimonial,
  getAllTestimonials,
  deleteTestimonial
} = require('../controllers/testimonialController');
const { authenticate, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getTestimonials);
router.post('/', createTestimonial);

// Admin routes
router.get('/all', authenticate, authorize('admin'), getAllTestimonials);
router.delete('/:id', authenticate, authorize('admin'), deleteTestimonial);

module.exports = router;