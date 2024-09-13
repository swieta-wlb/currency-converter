export type Currency = {
  currency: string;
  code: string;
  mid: number;
  table?: string;
}

export type CurrencyRate = {
  effectiveDate: string;
  no: string;
  mid: number;
}
