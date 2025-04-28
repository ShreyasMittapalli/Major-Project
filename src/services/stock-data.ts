
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
    this.apiKey = process.env.ALPHA_VANTAGE_API_KEY || '';
    this.baseUrl = 'https://www.alphavantage.co/query';
  }

  async getStockData(ticker: string): Promise<StockData> {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    try {
      const response = await axios.get(`${this.baseUrl}`, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: ticker,
          apikey: this.apiKey
        }
      });

      const quote = response.data['Global Quote'];
      return {
        ticker: ticker,
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        timestamp: new Date().toISOString()
      };
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
      const response = await axios.get(`${this.baseUrl}`, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: ticker,
          outputsize: 'compact',
          apikey: this.apiKey
        }
      });

      const timeSeries = response.data['Time Series (Daily)'];
      return Object.entries(timeSeries)
        .slice(0, days)
        .map(([date, data]: [string, any]) => ({
          date,
          open: parseFloat(data['1. open']),
          high: parseFloat(data['2. high']),
          low: parseFloat(data['3. low']),
          close: parseFloat(data['4. close']),
          volume: parseInt(data['5. volume'])
        }));
    } catch (error) {
      console.error('Error fetching historical data:', error);
      throw error;
    }
  }
}

export const stockDataService = new StockDataService();
