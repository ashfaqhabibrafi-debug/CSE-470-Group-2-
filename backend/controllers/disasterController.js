const Disaster = require('../models/Disaster');
const Alert = require('../models/Alert');
const User = require('../models/User');
const { sendEmergencyAlert } = require('../utils/emailService');
const { notifyDisasterCreated, notifyDisasterVerified } = require('../utils/notificationService');

// @desc    Get all disasters
// @route   GET /api/disasters
// @access  Public
exports.getDisasters = async (req, res) => {
  try {
    const { status, type, verified } = req.query;
    let query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (verified === 'true') query.status = { $in: ['verified', 'active'] };

    const disasters = await Disaster.find(query)
      .populate('reportedBy', 'name email')
      .populate('verifiedBy', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: disasters.length,
      data: disasters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single disaster
// @route   GET /api/disasters/:id
// @access  Public
exports.getDisaster = async (req, res) => {
  try {
    const disaster = await Disaster.findById(req.params.id)
      .populate('reportedBy', 'name email phone')
      .populate('verifiedBy', 'name');

    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: 'Disaster not found',
      });
    }

    res.json({
      success: true,
      data: disaster,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create disaster
// @route   POST /api/disasters
// @access  Private (Citizen, Volunteer)
exports.createDisaster = async (req, res) => {
  try {
    const { title, description, type, severity, location, photos, affectedCount } = req.body;

    const disaster = await Disaster.create({
      title,
      description,
      type,
      severity: severity || 'medium',
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
        address: location.address,
        city: location.city,
        state: location.state,
        country: location.country,
      },
      photos: photos || [],
      reportedBy: req.user.id,
      affectedCount: affectedCount || 0,
    });

    // Send notification to admins about new disaster needing verification
    try {
      await notifyDisasterCreated(disaster, req.user.id);
    } catch (notifyError) {
      console.error('Error sending notification to admins:', notifyError);
      // Don't fail the creation if notification fails
    }

    res.status(201).json({
      success: true,
      data: disaster,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update disaster
// @route   PUT /api/disasters/:id
// @access  Private
exports.updateDisaster = async (req, res) => {
  try {
    let disaster = await Disaster.findById(req.params.id);

    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: 'Disaster not found',
      });
    }

    // Check if user is the reporter or admin
    if (disaster.reportedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this disaster',
      });
    }

    disaster = await Disaster.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: disaster,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Verify/Reject disaster
// @route   PUT /api/disasters/:id/verify
// @access  Private (Admin)
exports.verifyDisaster = async (req, res) => {
  try {
    const { status } = req.body; // 'verified' or 'rejected'

    if (!['verified', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be verified or rejected',
      });
    }

    const disaster = await Disaster.findById(req.params.id);

    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: 'Disaster not found',
      });
    }

    disaster.status = status;
    disaster.verifiedBy = req.user.id;
    disaster.verifiedAt = new Date();

    if (status === 'verified') {
      disaster.status = 'active';
      
      // Create emergency alert for verified disaster
      try {
        // Find users in the affected region (within 50km)
        let targetUsers = [];
        if (disaster.location && disaster.location.coordinates) {
          const [longitude, latitude] = disaster.location.coordinates;
          const radiusInMeters = 50000; // 50km radius

          const nearbyUsers = await User.find({
            location: {
              $near: {
                $geometry: {
                  type: 'Point',
                  coordinates: [longitude, latitude],
                },
                $maxDistance: radiusInMeters,
              },
            },
          }).select('_id email name');

          targetUsers = nearbyUsers.map(user => user._id);
        }

        // Create alert
        const alert = await Alert.create({
          title: `Emergency Alert: ${disaster.title}`,
          message: `A ${disaster.type} disaster has been verified in your area. ${disaster.description}`,
          type: 'sos',
          priority: disaster.severity === 'critical' ? 'critical' : disaster.severity === 'high' ? 'high' : 'medium',
          disaster: disaster._id,
          targetRegion: disaster.location ? {
            type: 'Point',
            coordinates: disaster.location.coordinates,
            radius: 50,
          } : null,
          targetUsers,
          sentBy: req.user.id,
          sentVia: ['in-app', 'email'],
          sentAt: new Date(),
        });

        // Send emails to all target users
        if (targetUsers.length > 0) {
          const users = await User.find({ _id: { $in: targetUsers } }).select('email name');
          for (const user of users) {
            if (user.email) {
              await sendEmergencyAlert(user.email, user.name, disaster);
            }
          }
        }
      } catch (alertError) {
        console.error('Error creating alert:', alertError);
        // Don't fail the verification if alert creation fails
      }

      // Send notification messages to all citizens and volunteers
      try {
        await notifyDisasterVerified(disaster, req.user.id);
      } catch (notifyError) {
        console.error('Error sending notifications:', notifyError);
        // Don't fail the verification if notification fails
      }
    }

    await disaster.save();

    res.json({
      success: true,
      data: disaster,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get disasters near location
// @route   GET /api/disasters/nearby
// @access  Public
exports.getNearbyDisasters = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 50000 } = req.query; // maxDistance in meters

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: 'Please provide longitude and latitude',
      });
    }

    const disasters = await Disaster.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
      status: { $in: ['verified', 'active'] },
    })
      .populate('reportedBy', 'name email')
      .limit(50);

    res.json({
      success: true,
      count: disasters.length,
      data: disasters,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete disaster
// @route   DELETE /api/disasters/:id
// @access  Private (Admin)
exports.deleteDisaster = async (req, res) => {
  try {
    const disaster = await Disaster.findById(req.params.id);

    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: 'Disaster not found',
      });
    }

    await disaster.deleteOne();

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

