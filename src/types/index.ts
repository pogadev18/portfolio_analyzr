export type MergedETF = {
  info?: {
    etfsMerged: string;
  };
  etf: string;
  alias: string | null;
  currency: string;
  units: string | null;
  amount: string;
};
