import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../trpc';

import { createInvestmentYearSchemaServer } from '@/root/schema/investmentYearSchema';
import { portfolioIdSchema, userIdSchema } from '@/root/schema/common';

export const investmentYearRouter = router({
  getAll: protectedProcedure.input(portfolioIdSchema).query(async ({ ctx, input }) => {
    const { portfolioId } = input;
    const { prisma, session } = ctx;

    const portfolio = await prisma.portfolio.findFirst({ where: { id: portfolioId } });

    if (!portfolio) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'portfolio not found',
      });
    }

    return await ctx.prisma.investmentYear.findMany({
      where: { portfolioId, userId: session.user.id },
    });
  }),
  create: protectedProcedure
    .input(createInvestmentYearSchemaServer)
    .mutation(async ({ ctx, input }) => {
      const investmentYearAlreadyExists = await ctx.prisma.investmentYear.findFirst({
        where: { year: input.year },
      });

      if (investmentYearAlreadyExists) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'It looks like you already have this investment year created. Try adding another year',
          cause: 'investmentYear already exists',
        });
      }

      return ctx.prisma.investmentYear.create({ data: { ...input } });
    }),
});
