'use server';

/**
 * @fileOverview A flow for generating metadata for Trader Card NFTs.
 *
 * - generateTraderCardMetadata - A function that generates metadata for Trader Card NFTs.
 * - GenerateTraderCardMetadataInput - The input type for the generateTraderCardMetadata function.
 * - GenerateTraderCardMetadataOutput - The return type for the generateTraderCardMetadata function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTraderCardMetadataInputSchema = z.object({
  name: z.string().describe('The name of the trader.'),
  elo: z.number().describe('The ELO rating of the trader.'),
  wins: z.number().describe('The number of wins the trader has.'),
  losses: z.number().describe('The number of losses the trader has.'),
  xp: z.number().describe('The amount of experience points the trader has.'),
  tier: z.string().describe('The tier of the trader (e.g., bronze, silver, gold).'),
  skinsUnlocked: z.number().describe('The number of skins unlocked by the trader.'),
});
export type GenerateTraderCardMetadataInput = z.infer<
  typeof GenerateTraderCardMetadataInputSchema
>;

const GenerateTraderCardMetadataOutputSchema = z.object({
  description: z
    .string()
    .describe('A detailed description of the trader card, highlighting stats and achievements.'),
  attributes: z
    .array(
      z.object({
        trait_type: z.string(),
        value: z.string(),
      })
    )
    .describe('Attributes for the NFT metadata, including ELO, wins, losses, etc.'),
});
export type GenerateTraderCardMetadataOutput = z.infer<
  typeof GenerateTraderCardMetadataOutputSchema
>;

export async function generateTraderCardMetadata(
  input: GenerateTraderCardMetadataInput
): Promise<GenerateTraderCardMetadataOutput> {
  return generateTraderCardMetadataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTraderCardMetadataPrompt',
  input: {schema: GenerateTraderCardMetadataInputSchema},
  output: {schema: GenerateTraderCardMetadataOutputSchema},
  prompt: `You are an expert NFT metadata generator for a trading card game.

  Generate a compelling description and attributes for a Trader Card NFT based on the following trader information:

  Name: {{{name}}}
  ELO: {{{elo}}}
  Wins: {{{wins}}}
  Losses: {{{losses}}}
  XP: {{{xp}}}
  Tier: {{{tier}}}
  Skins Unlocked: {{{skinsUnlocked}}}

  Description should be a short paragraph that captures the essence of the trader's achievements and current status.  It should be suitable for display on the NFT metadata.

  Attributes should be an array of key-value pairs, suitable for inclusion in the NFT metadata. Include attributes for ELO, Wins, Losses, XP, Tier, and Skins Unlocked.

  Ensure the output is valid JSON that conforms to the schema.`,
});

const generateTraderCardMetadataFlow = ai.defineFlow(
  {
    name: 'generateTraderCardMetadataFlow',
    inputSchema: GenerateTraderCardMetadataInputSchema,
    outputSchema: GenerateTraderCardMetadataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
