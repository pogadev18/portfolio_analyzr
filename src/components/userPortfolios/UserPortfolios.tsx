import type { Portfolio } from '.prisma/client';
import { useRouter } from 'next/router';

interface IUserPortfolios {
  portfolios: Portfolio[];
}

const UserPortfolios = ({ portfolios }: IUserPortfolios) => {
  const router = useRouter();
  return (
    <div className="text-center text-white">
      {portfolios?.length > 0 ? (
        portfolios.map((portfolio) => (
          <div key={portfolio.id} className="rounded border p-3">
            <p className="text-xl font-bold">{portfolio.name}</p>
            <p>{portfolio.description}</p>
          </div>
        ))
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
