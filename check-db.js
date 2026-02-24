const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function checkDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/wealthcon', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const userSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.model('User', userSchema, 'users');

    const adminUser = await User.findOne({ email: 'admin@test.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found in database');
    } else {
      console.log('✓ Admin user found');
      console.log('  Email:', adminUser.email);
      console.log('  Password field:', adminUser.password ? '✓ Exists' : '❌ Missing');
      console.log('  Password hash:', adminUser.password ? adminUser.password.substring(0, 20) + '...' : 'N/A');
      console.log('  Password length:', adminUser.password ? adminUser.password.length : 0);
      
      // Test bcrypt
      const isMatch = await bcrypt.compare('Admin@123', adminUser.password);
      console.log('  bcrypt.compare("Admin@123", hash):', isMatch ? '✓ MATCH' : '❌ NO MATCH');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDB();
