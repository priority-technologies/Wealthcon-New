const mongoose = require('mongoose');

async function checkDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/wealthcon', {
    });

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    console.log('Collections in wealthcon database:');
    collections.forEach(c => console.log('  -', c.name));

    if (collections.some(c => c.name === 'users')) {
      const usersCount = await db.collection('users').countDocuments();
      console.log(`\nUsers collection has ${usersCount} documents`);
      
      if (usersCount > 0) {
        const firstUser = await db.collection('users').findOne();
        console.log('First user:', JSON.stringify(firstUser, null, 2).substring(0, 200));
      }
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkDB();
