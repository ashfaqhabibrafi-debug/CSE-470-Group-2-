const express = require('express');
const router = express.Router();
const {
  getFeedback,
  createFeedback,
  getUserRating,
} = require('../controllers/feedbackController');
const { protect } = require('../middleware/auth');

router.route('/').get(protect, getFeedback).post(protect, createFeedback);
router.route('/rating/:userId').get(getUserRating);

module.exports = router;

