import { useState } from 'react';
import { Chart } from 'react-google-charts';
import type { InvestmentYear } from '.prisma/client';
import { useRouter } from 'next/router';

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
  portfolioId: string;
}

const InvestmentsPieCharts = ({ investmentYears, portfolioId }: IInvestmentsPieChartsProps) => {
  const router = useRouter();
  const [investmentYearToFetch, setInvestmentYearToFetch] = useState<string>(String(currentYear));

  // the selected year by default is the current year
  const { data: investmentsData, isLoading: loadingInvestmentYear } =
    trpc.investmentYear.getByYear.useQuery({ year: investmentYearToFetch, portfolioId });

  console.log('investmentsData', investmentsData);

  return (
    <section className="flex p-10">
      <ul className="years-list">
        {investmentYears?.length ? (
          <>
            <li>
              <button
                onClick={() => setInvestmentYearToFetch('all')}
                type="button"
                className={`my-2 w-32 rounded ${
                  investmentYearToFetch === 'all' ? 'bg-amber-300' : 'bg-amber-500'
                }  p-5 hover:bg-amber-200`}
              >
                all
              </button>
            </li>
            {investmentYears?.map(({ year, id }) => (
              <li key={id}>
                <button
                  onClick={(event) => setInvestmentYearToFetch(event.currentTarget.textContent!)}
                  type="button"
                  className={`my-2 w-32 rounded ${
                    year === investmentYearToFetch ? 'bg-amber-300' : 'bg-amber-500'
                  }  p-5 hover:bg-amber-200`}
                >
                  {year}
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
                  {investmentsData?.investmentYearInfo?.sumToInvest}&nbsp;
                  {investmentsData?.investmentYearInfo?.currency}
                </span>
              </h2>
              {investmentsData?.investmentsInThatYear?.length === 0 ? (
                <>
                  <p>no investments for this year</p>
                  <button
                    disabled={investmentYears?.length === 0}
                    onClick={() => router.push(`/portfolio/${portfolioId}/new-investment`)}
                    className="my-3 rounded bg-red-800 p-3 text-white hover:bg-red-500 disabled:bg-gray-300"
                  >
                    add investment
                  </button>
                </>
              ) : (
                <Chart
                  chartType="PieChart"
                  data={formatEtfsPieChartData(investmentsData?.investmentsInThatYear)}
                  options={etfsPieChartOptions}
                  width="100%"
                  height="800px"
                />
              )}
            </>
          )}
        </div>
      ) : null}
    </section>
  );
};

export default InvestmentsPieCharts;
