const SimpleBooking = require('../models/SimpleBooking');
const Package = require('../models/Package');
const User = require('../models/User');

// Create new booking
const bookPackage = async (req, res) => {
  try {
    console.log('Booking request:', req.body);
    console.log('User:', req.user);
    
    // Direct MongoDB insertion with minimal data
    const bookingData = {
      user: req.user._id,
      package: req.body.packageId,
      dates: {
        startDate: new Date(req.body.startDate),
        endDate: new Date(new Date(req.body.startDate).getTime() + 24 * 60 * 60 * 1000)
      },
      pricing: {
        totalAmount: req.body.pricing?.totalAmount || 39999
      },
      status: 'Confirmed',
      createdAt: new Date()
    };
    
    const startDateObj = new Date(req.body.startDate);
    const endDateObj = new Date(startDateObj.getTime() + 24 * 60 * 60 * 1000);
    
    const booking = await SimpleBooking.create({
      user: req.user._id,
      package: req.body.packageId,
      dates: {
        startDate: startDateObj,
        endDate: endDateObj
      },
      travelers: {
        adults: req.body.travelers?.adults || 1,
        children: req.body.travelers?.children || 0,
        infants: req.body.travelers?.infants || 0
      },
      pricing: {
        totalAmount: req.body.pricing?.totalAmount || 39999
      },
      status: 'Confirmed'
    });
    console.log('Booking created:', booking._id);
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    console.log('Getting bookings for user:', req.user._id);
    
    const bookings = await SimpleBooking.find({ user: req.user._id })
      .populate('package', 'title destination duration images pricing')
      .sort({ createdAt: -1 });
    
    console.log('Found bookings:', bookings.length);

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await SimpleBooking.findById(req.params.id)
      .populate('package')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking or is admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
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
    const booking = await SimpleBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update booking status to cancelled
    booking.status = 'Cancelled';
    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling booking'
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

  getAllBookings,
  getBookingStats
};