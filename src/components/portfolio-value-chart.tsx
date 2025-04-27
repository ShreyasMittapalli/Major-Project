'use client';

import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart'; // Import ChartConfig type

// Mock data generation
const generateMockData = (days: number) => {
  const data = [];
  let value = 100000; // Starting value
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const fluctuation = (Math.random() - 0.45) * 5000; // Introduce more variance
    value += fluctuation;
    value = Math.max(value, 50000); // Ensure value doesn't drop too low unrealisticly
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(value),
    });
  }
  return data;
};

const chartData = generateMockData(30);

const chartConfig = {
  value: {
    label: 'Portfolio Value',
    color: 'hsl(var(--chart-1))', // Use theme variable
  },
} satisfies ChartConfig; // Use satisfies for type checking

export function PortfolioValueChart() {
  return (
     <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
          top: 10, // Add top margin for better spacing
        }}
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
         <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value} // Keep simple date format
        />
        <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} // Format as $100k
            domain={['dataMin - 5000', 'dataMax + 5000']} // Add padding to domain
        />
        <ChartTooltip
            cursor={false} // Disable cursor line for cleaner look
            content={<ChartTooltipContent indicator="line" labelKey="value" nameKey="date" formatter={(value) => `$${value.toLocaleString()}`} />}
            />
        <defs>
          <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-value)" // Use CSS variable from config
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-value)" // Use CSS variable from config
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="value"
          type="natural" // Smoother curve
          fill="url(#fillValue)"
          fillOpacity={0.4}
          stroke="var(--color-value)" // Use CSS variable from config
          strokeWidth={2}
           dot={false} // Hide dots for cleaner look
        />
      </AreaChart>
    </ChartContainer>
  );
}
