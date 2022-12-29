import { Chart } from 'react-google-charts';

import type { InvestmentYear, Investment } from '.prisma/client';
import { etfsPieChartData } from '@/root/utils/gooleChartsDataFormat';

interface IInvestmentsPieChartsProps {
  investmentYears: InvestmentYear[] | undefined;
  investments: Investment[] | undefined;
}

const options = {
  title: 'My ETFs',
  is3D: true,
};

const InvestmentsPieCharts = ({ investmentYears, investments }: IInvestmentsPieChartsProps) => {
  const etfsData = etfsPieChartData(investments);

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
          <h2 className="text-3xl font-bold">Pie Chart</h2>
          <Chart
            chartType="PieChart"
            data={etfsData}
            options={options}
            width="100%"
            height="800px"
          />
        </div>
      ) : null}
    </section>
  );
};

export default InvestmentsPieCharts;
