
import { Portfolio } from '@/models/Portfolio';
import { stockDataService } from './stock-data';

export class PortfolioService {
  async getPortfolio(userId: string) {
    let portfolio = await Portfolio.findOne({ userId });
    if (!portfolio) {
      portfolio = await Portfolio.create({
        userId,
        cash: 100000,
        positions: [],
        totalValue: 100000,
      });
    }
    return portfolio;
  }

  async executeTrade(userId: string, symbol: string, type: 'buy' | 'sell', quantity: number, price: number) {
    const portfolio = await this.getPortfolio(userId);
    const total = quantity * price;
    
    if (type === 'buy' && portfolio.cash < total) {
      throw new Error('Insufficient funds');
    }

    const position = portfolio.positions.find(p => p.symbol === symbol);
    
    if (type === 'sell' && (!position || position.quantity < quantity)) {
      throw new Error('Insufficient shares');
    }

    if (type === 'buy') {
      if (position) {
        position.quantity += quantity;
        position.averagePrice = ((position.quantity - quantity) * position.averagePrice + total) / position.quantity;
      } else {
        portfolio.positions.push({
          symbol,
          quantity,
          averagePrice: price,
          currentPrice: price,
          totalValue: total,
          unrealizedPnL: 0,
        });
      }
      portfolio.cash -= total;
    } else {
      position!.quantity -= quantity;
      if (position!.quantity === 0) {
        portfolio.positions = portfolio.positions.filter(p => p.symbol !== symbol);
      }
      portfolio.cash += total;
    }

    portfolio.totalValue = portfolio.cash + portfolio.positions.reduce((sum, pos) => sum + pos.totalValue, 0);
    portfolio.lastUpdated = new Date();
    await portfolio.save();
    
    return portfolio;
  }

  async updatePrices(userId: string) {
    const portfolio = await this.getPortfolio(userId);
    
    for (const position of portfolio.positions) {
      const data = await stockDataService.getStockData(position.symbol);
      position.currentPrice = data.price;
      position.totalValue = position.quantity * position.currentPrice;
      position.unrealizedPnL = position.totalValue - (position.quantity * position.averagePrice);
    }

    portfolio.totalValue = portfolio.cash + portfolio.positions.reduce((sum, pos) => sum + pos.totalValue, 0);
    portfolio.lastUpdated = new Date();
    await portfolio.save();
    
    return portfolio;
  }
}

export const portfolioService = new PortfolioService();
