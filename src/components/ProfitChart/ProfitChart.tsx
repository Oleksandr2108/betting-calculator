/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useState } from "react";
import styles from "./ProfitChart.module.css";
import type { HistoryEntry } from "../../hooks/useBetCalculator";
import { CURRENCIES } from "../../constants/currencies";
import { GAME_TYPES } from "../../constants/gameTypes";
import { convertCurrency } from "../../utils/currency";

interface ProfitChartProps {
  history: HistoryEntry[];
  displayCurrency?: string;
  onCurrencyChange?: (currency: string) => void;
}

const HatchedPattern = () => (
  <pattern
    id="hatched-profit"
    x="0"
    y="0"
    width="6.81"
    height="6.81"
    patternUnits="userSpaceOnUse"
    patternTransform="rotate(-45)"
    overflow="visible"
  >
    <g
      overflow="visible"
      className="will-change-transform"
    >
      <animateTransform
        attributeName="transform"
        type="translate"
        from="0 0"
        to="6 0"
        dur="1s"
        repeatCount="indefinite"
      />
      <rect
        width="10"
        height="10"
        opacity={0.05}
        fill="hsl(142, 71%, 45%)"
      />
      <rect
        width="1"
        height="10"
        fill="hsl(142, 71%, 45%)"
      />
    </g>
  </pattern>
);

const CustomTooltip = ({
  active,
  payload,
  label,
  currencySymbol,
}: {
  active: boolean;
  payload: any[];
  label: string;
  currencySymbol: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipLabel}>{label}</p>
      <p className={styles.tooltipValue}>
        {payload[0].value >= 0 ? "+" : ""}
        {payload[0].value.toFixed(2)} {currencySymbol}
      </p>
    </div>
  );
};

const ProfitChart = ({
  history,
  displayCurrency = "UAH",
  onCurrencyChange,
}: ProfitChartProps) => {
  const [localCurrency, setLocalCurrency] = useState(displayCurrency);
  const [isHovering, setIsHovering] = useState(false);

  const activeCurrency = onCurrencyChange ? displayCurrency : localCurrency;
  const currSymbol =
    CURRENCIES.find((c) => c.code === activeCurrency)?.symbol ?? "₴";

  const handleCurrencyChange = (code: string) => {
    setLocalCurrency(code);
    onCurrencyChange?.(code);
  };

  const data = [...history].reverse().map((entry, index) => {
    const game = GAME_TYPES.find((g) => g.value === entry.gameType);
    const originalCurrency = entry.currency ?? "UAH";
    const convertedProfit = convertCurrency(
      entry.profit,
      originalCurrency,
      activeCurrency,
    );
    return {
      name: ` ${game?.label ?? entry.gameType} #${index + 1}`,
      profit: parseFloat(convertedProfit.toFixed(2)),
    };
  });

  const totalProfit = data.reduce((sum, d) => sum + d.profit, 0);

  const isPositive = totalProfit >= 0;

  // Calculate min and max for Y-axis domain with padding
  const profits = data.map((d) => d.profit);
  const minProfit = Math.min(...profits);
  const maxProfit = Math.max(...profits);
  const range = maxProfit - minProfit;
  const padding = range === 0 ? Math.abs(maxProfit) * 0.1 || 1 : range * 0.05; // Handle case where all values are the same
  const yAxisDomain = [minProfit - padding, maxProfit + padding];

  if (history.length === 0) return null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h3 className={styles.heading}>Profit Chart</h3>
          <div className={styles.currencySwitch}>
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                className={`${styles.currencyBtn} ${activeCurrency === c.code ? styles.currencyBtnActive : ""}`}
                onClick={() => handleCurrencyChange(c.code)}
              >
                {c.symbol} {c.code}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.description}>
          <span
            className={`${styles.badge} ${isPositive ? styles.badgePositive : styles.badgeNegative}`}
          >
            <span className={styles.trendIcon}>{isPositive ? "↑" : "↓"}</span>
            <span>
              {isPositive ? "+" : ""}
              {totalProfit.toFixed(2)} {currSymbol}
            </span>
          </span>
        </div>
      </div>
      <div className={styles.chartContainer}>
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart
            accessibilityLayer
            data={data}
            onMouseMove={() => {
              setIsHovering(true);
            }}
            onMouseLeave={() => {
              setIsHovering(false);
            }}
            margin={{ top: 5, right: 12, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="name"
              tickLine={true}
              axisLine={true}
              tickMargin={8}
              tick={{ fontSize: 10 }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => `${v}`}
              width={65}
              domain={yAxisDomain}
            />
            <Tooltip
              cursor={false}
              content={
                <CustomTooltip
                  currencySymbol={currSymbol}
                  active={false}
                  payload={[]}
                  label={""}
                />
              }
            />
            <defs>
              <HatchedPattern />
              <linearGradient
                id="gradient-profit"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="hsl(142, 71%, 45%)"
                  stopOpacity={0.7}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(142, 71%, 45%)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="profit"
              type="monotone"
              fill={
                isHovering ? "url(#hatched-profit)" : "url(#gradient-profit)"
              }
              fillOpacity={0.4}
              stroke="hsl(142, 71%, 45%)"
              strokeWidth={2}
            />
            <Area
              dataKey="profit"
              type='monotone'
              fill="none"
              stroke="hsl(142, 71%, 45%)"
              strokeOpacity={0.1}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProfitChart;
