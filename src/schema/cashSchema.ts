import z from 'zod';
import { userIdSchema, portfolioIdSchema, investmentYearIdSchema } from '@/root/schema/common';

export const createCashSchemaClient = z.object({
  investmentYear: z.string(),
  date: z.string(),
  amount: z.string().min(1),
  currency: z.string(),
});

export const createCashSchemaServer = createCashSchemaClient
  .merge(userIdSchema)
  .merge(portfolioIdSchema)
  .merge(investmentYearIdSchema);

export type CreateCash = z.infer<typeof createCashSchemaClient>;
