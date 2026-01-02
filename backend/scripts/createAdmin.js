const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!');
      console.log('Email: admin@example.com');
      console.log('To create a new admin, use a different email or delete the existing one.\n');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('✅ Admin created successfully!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:    admin@example.com');
    console.log('Password: admin123456');
    console.log('Role:     admin');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('⚠️  IMPORTANT: Change the password after first login!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 11000) {
      console.log('\n⚠️  Admin with this email already exists!');
    }
    process.exit(1);
  }
};

createAdmin();

