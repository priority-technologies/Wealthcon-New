const mongoose = require('mongoose');

async function cleanup() {
  try {
    await mongoose.connect('mongodb://localhost:27017/wealthcon');
    const db = mongoose.connection.db;
    
    await db.collection('users').deleteMany({ 
      email: { $in: ['test@wealthcon.com', 'admin@test.com', 'user@test.com'] } 
    });
    
    console.log('✓ Old test users deleted');
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

cleanup();
