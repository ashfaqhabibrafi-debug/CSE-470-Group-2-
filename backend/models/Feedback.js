const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Target can be a volunteer (User), donation event, or organization
    targetType: {
      type: String,
      enum: ['volunteer', 'donationEvent', 'organization'],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'targetTypeModel',
    },
    targetTypeModel: {
      type: String,
      enum: ['User', 'DonationEvent', 'Organization'],
      required: true,
    },
    // Keep 'to' for backward compatibility (for volunteer feedbacks)
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    donationEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DonationEvent',
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
    },
    helpRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'HelpRequest',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['response_time', 'helpfulness', 'communication', 'overall', 'service', 'impact'],
      default: 'overall',
    },
  },
  {
    timestamps: true,
  }
);

feedbackSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });
feedbackSchema.index({ to: 1, createdAt: -1 });
feedbackSchema.index({ donationEvent: 1, createdAt: -1 });
feedbackSchema.index({ organization: 1, createdAt: -1 });
feedbackSchema.index({ helpRequest: 1 });

module.exports = mongoose.model('Feedback', feedbackSchema);

