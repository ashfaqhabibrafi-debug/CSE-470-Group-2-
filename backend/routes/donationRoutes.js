const express = require('express');
const router = express.Router();
const {
  getDonations,
  getDonation,
  createDonation,
  updateDonationStatus,
  getDonationStats,
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getDonations).post(protect, createDonation);
router.route('/stats').get(protect, authorize('admin'), getDonationStats);
router.route('/:id').get(getDonation);
router.route('/:id/status').put(protect, authorize('admin'), updateDonationStatus);

module.exports = router;

