import type { InvestmentYear } from '.prisma/client';

interface IInvestmentsPieChartsProps {
  investmentYears: InvestmentYear[] | undefined;
}

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
        <div className="pie-chart px-10">
          <h2 className="text-3xl font-bold">Pie Chart</h2>
        </div>
      ) : null}
    </section>
  );
};

export default InvestmentsPieCharts;
