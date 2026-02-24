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
});

const User = mongoose.model('User', userSchema);

async function checkUser() {
  try {
    const user = await User.findOne({ email: 'test@wealthcon.com' });
    if (user) {
      console.log('✓ User found in database');
      console.log('Email:', user.email);
      console.log('Password:', user.password);
      console.log('Active:', user.isActive);
    } else {
      console.log('✗ User NOT found - need to create it');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkUser();
