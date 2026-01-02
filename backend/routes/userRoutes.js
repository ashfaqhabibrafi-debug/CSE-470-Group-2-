const express = require('express');
const router = express.Router();
const {
  getUsers,
  getVolunteers,
  getUserById,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.route('/').get(protect, authorize('admin'), getUsers);
router.route('/volunteers').get(protect, getVolunteers);
router.route('/:id').get(protect, getUserById).put(protect, updateUser).delete(protect, authorize('admin'), deleteUser);

module.exports = router;
