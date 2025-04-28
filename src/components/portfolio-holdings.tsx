import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from 'lucide-react';

'use client';

import { useState, useEffect } from 'react';

interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  unrealizedPnL: number;
}

interface Portfolio {
  positions: Position[];
  cash: number;
  totalValue: number;
}

export function PortfolioHoldings() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('/api/portfolio');
        const data = await response.json();
        setPortfolio(data);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPortfolio, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading portfolio...</div>;
  }

  if (!portfolio) {
    return <div>No portfolio data available.</div>;
  }

  const calculateTotalValue = (holding: typeof holdings[0]) => {
    return holding.quantity * holding.currentPrice;
  };

  const calculateGainLoss = (holding: typeof holdings[0]) => {
    return (holding.currentPrice - holding.avgPrice) * holding.quantity;
  };

   const calculateGainLossPercent = (holding: typeof holdings[0]) => {
     if (holding.avgPrice === 0) return 0;
    return ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
  };


  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[80px]">Ticker</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead className="text-right">Avg Price</TableHead>
          <TableHead className="text-right">Current Price</TableHead>
           <TableHead className="text-right">Total Value</TableHead>
          <TableHead className="text-right">Gain/Loss</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {portfolio.positions.map((position) => {
           const gainLoss = position.unrealizedPnL;
           const gainLossPercent = (gainLoss / (position.totalValue - gainLoss)) * 100;
           const isGain = gainLoss >= 0;

          return (
          <TableRow key={holding.ticker}>
            <TableCell className="font-medium">{position.symbol}</TableCell>
            <TableCell className="text-right">{position.quantity}</TableCell>
            <TableCell className="text-right">${position.averagePrice.toFixed(2)}</TableCell>
            <TableCell className="text-right">${position.currentPrice.toFixed(2)}</TableCell>
            <TableCell className="text-right">${position.totalValue.toFixed(2)}</TableCell>
            <TableCell className={`text-right font-medium ${isGain ? 'text-green-600' : 'text-red-600'}`}>
               <div className="flex items-center justify-end gap-1">
                {isGain ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span>{isGain ? '+' : ''}${gainLoss.toFixed(2)}</span>
               </div>
                <span className="text-xs">({isGain ? '+' : ''}{gainLossPercent.toFixed(2)}%)</span>
            </TableCell>
          </TableRow>
        )})}
      </TableBody>
      <TableCaption>Your current stock positions.</TableCaption>
    </Table>
  );
}
