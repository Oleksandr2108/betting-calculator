
import { GAME_TYPES } from '../../constants/gameTypes';
import type { HistoryEntry } from '../../hooks/useBetCalculator';
import styles from './BetHistoryItem.module.css';

interface BetHistoryItemProps {
  bet: HistoryEntry;
  currencySymbol: string;
}

const BetHistoryItem = ({ bet, currencySymbol }: BetHistoryItemProps) => {
  const game = GAME_TYPES.find(g => g.value === bet.gameType);

  return (
    <div className={styles.item}>
      <div className={styles.left}>
        <span className={styles.icon}>{game?.label ?? '🎯'}</span>
        <div className={styles.info}>
          <p className={styles.betLine}>
            {bet.amount} {currencySymbol} × {bet.coefficient}
          </p>
          <p className={styles.date}>{bet.date}</p>
        </div>
      </div>
      <div className={styles.right}>
        <p className={styles.profit}>+{bet.profit.toFixed(2)} {currencySymbol}</p>
        <p className={styles.potentialWin}>{bet.potentialWin.toFixed(2)} {currencySymbol}</p>
      </div>
    </div>
  );
};

export default BetHistoryItem;
