import { router } from '../trpc';
import { authRouter } from './auth';
import { portfolioRouter } from './portfolio';
import { investmentYearRouter } from './investmentYear';
import { investmentRouter } from './investment';
import { cashRouter } from '@/root/server/trpc/router/cash';

export const appRouter = router({
  portfolio: portfolioRouter,
  investmentYear: investmentYearRouter,
  investment: investmentRouter,
  cash: cashRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
