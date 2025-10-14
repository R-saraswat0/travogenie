const router = require('express').Router();
const { authenticate } = require('../middleware/auth');

// Simple in-memory storage for bookings (for testing)
let bookings = [];
let bookingCounter = 1;

const bookPackage = async (req, res) => {
  try {
    const { packageId, travelers, startDate } = req.body;
    
    // Create a simple booking
    const booking = {
      _id: `booking_${bookingCounter++}`,
      user: req.user._id,
      package: {
        _id: packageId,
        title: 'Booked Package',
        destination: 'Travel Destination'
      },
      travelers: {
        adults: typeof travelers === 'number' ? travelers : (travelers.adults || 1),
        children: typeof travelers === 'number' ? 0 : (travelers.children || 0),
        infants: typeof travelers === 'number' ? 0 : (travelers.infants || 0)
      },
      dates: {
        startDate: new Date(startDate)
      },
      pricing: {
        totalAmount: 39999
      },
      status: 'Confirmed',
      createdAt: new Date()
    };
    
    bookings.push(booking);
    
    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, message: 'Booking failed' });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const userBookings = bookings.filter(booking => booking.user.toString() === req.user._id.toString());
    
    res.json({
      success: true,
      bookings: userBookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch bookings' });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const bookingIndex = bookings.findIndex(b => b._id === req.params.id && b.user.toString() === req.user._id.toString());
    
    if (bookingIndex === -1) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    bookings[bookingIndex].status = 'Cancelled';
    
    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Cancellation failed' });
  }
};

// User routes
router.post('/', authenticate, bookPackage);
router.get('/my', authenticate, getMyBookings);
router.put('/cancel/:id', authenticate, cancelBooking);

module.exports = router;