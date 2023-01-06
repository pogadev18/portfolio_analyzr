import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../trpc';

import { createInvestmentSchemaServer } from '@/root/schema/investmentSchema';
import { portfolioIdSchema } from '@/root/schema/common';

export const investmentRouter = router({
  getAll: protectedProcedure.input(portfolioIdSchema).query(async ({ ctx, input }) => {
    const { session } = ctx;
    const { portfolioId } = input;

    const portfolio = await ctx.prisma.portfolio.findFirst({ where: { id: portfolioId } });

    if (!portfolio) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'The portfolio you are looking for does not exists, try again',
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
      const {
        prisma,
        session: { user },
      } = ctx;

      const { etf, portfolioId, investmentYearId } = input;

      const etfAlreadyExists = await ctx.prisma.investment.findFirst({
        where: { userId: user.id, portfolioId, etf, investmentYearId },
      });

      if (etfAlreadyExists) {
        const { alias, etf } = etfAlreadyExists;
        throw new TRPCError({
          code: 'CONFLICT',
          message: `It looks like you already have ${
            alias !== '' ? alias : etf
          } as an investment. Consider editing the sum invested or if  you want to add it again, make sure you delete it first!`,
        });
      }

      return prisma.investment.create({
        data: { ...input },
      });
    }),
});
