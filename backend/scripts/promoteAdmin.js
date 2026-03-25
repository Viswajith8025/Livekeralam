const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../src/models/User');

dotenv.config();

const promoteEmail = 'admin@gmail.com'; // Change this if needed

const promoteAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const user = await User.findOneAndUpdate(
      { email: promoteEmail },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log(`Successfully promoted ${promoteEmail} to ADMIN.`);
    } else {
      console.log(`User with email ${promoteEmail} not found. Register first!`);
    }

    process.exit();
  } catch (error) {
    console.error('Promotion failed:', error);
    process.exit(1);
  }
};

promoteAdmin();
