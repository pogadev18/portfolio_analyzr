import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Header from '@/root/components/header';

import { trpc } from '../utils/trpc';

import '../styles/globals.css';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Header />
      <Component {...pageProps} />
      <ReactQueryDevtools />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
