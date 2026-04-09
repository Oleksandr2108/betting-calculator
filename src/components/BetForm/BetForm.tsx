import { CURRENCIES } from "../../constants/currencies";
import { GAME_TYPES } from "../../constants/gameTypes";
import type { FormData, FormErrors } from "../../hooks/useBetCalculator";
import styles from "./BetForm.module.css";

interface BetFormProps {
  formData: FormData;
  errors: FormErrors;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSubmit: () => void;
}

const BetForm = ({ formData, errors, onChange, onSubmit }: BetFormProps) => {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form
      className={styles.card}
      onSubmit={handleFormSubmit}
    >
      <h2 className={styles.heading}>Betting options</h2>

      <div className={styles.fieldGroup}>
        {/* Bet Amount */}
        <div>
          <label
            htmlFor="betAmount"
            className={styles.label}
          >
            Bet Amount
          </label>
          <input
            id="betAmount"
            type="number"
            name="betAmount"
            value={formData.betAmount}
            onChange={onChange}
            placeholder="Enter bet amount..."
            min={1}
            className={`${styles.input} ${errors.betAmount ? styles.inputError : ""}`}
          />
          {errors.betAmount && (
            <p className={styles.errorText}>{errors.betAmount}</p>
          )}
        </div>

        {/* Coefficient */}
        <div>
          <label
            htmlFor="coefficient"
            className={styles.label}
          >
            Coefficient
          </label>
          <input
            id="coefficient"
            type="number"
            name="coefficient"
            value={formData.coefficient}
            onChange={onChange}
            placeholder="For example, 2.5"
            step="0.01"
            className={`${styles.input} ${errors.coefficient ? styles.inputError : ""}`}
          />
          {errors.coefficient && (
            <p className={styles.errorText}>{errors.coefficient}</p>
          )}
        </div>

        {/* Game Type */}
        <div>
          <label
            htmlFor="gameType"
            className={styles.label}
          >
            Game Type
          </label>
          <select
            id="gameType"
            name="gameType"
            value={formData.gameType}
            onChange={onChange}
            className={`${styles.select} ${errors.gameType ? styles.inputError : ""}`}
          >
            <option value="">Select game type...</option>
            {GAME_TYPES.map((type) => (
              <option
                key={type.value}
                value={type.value}
              >
                {type.label}
              </option>
            ))}
          </select>
          {errors.gameType && (
            <p className={styles.errorText}>{errors.gameType}</p>
          )}
        </div>

        {/* Currency */}
        <div>
          <label
            htmlFor="currency"
            className={styles.label}
          >
            Currency
          </label>
          <select
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={onChange}
            className={styles.select}
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
        </div>

        <button
          type="submit"
          className={styles.submitButton}
        >
          Calculate ✨
        </button>
      </div>
    </form>
  );
};

export default BetForm;
