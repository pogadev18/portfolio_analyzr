import { Investment } from '.prisma/client';

// loops through investments and creates a list with all the investments years (no duplicates)
export const displayInvestmentYears = (investments: Investment[] | undefined) => {
  const investmentYears: string[] = [];

  // TODO: map creates a new array anyway, optimize this part
  investments?.map((investment) =>
    investmentYears.push(investment.date.slice(0, investment.date.indexOf('-'))),
  );

  return [...new Set(investmentYears)];
};
