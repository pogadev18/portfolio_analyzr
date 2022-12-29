import { Chart } from 'react-google-charts';

import type { InvestmentYear } from '.prisma/client';

interface IInvestmentsPieChartsProps {
  investmentYears: InvestmentYear[] | undefined;
}

const data = [
  ['Task', 'Hours per Day'],
  ['Work', 484.23],
  ['Eat', 423],
  ['Commute', 1937],
  ['Watch TV', 675],
  ['Sleep', 876],
  ['Drink', 1322.32],
];

const options = {
  title: 'My Daily Activities',
  is3D: true,
};

const InvestmentsPieCharts = ({ investmentYears }: IInvestmentsPieChartsProps) => {
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
          <Chart chartType="PieChart" data={data} options={options} width="100%" height="800px" />
        </div>
      ) : null}
    </section>
  );
};

export default InvestmentsPieCharts;
