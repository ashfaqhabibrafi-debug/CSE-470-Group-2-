const express = require('express');
const router = express.Router();
const {
  getOrganizations,
  getAllOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} = require('../controllers/organizationController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getOrganizations).post(protect, authorize('admin'), createOrganization);
router.route('/all').get(protect, authorize('admin'), getAllOrganizations);
router.route('/:id').get(getOrganization).put(protect, authorize('admin'), updateOrganization).delete(protect, authorize('admin'), deleteOrganization);

module.exports = router;
