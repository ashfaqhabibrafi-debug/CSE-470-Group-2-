const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: String,
    website: String,
    logo: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    contactPerson: {
      name: String,
      email: String,
      phone: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Organization', organizationSchema);

