const HelpRequest = require('../models/HelpRequest');
const User = require('../models/User');
const { notifyHelpRequestCreated, notifyHelpRequestVerified } = require('../utils/notificationService');

// @desc    Get all help requests
// @route   GET /api/help-requests
// @access  Public
exports.getHelpRequests = async (req, res) => {
  try {
    const { status, disaster, requestType } = req.query;
    let query = {};

    if (status) query.status = status;
    if (disaster) query.disaster = disaster;
    if (requestType) query.requestType = { $in: requestType.split(',') };

    const helpRequests = await HelpRequest.find(query)
      .populate('requestedBy', 'name email phone')
      .populate('matchedVolunteer', 'name email phone')
      .populate('disaster', 'title type location')
      .populate('verifiedBy', 'name')
      .sort({ urgency: -1, createdAt: -1 });

    res.json({
      success: true,
      count: helpRequests.length,
      data: helpRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single help request
// @route   GET /api/help-requests/:id
// @access  Public
exports.getHelpRequest = async (req, res) => {
  try {
    const helpRequest = await HelpRequest.findById(req.params.id)
      .populate('requestedBy', 'name email phone address')
      .populate('matchedVolunteer', 'name email phone skills')
      .populate('disaster', 'title description type location')
      .populate('verifiedBy', 'name');

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found',
      });
    }

    res.json({
      success: true,
      data: helpRequest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create help request
// @route   POST /api/help-requests
// @access  Private (Citizen, Volunteer)
exports.createHelpRequest = async (req, res) => {
  try {
    const { disaster, requestType, description, urgency, location, quantity } = req.body;

    const helpRequest = await HelpRequest.create({
      disaster,
      requestedBy: req.user.id,
      requestType,
      description,
      urgency: urgency || 'medium',
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
        address: location.address,
      },
      quantity: quantity || {},
    });

    const populated = await HelpRequest.findById(helpRequest._id)
      .populate('requestedBy', 'name email')
      .populate('disaster', 'title');

    // Send notification to admins about new help request needing verification
    try {
      await notifyHelpRequestCreated(populated, req.user.id);
    } catch (notifyError) {
      console.error('Error sending notification to admins:', notifyError);
      // Don't fail the creation if notification fails
    }

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

// @desc    Match volunteer to help request
// @route   PUT /api/help-requests/:id/match
// @access  Private (Volunteer)
exports.matchHelpRequest = async (req, res) => {
  try {
    const helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found',
      });
    }

    if (helpRequest.status !== 'pending' && helpRequest.status !== 'verified') {
      return res.status(400).json({
        success: false,
        message: 'Help request is already matched or completed',
      });
    }

    helpRequest.matchedVolunteer = req.user.id;
    helpRequest.status = 'matched';
    helpRequest.matchedAt = new Date();

    await helpRequest.save();

    const populated = await HelpRequest.findById(helpRequest._id)
      .populate('matchedVolunteer', 'name email phone')
      .populate('requestedBy', 'name email');

    res.json({
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

// @desc    Update help request status
// @route   PUT /api/help-requests/:id/status
// @access  Private
exports.updateHelpRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found',
      });
    }

    // Check authorization
    const isRequester = helpRequest.requestedBy.toString() === req.user.id;
    const isVolunteer = helpRequest.matchedVolunteer?.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isRequester && !isVolunteer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this help request',
      });
    }

    helpRequest.status = status;
    if (status === 'completed') {
      helpRequest.completedAt = new Date();
    }

    await helpRequest.save();

    res.json({
      success: true,
      data: helpRequest,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify/Reject help request
// @route   PUT /api/help-requests/:id/verify
// @access  Private (Admin)
exports.verifyHelpRequest = async (req, res) => {
  try {
    const { status } = req.body; // 'verified' or 'rejected'

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be verified or rejected',
      });
    }

    const helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found',
      });
    }

    helpRequest.status = status;
    helpRequest.verifiedBy = req.user.id;
    helpRequest.verifiedAt = new Date();

    await helpRequest.save();

    const populated = await HelpRequest.findById(helpRequest._id)
      .populate('requestedBy', 'name email')
      .populate('disaster', 'title')
      .populate('verifiedBy', 'name');

    // If verified, send notification to citizens and volunteers
    if (status === 'verified') {
      try {
        await notifyHelpRequestVerified(populated, req.user.id);
      } catch (notifyError) {
        console.error('Error sending notifications:', notifyError);
        // Don't fail the verification if notification fails
      }
    }

    res.json({
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

// @desc    Get nearby help requests
// @route   GET /api/help-requests/nearby
// @access  Private (Volunteer)
exports.getNearbyHelpRequests = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 50000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide longitude and latitude',
      });
    }

    const helpRequests = await HelpRequest.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
      status: { $in: ['verified', 'pending'] },
    })
      .populate('requestedBy', 'name email phone')
      .populate('disaster', 'title type')
      .limit(50);

    res.json({
      success: true,
      count: helpRequests.length,
      data: helpRequests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete help request
// @route   DELETE /api/help-requests/:id
// @access  Private (Admin, Requester)
exports.deleteHelpRequest = async (req, res) => {
  try {
    const helpRequest = await HelpRequest.findById(req.params.id);

    if (!helpRequest) {
      return res.status(404).json({
        success: false,
        message: 'Help request not found',
      });
    }

    // Check if user is the requester or admin
    if (
      helpRequest.requestedBy.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this help request',
      });
    }

    await helpRequest.deleteOne();

    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
