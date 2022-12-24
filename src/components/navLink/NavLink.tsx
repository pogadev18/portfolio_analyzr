import React from 'react';
import { useRouter } from 'next/router';

function NavLink({ children, href }: { children: React.ReactNode; href: string }) {
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await router.push(href);
  };

  return (
    <a className="mx-3" href={href} onClick={handleClick}>
      <span className={`${router.pathname === href ? 'font-bold' : 'font-normal'}`}>
        {children}
      </span>
    </a>
  );
}

export default NavLink;
