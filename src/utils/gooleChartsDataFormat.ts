import type { Investment } from '.prisma/client';

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
  alias: string | null;
  etf: string;
  amount: string;
  currency: string;
}) {
  const sumInvestedAndCurrency = `${amount} ${currency}`;

  if (alias !== '') {
    return `${alias} - ${sumInvestedAndCurrency}`;
  } else {
    return `${etf} - ${sumInvestedAndCurrency}`;
  }
}

export const formatEtfsPieChartData = (investments: Investment[] | undefined) => {
  const dataForPieChart: (string | number)[][] = [['ETFs', 'Sum Invested']];

  investments?.map(({ alias, etf, amount, currency }) => {
    dataForPieChart.push([renderPieChartLegend({ alias, etf, amount, currency }), Number(amount)]);
  });

  console.log('dataForPieChart', dataForPieChart);

  return dataForPieChart;
};
