import "./App.css";
import BetForm from "./components/BetForm/BetForm";
import BetHistory from "./components/BetHistory/BetHistory";
import BetResultComponent from "./components/BetResult/BetResult";
import ProfitChart from "./components/ProfitChart/ProfitChart";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";
import { useBetCalculator } from "./hooks/useBetCalculator";

function App() {
  const {
    formData,
    errors,
    handleChange,
    handleSubmit,
    result,
    currencySymbol,
    history,
    clearHistory,
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
              <BetResultComponent
                result={result}
                gameType={formData.gameType}
                currencySymbol={currencySymbol}
              />
            </div>
            <div className="column">
              <BetHistory
                history={history}
                onClear={clearHistory}
              />
              <ProfitChart history={history} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
