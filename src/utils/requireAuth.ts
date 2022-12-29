import { getSession } from 'next-auth/react';
import type { GetServerSidePropsContext } from 'next';
import type { Session } from 'next-auth';

// reusable function to use in pages that need auth  to be accessed
export const requireAuth = async (
  context: GetServerSidePropsContext,
  cb: ({ session }: { session: Session }) => { props: { session: Session } },
) => {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return cb({ session });
};
