import z from 'zod';

export const createPortfolioSchemaClient = z.object({
  name: z.string().min(3),
  description: z.string().nullish(),
});

export const createPortfolioSchemaServer = createPortfolioSchemaClient.merge(
  z.object({ createdBy: z.string() }),
);

export type CreatePortfolio = z.infer<typeof createPortfolioSchemaClient>;
