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

// Mock data for portfolio holdings
const holdings = [
  { ticker: 'AAPL', quantity: 50, avgPrice: 165.00, currentPrice: 175.50 },
  { ticker: 'MSFT', quantity: 25, avgPrice: 290.50, currentPrice: 305.25 },
  { ticker: 'NVDA', quantity: 10, avgPrice: 700.00, currentPrice: 780.30 },
   { ticker: 'GOOGL', quantity: 5, avgPrice: 2750.00, currentPrice: 2850.00 },
    { ticker: 'TSLA', quantity: 15, avgPrice: 800.00, currentPrice: 750.10 }, // Example of a loss
];

export function PortfolioHoldings() {

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
        {holdings.map((holding) => {
           const totalValue = calculateTotalValue(holding);
           const gainLoss = calculateGainLoss(holding);
           const gainLossPercent = calculateGainLossPercent(holding);
           const isGain = gainLoss >= 0;

          return (
          <TableRow key={holding.ticker}>
            <TableCell className="font-medium">{holding.ticker}</TableCell>
            <TableCell className="text-right">{holding.quantity}</TableCell>
            <TableCell className="text-right">${holding.avgPrice.toFixed(2)}</TableCell>
             <TableCell className="text-right">${holding.currentPrice.toFixed(2)}</TableCell>
             <TableCell className="text-right">${totalValue.toFixed(2)}</TableCell>
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
