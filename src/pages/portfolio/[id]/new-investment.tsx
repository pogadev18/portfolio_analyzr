import Head from 'next/head';
import type { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';

import InvestmentForm from '@/root/components/investmentForm';

import { requireAuth } from '@/root/utils/requireAuth';
import NavLink from '@/root/components/navLink';

const NewInvestment = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>ETFs Portfolio Analyzr | New Investment</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="p-5">
        <NavLink href={`/portfolio/${id}`}>Back to Portfolio</NavLink>
        <h1>Add Investment</h1>
        <InvestmentForm />
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

export default NewInvestment;
