import dynamic from 'next/dynamic';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Select = dynamic(import('react-select'), { ssr: false });

import type { CreateInvestment } from '@/root/schema/investmentSchema';
import type { ETFType } from '@/root/utils/etfsList';

import { createInvestmentSchemaClient } from '@/root/schema/investmentSchema';
import { etfsSelectList } from '@/root/utils/etfsList';
import { trpc } from '@/root/utils/trpc';

const InvestmentForm = () => {
  const router = useRouter();
  const { id } = router.query;
  const trpcUtils = trpc.useContext();

  const {
    mutateAsync: createInvestment,
    isLoading,
    isSuccess,
  } = trpc.investment.create.useMutation({
    onSuccess: () => trpcUtils.investment.getAll.invalidate(),
  });
  const { data: session } = useSession();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateInvestment>({
    resolver: zodResolver(createInvestmentSchemaClient),
  });

  function onSubmit(values: CreateInvestment) {
    const data = {
      ...values,
      userId: session?.user?.id ?? '',
      portfolioId: id as string,
    };

    createInvestment(data);
  }

  // reset form after mutation is successful
  useEffect(() => {
    if (isSuccess) {
      reset();
    }
  }, [isSuccess]);

  if (isLoading) return <p>creating investment...</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <section className="w-1/3 p-4">
        <div className="mb-6">
          <label htmlFor="date" className="mb-2 block text-sm font-medium">
            Date of investment
          </label>
          <input
            min="2000-01-01"
            type="date"
            id="date"
            className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            required
            {...register('date')}
          />
        </div>
        {errors.date && <p className="font-bold text-red-600">{errors.date.message}</p>}

        <div className="mb-6">
          <label htmlFor="etfs" className="mb-2 block text-sm font-medium">
            Select an ETF
          </label>
          <Controller
            control={control}
            render={({ field: { onChange, value, name, ref } }) => (
              <Select
                id="etfs"
                escapeClearsValue
                inputRef={ref}
                value={etfsSelectList.find((etf: { value: string }) => etf.value === value)}
                name={name}
                options={etfsSelectList}
                onChange={(selectedOption: ETFType) => {
                  onChange(selectedOption.value);
                }}
              />
            )}
            name="etf"
          />
        </div>
        {errors.etf && <p className="font-bold text-red-600">{errors.etf.message}</p>}

        <div className="mb-6">
          <label htmlFor="alias" className="mb-2 block text-sm font-medium ">
            ETF Alias
          </label>
          <input
            type="text"
            id="alias"
            className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            {...register('alias')}
          />
        </div>
        {errors.alias && <p className="font-bold text-red-600">{errors.alias.message}</p>}

        <div className="mb-6">
          <label htmlFor="units" className="mb-2 block text-sm font-medium">
            Units bought
          </label>
          <input
            type="number"
            id="units"
            className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            required
            {...register('units')}
          />
        </div>
        {errors.units && <p className="font-bold text-red-600">{errors.units.message}</p>}

        <div className="mb-6">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Total price (EUR)
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

export default InvestmentForm;
