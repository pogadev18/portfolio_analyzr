import { router, protectedProcedure } from '../trpc';

import { createCashSchemaServer } from '@/root/schema/cashSchema';

export const cashRouter = router({
  create: protectedProcedure.input(createCashSchemaServer).mutation(async ({ ctx, input }) => {
    const { prisma } = ctx;

    return prisma.cash.create({ data: { ...input } });
  }),
});
