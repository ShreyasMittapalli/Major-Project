
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/algotrade';

export async function connectDB() {
  try {
    if (!mongoose.connection.readyState) {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
      });
      console.log('Connected to MongoDB');
      
      // Initialize demo portfolio if it doesn't exist
      const Portfolio = mongoose.models.Portfolio;
      const existingPortfolio = await Portfolio.findOne({ userId: 'demo-user' });
      if (!existingPortfolio) {
        await Portfolio.create({
          userId: 'demo-user',
          cash: 100000,
          positions: [],
          totalValue: 100000,
          lastUpdated: new Date()
        });
      }
    }
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
