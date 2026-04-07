import "./App.css";
import BetForm from "./components/BetForm/BetForm";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";
import { useBetCalculator } from "./hooks/useBetCalculator";

function App() {
  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
  } = useBetCalculator();
  return (
    <div className="page">
      <ThemeToggle />
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="badge">Betting Calculator</div>
          <h1 className="title">🎰 Rate Calculator</h1>
          <p className="subtitle">
            Calculate potential winnings and track your history
          </p>
          <div className="grid">
            <div className="column">
              <BetForm
                formData={formData}
                errors={errors}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            </div>
            <div className="column">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
