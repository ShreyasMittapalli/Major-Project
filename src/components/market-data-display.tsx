'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { stockDataService, type StockData } from '@/services/stock-data';
import { TrendingUp, TrendingDown, Package } from 'lucide-react';

interface MarketDataDisplayProps {
  initialTicker?: string;
}

export function MarketDataDisplay({ initialTicker = "AAPL" }: MarketDataDisplayProps) {
  const [selectedTicker, setSelectedTicker] = useState<string>(initialTicker);
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await stockDataService.getStockData(selectedTicker);
        // Simulate price change for visual feedback
        const prevPrice = stockData?.price || data.price;
        setStockData({...data, prevPrice}); // Add prevPrice for comparison
      } catch (err) {
        setError(`Failed to fetch data for ${selectedTicker}. Please try again.`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Optional: Set interval for real-time updates (be mindful of API limits)
    // const intervalId = setInterval(fetchData, 30000); // Fetch every 30 seconds
    // return () => clearInterval(intervalId);
  }, [selectedTicker]); // Refetch when ticker changes

  const handleTickerChange = (value: string) => {
    setSelectedTicker(value);
    setStockData(null); // Clear old data immediately
  };

   const priceChange = stockData ? stockData.price - (stockData as any).prevPrice : 0;
   const priceChangePercentage = stockData && (stockData as any).prevPrice ? (priceChange / (stockData as any).prevPrice) * 100 : 0;


  return (
    <div className="space-y-4">
       <Select value={selectedTicker} onValueChange={handleTickerChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Ticker" />
        </SelectTrigger>
        <SelectContent>
          {/* Add more relevant tickers */}
          <SelectItem value="AAPL">AAPL</SelectItem>
          <SelectItem value="GOOGL">GOOGL</SelectItem>
          <SelectItem value="MSFT">MSFT</SelectItem>
          <SelectItem value="AMZN">AMZN</SelectItem>
          <SelectItem value="TSLA">TSLA</SelectItem>
           <SelectItem value="NVDA">NVDA</SelectItem>
           <SelectItem value="META">META</SelectItem>
        </SelectContent>
      </Select>

      {loading && (
        <div className="grid grid-cols-3 gap-4">
           <Skeleton className="h-20" />
           <Skeleton className="h-20" />
           <Skeleton className="h-20" />
           <Skeleton className="h-40 col-span-3" />
        </div>
      )}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && stockData && (
        <>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Price</CardTitle>
                {priceChange >= 0 ? <TrendingUp className="h-4 w-4 text-muted-foreground" /> : <TrendingDown className="h-4 w-4 text-muted-foreground" />}
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">${stockData.price.toFixed(2)}</div>
               <p className={`text-xs ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                 {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercentage.toFixed(2)}%)
               </p>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Volume</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{stockData.volume.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                    Shares traded today
                </p>
             </CardContent>
           </Card>
           <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Timestamp</CardTitle>
                {/* Placeholder icon or leave blank */}
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-muted-foreground">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
                </svg>

             </CardHeader>
             <CardContent>
                <div className="text-lg font-semibold">{new Date(stockData.timestamp).toLocaleTimeString()}</div>
                <p className="text-xs text-muted-foreground">
                   {new Date(stockData.timestamp).toLocaleDateString()}
                 </p>
             </CardContent>
           </Card>
        </div>
         {/* Placeholder for Chart */}
         <Card>
           <CardHeader>
             <CardTitle>{selectedTicker} Chart</CardTitle>
             <CardDescription>Price movement (Placeholder)</CardDescription>
           </CardHeader>
           <CardContent className="h-[300px] flex items-center justify-center bg-muted/50 rounded-md">
             <p className="text-muted-foreground">Stock Chart Placeholder</p>
             {/* TODO: Implement actual chart using stockData history */}
           </CardContent>
         </Card>
         </>
      )}
    </div>
  );
}
