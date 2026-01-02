const Organization = require('../models/Organization');
const { notifyOrganizationCreated, notifyOrganizationVerified } = require('../utils/notificationService');

// @desc    Get all organizations
// @route   GET /api/organizations
// @access  Public
exports.getOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find({ isVerified: true }).sort({ name: 1 });

    res.json({
      success: true,
      count: organizations.length,
      data: organizations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all organizations (including unverified) - Admin only
// @route   GET /api/organizations/all
// @access  Private (Admin)
exports.getAllOrganizations = async (req, res) => {
  try {
    const organizations = await Organization.find().sort({ name: 1 });

    res.json({
      success: true,
      count: organizations.length,
      data: organizations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single organization
// @route   GET /api/organizations/:id
// @access  Public
exports.getOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    res.json({
      success: true,
      data: organization,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create organization
// @route   POST /api/organizations
// @access  Private (Admin)
exports.createOrganization = async (req, res) => {
  try {
    const organization = await Organization.create(req.body);

    // Organizations created by admin are automatically verified
    // But if isVerified is false, notify admins for verification
    if (!organization.isVerified) {
      try {
        await notifyOrganizationCreated(organization, req.user.id);
      } catch (notifyError) {
        console.error('Error sending notification to admins:', notifyError);
      }
    } else {
      // If automatically verified, notify users
      try {
        await notifyOrganizationVerified(organization, req.user.id);
      } catch (notifyError) {
        console.error('Error sending notifications:', notifyError);
      }
    }

    res.status(201).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update organization
// @route   PUT /api/organizations/:id
// @access  Private (Admin)
exports.updateOrganization = async (req, res) => {
  try {
    const oldOrganization = await Organization.findById(req.params.id);
    const organization = await Organization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    // If organization was just verified (wasn't verified before, now is)
    if (oldOrganization && !oldOrganization.isVerified && organization.isVerified) {
      try {
        await notifyOrganizationVerified(organization, req.user.id);
      } catch (notifyError) {
        console.error('Error sending notifications:', notifyError);
        // Don't fail the update if notification fails
      }
    }

    res.json({
      success: true,
      data: organization,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete organization
// @route   DELETE /api/organizations/:id
// @access  Private (Admin)
exports.deleteOrganization = async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found',
      });
    }

    await organization.deleteOne();

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
