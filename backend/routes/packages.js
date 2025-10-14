const router = require('express').Router();
const Package = require('../models/Package');

// Get all packages
const getPackages = async (req, res) => {
  try {
    const packages = await Package.find({ isActive: true });
    res.json({
      success: true,
      packages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch packages'
    });
  }
};

// Get package by ID
const getPackageById = async (req, res) => {
  try {
    const package = await Package.findById(req.params.id);
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
    res.status(500).json({
      success: false,
      message: 'Failed to fetch package'
    });
  }
};

router.get('/', getPackages);
router.get('/:id', getPackageById);

module.exports = router;