import { Investment } from '.prisma/client';

// loops through investments and creates a list with all the years of investments (no duplicates)

export const displayInvestmentYears = (investments: Investment[] | undefined) => {
  const years: string[] = [];

  investments?.map((investment) =>
    years.push(investment.date.slice(0, investment.date.indexOf('-'))),
  );

  return [...new Set(years)];
};
