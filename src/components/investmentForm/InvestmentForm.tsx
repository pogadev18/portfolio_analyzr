import dynamic from 'next/dynamic';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import type { InvestmentYear } from '@prisma/client';

import FormField from '@/root/components/formField';

const Select = dynamic(import('react-select'), { ssr: false });

import type { CreateInvestment } from '@/root/schema/investmentSchema';
import type { ETFType } from '@/root/utils/etfsList';

import { createInvestmentSchemaClient } from '@/root/schema/investmentSchema';
import { etfsSelectList } from '@/root/utils/etfsList';
import { CURRENCIES } from '@/root/constants';

interface InvestmentFormProps {
  onSubmitReady: (data: CreateInvestment) => void;
  investmentsYears: InvestmentYear[] | undefined;
}

const InvestmentForm = (props: InvestmentFormProps) => {
  // keep track of the selected investment year
  const [selectedInvestmentYear, setSelectedInvestmentYear] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CreateInvestment>({
    resolver: zodResolver(createInvestmentSchemaClient),
  });

  // TODO: useImperativeHook
  // reset form after mutation is successful
  // useEffect(() => {
  //   if (isSuccess) {
  //     reset();
  //     setSelectedInvestmentYear(null);
  //   }
  // }, [isSuccess, reset]);

  return (
    <form className="flex-1" onSubmit={handleSubmit(props.onSubmitReady)}>
      <section className="w-1/3 p-4">
        <div className="mb-6">
          <label htmlFor="investmentYear" className="mb-2 block text-sm font-medium">
            Choose an investment year for this investment
          </label>
          <select
            {...register('investmentYear')}
            id="investmentYear"
            onChange={(event) =>
              // todo: improve this logic maybe?
              setSelectedInvestmentYear(event?.currentTarget?.value?.replace('Choose...', '') ?? '')
            }
            className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          >
            <option value={0}>Choose...</option>
            {props.investmentsYears?.map((year) => (
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
          <FormField
            id="date"
            label="Date of investment (month and day)"
            error={errors.date?.message}
            type="date"
            inputProps={{
              ...register('date'),
              disabled: !selectedInvestmentYear,
              min: `${selectedInvestmentYear}-01-01`,
              max: `${selectedInvestmentYear}-12-31`,
            }}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="etfs" className="mb-2 block text-sm font-medium">
            Select an ETF
          </label>
          <Controller
            control={control}
            render={({ field: { onChange, value, name } }) => {
              // ugly "hack" for react-select onChange type (the best solution I could find on "internets")
              const isSelectOption = (v: any): v is ETFType => {
                if ((v as ETFType).value !== undefined) return v.value;
                return false;
              };

              return (
                <Select
                  id="etfs"
                  escapeClearsValue
                  {...register('etf')}
                  value={etfsSelectList.find((etf: { value: string }) => etf.value === value)}
                  name={name}
                  options={etfsSelectList}
                  onChange={(v) => {
                    if (isSelectOption(v)) {
                      onChange(v.value);
                    }
                  }}
                />
              );
            }}
            name="etf"
          />
        </div>
        {errors.etf && <p className="font-bold text-red-600">{errors.etf.message}</p>}

        <div className="mb-6">
          <FormField
            error={errors.alias?.message}
            id="alias"
            label="ETF Alias"
            inputProps={register('alias')}
          />
        </div>
        {errors.alias && <p className="font-bold text-red-600">{errors.alias.message}</p>}

        <div className="mb-6">
          <FormField
            id="units"
            label="Units bought"
            error={errors.units?.message}
            type="number"
            inputProps={register('units')}
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center">
            <div className="price flex-1">
              <FormField
                id="amount"
                label="Total price"
                error={errors.amount?.message}
                type="number"
                inputProps={register('amount')}
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

export default InvestmentForm;
