import { ReactNode } from "react";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import GlassCard from "./GlassCard";

export interface MetricHistoryPoint {
  week: string;
  value: number;
}

export interface MetricAnalyticsCardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  history?: MetricHistoryPoint[];
  status?: "IMPROVING" | "STABLE" | "DECLINING";
  statusLabel?: string;
  target?: number;
  icon: ReactNode;
  accentColor?: string;
  subValue?: string;
  dotIndicator?: { total: number; late: number };
}

export default function MetricAnalyticsCard({
  title,
  value,
  trend,
  trendLabel = "this month",
  history = [],
  status,
  statusLabel,
  target,
  icon,
  accentColor = "#6366F1",
  subValue,
  dotIndicator,
}: MetricAnalyticsCardProps) {
  // Compute trend state automatically if status is not explicitly passed
  const computedStatus =
    status ||
    (trend !== undefined
      ? trend > 0
        ? "IMPROVING"
        : trend < 0
        ? "DECLINING"
        : "STABLE"
      : undefined);

  const isPositive = computedStatus === "IMPROVING";
  const isDeclining = computedStatus === "DECLINING";

  // Unique chart gradient identifier
  const chartId = `spark-${title.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`;

  return (
    <GlassCard
      hover
      className="relative overflow-hidden flex flex-col justify-between p-4 sm:p-5 min-w-0 border border-white/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg shadow-indigo-500/5 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group"
    >
      <div>
        {/* Header: Title + Icon */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-none">
            {title}
          </span>
          <div className="shrink-0 w-9 h-9 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-white/90 dark:border-slate-700/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm backdrop-blur-md group-hover:scale-105 transition-transform duration-300">
            {icon}
          </div>
        </div>

        {/* Main Metric Value + Trend Badge */}
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">
            {value}
          </span>

          {trend !== undefined && (
            <div
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                isPositive
                  ? "bg-emerald-100/90 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60"
                  : isDeclining
                  ? "bg-rose-100/90 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200/60"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 shrink-0" />
              ) : isDeclining ? (
                <TrendingDown className="w-3.5 h-3.5 shrink-0" />
              ) : (
                <Minus className="w-3.5 h-3.5 shrink-0" />
              )}
              <span>
                {trend > 0 ? "+" : ""}
                {trend}% {trendLabel ? trendLabel.split(" ")[0] : ""}
              </span>
            </div>
          )}
        </div>

        {/* Contextual Status / Subvalue */}
        {(statusLabel || computedStatus || subValue) && (
          <div className="mt-2 flex items-center justify-between text-xs">
            <span
              className={`font-semibold ${
                isDeclining
                  ? "text-rose-600 dark:text-rose-400"
                  : isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-slate-500"
              }`}
            >
              {statusLabel ||
                (isDeclining ? "↓ Declining" : isPositive ? "↑ Improving" : "• Stable")}
            </span>
            {subValue && (
              <span className="text-slate-500 dark:text-slate-400 font-medium">{subValue}</span>
            )}
          </div>
        )}
      </div>

      {/* Visual Dot Indicator for Submission Consistency */}
      {dotIndicator && (
        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5" aria-label="Submission history status">
            {Array.from({ length: dotIndicator.total }).map((_, i) => {
              const isLate = i >= dotIndicator.total - dotIndicator.late;
              return (
                <span
                  key={i}
                  className={`w-3.5 h-3.5 rounded-full transition-transform ${
                    isLate
                      ? "bg-amber-500 border border-amber-300 shadow-sm shadow-amber-500/20"
                      : "bg-emerald-500 border border-emerald-300 shadow-sm shadow-emerald-500/20"
                  }`}
                  title={isLate ? `Submission ${i + 1}: Late` : `Submission ${i + 1}: On Time`}
                />
              );
            })}
          </div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            {Math.round(((dotIndicator.total - dotIndicator.late) / dotIndicator.total) * 100)}% on time
          </span>
        </div>
      )}

      {/* Target Comparison Row (for Attendance) */}
      {target !== undefined && (
        <div className="mt-4 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Current: <strong className="text-slate-800 dark:text-slate-200">{value}</strong>
          </span>
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Target: <strong className="text-indigo-600 dark:text-indigo-400">{target}%</strong>
          </span>
        </div>
      )}

      {/* Recharts Mini Sparkline Area Chart */}
      {history.length > 0 && !dotIndicator && (
        <div className="mt-3 pt-1 h-12 w-full shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
              <defs>
                <linearGradient id={chartId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={accentColor}
                strokeWidth={2.5}
                fill={`url(#${chartId})`}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </GlassCard>
  );
}
