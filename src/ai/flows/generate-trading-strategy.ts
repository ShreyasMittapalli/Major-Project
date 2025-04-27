// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview A flow that generates a trading strategy from a natural language description.
 *
 * - generateTradingStrategy - A function that generates a trading strategy.
 * - GenerateTradingStrategyInput - The input type for the generateTradingStrategy function.
 * - GenerateTradingStrategyOutput - The return type for the generateTradingStrategy function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateTradingStrategyInputSchema = z.object({
  algorithmDescription: z
    .string()
    .describe('A description of the trading algorithm in natural language.'),
});
export type GenerateTradingStrategyInput = z.infer<
  typeof GenerateTradingStrategyInputSchema
>;

const GenerateTradingStrategyOutputSchema = z.object({
  mathematicalStrategy: z
    .string()
    .describe('The trading algorithm translated into a mathematical strategy.'),
});
export type GenerateTradingStrategyOutput = z.infer<
  typeof GenerateTradingStrategyOutputSchema
>;

export async function generateTradingStrategy(
  input: GenerateTradingStrategyInput
): Promise<GenerateTradingStrategyOutput> {
  return generateTradingStrategyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTradingStrategyPrompt',
  input: {
    schema: z.object({
      algorithmDescription: z
        .string()
        .describe('A description of the trading algorithm in natural language.'),
    }),
  },
  output: {
    schema: z.object({
      mathematicalStrategy: z
        .string()
        .describe('The trading algorithm translated into a mathematical strategy.'),
    }),
  },
  prompt: `You are an expert financial analyst who translates trading algorithms described in natural language into mathematical strategies.

  Translate the following algorithm description into a mathematical strategy that can be used for automated trading.

  Algorithm Description: {{{algorithmDescription}}}

  Mathematical Strategy:`,
});

const generateTradingStrategyFlow = ai.defineFlow<
  typeof GenerateTradingStrategyInputSchema,
  typeof GenerateTradingStrategyOutputSchema
>({
  name: 'generateTradingStrategyFlow',
  inputSchema: GenerateTradingStrategyInputSchema,
  outputSchema: GenerateTradingStrategyOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
