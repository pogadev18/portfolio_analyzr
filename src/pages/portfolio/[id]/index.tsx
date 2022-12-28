import Head from 'next/head';
import { useRouter } from 'next/router';
import type { GetServerSidePropsContext } from 'next';

import LoadingSpinner from '@/root/components/loadingSpinner';
import InvestmentsPieCharts from '@/root/components/investmentsPieCharts';

import { requireAuth } from '@/root/utils/requireAuth';
import { trpc } from '@/root/utils/trpc';

const PortfolioPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // get all investment years
  const { data: investmentYears, isLoading: loadingInvestmentYears } =
    trpc.investmentYear.getAll.useQuery({ portfolioId: id as string });

  if (loadingInvestmentYears) return <LoadingSpinner />;

  return (
    <>
      <Head>
        <title>ETFs Portfolio Analyzr | Portfolio</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Portfolio Page</h1>
        <p>
          Every portfolio is divided in multiple investment years and for each investment year,
          <br /> you can add multiple investments.{' '}
          {investmentYears?.length === 0 && (
            <span>Therefore, before adding any investments, add an investment year first.</span>
          )}
        </p>

        <button
          onClick={() => router.push(`/portfolio/${id}/new-investment-year`)}
          className="my-3 mr-3 rounded bg-red-800 p-3 text-white hover:bg-red-500"
        >
          add investment year
        </button>

        <button
          disabled={investmentYears?.length === 0}
          onClick={() => router.push(`/portfolio/${id}/new-investment`)}
          className="my-3 rounded bg-red-800 p-3 text-white hover:bg-red-500 disabled:bg-gray-300"
        >
          add investment
        </button>

        <InvestmentsPieCharts investmentYears={investmentYears} />
      </main>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return await requireAuth(context, ({ session }) => {
    return {
      props: { session },
    };
  });
}

export default PortfolioPage;
