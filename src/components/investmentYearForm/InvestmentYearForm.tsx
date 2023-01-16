import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import type { CreateInvestmentYear } from '@/root/schema/investmentYearSchema';
import { createInvestmentYearSchemaClient } from '@/root/schema/investmentYearSchema';
import { CURRENCIES } from '@/root/constants';

import { trpc } from '@/root/utils/trpc';
import { generateArrayOfYears } from '@/root/utils/generateArrayOfYears';
import FormField from '@/root/components/formField';

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
    if (session?.user) {
      const data = {
        userId: session.user.id,
        portfolioId: portfolioId as string,
        ...values,
      };

      createInvestmentYear(data);
    }
  }

  // reset form after mutation is successful
  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess, reset]);

  if (isLoading) return <p>creating investment year...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section className="w-1/3 p-4">
        <div className="mb-6">
          <label htmlFor="investmentYears" className="mb-2 block text-sm font-medium">
            Choose an investment year
          </label>
          <select
            placeholder="choose..."
            {...register('year')}
            id="investmentYears"
            className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          >
            {investmentYearsList.map((year) => (
              <option value={year} key={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        {errors.year && <p className="font-bold text-red-600">{errors.year.message}</p>}

        <div className="mb-6">
          <div className="flex items-center">
            <div className="price flex-1">
              <FormField
                id="sumToInvest"
                label="Sum to invest (you can always edit this later)"
                error={errors.sumToInvest?.message}
                type="number"
                inputProps={register('sumToInvest')}
              />
            </div>
            <div className="currency">
              <select
                className="block w-full rounded-lg rounded-bl-none rounded-tl-none border border-gray-300 p-2.5 text-sm text-gray-900
            focus:border-blue-500 focus:ring-blue-500"
                {...register('currency')}
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

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
