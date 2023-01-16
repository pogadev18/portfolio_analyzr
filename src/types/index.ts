import type { ChangeEvent, RefCallback } from 'react';

// use this type to return allYearInvestments
export type AllInvestment = {
  etf: string;
  amount: number;
  units: number;
  currency: string | undefined;
  alias: string | null | undefined;
};

export type InputProps = {
  onChange?: (e: ChangeEvent) => unknown;
  onBlur?: (e: ChangeEvent) => unknown;
  ref?: RefCallback<HTMLInputElement>;
  name?: string;
  min?: string | number;
  max?: string | number;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  required?: boolean;
  disabled?: boolean;
};
