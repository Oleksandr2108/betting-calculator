import { useState } from "react";
import type { HistoryEntry } from "../../hooks/useBetCalculator";
import BetHistoryItem from "../BetHistoryItem/BetHistoryItem";
import styles from "./BetHistory.module.css";
import { CURRENCIES } from "../../constants/currencies";

interface BetHistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
  currencySymbol: string;
}

const BetHistory = ({ history, onClear }: BetHistoryProps) => {
  const [displayCurrency, setDisplayCurrency] = useState("UAH");

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.heading}>
          Latest bets
        </h2>
        <div className={styles.headerActions}>
          {history.length > 0 && (
            <>
              <select
                value={displayCurrency}
                onChange={(e) => setDisplayCurrency(e.target.value)}
                className={styles.currencySelect}
              >
                {CURRENCIES.map((c) => (
                  <option
                    key={c.code}
                    value={c.code}
                  >
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
              <button
                onClick={onClear}
                className={styles.clearButton}
              >
                Clear
              </button>
            </>
          )}
        </div>
      </div>

      {history.length === 0 ? (
        <div className={styles.placeholder}>
          <p className={styles.placeholderIcon}>📋</p>
          <p className={styles.placeholderText}>The story is empty</p>
        </div>
      ) : (
        <div className={styles.list}>
          {history.map((bet) => (
            <BetHistoryItem
              key={bet.id}
              bet={bet}
              displayCurrency={displayCurrency}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BetHistory;
