'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltip as RechartsChartTooltip, // Alias to avoid conflict
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';

// Mock data for performance summary
const performanceData = [
  { metric: 'Profit/Loss', value: 15340.50, fill: 'hsl(var(--chart-1))' }, // Teal
  { metric: 'Win Rate', value: 65, fill: 'hsl(var(--chart-2))' }, // Darker Blue
  { metric: 'Avg Gain', value: 550.20, fill: 'hsl(var(--chart-1))' },
  { metric: 'Avg Loss', value: -320.80, fill: 'hsl(var(--chart-3))' }, // Medium Gray
  { metric: 'Sharpe Ratio', value: 1.2, fill: 'hsl(var(--chart-2))' },
];

const chartConfig = {
  value: {
    label: 'Value',
    // No single color, as each bar has its own
  },
  'Profit/Loss': { label: 'P/L ($)', color: 'hsl(var(--chart-1))' },
  'Win Rate': { label: 'Win Rate (%)', color: 'hsl(var(--chart-2))' },
  'Avg Gain': { label: 'Avg Gain ($)', color: 'hsl(var(--chart-1))' },
  'Avg Loss': { label: 'Avg Loss ($)', color: 'hsl(var(--chart-3))' },
  'Sharpe Ratio': { label: 'Sharpe Ratio', color: 'hsl(var(--chart-2))' },
} satisfies ChartConfig;

// Custom Tooltip Content
const CustomTooltipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const config = chartConfig[data.metric as keyof typeof chartConfig];
    let formattedValue = data.value.toLocaleString();
     if (data.metric === 'Profit/Loss' || data.metric === 'Avg Gain' || data.metric === 'Avg Loss') {
      formattedValue = `$${data.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    } else if (data.metric === 'Win Rate') {
         formattedValue = `${data.value}%`;
    } else if (data.metric === 'Sharpe Ratio') {
         formattedValue = data.value.toFixed(2);
    }

    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-1 gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {config?.label || data.metric}
            </span>
          </div>
           <span className="font-bold text-foreground">
            {formattedValue}
          </span>
        </div>
      </div>
    );
  }

  return null;
};


export function PerformanceSummary() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
       <ResponsiveContainer width="100%" height={200}>
      <BarChart accessibilityLayer data={performanceData} layout="vertical" margin={{ left: 10, right: 10 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" />
        <XAxis type="number" hide />
        <YAxis
          dataKey="metric"
          type="category"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
           width={100} // Adjust width for labels
          tick={{ fontSize: 12 }}
        />
         <RechartsChartTooltip
          cursor={false}
          content={<CustomTooltipContent />}
        />
        <Bar dataKey="value" radius={4} fill="var(--color-value)" />
      </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
