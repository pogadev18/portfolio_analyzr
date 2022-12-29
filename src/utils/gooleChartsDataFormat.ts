import type { Investment } from '.prisma/client';

// helper functions that format data for the Google charts library

export const formatEtfsPieChartData = (investments: Investment[] | undefined) => {
  const dataForPieChart: (string | number)[][] = [['ETFs', 'Sum Invested']];

  investments?.map(({ alias, etf, amount }) => {
    dataForPieChart.push([`${alias !== '' ? alias : etf}`, Number(amount)]);
  });

  return dataForPieChart;
};
