const mongoose = require('mongoose');

const helpRequestSchema = new mongoose.Schema(
  {
    disaster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Disaster',
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    requestType: {
      type: [String],
      enum: ['food', 'water', 'shelter', 'medical', 'rescue', 'clothing', 'other'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    urgency: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        index: '2dsphere',
      },
      address: String,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'matched', 'in-progress', 'completed', 'cancelled', 'rejected'],
      default: 'pending',
    },
    matchedVolunteer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    matchedAt: Date,
    completedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: Date,
    quantity: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
helpRequestSchema.index({ location: '2dsphere' });
helpRequestSchema.index({ disaster: 1, status: 1 });
helpRequestSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('HelpRequest', helpRequestSchema);
