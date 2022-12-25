import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

function NavLink({ children, href }: { children: ReactNode; href: string }) {
  const router = useRouter();

  return (
    <Link className="mx-3" href={href}>
      <span className={`${router.pathname === href ? 'font-bold' : 'font-normal'}`}>
        {children}
      </span>
    </Link>
  );
}

export default NavLink;
