const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  package: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package',
    required: true
  },
  travelers: {
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, default: 0 },
    infants: { type: Number, default: 0 }
  },
  travelerDetails: [{
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    type: { type: String, enum: ['Adult', 'Child', 'Infant'] },
    documents: {
      passport: String,
      visa: String,
      other: String
    }
  }],
  dates: {
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
  },
  pricing: {
    baseAmount: { type: Number, required: true },
    taxes: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true }
  },
  payment: {
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded', 'Partial'],
      default: 'Pending'
    },
    method: String,
    transactionId: String,
    paidAmount: { type: Number, default: 0 },
    paymentDate: Date
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed', 'Refunded'],
    default: 'Pending'
  },
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String
    }
  },
  specialRequests: String,
  cancellation: {
    isCancelled: { type: Boolean, default: false },
    cancelledAt: Date,
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: String,
    refundAmount: { type: Number, default: 0 },
    refundStatus: {
      type: String,
      enum: ['Not Applicable', 'Pending', 'Processed', 'Failed'],
      default: 'Not Applicable'
    }
  },
  notifications: [{
    type: String,
    message: String,
    sentAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Sent', 'Failed'], default: 'Sent' }
  }]
}, {
  timestamps: true
});

// Generate unique booking ID
bookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingId = `TRV${Date.now().toString().slice(-6)}${(count + 1).toString().padStart(3, '0')}`;
  }
  next();
});

// Calculate refund amount based on cancellation policy
bookingSchema.methods.calculateRefund = function() {
  const now = new Date();
  const startDate = new Date(this.dates.startDate);
  const daysUntilStart = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));
  
  let refundPercentage = 0;
  
  if (daysUntilStart >= 30) {
    refundPercentage = 0.9; // 90% refund
  } else if (daysUntilStart >= 15) {
    refundPercentage = 0.75; // 75% refund
  } else if (daysUntilStart >= 7) {
    refundPercentage = 0.5; // 50% refund
  } else if (daysUntilStart >= 3) {
    refundPercentage = 0.25; // 25% refund
  } else {
    refundPercentage = 0; // No refund
  }
  
  return Math.round(this.pricing.totalAmount * refundPercentage);
};

// Check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  if (this.status === 'Cancelled' || this.status === 'Completed') {
    return false;
  }
  
  const now = new Date();
  const startDate = new Date(this.dates.startDate);
  
  return startDate > now;
};

module.exports = mongoose.model('Booking', bookingSchema);