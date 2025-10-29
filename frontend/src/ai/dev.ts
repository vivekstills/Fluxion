'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-learning-progress.ts';
import '@/ai/flows/verify-user-identity-rewards.ts';
import '@/ai/flows/generate-trader-card-metadata.ts';
import '@/ai/flows/analyze-candlestick-patterns.ts';
