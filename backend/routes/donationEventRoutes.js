const express = require('express');
const router = express.Router();
const {
  getDonationEvents,
  getDonationEvent,
  createDonationEvent,
  updateDonationEvent,
  deleteDonationEvent,
} = require('../controllers/donationEventController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getDonationEvents).post(protect, authorize('admin'), createDonationEvent);
router.route('/:id').get(getDonationEvent).put(protect, authorize('admin'), updateDonationEvent).delete(protect, authorize('admin'), deleteDonationEvent);

module.exports = router;

