
import type { HistoryEntry } from '../../hooks/useBetCalculator';
import BetHistoryItem from '../BetHistoryItem/BetHistoryItem';
import styles from './BetHistory.module.css';

interface BetHistoryProps {
  history: HistoryEntry[];
  onClear: () => void;
  currencySymbol: string;
}

const BetHistory = ({ history, onClear, currencySymbol }: BetHistoryProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.heading}>
          <span className={styles.headingIcon}>3</span>
          Останні ставки
        </h2>
        {history.length > 0 && (
          <button onClick={onClear} className={styles.clearButton}>
            Очистити
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className={styles.placeholder}>
          <p className={styles.placeholderIcon}>📋</p>
          <p className={styles.placeholderText}>Історія порожня</p>
        </div>
      ) : (
        <div className={styles.list}>
          {history.map(bet => (
            <BetHistoryItem key={bet.id} bet={bet} currencySymbol={currencySymbol} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BetHistory;
