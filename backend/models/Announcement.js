const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['safety_guidelines', 'government_notice', 'update', 'general'],
      default: 'general',
    },
    image: String,
    link: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: Date,
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

announcementSchema.index({ isPublished: 1, createdAt: -1 });

module.exports = mongoose.model('Announcement', announcementSchema);

