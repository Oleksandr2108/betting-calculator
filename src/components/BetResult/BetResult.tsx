import { GAME_TYPES } from "../../constants/gameTypes";
import type { BetResult } from "../../hooks/useBetCalculator";
import styles from "./BetResult.module.css";

interface BetResultProps {
  result: BetResult | null;
  gameType: string;
  currencySymbol: string;
}

const BetResultComponent = ({ result, gameType, currencySymbol }: BetResultProps) => {
  const game = GAME_TYPES.find((g) => g.value === gameType);

  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>Bet Result</h2>

      {result ? (
        <div className={styles.resultContent}>
          {game && (
            <div className={styles.gameInfo}>
              <span className={styles.gameLabel}>{game.label}</span>
            </div>
          )}

          <div className={styles.resultBox}>
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>Potential winnings</span>
              <span className={styles.resultWin}>
                {result.win.toFixed(2)} {currencySymbol}
              </span>
            </div>
            <div className={styles.divider} />
            <div className={styles.resultRow}>
              <span className={styles.resultLabel}>Net profit</span>
              <span className={styles.resultProfit}>
                +{result.profit.toFixed(2)} {currencySymbol}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.placeholder}>
          <p className={styles.placeholderIcon}>📊</p>
          <p className={styles.placeholderText}>Enter data for calculation</p>
        </div>
      )}
    </div>
  );
};

export default BetResultComponent;
