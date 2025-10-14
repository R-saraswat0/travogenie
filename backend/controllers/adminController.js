const User = require('../models/User');
const Booking = require('../models/Booking');
const Package = require('../models/Package');

// Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalPackages = await Package.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $match: { 'payment.status': 'Paid' } },
      { $group: { _id: null, total: { $sum: '$pricing.totalAmount' } } }
    ]);

    const monthlyBookings = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) }
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.totalAmount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalBookings,
        totalPackages,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyBookings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
};

// User Management
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    let query = {};
    
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: { current: parseInt(page), pages: Math.ceil(total / limit), total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: status },
      { new: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update user status' });
  }
};

// Booking Management
const getAllBookingsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, startDate, endDate } = req.query;
    let query = {};

    if (status) query.status = status;
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('package', 'title destination')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      bookings,
      pagination: { current: parseInt(page), pages: Math.ceil(total / limit), total }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
};

// Package Management
const createPackageAdmin = async (req, res) => {
  try {
    const packageData = { ...req.body, createdBy: req.user.id };
    const package = new Package(packageData);
    await package.save();

    res.status(201).json({ success: true, package });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create package' });
  }
};

const updatePackageAdmin = async (req, res) => {
  try {
    const package = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ success: true, package });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update package' });
  }
};

const deletePackageAdmin = async (req, res) => {
  try {
    await Package.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete package' });
  }
};

// Reports
const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchQuery = {
      'payment.status': 'Paid'
    };
    
    if (startDate && endDate) {
      matchQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const report = await Booking.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalRevenue: { $sum: '$pricing.totalAmount' },
          totalBookings: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to generate report' });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllBookingsAdmin,
  createPackageAdmin,
  updatePackageAdmin,
  deletePackageAdmin,
  getRevenueReport
};