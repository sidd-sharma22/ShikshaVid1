const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');

const getArgValue = (flag) => {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index === process.argv.length - 1) return undefined;
  return process.argv[index + 1];
};

const createOrUpdateAdmin = async () => {
  const email = getArgValue('--email') || process.env.ADMIN_EMAIL || 'admin@shikshavid.com';
  const password = getArgValue('--password') || process.env.ADMIN_PASSWORD;
  const name = getArgValue('--name') || process.env.ADMIN_NAME || 'Admin';
  const phone = getArgValue('--phone') || process.env.ADMIN_PHONE || '9999999999';

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required');
  }
  if (!password || password.length < 6) {
    throw new Error('ADMIN_PASSWORD (or --password) is required and must be at least 6 characters');
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await User.findOne({ email }).select('+password');
  if (existing) {
    existing.name = name;
    existing.phone = phone;
    existing.role = 'admin';
    existing.isActive = true;
    existing.password = password;
    await existing.save();
    console.log(`Admin updated for ${email}`);
  } else {
    await User.create({
      name,
      email,
      password,
      role: 'admin',
      phone,
      isActive: true
    });
    console.log(`Admin created for ${email}`);
  }
};

createOrUpdateAdmin()
  .then(async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Create admin failed:', error.message);
    try {
      await mongoose.connection.close();
    } catch {}
    process.exit(1);
  });
