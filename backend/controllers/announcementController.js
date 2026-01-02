const Announcement = require('../models/Announcement');

// @desc    Get all published announcements
// @route   GET /api/announcements
// @access  Public
exports.getAnnouncements = async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isPublished: true };

    if (category) query.category = category;

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'name')
      .sort({ publishedAt: -1, createdAt: -1 });

    res.json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private (Admin)
exports.createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create({
      ...req.body,
      createdBy: req.user.id,
    });

    const populated = await Announcement.findById(announcement._id)
      .populate('createdBy', 'name email');

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

// @desc    Publish announcement
// @route   PUT /api/announcements/:id/publish
// @access  Private (Admin)
exports.publishAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found',
      });
    }

    announcement.isPublished = true;
    announcement.publishedAt = new Date();
    await announcement.save();

    res.json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

