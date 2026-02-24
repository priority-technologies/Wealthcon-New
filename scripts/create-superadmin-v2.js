const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/wealthcon', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  userId: { type: String, unique: true, required: true },
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  role: { type: String, required: true },
  mobile: { type: Number, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.model('Users', userSchema);

async function createSuperAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@wealthcon.com' });
    if (existingAdmin) {
      console.log('✓ SuperAdmin already exists');
      console.log('📧 Email: admin@wealthcon.com');
      console.log('🔐 Password: Admin@1234');
      process.exit(0);
    }

    // Create unique userId
    const userId = 'admin_' + Date.now();

    // Create superadmin user
    const superAdmin = new User({
      userId: userId,
      username: 'superadmin',
      email: 'admin@wealthcon.com',
      password: 'Admin@1234',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'superAdmin',
      mobile: 9999999999,
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
