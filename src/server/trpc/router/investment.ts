import { router, protectedProcedure } from '../trpc';

import { createInvestmentSchemaServer } from '@/root/schema/investmentSchema';

export const investmentRouter = router({
  create: protectedProcedure
    .input(createInvestmentSchemaServer)
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.investment.create({
        data: { ...input },
      });
    }),
});
