import type { Portfolio } from '.prisma/client';
import { useRouter } from 'next/router';

import PortfolioCard from '@/root/components/portfolioCard';

interface IUserPortfolios {
  portfolios: Portfolio[];
}

const UserPortfolios = ({ portfolios }: IUserPortfolios) => {
  const router = useRouter();
  return (
    <div className="text-center text-white">
      {portfolios?.length > 0 ? (
        portfolios.map((portfolio) => <PortfolioCard key={portfolio.id} portfolio={portfolio} />)
      ) : (
        <>
          <p>it looks like you do not have a portfolio yet</p>
          <button
            onClick={() => router.push('/create-portfolio')}
            className="my-3 rounded bg-red-800 p-3 hover:bg-red-500"
          >
            create portfolio
          </button>
        </>
      )}
    </div>
  );
};

export default UserPortfolios;
