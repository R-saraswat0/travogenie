const User = require('../models/User');
const Booking = require('../models/Booking');
const Package = require('../models/Package');

exports.getDashboardStats = async (req, res) => {
    const users = await User.countDocuments();
    const bookings = await Booking.countDocuments();
    const revenue = await Booking.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$pricePaid" } } }
    ]);

    res.json({
        users,
        bookings,
        revenue: revenue[0]?.total || 0
    });
};
