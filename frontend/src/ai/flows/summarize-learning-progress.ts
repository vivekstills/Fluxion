'use server';
/**
 * @fileOverview Summarizes a user's learning progress in the app using AI.
 *
 * - summarizeLearningProgress - A function that summarizes learning progress.
 * - SummarizeLearningProgressInput - The input type for the summarizeLearningProgress function.
 * - SummarizeLearningProgressOutput - The return type for the summarizeLearningProgress function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLearningProgressInputSchema = z.object({
  modulesCompleted: z
    .array(z.string())
    .describe('A list of modules the user has completed.'),
});
export type SummarizeLearningProgressInput = z.infer<typeof SummarizeLearningProgressInputSchema>;

const SummarizeLearningProgressOutputSchema = z.object({
  summary: z.string().describe('A summary of the learning progress.'),
  progress: z.string().describe('A one-sentence summary of the learning progress generation.'),
});
export type SummarizeLearningProgressOutput = z.infer<typeof SummarizeLearningProgressOutputSchema>;

export async function summarizeLearningProgress(
  input: SummarizeLearningProgressInput
): Promise<SummarizeLearningProgressOutput> {
  return summarizeLearningProgressFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLearningProgressPrompt',
  input: {schema: SummarizeLearningProgressInputSchema},
  output: {schema: SummarizeLearningProgressOutputSchema},
  prompt: `You are an AI assistant that summarizes a user's learning progress.

  Summarize the following modules completed by the user:
  {{#each modulesCompleted}}
  - {{this}}
  {{/each}}
  `,
});

const summarizeLearningProgressFlow = ai.defineFlow(
  {
    name: 'summarizeLearningProgressFlow',
    inputSchema: SummarizeLearningProgressInputSchema,
    outputSchema: SummarizeLearningProgressOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      ...output!,
      progress: 'Generated a summary of the user\'s learning progress.',
    };
  }
);
