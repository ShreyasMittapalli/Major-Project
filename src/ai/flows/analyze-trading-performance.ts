// The AI trading performance analyzer.
//
// - analyzeTradingPerformance - Analyzes trading performance.
// - AnalyzeTradingPerformanceInput - Input type for the
//   analyzeTradingPerformance function.
// - AnalyzeTradingPerformanceOutput - Return type for the
//   analyzeTradingPerformance function.

'use server';

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const AnalyzeTradingPerformanceInputSchema = z.object({
  strategyDescription: z
    .string()
    .describe('The description of the trading strategy.'),
  historicalData: z
    .string()
    .describe(
      'Historical trading data, including dates, prices, and buy/sell actions.'
    ),
});

export type AnalyzeTradingPerformanceInput =
  z.infer<typeof AnalyzeTradingPerformanceInputSchema>;

const AnalyzeTradingPerformanceOutputSchema = z.object({
  summary: z.string().describe('A summary of the trading strategy performance.'),
  keyMetrics: z
    .string()
    .describe('Key performance metrics, such as profit/loss, risk, and Sharpe ratio.'),
  recommendations:
    z.string().describe('Recommendations for optimizing the trading strategy.'),
});

export type AnalyzeTradingPerformanceOutput =
  z.infer<typeof AnalyzeTradingPerformanceOutputSchema>;

export async function analyzeTradingPerformance(
  input: AnalyzeTradingPerformanceInput
): Promise<AnalyzeTradingPerformanceOutput> {
  return analyzeTradingPerformanceFlow(input);
}

const analyzeTradingPerformancePrompt = ai.definePrompt({
  name: 'analyzeTradingPerformancePrompt',
  input: {
    schema: z.object({
      strategyDescription: z
        .string()
        .describe('The description of the trading strategy.'),
      historicalData: z
        .string()
        .describe(
          'Historical trading data, including dates, prices, and buy/sell actions.'
        ),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A summary of the trading strategy performance.'),
      keyMetrics: z
        .string()
        .describe('Key performance metrics, such as profit/loss, risk, and Sharpe ratio.'),
      recommendations:
        z.string().describe('Recommendations for optimizing the trading strategy.'),
    }),
  },
  prompt: `You are an expert trading strategy analyst.

You will analyze the performance of a trading strategy based on historical data and provide a summary, key metrics, and recommendations for optimization.

Strategy Description: {{{strategyDescription}}}
Historical Data: {{{historicalData}}}

Analyze the trading strategy and provide a summary of its performance, key metrics, and recommendations for optimization.`,
});

const analyzeTradingPerformanceFlow = ai.defineFlow<
  typeof AnalyzeTradingPerformanceInputSchema,
  typeof AnalyzeTradingPerformanceOutputSchema
>(
  {
    name: 'analyzeTradingPerformanceFlow',
    inputSchema: AnalyzeTradingPerformanceInputSchema,
    outputSchema: AnalyzeTradingPerformanceOutputSchema,
  },
  async input => {
    const {output} = await analyzeTradingPerformancePrompt(input);
    return output!;
  }
);
