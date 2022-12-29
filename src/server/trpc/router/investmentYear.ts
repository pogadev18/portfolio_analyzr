import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../trpc';

import {
  createInvestmentYearSchemaServer,
  getByYearSchema,
} from '@/root/schema/investmentYearSchema';
import { portfolioIdSchema } from '@/root/schema/common';

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
  getByYear: protectedProcedure.input(getByYearSchema).query(async ({ ctx, input }) => {
    const investmentYear = await ctx.prisma.investmentYear.findFirst({
      where: { year: input.year },
    });

    if (!investmentYear) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Year ${input.year} could not be found! Try again with another year!`,
      });
    }

    return investmentYear;
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
