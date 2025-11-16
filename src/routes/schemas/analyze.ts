import { z } from 'zod';

const transactionSchema = z.object({
  date: z.string().describe('ISO date of the transaction').optional(),
  amount: z.number(),
  vendor: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  note: z.string().optional(),
});

export const analyzeRequestSchema = z.object({
  input: z.string().min(1, 'input must contain a user request'),
  transactions: z.array(transactionSchema).max(500).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;

