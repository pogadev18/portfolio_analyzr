import z from 'zod';
import { userIdSchema, portfolioIdSchema } from '@/root/schema/common';

export const createInvestmentYearSchemaClient = z.object({
  year: z.string(),
  sumToInvest: z.string(),
  currency: z.string(),
});

export const createInvestmentYearSchemaServer = createInvestmentYearSchemaClient
  .merge(userIdSchema)
  .merge(portfolioIdSchema);

export type CreateInvestmentYear = z.infer<typeof createInvestmentYearSchemaClient>;
