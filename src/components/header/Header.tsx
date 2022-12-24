import { signIn, signOut, useSession } from 'next-auth/react';

import NavLink from '@/root/components/navLink';

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="bg-amber-600 py-3 text-center">
      {session ? (
        <button onClick={() => signOut()} className="text-white">
          Sign out
        </button>
      ) : (
        <button onClick={() => signIn()} className="text-white">
          Sign In
        </button>
      )}

      {session && (
        <nav>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/create-portfolio">Create Portfolio</NavLink>
        </nav>
      )}
    </header>
  );
};

export default Header;
