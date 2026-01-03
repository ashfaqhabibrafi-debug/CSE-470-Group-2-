const Donation = require('../models/Donation');
const DonationEvent = require('../models/DonationEvent');
const { notifyDonationStatusChange } = require('../utils/notificationService');

// @desc    Get all donations
// @route   GET /api/donations
// @access  Public
exports.getDonations = async (req, res) => {
  try {
    const { event, donor, status } = req.query;
    let query = {};

    if (event) query.event = event;
    if (donor) query.donor = donor;
    if (status) query.status = status;

    const donations = await Donation.find(query)
      .populate('donor', 'name email')
      .populate('event', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get donation statistics
// @route   GET /api/donations/stats
// @access  Private (Admin)
exports.getDonationStats = async (req, res) => {
  try {
    // Get all confirmed and delivered donations (excluding cancelled)
    const donations = await Donation.find({
      status: { $in: ['confirmed', 'delivered'] }
    });

    // Calculate total money donated
    const totalMoney = donations
      .filter(d => d.donationType === 'money')
      .reduce((sum, d) => sum + (d.amount || 0), 0);

    // Calculate total items by type
    const itemsByType = {};
    donations
      .filter(d => d.donationType !== 'money')
      .forEach(donation => {
        const type = donation.donationType;
        if (!itemsByType[type]) {
          itemsByType[type] = {
            type,
            totalQuantity: 0,
            donations: []
          };
        }
        itemsByType[type].totalQuantity += donation.quantity || 1;
        itemsByType[type].donations.push({
          itemDescription: donation.itemDescription,
          quantity: donation.quantity || 1
        });
      });

    // Get total donations count
    const totalDonations = donations.length;

    // Get donations by status
    const donationsByStatus = await Donation.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get donations by type
    const donationsByType = await Donation.aggregate([
      {
        $group: {
          _id: '$donationType',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    // Get recent donations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentDonations = await Donation.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
      status: { $in: ['confirmed', 'delivered'] }
    });

    res.json({
      success: true,
      data: {
        totalMoney,
        totalItemsByType: Object.values(itemsByType),
        totalDonations,
        donationsByStatus: donationsByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        donationsByType: donationsByType.reduce((acc, item) => {
          acc[item._id] = {
            count: item.count,
            totalAmount: item.totalAmount || 0
          };
          return acc;
        }, {}),
        recentDonations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create donation
// @route   POST /api/donations
// @access  Private
exports.createDonation = async (req, res) => {
  try {
    const { donationType, amount, itemDescription, quantity, event, deliveryAddress, notes } = req.body;

    const donation = await Donation.create({
      donor: req.user.id,
      donationType,
      amount: amount || 0,
      itemDescription,
      quantity: quantity || 1,
      event,
      deliveryAddress,
      notes,
    });

    // Update event totals if event is specified
    if (event) {
      const donationEvent = await DonationEvent.findById(event);
      if (donationEvent) {
        if (donationType === 'money') {
          donationEvent.collectedAmount += amount || 0;
        } else {
          const current = donationEvent.collectedItems.get(itemDescription) || 0;
          donationEvent.collectedItems.set(itemDescription, current + (quantity || 1));
        }

        // Check if goals are met and mark as completed
        let goalsMet = true;

        // Check money goal
        if (donationEvent.targetAmount > 0 && donationEvent.collectedAmount < donationEvent.targetAmount) {
          goalsMet = false;
        }

        // Check item goals
        if (donationEvent.targetItems && donationEvent.targetItems.size > 0) {
          for (const [item, target] of donationEvent.targetItems.entries()) {
            const collected = donationEvent.collectedItems.get(item) || 0;
            if (collected < target) {
              goalsMet = false;
              break;
            }
          }
        }

        // Update status to completed if all goals are met
        if (goalsMet && donationEvent.status === 'active') {
          donationEvent.status = 'completed';
        }

        await donationEvent.save();
      }
    }

    const populated = await Donation.findById(donation._id)
      .populate('donor', 'name email')
      .populate('event', 'title');

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

// @desc    Update donation status
// @route   PUT /api/donations/:id/status
// @access  Private (Admin)
exports.updateDonationStatus = async (req, res) => {
  try {
    const { status, transactionId } = req.body;
    const donation = await Donation.findById(req.params.id);

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    const oldStatus = donation.status;
    donation.status = status;
    if (transactionId) donation.transactionId = transactionId;

    await donation.save();

    // Notify donor if status changed to confirmed or delivered
    if ((status === 'confirmed' || status === 'delivered') && oldStatus !== status) {
      await notifyDonationStatusChange(donation, req.user.id);
    }

    res.json({
      success: true,
      data: donation,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get donation by ID
// @route   GET /api/donations/:id
// @access  Public
exports.getDonation = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email phone address')
      .populate('event', 'title description');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found',
      });
    }

    res.json({
      success: true,
      data: donation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
