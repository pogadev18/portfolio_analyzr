import { router } from '../trpc';
import { authRouter } from './auth';
import { portfolioRouter } from './portfolio';

export const appRouter = router({
  portfolio: portfolioRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
