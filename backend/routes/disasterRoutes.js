const express = require('express');
const router = express.Router();
const {
  getDisasters,
  getDisaster,
  createDisaster,
  updateDisaster,
  verifyDisaster,
  getNearbyDisasters,
  deleteDisaster,
} = require('../controllers/disasterController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getDisasters).post(protect, createDisaster);
router.route('/nearby').get(getNearbyDisasters);
router.route('/:id').get(getDisaster).put(protect, updateDisaster).delete(protect, authorize('admin'), deleteDisaster);
router.route('/:id/verify').put(protect, authorize('admin'), verifyDisaster);

module.exports = router;

