import Head from 'next/head';
import { useRouter } from 'next/router';

const PortfolioPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <Head>
        <title>ETFs Portfolio Analyzr | Portfolio</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Portfolio Page: {id}</h1>
      </main>
    </>
  );
};

export default PortfolioPage;