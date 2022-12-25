import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';

import { createPortfolioSchemaClient, CreatePortfolio } from '@/root/schema/portfolioSchema';
import { trpc } from '@/root/utils/trpc';

const PortfolioForm = () => {
  const { data: session } = useSession();
  const trpcUtils = trpc.useContext();

  const { mutateAsync: createPortfolio, isLoading } = trpc.portfolio.create.useMutation({
    onSuccess: () => trpcUtils.portfolio.getAll.invalidate(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePortfolio>({
    resolver: zodResolver(createPortfolioSchemaClient),
  });

  function onSubmit(values: CreatePortfolio) {
    const data = {
      userId: session?.user?.id ?? '',
      ...values,
    };

    createPortfolio(data);
  }

  if (isLoading) return 'creating portfolio...';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="text-left">
      <section className="w-1/3 p-4">
        <div className="mb-6">
          <label htmlFor="name" className="mb-2 block text-sm font-medium ">
            Portfolio Name
          </label>
          <input
            type="text"
            id="name"
            className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            required
            {...register('name')}
          />
        </div>
        {errors.name && <p className="font-bold text-red-600">{errors.name.message}</p>}

        <div className="mb-6">
          <label htmlFor="desc" className="mb-2 block text-sm font-medium ">
            Description
          </label>
          <textarea
            id="desc"
            className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            {...register('description')}
          />
        </div>
        {errors.description && (
          <p className="font-bold text-red-600">{errors.description.message}</p>
        )}
        <button
          type="submit"
          className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white"
        >
          Submit
        </button>
      </section>
    </form>
  );
};

export default PortfolioForm;
