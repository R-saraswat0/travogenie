const Testimonial = require('../models/Testimonial');

// Get all testimonials
const getTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name');
    
    res.json({
      success: true,
      testimonials
    });
  } catch (error) {
    console.error('Get testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials'
    });
  }
};

// Create new testimonial
const createTestimonial = async (req, res) => {
  try {
    const { name, location, text, rating } = req.body;
    
    // Validation
    if (!name || !location || !text || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Name, location, text, and rating are required'
      });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    // Create testimonial
    const testimonial = new Testimonial({
      name: name.trim(),
      location: location.trim(),
      text: text.trim(),
      rating: parseInt(rating),
      user: req.user?.id || null,
      isApproved: true // Auto-approved
    });
    
    await testimonial.save();
    
    res.status(201).json({
      success: true,
      message: 'Thank you! Your testimonial has been published successfully.',
      testimonial: {
        id: testimonial._id,
        name: testimonial.name,
        location: testimonial.location,
        text: testimonial.text,
        rating: testimonial.rating,
        createdAt: testimonial.createdAt
      }
    });
  } catch (error) {
    console.error('Create testimonial error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to submit testimonial'
    });
  }
};

// Admin: Get all testimonials (including pending)
const getAllTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email');
    
    res.json({
      success: true,
      testimonials
    });
  } catch (error) {
    console.error('Get all testimonials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch testimonials'
    });
  }
};



// Admin: Delete testimonial
const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    
    const testimonial = await Testimonial.findByIdAndDelete(id);
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Delete testimonial error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete testimonial'
    });
  }
};

module.exports = {
  getTestimonials,
  createTestimonial,
  getAllTestimonials,
  deleteTestimonial
};