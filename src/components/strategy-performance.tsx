'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import {
  ChartContainer,
  ChartTooltip as RechartsChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

// Mock data for aggregated strategy performance over time (e.g., monthly)
const performanceData = [
  { month: 'Jan', profit: 1200, loss: 400 },
  { month: 'Feb', profit: 1800, loss: 300 },
  { month: 'Mar', profit: 900, loss: 600 },
  { month: 'Apr', profit: 2500, loss: 200 },
  { month: 'May', profit: 1500, loss: 700 },
  { month: 'Jun', profit: 3100, loss: 500 },
];

const chartConfig = {
  profit: {
    label: 'Total Profit',
    color: 'hsl(var(--chart-1))', // Teal
  },
  loss: {
    label: 'Total Loss',
    color: 'hsl(var(--chart-3))', // Medium Gray (or red if preferred for loss)
  },
} satisfies ChartConfig;

export function StrategyPerformance() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
       <ResponsiveContainer width="100%" height={250}>
      <BarChart accessibilityLayer data={performanceData}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value}
        />
        <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} // Format as $1k
        />
        <RechartsChartTooltip
            cursor={false} // Disable cursor line
             content={<ChartTooltipContent indicator="dot" formatter={(value, name) => `$${value.toLocaleString()}`} />}
        />
        <Legend content={<ChartLegendContent />} />
        <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
        <Bar dataKey="loss" fill="var(--color-loss)" radius={4} />
      </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
