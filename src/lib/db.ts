
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/algotrade';

export async function connectDB() {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
      });
      console.log('Connected to MongoDB');
    }
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
