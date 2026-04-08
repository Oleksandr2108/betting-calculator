import { CURRENCIES } from "../../constants/currencies";
import { GAME_TYPES } from "../../constants/gameTypes";
import type { HistoryEntry } from "../../hooks/useBetCalculator";
import styles from "./BetHistoryItem.module.css";

interface BetHistoryItemProps {
  bet: HistoryEntry;
  displayCurrency: string;
}

function convert(amount: number, fromCode: string, toCode: string): number {
  const from = CURRENCIES.find((c) => c.code === fromCode);
  const to = CURRENCIES.find((c) => c.code === toCode);
  if (!from || !to) return amount;

  const inUAH = amount / from.rate;
  return inUAH * to.rate;
}

const BetHistoryItem = ({ bet, displayCurrency }: BetHistoryItemProps) => {
  const game = GAME_TYPES.find((g) => g.value === bet.gameType);

  const originalCurrency = bet.currency ?? "UAH";
  const origSymbol =
    CURRENCIES.find((c) => c.code === originalCurrency)?.symbol ?? "₴";
  const dispSymbol =
    CURRENCIES.find((c) => c.code === displayCurrency)?.symbol ?? "₴";

  const needsConversion = originalCurrency !== displayCurrency;

  const convertedProfit = convert(
    bet.profit,
    originalCurrency,
    displayCurrency,
  );
  const convertedWin = convert(
    bet.potentialWin,
    originalCurrency,
    displayCurrency,
  );

  return (
    <div className={styles.item}>
      <div className={styles.left}>
        <div className={styles.info}>
        <span className={styles.icon}>{game?.label}</span>
          <p className={styles.betLine}>
            {bet.amount} {origSymbol} × {bet.coefficient}
          </p>
          <p className={styles.date}>{bet.date}</p>
        </div>
      </div>
      <div className={styles.right}>
        <p className={styles.profit}>
          +{bet.profit.toFixed(2)} {origSymbol}
        </p>
        {needsConversion && (
          <p className={styles.converted}>
            ≈ +{convertedProfit.toFixed(2)} {dispSymbol}
          </p>
        )}
        <p className={styles.potentialWin}>
          {bet.potentialWin.toFixed(2)} {origSymbol}
          {needsConversion && (
            <span className={styles.convertedSmall}>
              {" "}
              ≈ {convertedWin.toFixed(2)} {dispSymbol}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default BetHistoryItem;
