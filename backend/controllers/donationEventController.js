const DonationEvent = require('../models/DonationEvent');
const Organization = require('../models/Organization');
const { notifyDonationEventCreated } = require('../utils/notificationService');

// @desc    Get all donation events
// @route   GET /api/donation-events
// @access  Public
exports.getDonationEvents = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) query.status = status;

    const events = await DonationEvent.find(query)
      .populate('createdBy', 'name email')
      .populate('organization', 'name logo')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single donation event
// @route   GET /api/donation-events/:id
// @access  Public
exports.getDonationEvent = async (req, res) => {
  try {
    const event = await DonationEvent.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('organization', 'name logo description');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Donation event not found',
      });
    }

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create donation event
// @route   POST /api/donation-events
// @access  Private (Admin)
exports.createDonationEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      targetAmount,
      targetItems,
      organization,
      endDate,
      image,
      location,
    } = req.body;

    const event = await DonationEvent.create({
      title,
      description,
      targetAmount: targetAmount || 0,
      targetItems: targetItems || {},
      createdBy: req.user.id,
      organization,
      endDate,
      image,
      location,
    });

    const populated = await DonationEvent.findById(event._id)
      .populate('createdBy', 'name email')
      .populate('organization', 'name');

    // Send notification messages to all citizens and volunteers
    try {
      await notifyDonationEventCreated(populated, req.user.id);
    } catch (notifyError) {
      console.error('Error sending notifications:', notifyError);
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

// @desc    Update donation event
// @route   PUT /api/donation-events/:id
// @access  Private (Admin)
exports.updateDonationEvent = async (req, res) => {
  try {
    let event = await DonationEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Donation event not found',
      });
    }

    event = await DonationEvent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('organization', 'name logo');

    res.json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete donation event
// @route   DELETE /api/donation-events/:id
// @access  Private (Admin)
exports.deleteDonationEvent = async (req, res) => {
  try {
    const event = await DonationEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Donation event not found',
      });
    }

    await event.deleteOne();

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

