const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/wealthcon', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

async function createSuperAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@wealthcon.com' });
    if (existingAdmin) {
      console.log('✓ SuperAdmin already exists');
      process.exit(0);
    }

    // Create superadmin user
    const superAdmin = new User({
      email: 'admin@wealthcon.com',
      password: 'Admin@1234',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'superAdmin',
      isActive: true,
    });

    await superAdmin.save();
    console.log('✓ SuperAdmin created successfully!');
    console.log('📧 Email: admin@wealthcon.com');
    console.log('🔐 Password: Admin@1234');
    process.exit(0);
  } catch (error) {
    console.error('Error creating superadmin:', error.message);
    process.exit(1);
  }
}

createSuperAdmin();
