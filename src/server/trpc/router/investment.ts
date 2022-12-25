import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../trpc';

import { createInvestmentSchemaServer } from '@/root/schema/investmentSchema';
import { portfolioIdSchema } from '@/root/schema/common';

export const investmentRouter = router({
  getAll: protectedProcedure.input(portfolioIdSchema).query(async ({ ctx, input }) => {
    const { session, prisma } = ctx;
    const { portfolioId } = input;

    const portfolio = await ctx.prisma.portfolio.findFirst({ where: { id: portfolioId } });

    if (!portfolio) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'portfolio not found',
      });
    }

    // get all the investments for the logged-in user and for a specific portfolio
    return await ctx.prisma.investment.findMany({
      where: {
        userId: session.user.id,
        portfolioId: input.portfolioId,
      },
    });
  }),
  create: protectedProcedure
    .input(createInvestmentSchemaServer)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.investment.create({
        data: { ...input },
      });
    }),
});
