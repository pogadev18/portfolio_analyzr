import type { Investment } from '.prisma/client';
import type { AllInvestment } from '@/root/types';

// helper functions that format data for the Google charts library

/*
    this function renders what is visible on the legend in the etf pie chart

    output examples:
    ----------------
    - MSCI World - 1245 EUR (if alias)
    - 4BRZ.DE - 213 EUR (if not alis, ticker will be displayed)
*/
function renderPieChartLegend({
  alias,
  etf,
  amount,
  currency,
}: {
  // TODO: type adjustments??
  alias: string | null | undefined;
  etf: string;
  amount: string | number;
  currency: string | undefined;
}) {
  // todo: refactor to be only number the 'amount' and 'units' values (also in the Prisma schema and in Zod)
  const amountWith2Decimals = Number(amount).toFixed(2);
  const sumInvestedAndCurrency = `${amountWith2Decimals} ${currency}`;

  if (alias !== '') {
    return `${alias} - ${sumInvestedAndCurrency}`;
  } else {
    return `${etf} - ${sumInvestedAndCurrency}`;
  }
}

export const formatEtfsPieChartData = (investments: Investment[] | AllInvestment[] | undefined) => {
  const dataForPieChart: (string | number)[][] = [['ETFs', 'Sum Invested']];

  investments?.map(({ alias, etf, amount, currency }) => {
    dataForPieChart.push([renderPieChartLegend({ alias, etf, amount, currency }), Number(amount)]);
  });

  return dataForPieChart;
};
