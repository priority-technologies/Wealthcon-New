import mongoose from "mongoose";

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    // console.log('Already connected to the database');
    return mongoose;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);

    isConnected = true;
    console.info('Connected to the database');
    return db;
  } catch (error) {
    console.error('Error connecting to the database:', error.message);
    throw new Error('Database connection failed');
  }
}

export default connectToDatabase;
