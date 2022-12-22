import { router, protectedProcedure } from '../trpc';
import { createPortfolioSchemaServer } from '@/root/schema/portfolioSchema';

export const portfolioRouter = router({
  create: protectedProcedure.input(createPortfolioSchemaServer).mutation(async ({ ctx, input }) => {
    return ctx.prisma.portfolio.create({
      data: { ...input },
    });
  }),
});
