const express = require('express');
const router = express.Router();
const {
  getAnnouncements,
  createAnnouncement,
  publishAnnouncement,
} = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getAnnouncements).post(protect, authorize('admin'), createAnnouncement);
router.route('/:id/publish').put(protect, authorize('admin'), publishAnnouncement);

module.exports = router;

