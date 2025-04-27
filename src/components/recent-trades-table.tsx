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
import { format } from 'date-fns';

// Mock data for recent trades
const trades = [
  { id: 'T001', ticker: 'AAPL', type: 'Buy', quantity: 10, price: 175.50, timestamp: new Date(2024, 6, 20, 10, 30), status: 'Filled' },
  { id: 'T002', ticker: 'GOOGL', type: 'Sell', quantity: 5, price: 2850.00, timestamp: new Date(2024, 6, 20, 9, 15), status: 'Filled' },
  { id: 'T003', ticker: 'MSFT', type: 'Buy', quantity: 8, price: 305.25, timestamp: new Date(2024, 6, 19, 14, 0), status: 'Filled' },
  { id: 'T004', ticker: 'AMZN', type: 'Buy', quantity: 2, price: 3400.75, timestamp: new Date(2024, 6, 19, 11, 45), status: 'Pending' },
  { id: 'T005', ticker: 'TSLA', type: 'Sell', quantity: 15, price: 750.10, timestamp: new Date(2024, 6, 18, 15, 55), status: 'Filled' },
];

export function RecentTradesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Ticker</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Quantity</TableHead>
          <TableHead className="text-right">Price</TableHead>
          <TableHead>Timestamp</TableHead>
           <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trades.map((trade) => (
          <TableRow key={trade.id}>
            <TableCell className="font-medium">{trade.ticker}</TableCell>
            <TableCell>
               <Badge variant={trade.type === 'Buy' ? 'default' : 'destructive'} className={trade.type === 'Buy' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}>
                {trade.type}
              </Badge>
            </TableCell>
            <TableCell className="text-right">{trade.quantity}</TableCell>
            <TableCell className="text-right">${trade.price.toFixed(2)}</TableCell>
            <TableCell>{format(trade.timestamp, 'Pp')}</TableCell>
            <TableCell className="text-right">
                 <Badge variant={trade.status === 'Filled' ? 'secondary' : 'outline'} className={trade.status === 'Filled' ? 'bg-gray-200 text-gray-800' : 'border-yellow-500 text-yellow-600'}>
                    {trade.status}
                </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
       <TableCaption>A list of your recent paper trades.</TableCaption>
    </Table>
  );
}
