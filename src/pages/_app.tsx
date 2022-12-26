import { type AppType } from 'next/app';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Header from '@/root/components/header';

import { trpc } from '../utils/trpc';

import ErrorBoundary from '@/root/components/errorBoundary/ErrorBoundary';
import '../styles/globals.css';

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <ErrorBoundary>
        <Header />
        <Component {...pageProps} />
      </ErrorBoundary>
      <ReactQueryDevtools />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
