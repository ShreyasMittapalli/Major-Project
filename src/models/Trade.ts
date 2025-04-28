
import mongoose from 'mongoose';

const TradeSchema = new mongoose.Schema({
  userId: String,
  symbol: String,
  type: { type: String, enum: ['buy', 'sell'] },
  quantity: Number,
  price: Number,
  timestamp: { type: Date, default: Date.now },
  total: Number,
  status: { type: String, enum: ['pending', 'completed', 'failed'] },
});

export const Trade = mongoose.models.Trade || mongoose.model('Trade', TradeSchema);
