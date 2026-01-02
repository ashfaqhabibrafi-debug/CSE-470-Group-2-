const mongoose = require('mongoose');

const disasterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a disaster title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    type: {
      type: String,
      enum: ['flood', 'earthquake', 'fire', 'cyclone', 'tsunami', 'drought', 'landslide', 'other'],
      required: true,
    },
    severity: {
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
      city: String,
      state: String,
      country: String,
    },
    photos: {
      type: [String],
      default: [],
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'active', 'resolved', 'rejected'],
      default: 'pending',
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: Date,
    resolvedAt: Date,
    affectedCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
disasterSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Disaster', disasterSchema);

