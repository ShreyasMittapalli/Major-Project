import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PortfolioValueChart } from "@/components/portfolio-value-chart";
import { PerformanceSummary } from "@/components/performance-summary";
import { RecentTradesTable } from "@/components/recent-trades-table"; // Assuming this component will be created
import { DollarSign, TrendingUp, TrendingDown, List } from 'lucide-react';

// Mock data - replace with actual data fetching
const portfolioValue = 125340.50;
const todayChange = 250.75;
const totalGainLoss = 15340.50;
const gainLossPercentage = (totalGainLoss / (portfolioValue - totalGainLoss)) * 100;


export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <p className={`text-xs ${todayChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {todayChange >= 0 ? '+' : ''}${todayChange.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} today
          </p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
           {totalGainLoss >= 0 ? <TrendingUp className="h-4 w-4 text-muted-foreground" /> : <TrendingDown className="h-4 w-4 text-muted-foreground" />}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
           {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
           <p className={`text-xs ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            ({gainLossPercentage >= 0 ? '+' : ''}{gainLossPercentage.toFixed(2)}%)
          </p>
        </CardContent>
      </Card>
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Strategies</CardTitle>
          <List className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">3</div>
          <p className="text-xs text-muted-foreground">
            Automated trading strategies running
          </p>
        </CardContent>
      </Card>
      {/* Placeholder for another key metric */}
       <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
           {/* Placeholder icon */}
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-muted-foreground">
            <path d="M12 7a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0112 7zm0 10a1 1 0 100-2 1 1 0 000 2z" />
            <path fillRule="evenodd" d="M12 1.25C6.063 1.25 1.25 6.063 1.25 12S6.063 22.75 12 22.75 22.75 17.937 22.75 12 17.937 1.25 12 1.25zM2.75 12a9.25 9.25 0 1118.5 0 9.25 9.25 0 01-18.5 0z" clipRule="evenodd" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">15</div>
          <p className="text-xs text-muted-foreground">
             Currently held stocks
          </p>
        </CardContent>
      </Card>


      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Portfolio Value Over Time</CardTitle>
          <CardDescription>Last 30 days performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <PortfolioValueChart />
        </CardContent>
      </Card>

       <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Performance Summary</CardTitle>
           <CardDescription>Key performance indicators.</CardDescription>
        </CardHeader>
        <CardContent>
           <PerformanceSummary />
        </CardContent>
      </Card>

      <Card className="md:col-span-4">
        <CardHeader>
          <CardTitle>Recent Trades</CardTitle>
           <CardDescription>Your latest buy and sell orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentTradesTable />
        </CardContent>
      </Card>
    </div>
  );
}
