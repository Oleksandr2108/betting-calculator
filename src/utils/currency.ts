import { CURRENCIES } from "../constants/currencies";

export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string,
): number {
  const from = CURRENCIES.find((c) => c.code === fromCode);
  const to = CURRENCIES.find((c) => c.code === toCode);
  if (!from || !to) return amount;

  const inUAH = amount / from.rate;
  return inUAH * to.rate;
}
