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
import { useRef, useState } from "react";
import { useSpring } from "motion/react";
import styles from "./ProfitChart.module.css";
import type { HistoryEntry } from "../../hooks/useBetCalculator";
import { CURRENCIES } from "../../constants/currencies";
import { GAME_TYPES } from "../../constants/gameTypes";

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

function convert(amount: number, fromCode: string, toCode: string): number {
  const from = CURRENCIES.find((c) => c.code === fromCode);
  const to = CURRENCIES.find((c) => c.code === toCode);
  if (!from || !to) return amount;
  const inUah = amount / from.rate;
  return inUah * to.rate;
}

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
  const chartRef = useRef<HTMLDivElement>(null);
  const [localCurrency, setLocalCurrency] = useState(displayCurrency);
  const [isHovering, setIsHovering] = useState(false);

  const activeCurrency = onCurrencyChange ? displayCurrency : localCurrency;
  const currSymbol =
    CURRENCIES.find((c) => c.code === activeCurrency)?.symbol ?? "₴";

  const handleCurrencyChange = (code: string) => {
    setLocalCurrency(code);
    onCurrencyChange?.(code);
  };

  const data = [...history].reverse().map((entry) => {
    const game = GAME_TYPES.find((g) => g.value === entry.gameType);
    const originalCurrency = entry.currency ?? "UAH";
    const convertedProfit = convert(
      entry.profit,
      originalCurrency,
      activeCurrency,
    );
    return {
      name: ` ${game?.label ?? entry.gameType}`,
      profit: parseFloat(convertedProfit.toFixed(2)),
    };
  });

  const totalProfit = data.reduce((sum, d) => sum + d.profit, 0);
  const lastProfit = data[data.length - 1]?.profit ?? 0;
  const isPositive = totalProfit >= 0;

  const springX = useSpring(0, { damping: 30, stiffness: 100 });
  const springY = useSpring(lastProfit, { damping: 10, stiffness: 10 });

  if (history.length === 0) return null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h3 className={styles.heading}>
            Profit Chart
          </h3>
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
      <div
        className={styles.chartContainer}
        ref={chartRef}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart
            className="overflow-visible"
            accessibilityLayer
            data={data}
            onMouseMove={(state) => {
              const x = state.activeCoordinate?.x;
              const dataValue =
                state.activeTooltipIndex !== null &&
                state.activeTooltipIndex !== undefined &&
                typeof state.activeTooltipIndex === "number"
                  ? data[state.activeTooltipIndex]?.profit
                  : undefined;
              if (x && dataValue !== undefined) {
                setIsHovering(true);
                springX.set(x);
                springY.set(dataValue);
              }
            }}
            onMouseLeave={() => {
              setIsHovering(false);
              springX.set(chartRef.current?.getBoundingClientRect().width || 0);
              springY.jump(lastProfit);
            }}
            margin={{ top: 5, right: 12, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 11 }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => `${v}`}
              width={65}
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
                  stopOpacity={0.3}
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
              type="natural"
              fill={
                isHovering ? "url(#hatched-profit)" : "url(#gradient-profit)"
              }
              fillOpacity={0.4}
              stroke="hsl(142, 71%, 45%)"
              strokeWidth={2}
            />
            <Area
              dataKey="profit"
              type="natural"
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
