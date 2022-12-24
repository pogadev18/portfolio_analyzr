import Link from 'next/link';

import type { Portfolio } from '.prisma/client';

interface IPortfolioCard {
  portfolio: Portfolio;
}

const PortfolioCard = ({ portfolio }: IPortfolioCard) => {
  return (
    <Link
      href={`/portfolio/${portfolio.id}`}
      className="block rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-md hover:bg-gray-600"
    >
      <p className="text-xl font-bold">{portfolio.name}</p>
      <p>{portfolio.description}</p>
    </Link>
  );
};

export default PortfolioCard;
