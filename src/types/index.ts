// use this type to return allYearInvestments
export type AllYearsInvestment = {
  etf: string;
  amount: number;
  units: number;
  currency: string | undefined;
  alias: string | null | undefined;
};
