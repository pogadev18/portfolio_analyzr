import { getSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import { Session } from 'next-auth';
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
