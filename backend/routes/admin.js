const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getDashboardStats } = require('../controllers/adminController');

router.get('/dashboard-stats', protect, adminOnly, getDashboardStats);

module.exports = router;
