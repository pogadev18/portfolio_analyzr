import { TRPCError } from '@trpc/server';

import { router, protectedProcedure } from '../trpc';

import type { MergedETF } from '@/root/types';

import { createInvestmentYearSchemaServer } from '@/root/schema/investmentYearSchema';
import { portfolioIdSchema, getInvestmentsByYearSchema } from '@/root/schema/common';
import { checkDuplicatedETFs } from '@/root/utils/checkDuplicatedEtfs';

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
      orderBy: { createdAt: 'desc' },
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

      // store the duplicated ones into an array (these are the ones from the most recent years)
      const duplicatedInvestments = investments?.filter(
        ({ etf }, index) => etf === duplicatedISINS[index],
      );

      // store only the ones that are not duplicated
      const notDuplicatedInvestments = investments?.filter(
        ({ etf }, index) => etf !== duplicatedISINS[index],
      );

      /*
        - add the sum (amount) of the duplicatedInvestments to the notDuplicatedInvestments
        - add the units of the etfs as well

         - output: finalInvestments = [
          { etf: 'IS3N.DE', alias: '', amount: '2300', currency: 'EUR', units: '233' },
        ];
       */

      // TODO: fix this, not working!!!
      const overallInvestments = investments.reduce(
        (mergedInvestments: MergedETF[], item, index) => {
          // 'mergedInvestments' has a default value equal to the starting point -> []
          // 'item' is each individual etf from 'investments' array on which we call the 'reduce' method

          const mergedETF = {
            info: {
              etfsMerged: `Merged ${item.etf} from ${item.investmentYear} with ${notDuplicatedInvestments[index]?.etf} from ${notDuplicatedInvestments[index]?.investmentYear}`,
            },
            etf: item.etf,
            alias: item.alias,
            currency: item.currency,
            units: String(Number(item.units) + Number(notDuplicatedInvestments[index]?.units)),
            amount: String(Number(item.amount) + Number(notDuplicatedInvestments[index]?.amount)),
          };

          mergedInvestments.push(mergedETF);

          return mergedInvestments;
        },
        [],
      ); // starting point

      return { investmentYearInfo: null, investmentsInThatYear: overallInvestments };
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
