const mongoose = require('mongoose');
const path = require('path');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/wealthcon', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User Schema inline
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  role: String,
  isActive: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createTestUser() {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'test@wealthcon.com' });
    if (existingUser) {
      console.log('✓ Test user already exists');
      process.exit(0);
    }

    // Create test user
    const testUser = new User({
      email: 'test@wealthcon.com',
      password: 'Test@1234',
      firstName: 'Test',
      lastName: 'User',
      role: 'doctor',
      isActive: true,
    });

    await testUser.save();
    console.log('✓ Test user created successfully!');
    console.log('📧 Email: test@wealthcon.com');
    console.log('🔐 Password: Test@1234');
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error.message);
    process.exit(1);
  }
}

createTestUser();
