const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/wealthcon', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sessionSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  token: String,
  lastLoginAt: Date,
}, { timestamps: true });

const Session = mongoose.model('Sessions', sessionSchema);

async function checkSession() {
  try {
    const sessions = await Session.find().lean();
    console.log('Sessions in database:', sessions.length);
    sessions.forEach(s => {
      console.log(`- User: ${s.userId}, Token: ${s.token.substring(0, 20)}...`);
    });
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkSession();
