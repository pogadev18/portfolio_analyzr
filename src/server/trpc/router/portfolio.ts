import { router, protectedProcedure } from '../trpc';
import { createPortfolioSchemaServer, userIdSchema } from '@/root/schema/portfolioSchema';

export const portfolioRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx;

    return await ctx.prisma.portfolio.findMany({
      where: {
        userId: session.user.id,
      },
    });
  }),
  create: protectedProcedure.input(createPortfolioSchemaServer).mutation(async ({ ctx, input }) => {
    return ctx.prisma.portfolio.create({
      data: { ...input },
    });
  }),
});
