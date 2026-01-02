const Alert = require('../models/Alert');
const User = require('../models/User');
const Disaster = require('../models/Disaster');
const { sendEmergencyAlert } = require('../utils/emailService');

// @desc    Get all alerts
// @route   GET /api/alerts
// @access  Private
exports.getAlerts = async (req, res) => {
  try {
    const { type, priority } = req.query;
    let query = {};

    if (type) query.type = type;
    if (priority) query.priority = priority;

    // If user is not admin, only show alerts sent to them or in their region
    if (req.user.role !== 'admin') {
      query.$or = [
        { targetUsers: req.user.id },
        { targetUsers: { $size: 0 } }, // Public alerts
      ];
    }

    const alerts = await Alert.find(query)
      .populate('disaster', 'title type severity')
      .populate('sentBy', 'name')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user's alerts
// @route   GET /api/alerts/my-alerts
// @access  Private
exports.getMyAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({
      $or: [
        { targetUsers: req.user.id },
        { targetUsers: { $size: 0 } },
      ],
    })
      .populate('disaster', 'title type severity location')
      .populate('sentBy', 'name')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create alert
// @route   POST /api/alerts
// @access  Private (Admin)
exports.createAlert = async (req, res) => {
  try {
    const { title, message, type, priority, disaster, targetRegion, targetUsers, sentVia } = req.body;

    const alert = await Alert.create({
      title,
      message,
      type: type || 'general',
      priority: priority || 'medium',
      disaster,
      targetRegion,
      targetUsers: targetUsers || [],
      sentBy: req.user.id,
      sentVia: sentVia || ['in-app'],
      sentAt: new Date(),
    });

    // Send emails if requested
    if (sentVia && sentVia.includes('email')) {
      await sendAlertEmails(alert, targetUsers);
    }

    const populated = await Alert.findById(alert._id)
      .populate('disaster', 'title type')
      .populate('sentBy', 'name');

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

// Helper function to send alert emails
const sendAlertEmails = async (alert, targetUserIds) => {
  if (!targetUserIds || targetUserIds.length === 0) return;

  try {
    const users = await User.find({ _id: { $in: targetUserIds } }).select('email name');
    
    for (const user of users) {
      if (user.email) {
        await sendEmergencyAlert(user.email, user.name, alert.disaster || { title: alert.title, description: alert.message });
      }
    }
  } catch (error) {
    console.error('Error sending alert emails:', error);
  }
};

// @desc    Get alert by ID
// @route   GET /api/alerts/:id
// @access  Private
exports.getAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id)
      .populate('disaster', 'title type severity location')
      .populate('sentBy', 'name email')
      .populate('targetUsers', 'name email');

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found',
      });
    }

    res.json({
      success: true,
      data: alert,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create emergency alert for verified disaster
// @route   POST /api/alerts/disaster/:disasterId
// @access  Private (Admin)
exports.createDisasterAlert = async (req, res) => {
  try {
    const disaster = await Disaster.findById(req.params.disasterId);

    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: 'Disaster not found',
      });
    }

    // Find users in the affected region
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

    const populated = await Alert.findById(alert._id)
      .populate('disaster', 'title type severity')
      .populate('sentBy', 'name');

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

