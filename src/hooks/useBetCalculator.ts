import { useCallback, useEffect, useMemo, useState } from "react";
import { CURRENCIES } from "../constants/currencies";

export interface FormData {
  betAmount: string;
  coefficient: string;
  gameType: string;
  currency: string;
}
export interface FormErrors {
  betAmount?: string;
  coefficient?: string;
  gameType?: string;
}

export interface BetResult {
  win: number;
  profit: number;
}

export interface HistoryEntry {
  id: number;
  date: string;
  amount: number;
  coefficient: number;
  gameType: string;
  potentialWin: number;
  profit: number;
  currency: string;
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  if (!value || typeof value !== "object") return false;

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === "number" &&
    typeof entry.date === "string" &&
    typeof entry.amount === "number" &&
    typeof entry.coefficient === "number" &&
    typeof entry.gameType === "string" &&
    typeof entry.potentialWin === "number" &&
    typeof entry.profit === "number" &&
    typeof entry.currency === "string"
  );
}

function loadHistory(): HistoryEntry[] {
  const saved = localStorage.getItem("betHistory");
  if (!saved) return [];

  try {
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isHistoryEntry);
  } catch {
    return [];
  }
}

export function useBetCalculator() {
  const [formData, setFormData] = useState<FormData>({
    betAmount: "",
    coefficient: "",
    gameType: "",
    currency: "UAH",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  useEffect(() => {
    localStorage.setItem("betHistory", JSON.stringify(history));
  }, [history]);

  const result = useMemo<BetResult | null>(() => {
    const amount = parseFloat(formData.betAmount);
    const coeff = parseFloat(formData.coefficient);
    if (isNaN(amount) || isNaN(coeff) || amount <= 0 || coeff < 1.01)
      return null;
    const win = amount * coeff;
    return { win, profit: win - amount };
  }, [formData.betAmount, formData.coefficient]);

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};
    const amount = parseFloat(formData.betAmount);
    const coeff = parseFloat(formData.coefficient);

    if (!formData.betAmount || isNaN(amount))
      newErrors.betAmount = "Enter the bet amount";
    else if (amount <= 0) newErrors.betAmount = "Amount must be greater than 0";
    else if (amount > 100000) newErrors.betAmount = "Maximum amount is 100,000";

    if (!formData.coefficient || isNaN(coeff))
      newErrors.coefficient = "Enter the coefficient";
    else if (coeff < 1.01)
      newErrors.coefficient = "Minimum coefficient is 1.01";
    else if (coeff > 1000)
      newErrors.coefficient = "Maximum coefficient is 1000";

    if (!formData.gameType) newErrors.gameType = "Select game type";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    if (!validate() || !result) return;

    const now = new Date();
    const entry: HistoryEntry = {
      id: Date.now(),
      date: now.toLocaleString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      amount: parseFloat(formData.betAmount),
      coefficient: parseFloat(formData.coefficient),
      gameType: formData.gameType,
      potentialWin: result.win,
      profit: result.profit,
      currency: formData.currency,
    };

    setHistory((prev) => [entry, ...prev].slice(0, 5));
    setFormData({
      betAmount: "",
      coefficient: "",
      gameType: "",
      currency: formData.currency,
    });
    setErrors({});
  }, [validate, result, formData]);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const currencySymbol =
    CURRENCIES.find((c) => c.code === formData.currency)?.symbol ?? "₴";

  return {
    formData,
    errors,
    result,
    history,
    handleChange,
    handleSubmit,
    clearHistory,
    currencySymbol,
  };
}
