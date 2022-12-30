import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '../trpc';

import { createInvestmentYearSchemaServer } from '@/root/schema/investmentYearSchema';
import { portfolioIdSchema, getInvestmentsByYearSchema } from '@/root/schema/common';

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
  getByYear: protectedProcedure.input(getInvestmentsByYearSchema).query(async ({ ctx, input }) => {
    const {
      session: { user },
    } = ctx;
    const { portfolioId, year } = input;

    /*
      two possible cases in this situation
      =====================================
      1. user selects 'all'
      2. user selects a specific investment year
     */

    if (year === 'all') {
      const investments = await ctx.prisma.investment.findMany({
        where: {
          userId: user.id,
          portfolioId,
        },
      });

      return { investmentYearInfo: null, investmentsInThatYear: investments };
    }

    const investmentYear = await ctx.prisma.investmentYear.findFirst({
      where: { userId: user.id, year, portfolioId },
    });

    if (!investmentYear) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Year ${input.year} could not be found! Try again with another year!`,
      });
    }

    // grab all the investments that are related to the year that was found
    const investmentsInThatYear = await ctx.prisma.investment.findMany({
      where: {
        userId: user.id,
        investmentYear: input.year,
        portfolioId,
      },
    });

    return { investmentYearInfo: investmentYear, investmentsInThatYear };
  }),
  create: protectedProcedure
    .input(createInvestmentYearSchemaServer)
    .mutation(async ({ ctx, input }) => {
      const investmentYearAlreadyExists = await ctx.prisma.investmentYear.findFirst({
        where: { year: input.year, userId: ctx.session.user.id },
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
