import z from 'zod';
import { userIdSchema, portfolioIdSchema } from '@/root/schema/common';

export const createInvestmentYearSchemaClient = z.object({
  year: z.string().min(4),
  sumToInvest: z.string().min(2),
  currency: z.string(),
});

export const createInvestmentYearSchemaServer = createInvestmentYearSchemaClient
  .merge(userIdSchema)
  .merge(portfolioIdSchema);

export type CreateInvestmentYear = z.infer<typeof createInvestmentYearSchemaClient>;
