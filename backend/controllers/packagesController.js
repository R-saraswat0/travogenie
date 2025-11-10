const Package = require('../models/Package');

// Get all packages with search and filter
const getPackages = async (req, res) => {
  try {
    const {
      search,
      category,
      destination,
      minPrice,
      maxPrice,
      duration,
      difficulty,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Search functionality
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by destination (sanitized to prevent regex injection)
    if (destination) {
      const sanitizedDestination = destination.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      query.destination = new RegExp(sanitizedDestination, 'i');
    }

    // Price range filter (with validation)
    if (minPrice || maxPrice) {
      query['pricing.adult'] = {};
      if (minPrice) {
        const min = parseInt(minPrice);
        if (isNaN(min) || min < 0) {
          return res.status(400).json({ success: false, message: 'Invalid minPrice' });
        }
        query['pricing.adult'].$gte = min;
      }
      if (maxPrice) {
        const max = parseInt(maxPrice);
        if (isNaN(max) || max < 0) {
          return res.status(400).json({ success: false, message: 'Invalid maxPrice' });
        }
        query['pricing.adult'].$lte = max;
      }
    }

    // Duration filter
    if (duration) {
      query['duration.days'] = parseInt(duration);
    }

    // Difficulty filter
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Sorting
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const packages = await Package.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'name')
      .exec();

    const total = await Package.countDocuments(query);

    res.json({
      success: true,
      packages,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching packages'
    });
  }
};

// Get single package by ID
const getPackageById = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('reviews.user', 'name');

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.json({
      success: true,
      package
    });
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching package'
    });
  }
};

// Create new package (Admin only)
const createPackage = async (req, res) => {
  try {
    const packageData = {
      ...req.body,
      createdBy: req.user.id
    };

    const package = new Package(packageData);
    await package.save();

    res.status(201).json({
      success: true,
      message: 'Package created successfully',
      package
    });
  } catch (error) {
    console.error('Create package error:', error);
    
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
      message: 'Server error while creating package'
    });
  }
};

// Update package (Admin only)
const updatePackage = async (req, res) => {
  try {
    const package = await Package.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.json({
      success: true,
      message: 'Package updated successfully',
      package
    });
  } catch (error) {
    console.error('Update package error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating package'
    });
  }
};

// Delete package (Admin only)
const deletePackage = async (req, res) => {
  try {
    const package = await Package.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    res.json({
      success: true,
      message: 'Package deleted successfully'
    });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting package'
    });
  }
};

// Check availability for specific dates
const checkAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { startDate, endDate } = req.query;

    const package = await Package.findById(id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const availableDates = [];

    // Check each date in the range
    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      if (package.isAvailableOnDate(date)) {
        availableDates.push(new Date(date));
      }
    }

    res.json({
      success: true,
      availableDates,
      isAvailable: availableDates.length > 0
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking availability'
    });
  }
};

// Get pricing for specific date and group
const getPricing = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, adults = 1, children = 0, infants = 0 } = req.query;

    const package = await Package.findById(id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    const checkDate = new Date(date);
    const isAvailable = package.isAvailableOnDate(checkDate);

    if (!isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Package not available on selected date'
      });
    }

    const basePrice = package.getPriceForDate(checkDate, parseInt(adults), parseInt(children), parseInt(infants));
    const taxes = Math.round(basePrice * 0.12); // 12% tax
    const totalPrice = basePrice + taxes;

    res.json({
      success: true,
      pricing: {
        basePrice,
        taxes,
        totalPrice,
        breakdown: {
          adults: parseInt(adults),
          children: parseInt(children),
          infants: parseInt(infants),
          adultPrice: package.pricing.adult,
          childPrice: package.pricing.child || 0,
          infantPrice: package.pricing.infant || 0
        }
      }
    });
  } catch (error) {
    console.error('Get pricing error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while calculating pricing'
    });
  }
};

// Add review to package
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const package = await Package.findById(req.params.id);

    if (!package) {
      return res.status(404).json({
        success: false,
        message: 'Package not found'
      });
    }

    // Check if user already reviewed
    const existingReview = package.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this package'
      });
    }

    // Add review
    package.reviews.push({
      user: req.user.id,
      rating,
      comment
    });

    // Recalculate average rating
    await package.calculateAverageRating();

    res.json({
      success: true,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding review'
    });
  }
};

module.exports = {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
  checkAvailability,
  getPricing,
  addReview
};