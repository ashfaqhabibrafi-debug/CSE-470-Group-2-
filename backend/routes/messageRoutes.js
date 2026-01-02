const express = require('express');
const router = express.Router();
const {
  getMessages,
  sendMessage,
  markAsRead,
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getMessages).post(protect, sendMessage);
router.route('/:id/read').put(protect, markAsRead);

module.exports = router;

