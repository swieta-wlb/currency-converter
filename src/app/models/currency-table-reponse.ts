import { Currency, CurrencyRate } from "./currency";

export type CurrencyTableResponse = {
  table: string;
  no: string;
  effectiveDate: string;
  rates: Currency[];
}

export type CurrencyResponse = {
  table: string;
  currency: string;
  code: string;
  rates: CurrencyRate[];
}
