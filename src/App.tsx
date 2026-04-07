import "./App.css";
import ThemeToggle from "./components/ThemeToggle/ThemeToggle";

function App() {
  return  <div className="page">
      <ThemeToggle />
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="badge">Betting Calculator</div>
          <h1 className="title">🎰 Калькулятор ставок</h1>
          <p className="subtitle">
            Розрахуйте потенційний виграш та відстежуйте історію
          </p>
        </div>
      </div>
    </div>;
}

export default App;
