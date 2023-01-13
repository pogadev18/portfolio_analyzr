import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/router';

import type { CreateCash } from '@/root/schema/cashSchema';
import { createCashSchemaClient } from '@/root/schema/cashSchema';
import { trpc } from '@/root/utils/trpc';

const CashForm = () => {
  // keep track of the selected investment year
  const [selectedInvestmentYear, setSelectedInvestmentYear] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const { id } = router.query;

  // get all investment years
  const { data: investmentYears } = trpc.investmentYear.getAll.useQuery({
    portfolioId: id as string,
  });

  const { mutateAsync: addCash, isLoading: addingCash } = trpc.cash.create.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCash>({
    resolver: zodResolver(createCashSchemaClient),
  });

  function onSubmit(values: CreateCash) {
    // get the id of the investment year that the user selected
    const investmentYearId = investmentYears?.find(
      (year) => year.year === values.investmentYear,
    )?.id;

    if (session?.user && investmentYearId) {
      const data = {
        ...values,
        userId: session.user.id,
        portfolioId: id as string,
        investmentYearId: investmentYearId,
      };

      addCash(data);
    }
  }

  if (addingCash) return <p>adding cash...</p>;

  return (
    <form className="flex-1" onSubmit={handleSubmit(onSubmit)}>
      <section className="w-1/3 p-4">
        <div className="mb-6">
          <label htmlFor="investmentYear" className="mb-2 block text-sm font-medium">
            Choose an investment year
          </label>
          <select
            {...register('investmentYear')}
            required
            id="investmentYear"
            onChange={(event) =>
              // todo: improve this logic maybe?
              setSelectedInvestmentYear(event?.currentTarget?.value?.replace('Choose...', '') ?? '')
            }
            className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Choose...</option>
            {investmentYears?.map((year) => (
              <option value={year.year} key={year.id}>
                {year.year}
              </option>
            ))}
          </select>
        </div>
        {errors.investmentYear && (
          <p className="font-bold text-red-600">{errors.investmentYear.message}</p>
        )}

        {/*
            - based on the selected investment year from above, set the min & max for the date input
            - also, disable the input until an investment year is selected
        */}
        <div className="mb-6">
          <label htmlFor="date" className="mb-2 block text-sm font-medium">
            Date of investment (month and day)
          </label>
          <input
            disabled={!selectedInvestmentYear}
            min={`${selectedInvestmentYear}-01-01`}
            max={`${selectedInvestmentYear}-12-31`}
            type="date"
            id="date"
            className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            required
            {...register('date')}
          />
        </div>
        {errors.date && <p className="font-bold text-red-600">{errors.date.message}</p>}

        <div className="mb-6">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Total
          </label>
          <div className="flex items-center">
            <div className="price flex-1">
              <input
                type="number"
                step="any"
                id="amount"
                className="block w-full rounded-lg rounded-tr-none rounded-br-none border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                required
                {...register('amount')}
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
        {errors.amount && <p className="font-bold text-red-600">{errors.amount.message}</p>}

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

export default CashForm;
