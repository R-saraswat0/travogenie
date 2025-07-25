const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const controller = require('../controllers/packagesController');

router.get('/', controller.getAllPackages);
router.get('/:id', controller.getPackage);
router.post('/', protect, adminOnly, controller.createPackage);
router.put('/:id', protect, adminOnly, controller.updatePackage);
router.delete('/:id', protect, adminOnly, controller.deletePackage);

module.exports = router;
