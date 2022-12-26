import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import type { CreateInvestmentYear } from '@/root/schema/investmentYearSchema';
import { createInvestmentYearSchemaClient } from '@/root/schema/investmentYearSchema';

import { trpc } from '@/root/utils/trpc';
import { generateArrayOfYears } from '@/root/utils/generateArrayOfYears';

const InvestmentYearForm = () => {
  const router = useRouter();
  const { id: portfolioId } = router.query;
  const { data: session } = useSession();
  const investmentYearsList = generateArrayOfYears();
  const trpcUtils = trpc.useContext();

  const {
    mutateAsync: createInvestmentYear,
    isLoading,
    isSuccess,
    isError,
    failureReason,
  } = trpc.investmentYear.create.useMutation({
    useErrorBoundary: true,
    onSuccess: () => trpcUtils.investmentYear.getAll.invalidate(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateInvestmentYear>({
    resolver: zodResolver(createInvestmentYearSchemaClient),
  });

  function onSubmit(values: CreateInvestmentYear) {
    const data = {
      userId: session?.user?.id ?? '',
      portfolioId: portfolioId as string,
      ...values,
    };

    createInvestmentYear(data);
  }

  // reset form after mutation is successful
  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess]);

  if (isLoading) return <p>creating investment year...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section className="w-1/3 p-4">
        <div className="mb-6">
          <label htmlFor="investmentYears" className="mb-2 block text-sm font-medium">
            Choose an investment year
          </label>
          <select
            {...register('year')}
            required
            id="investmentYears"
            className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Chose a year...</option>
            {investmentYearsList.map((year) => (
              <option value={year} key={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        {errors.year && <p className="font-bold text-red-600">{errors.year.message}</p>}

        <div className="mb-6">
          <label htmlFor="sumToInvest" className="mb-2 block text-sm font-medium">
            Sum to invest (you can always edit this later)
          </label>
          <div className="flex items-center">
            <div className="price flex-1">
              <input
                type="number"
                step="any"
                id="sumToInvest"
                className="block w-full rounded-lg rounded-tr-none rounded-br-none border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                required
                {...register('sumToInvest')}
              />
            </div>
            <div className="currency">
              <select
                className="block w-full rounded-lg rounded-bl-none rounded-tl-none border border-gray-300 p-2.5 text-sm text-gray-900
            focus:border-blue-500 focus:ring-blue-500"
                {...register('currency')}
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="RON">RON</option>
              </select>
            </div>
          </div>
        </div>

        {errors.sumToInvest && (
          <p className="font-bold text-red-600">{errors.sumToInvest.message}</p>
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

export default InvestmentYearForm;
