const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['sos', 'disaster', 'update', 'general'],
      default: 'general',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    disaster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disaster',
    },
    targetRegion: {
      type: {
        type: String,
        enum: ['Point'],
      },
      coordinates: [Number],
      radius: Number, // in kilometers
    },
    targetUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sentVia: {
      type: [String],
      enum: ['email', 'push', 'sms', 'in-app'],
      default: ['in-app'],
    },
    sentAt: Date,
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

alertSchema.index({ createdAt: -1 });
alertSchema.index({ type: 1, priority: 1 });

module.exports = mongoose.model('Alert', alertSchema);

