import { useState } from 'react';
import { Chart } from 'react-google-charts';
import type { InvestmentYear, Investment } from '.prisma/client';

import { formatEtfsPieChartData } from '@/root/utils/gooleChartsDataFormat';
import { etfsPieChartOptions, currentYear } from '@/root/constants';
import { trpc } from '@/root/utils/trpc';
import LoadingSpinner from '@/root/components/loadingSpinner';

// create a procedure that will query the investments table based on the year that I'm sending from the client

/*
  0. default is the current year
  1. when click on button, set the year in a state
  2. every time the year state changes, make a DB query and grab the investments for that year
 */

interface IInvestmentsPieChartsProps {
  investmentYears: InvestmentYear[] | undefined;
  // investments: Investment[] | undefined;
  portfolioId: string;
}

const InvestmentsPieCharts = ({
  investmentYears,
  // investments,
  portfolioId,
}: IInvestmentsPieChartsProps) => {
  const [investmentYearToFetch, setInvestmentYearToFetch] = useState<string>(String(currentYear));

  // the selected year by default is the current year
  const { data: investmentsData, isLoading: loadingInvestmentYear } =
    trpc.investmentYear.getByYear.useQuery({ year: investmentYearToFetch, portfolioId });

  console.log('AAAAA', investmentsData);

  return (
    <section className="flex p-10">
      <ul className="years-list">
        {investmentYears?.length ? (
          <>
            <li>
              <button type="button" className="w-32 rounded bg-amber-500 p-5 hover:bg-amber-200">
                all
              </button>
            </li>
            {investmentYears?.map((year) => (
              <li key={year.id}>
                <button
                  onClick={(event) => setInvestmentYearToFetch(event.currentTarget.textContent!)}
                  type="button"
                  className="my-2 w-32 rounded bg-amber-500 p-5 hover:bg-amber-200"
                >
                  {year.year}
                </button>
              </li>
            ))}
          </>
        ) : null}
      </ul>
      {investmentYears?.length ? (
        <div className="pie-chart flex-1 px-10">
          {loadingInvestmentYear ? (
            <LoadingSpinner />
          ) : (
            <>
              <h2 className="text-3xl font-bold">
                Total sum to invest in {investmentsData?.investmentYearInfo?.year}:{' '}
                <span>
                  {investmentsData?.investmentYearInfo?.sumToInvest}{' '}
                  {investmentsData?.investmentYearInfo?.currency}
                </span>
              </h2>
              <Chart
                chartType="PieChart"
                data={formatEtfsPieChartData(investmentsData?.investmentsInThatYear)}
                options={etfsPieChartOptions}
                width="100%"
                height="800px"
              />
            </>
          )}
        </div>
      ) : null}
    </section>
  );
};

export default InvestmentsPieCharts;
