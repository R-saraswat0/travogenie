const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

router.get('/me', protect, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
});

module.exports = router;
