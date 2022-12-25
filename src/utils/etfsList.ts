import etfsList from '@/root/etfs.json';

export type ETFType = {
  value: string;
  label: string;
};

const etfs = JSON.stringify(etfsList);

export const etfsSelectList = JSON.parse(etfs).map((etf: { name: string; simbol: string }) => ({
  value: etf.simbol,
  label: etf.name,
}));
