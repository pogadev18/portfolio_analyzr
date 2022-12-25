import z from 'zod';
import { userIdSchema } from '@/root/schema/common';

export const createPortfolioSchemaClient = z.object({
  name: z.string().min(3),
  description: z.string().nullish(),
});

export const createPortfolioSchemaServer = createPortfolioSchemaClient.merge(userIdSchema);

export type CreatePortfolio = z.infer<typeof createPortfolioSchemaClient>;
