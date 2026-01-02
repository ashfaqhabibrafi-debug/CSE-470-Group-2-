const mongoose = require('mongoose');

const donationEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    targetAmount: {
      type: Number,
      default: 0,
    },
    targetItems: {
      type: Map,
      of: Number,
      default: {},
    },
    collectedAmount: {
      type: Number,
      default: 0,
    },
    collectedItems: {
      type: Map,
      of: Number,
      default: {},
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled'],
      default: 'active',
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
    image: String,
    location: {
      address: String,
      city: String,
      state: String,
      country: String,
    },
  },
  {
    timestamps: true,
  }
);

donationEventSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('DonationEvent', donationEventSchema);

