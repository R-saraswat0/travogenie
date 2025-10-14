const Booking = require('../models/Booking');
const Package = require('../models/Package');
const User = require('../models/User');

// Create new booking
const bookPackage = async (req, res) => {
  try {
    const {
      packageId,
      travelers,
      startDate,
      pricing
    } = req.body;

    // Validate package exists and is active
    const package = await Package.findById(packageId);
    if (!package || !package.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Package not found or not available'
      });
    }

    // Calculate end date based on package duration
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(startDateObj.getTime() + (package.duration?.nights || 1) * 24 * 60 * 60 * 1000);

    // Use provided pricing or calculate default
    let bookingPricing;
    if (pricing && pricing.totalAmount) {
      bookingPricing = {
        baseAmount: pricing.totalAmount,
        taxes: Math.round(pricing.totalAmount * 0.12),
        totalAmount: pricing.totalAmount
      };
    } else {
      const baseAmount = package.pricing?.adult || 35000;
      const taxes = Math.round(baseAmount * 0.12);
      bookingPricing = {
        baseAmount,
        taxes,
        totalAmount: baseAmount + taxes
      };
    }

    // Create booking with simplified data
    const booking = new Booking({
      user: req.user.id,
      package: packageId,
      travelers: {
        adults: pricing?.breakdown?.adults || 1,
        children: pricing?.breakdown?.children || 0,
        infants: pricing?.breakdown?.infants || 0
      },
      dates: {
        startDate: startDateObj,
        endDate: endDateObj
      },
      pricing: bookingPricing,
      contactInfo: {
        phone: req.user.phone || 'Not provided',
        address: 'Not provided'
      },
      status: 'Pending'
    });

    await booking.save();

    // Populate booking details
    await booking.populate('package', 'title destination duration');
    await booking.populate('user', 'name email');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    
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
      message: 'Server error while creating booking'
    });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = { user: req.user.id };
    
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('package', 'title destination duration images pricing')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('package')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking'
    });
  }
};

// Update booking status (Admin only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('package', 'title destination');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating booking status'
    });
  }
};

// Cancel booking
const cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if booking can be cancelled
    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled'
      });
    }

    // Calculate refund amount
    const refundAmount = booking.calculateRefund();

    // Update booking
    booking.status = 'Cancelled';
    booking.cancellation = {
      isCancelled: true,
      cancelledAt: new Date(),
      cancelledBy: req.user.id,
      reason,
      refundAmount,
      refundStatus: refundAmount > 0 ? 'Pending' : 'Not Applicable'
    };

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully',
      refundAmount
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling booking'
    });
  }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus, transactionId, paidAmount } = req.body;
    
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update payment details
    booking.payment.status = paymentStatus;
    booking.payment.transactionId = transactionId;
    booking.payment.paidAmount = paidAmount;
    booking.payment.paymentDate = new Date();

    // Update booking status based on payment
    if (paymentStatus === 'Paid') {
      booking.status = 'Confirmed';
    } else if (paymentStatus === 'Failed') {
      booking.status = 'Pending';
    }

    await booking.save();

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating payment status'
    });
  }
};

// Get all bookings (Admin only)
const getAllBookings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('package', 'title destination duration')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching bookings'
    });
  }
};

// Get booking statistics
const getBookingStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.totalAmount' },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'Confirmed'] }, 1, 0] }
          },
          cancelledBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0] }
          },
          pendingBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
          }
        }
      }
    ]);

    const monthlyStats = await Booking.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().getFullYear(), 0, 1)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          bookings: { $sum: 1 },
          revenue: { $sum: '$pricing.totalAmount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      success: true,
      stats: stats[0] || {
        totalBookings: 0,
        totalRevenue: 0,
        confirmedBookings: 0,
        cancelledBookings: 0,
        pendingBookings: 0
      },
      monthlyStats
    });
  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking statistics'
    });
  }
};

module.exports = {
  bookPackage,
  createBooking: bookPackage,
  getMyBookings: getUserBookings,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  updatePaymentStatus,
  getAllBookings,
  getBookingStats
};