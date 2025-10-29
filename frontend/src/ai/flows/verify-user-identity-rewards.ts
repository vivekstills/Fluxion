'use server';

/**
 * @fileOverview An AI agent to verify user identity for daily reward claims and prevent abuse.
 *
 * - verifyUserIdentityForRewards - A function that handles the user identity verification process.
 * - VerifyUserIdentityForRewardsInput - The input type for the verifyUserIdentityForRewards function.
 * - VerifyUserIdentityForRewardsOutput - The return type for the verifyUserIdentityForRewards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerifyUserIdentityForRewardsInputSchema = z.object({
  walletAddress: z
    .string()
    .describe('The wallet address of the user claiming the reward.'),
  clientSignedMessage: z
    .string()
    .describe(
      'The client-signed message proving ownership of the wallet address.'
    ),
  lastClaimTime: z
    .number()
    .describe(
      'The timestamp of the users last reward claim, used to verify claim eligibility.'
    ),
  streakCount: z
    .number()
    .describe(
      'The number of consecutive days the user has claimed a reward, used to determine eligibility and reward amount.'
    ),
});
export type VerifyUserIdentityForRewardsInput = z.infer<
  typeof VerifyUserIdentityForRewardsInputSchema
>;

const VerifyUserIdentityForRewardsOutputSchema = z.object({
  isLegitimate: z
    .boolean()
    .describe(
      'Whether or not the user is determined to be a legitimate claimant.'
    ),
  fraudExplanation: z
    .string()
    .describe(
      'Explanation of why user is deemed fraudulent, if applicable.'
    ),
});
export type VerifyUserIdentityForRewardsOutput = z.infer<
  typeof VerifyUserIdentityForRewardsOutputSchema
>;

export async function verifyUserIdentityForRewards(
  input: VerifyUserIdentityForRewardsInput
): Promise<VerifyUserIdentityForRewardsOutput> {
  return verifyUserIdentityForRewardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyUserIdentityForRewardsPrompt',
  input: {schema: VerifyUserIdentityForRewardsInputSchema},
  output: {schema: VerifyUserIdentityForRewardsOutputSchema},
  prompt: `You are an AI-powered fraud detection service for a rewards program.

  Your task is to analyze user data and determine if the user is a legitimate claimant for a daily reward.

  Consider the following information about the user:
  - Wallet Address: {{{walletAddress}}}
  - Client-Signed Message: {{{clientSignedMessage}}}
  - Last Claim Time: {{{lastClaimTime}}}
  - Streak Count: {{{streakCount}}}

  Based on this information, determine if the user is likely to be a legitimate claimant or attempting to abuse the system.

  Explain your reasoning for the determination. The explanation should be set in the "fraudExplanation" output field. If the user is deemed legitimate, set the "fraudExplanation" to an empty string.

  Set the "isLegitimate" field to true if the user is a legitimate claimant, and false otherwise.
  `,
});

const verifyUserIdentityForRewardsFlow = ai.defineFlow(
  {
    name: 'verifyUserIdentityForRewardsFlow',
    inputSchema: VerifyUserIdentityForRewardsInputSchema,
    outputSchema: VerifyUserIdentityForRewardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
