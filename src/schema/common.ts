import z from 'zod';

export const userIdSchema = z.object({ userId: z.string() });
export const portfolioIdSchema = z.object({ portfolioId: z.string() });
export const investmentYearIdSchema = z.object({ investmentYearId: z.string() });
