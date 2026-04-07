export interface Currency {
  code: string;
  symbol: string;
  rate: number;
}

export const CURRENCIES: Currency[] = [
  { code: "UAH", symbol: "₴", rate: 1 },
  { code: "USD", symbol: "$", rate: 0.024 },
  { code: "EUR", symbol: "€", rate: 0.022 },
];
