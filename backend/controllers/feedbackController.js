const Feedback = require('../models/Feedback');

// @desc    Get all feedback (filtered by role)
// @route   GET /api/feedback
// @access  Private
exports.getFeedback = async (req, res) => {
  try {
    const { to, helpRequest, targetType, targetId } = req.query;
    let query = {};

    // Role-based filtering
    if (req.user.role === 'volunteer') {
      // Volunteers can only see feedback about them
      query.targetType = 'volunteer';
      query.targetId = req.user.id;
    } else if (req.user.role === 'admin') {
      // Admins can see all feedback
      // Apply filters if provided
      if (to) query.to = to;
      if (targetType) query.targetType = targetType;
      if (targetId) query.targetId = targetId;
    } else if (req.user.role === 'citizen') {
      // Citizens can see feedback they submitted
      query.from = req.user.id;
    }

    if (helpRequest) query.helpRequest = helpRequest;

    const feedback = await Feedback.find(query)
      .populate('from', 'name email profilePicture')
      .populate('to', 'name email profilePicture')
      .populate('donationEvent', 'title description')
      .populate('organization', 'name description')
      .populate('helpRequest', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: feedback.length,
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create feedback (Citizens only)
// @route   POST /api/feedback
// @access  Private (Citizen)
exports.createFeedback = async (req, res) => {
  try {
    // Only citizens can create feedback
    if (req.user.role !== 'citizen') {
      return res.status(403).json({
        success: false,
        message: 'Only citizens can submit feedback',
      });
    }

    const { targetType, targetId, helpRequest, rating, comment, category } = req.body;

    if (!targetType || !targetId) {
      return res.status(400).json({
        success: false,
        message: 'Please specify targetType and targetId',
      });
    }

    if (!['volunteer', 'donationEvent', 'organization'].includes(targetType)) {
      return res.status(400).json({
        success: false,
        message: 'targetType must be volunteer, donationEvent, or organization',
      });
    }

    // Check if feedback already exists for this target from this user
    const existing = await Feedback.findOne({
      from: req.user.id,
      targetType,
      targetId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted feedback for this target',
      });
    }

    // Determine targetTypeModel and set appropriate field
    let feedbackData = {
      from: req.user.id,
      targetType,
      targetId,
      rating,
      comment,
      category: category || 'overall',
    };

    if (targetType === 'volunteer') {
      feedbackData.targetTypeModel = 'User';
      feedbackData.to = targetId; // For backward compatibility
    } else if (targetType === 'donationEvent') {
      feedbackData.targetTypeModel = 'DonationEvent';
      feedbackData.donationEvent = targetId;
    } else if (targetType === 'organization') {
      feedbackData.targetTypeModel = 'Organization';
      feedbackData.organization = targetId;
    }

    if (helpRequest) feedbackData.helpRequest = helpRequest;

    const feedback = await Feedback.create(feedbackData);

    const populated = await Feedback.findById(feedback._id)
      .populate('from', 'name email profilePicture')
      .populate('to', 'name email profilePicture')
      .populate('donationEvent', 'title description')
      .populate('organization', 'name description')
      .populate('helpRequest', 'title');

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get average rating for user
// @route   GET /api/feedback/rating/:userId
// @access  Public
exports.getUserRating = async (req, res) => {
  try {
    const feedback = await Feedback.find({ to: req.params.userId });

    if (feedback.length === 0) {
      return res.json({
        success: true,
        data: {
          averageRating: 0,
          totalFeedback: 0,
        },
      });
    }

    const totalRating = feedback.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = totalRating / feedback.length;

    res.json({
      success: true,
      data: {
        averageRating: averageRating.toFixed(2),
        totalFeedback: feedback.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

