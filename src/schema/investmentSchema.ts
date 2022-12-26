import z from 'zod';
import { userIdSchema, portfolioIdSchema, investmentYearIdSchema } from '@/root/schema/common';

export const createInvestmentSchemaClient = z.object({
  investmentYear: z.string(),
  date: z.string(),
  etf: z.string({ required_error: 'Select an ETF' }),
  alias: z.string().nullish(),
  units: z.string().min(1),
  amount: z.string().min(1),
  currency: z.string(),
});

export const createInvestmentSchemaServer = createInvestmentSchemaClient
  .merge(userIdSchema)
  .merge(portfolioIdSchema)
  .merge(investmentYearIdSchema);

export type CreateInvestment = z.infer<typeof createInvestmentSchemaClient>;
