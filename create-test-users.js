const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  role: { type: String, enum: ['admin', 'superAdmin', 'lot1', 'lot2', 'lot3', 'lot4', 'lot5', 'lot6', 'lot7', 'lot8', 'lot9', 'lot10', 'lot11', 'lot12', 'lot13', 'lot14', 'lot15'], default: 'lot1', required: true },
  mobile: { type: Number, required: true },
  district: String,
  state: String,
  profilePicture: String,
}, { collection: 'users' });

const User = mongoose.model('User', userSchema);

async function createTestUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/wealthcon');
    console.log('✓ Connected to MongoDB');

    // Delete existing test users
    await User.deleteMany({ email: { $in: ['admin@wealthcon.com', 'user@wealthcon.com'] } });
    console.log('✓ Cleaned up old test users');

    // Create test users with unique IDs
    const result = await User.insertMany([
      {
        userId: 'admin_' + crypto.randomBytes(8).toString('hex'),
        username: 'admin',
        email: 'admin@wealthcon.com',
        password: 'Admin@1234',
        role: 'admin',
        mobile: 9876543210,
        district: 'Test District',
        state: 'Test State',
      },
      {
        userId: 'user_' + crypto.randomBytes(8).toString('hex'),
        username: 'user',
        email: 'user@wealthcon.com',
        password: 'User@1234',
        role: 'lot1',
        mobile: 9123456789,
        district: 'Test District',
        state: 'Test State',
      },
    ]);

    console.log('✅ Test users created successfully!\n');
    console.log('═══════════════════════════════════════');
    console.log('📝 LOGIN CREDENTIALS');
    console.log('═══════════════════════════════════════');
    console.log('\n🔐 ADMIN ACCOUNT:');
    console.log('   Email:    admin@wealthcon.com');
    console.log('   Password: Admin@1234');
    console.log('   Role:     admin (Full access)');
    console.log('\n👤 USER ACCOUNT:');
    console.log('   Email:    user@wealthcon.com');
    console.log('   Password: User@1234');
    console.log('   Role:     lot1 (Student access)');
    console.log('\n═══════════════════════════════════════\n');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

createTestUsers();
