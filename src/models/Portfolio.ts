
import mongoose from 'mongoose';

const PositionSchema = new mongoose.Schema({
  symbol: String,
  quantity: Number,
  averagePrice: Number,
  currentPrice: Number,
  totalValue: Number,
  unrealizedPnL: Number,
});

const PortfolioSchema = new mongoose.Schema({
  userId: String,
  cash: { type: Number, default: 100000 }, // Starting with $100k
  positions: [PositionSchema],
  totalValue: Number,
  lastUpdated: Date,
});

export const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);
