const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Package title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Package description is required']
  },
  destination: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },
  duration: {
    days: { type: Number, required: true },
    nights: { type: Number, required: true }
  },
  price: {
    basePrice: { type: Number, required: true },
    currency: { type: String, default: 'INR' }
  },
  images: [{
    url: String,
    caption: String
  }],
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    activities: [String],
    meals: [String]
  }],
  inclusions: [String],
  exclusions: [String],
  category: {
    type: String,
    enum: ['Adventure', 'Beach', 'Cultural', 'Wildlife', 'Honeymoon', 'Family', 'Business'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Challenging'],
    default: 'Easy'
  },
  groupSize: {
    min: { type: Number, default: 1 },
    max: { type: Number, default: 20 }
  },
  availability: {
    startDate: Date,
    endDate: Date,
    availableDates: [Date],
    blackoutDates: [Date]
  },
  pricing: {
    adult: { type: Number, required: true },
    child: { type: Number },
    infant: { type: Number },
    seasonalPricing: [{
      season: String,
      startDate: Date,
      endDate: Date,
      multiplier: { type: Number, default: 1 }
    }]
  },
  accommodation: {
    type: String,
    options: [String]
  },
  transportation: {
    included: Boolean,
    type: [String]
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags: [String]
}, {
  timestamps: true
});

// Index for search functionality
packageSchema.index({ title: 'text', description: 'text', destination: 'text' });
packageSchema.index({ category: 1, 'pricing.adult': 1 });
packageSchema.index({ destination: 1, isActive: 1 });

// Calculate average rating
packageSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.rating.average = 0;
    this.rating.count = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating.average = (sum / this.reviews.length).toFixed(1);
    this.rating.count = this.reviews.length;
  }
  return this.save();
};

// Get price for specific date and group
packageSchema.methods.getPriceForDate = function(date, adults = 1, children = 0, infants = 0) {
  let basePrice = this.pricing.adult * adults;
  
  if (children > 0 && this.pricing.child) {
    basePrice += this.pricing.child * children;
  }
  
  if (infants > 0 && this.pricing.infant) {
    basePrice += this.pricing.infant * infants;
  }
  
  // Apply seasonal pricing
  const seasonalRate = this.pricing.seasonalPricing.find(season => {
    return date >= season.startDate && date <= season.endDate;
  });
  
  if (seasonalRate) {
    basePrice *= seasonalRate.multiplier;
  }
  
  return Math.round(basePrice);
};

// Check availability for date
packageSchema.methods.isAvailableOnDate = function(date) {
  const checkDate = new Date(date);
  
  // Check if within availability window
  if (this.availability.startDate && checkDate < this.availability.startDate) return false;
  if (this.availability.endDate && checkDate > this.availability.endDate) return false;
  
  // Check blackout dates
  if (this.availability.blackoutDates.some(blackout => 
    blackout.toDateString() === checkDate.toDateString())) {
    return false;
  }
  
  // Check available dates (if specified)
  if (this.availability.availableDates.length > 0) {
    return this.availability.availableDates.some(available => 
      available.toDateString() === checkDate.toDateString());
  }
  
  return true;
};

module.exports = mongoose.model('Package', packageSchema);