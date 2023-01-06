import { TRPCError } from '@trpc/server';
import type { Investment } from '.prisma/client';

import { router, protectedProcedure } from '../trpc';

import { createInvestmentYearSchemaServer } from '@/root/schema/investmentYearSchema';
import { portfolioIdSchema, getInvestmentsByYearSchema } from '@/root/schema/common';
import { checkDuplicatedETFs } from '@/root/utils/checkDuplicatedEtfs';
import type { AllYearsInvestment } from '@/root/types';

export const investmentYearRouter = router({
  getAll: protectedProcedure.input(portfolioIdSchema).query(async ({ ctx, input }) => {
    const { portfolioId } = input;
    const { prisma, session } = ctx;

    const portfolio = await prisma.portfolio.findFirst({ where: { id: portfolioId } });

    if (!portfolio) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'The portfolio you are looking for does not exists, try again',
      });
    }

    return await ctx.prisma.investmentYear.findMany({
      where: { portfolioId, userId: session.user.id },
      orderBy: { year: 'desc' },
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

      const etfISINs = investments?.map((i) => i.etf); // grab the ISINs of all the etfs
      const duplicatedISINS = checkDuplicatedETFs(etfISINs); // check which ones are duplicated

      // group etfs by isin
      const groupedETFs: { [key: string]: Investment[] } = {};

      /*
          - filter the 'investments' array as many times as the length of the 'duplicatedISINS' array
          - example: if there are 6 duplicated ISINS, then filter the 'investments' array 6 times
            and each time create a property with the ISIN that has multiple investments and group
            them together
       */
      duplicatedISINS.forEach(
        (isin) => (groupedETFs[`${isin}`] = investments.filter(({ etf }) => etf === isin)),
      );

      const allYearsInvestments: AllYearsInvestment[] = [];

      // TODO: think of some adjustments here (DRY)
      for (const [key, value] of Object.entries(groupedETFs)) {
        const totalAmountInvested = value.reduce((sum, item) => sum + Number(item.amount), 0);
        const totalUnitsInvested = value.reduce((sum, item) => sum + Number(item.units), 0);

        const obj = {
          alias: value.map((i) => i.alias)[0],
          etf: key,
          amount: totalAmountInvested,
          units: totalUnitsInvested,
          currency: value.map((i) => i.currency)[0],
        };

        allYearsInvestments.push(obj);
      }

      return { investmentYearInfo: null, investmentsInThatYear: allYearsInvestments };
    }

    // user selects a specific investment year logic
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
