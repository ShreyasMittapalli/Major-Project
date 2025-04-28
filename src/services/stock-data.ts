
import axios from 'axios';

export interface StockData {
  ticker: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: string;
}

export interface HistoricalData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

class StockDataService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.STOCK_API_KEY || '';
    this.baseUrl = process.env.STOCK_API_BASE_URL || '';
  }

  async getStockData(ticker: string): Promise<StockData> {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    try {
      // This will be implemented based on the chosen API provider
      throw new Error('API provider not configured');
    } catch (error) {
      console.error('Error fetching stock data:', error);
      throw error;
    }
  }

  async getHistoricalData(ticker: string, days: number = 30): Promise<HistoricalData[]> {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    try {
      // This will be implemented based on the chosen API provider
      throw new Error('API provider not configured');
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }
}

export const stockDataService = new StockDataService();
