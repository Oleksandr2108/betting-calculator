import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import styles from "./ProfitChart.module.css";
import type { HistoryEntry } from "../../hooks/useBetCalculator";

interface ProfitChartProps {
  history: HistoryEntry[];
}

const ProfitChart = ({ history }: ProfitChartProps) => {
  if (history.length === 0) return null;

  const data = [...history].reverse().map((entry, i) => ({
    name: `#${i + 1}`,
    profit: parseFloat(entry.profit.toFixed(2)),
    amount: entry.amount,
  }));

  return (
    <div className={styles.card}>
      <h2 className={styles.heading}>
        <span className={styles.headingIcon}>📊</span>
        Profit Chart
      </h2>
      <div className={styles.chartContainer}>
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              className="opacity-30"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid hsl(var(--border))",
                backgroundColor: "hsl(var(--card))",
                color: "hsl(var(--card-foreground))",
              }}
              formatter={(value) =>
                value !== undefined && typeof value === "number"
                  ? [`${value.toFixed(2)} ₴`, "Profit"]
                  : null
              }
            />
            <Bar
              dataKey="profit"
              fill="hsl(142, 71%, 45%)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfitChart;
