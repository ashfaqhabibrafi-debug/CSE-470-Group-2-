const express = require('express');
const router = express.Router();
const {
  getAlerts,
  getMyAlerts,
  getAlert,
  createAlert,
  createDisasterAlert,
} = require('../controllers/alertController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(protect, getAlerts).post(protect, authorize('admin'), createAlert);
router.route('/my-alerts').get(protect, getMyAlerts);
router.route('/disaster/:disasterId').post(protect, authorize('admin'), createDisasterAlert);
router.route('/:id').get(protect, getAlert);

module.exports = router;

