const express = require('express');
const router = express.Router();
const {
  getHelpRequests,
  getHelpRequest,
  createHelpRequest,
  matchHelpRequest,
  updateHelpRequestStatus,
  verifyHelpRequest,
  getNearbyHelpRequests,
  deleteHelpRequest,
} = require('../controllers/helpRequestController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getHelpRequests).post(protect, createHelpRequest);
router.route('/nearby').get(protect, authorize('volunteer', 'admin'), getNearbyHelpRequests);
router.route('/:id').get(getHelpRequest).delete(protect, deleteHelpRequest);
router.route('/:id/match').put(protect, authorize('volunteer', 'admin'), matchHelpRequest);
router.route('/:id/status').put(protect, updateHelpRequestStatus);
router.route('/:id/verify').put(protect, authorize('admin'), verifyHelpRequest);

module.exports = router;

