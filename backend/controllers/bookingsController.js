const Booking = require('../models/Booking');
const Package = require('../models/Package');

exports.bookPackage = async (req, res) => {
    const { packageId, date } = req.body;
    const pkg = await Package.findById(packageId);
    if (!pkg.availableDates.includes(new Date(date).toISOString())) {
        return res.status(400).json({ message: "Date not available" });
    }

    const booking = await Booking.create({
        userId: req.user.id,
        packageId,
        date,
        pricePaid: pkg.price
    });
    res.status(201).json(booking);
};

exports.getMyBookings = async (req, res) => {
    const bookings = await Booking.find({ userId: req.user.id }).populate('packageId');
    res.json(bookings);
};

exports.cancelBooking = async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (booking.userId.toString() !== req.user.id) {
        return res.status(403).json({ message: "Not authorized" });
    }
    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Cancelled" });
};
