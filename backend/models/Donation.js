const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    donationType: {
      type: String,
      enum: ['money', 'clothes', 'medicine', 'food', 'other'],
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },
    itemDescription: {
      type: String,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DonationEvent',
    },
    status: {
      type: String,
      enum: ['pledged', 'confirmed', 'delivered', 'cancelled'],
      default: 'pledged',
    },
    transactionId: String,
    deliveryAddress: {
      type: String,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

donationSchema.index({ donor: 1, createdAt: -1 });
donationSchema.index({ event: 1, status: 1 });

module.exports = mongoose.model('Donation', donationSchema);

