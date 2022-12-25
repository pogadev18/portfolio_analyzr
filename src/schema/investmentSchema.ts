import z from 'zod';
import { userIdSchema, portfolioIdSchema } from '@/root/schema/common';

export const createInvestmentSchemaClient = z.object({
  date: z.string(),
  etf: z.string({ required_error: 'Select an ETF' }),
  units: z.string().min(1),
  amount: z.string().min(1),
  currency: z.string(),
});

export const createInvestmentSchemaServer = createInvestmentSchemaClient
  .merge(userIdSchema)
  .merge(portfolioIdSchema);

export type CreateInvestment = z.infer<typeof createInvestmentSchemaClient>;
