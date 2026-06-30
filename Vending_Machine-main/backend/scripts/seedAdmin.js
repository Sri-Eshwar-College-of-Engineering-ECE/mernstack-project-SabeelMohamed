const mongoose = require('mongoose');
const path = require('path');
const User = require('../models/User');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected');

    // Check if admin already exists
    const adminExists = await User.findOne({ email: 'sabeel@gmail.com' });

    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'sabeel@gmail.com',
      password: 'Sabeel@18',
      role: 'admin'
    });

    console.log('Admin user created successfully');
    console.log(`Email: ${admin.email}`);
    console.log(`Role: ${admin.role}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
