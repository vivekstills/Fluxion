'use server';
/**
 * @fileOverview An AI flow to analyze candlestick chart patterns and predict future movement.
 *
 * - analyzeCandlestickPatterns: A function to analyze chart data.
 * - AnalyzeCandlestickPatternsInput: Input type for the analysis function.
 * - AnalyzeCandlestickPatternsOutput: Return type for the analysis function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CandlestickDataSchema = z.object({
  name: z.string(),
  price: z.number(),
});

const AnalyzeCandlestickPatternsInputSchema = z.object({
  timeframe: z.enum(['hour', 'day', 'week']).describe('The timeframe for the analysis (hour, day, week).'),
  dataset: z
    .array(CandlestickDataSchema)
    .describe('An array of candlestick data points from the previous day.'),
});
export type AnalyzeCandlestickPatternsInput = z.infer<
  typeof AnalyzeCandlestickPatternsInputSchema
>;

const AnalyzeCandlestickPatternsOutputSchema = z.object({
  analysisSummary: z.string().describe('A brief summary of the AI\'s pattern analysis.'),
  predictedMovement: z
    .enum(['up', 'down', 'sideways'])
    .describe('The predicted direction of the price movement.'),
  confidenceScore: z.number().min(0).max(1).describe('The AI\'s confidence in its prediction, from 0 to 1.'),
});
export type AnalyzeCandlestickPatternsOutput = z.infer<
  typeof AnalyzeCandlestickPatternsOutputSchema
>;

export async function analyzeCandlestickPatterns(
  input: AnalyzeCandlestickPatternsInput
): Promise<AnalyzeCandlestickPatternsOutput> {
  return analyzeCandlestickPatternsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeCandlestickPatternsPrompt',
  input: { schema: AnalyzeCandlestickPatternsInputSchema },
  output: { schema: AnalyzeCandlestickPatternsOutputSchema },
  prompt: `You are an expert financial analyst specializing in technical analysis of stock charts.

Analyze the provided candlestick data for the given timeframe to identify key patterns (e.g., head and shoulders, double top/bottom, flags, pennants) and predict the most likely subsequent price movement.

Timeframe: {{{timeframe}}}
Dataset:
\`\`\`json
{{{jsonStringify dataset}}}
\`\`\`

Based on your analysis of the patterns in the data, provide a summary, predict the future movement (up, down, or sideways), and give a confidence score for your prediction.`,
});

const analyzeCandlestickPatternsFlow = ai.defineFlow(
  {
    name: 'analyzeCandlestickPatternsFlow',
    inputSchema: AnalyzeCandlestickPatternsInputSchema,
    outputSchema: AnalyzeCandlestickPatternsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
