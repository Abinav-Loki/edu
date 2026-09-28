import { useEffect, useState, type ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import GlassCard from "./GlassCard";

interface StatCardProps {
  label: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  progress?: number;
  progressColor?: string;
  icon: ReactNode;
  tintClass?: string;
}

export default function StatCard({
  label,
  value,
  trend,
  trendLabel,
  progress,
  progressColor = "#6366F1",
  icon,
  tintClass = "",
}: StatCardProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (progress === undefined) return;
    const timer = setTimeout(() => setAnimatedProgress(progress), 150);
    return () => clearTimeout(timer);
  }, [progress]);

  const isPositiveTrend = trend !== undefined && trend >= 0;

  return (
    <GlassCard hover className={`${tintClass} flex flex-col gap-3 min-w-0`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider leading-none">
            {label}
          </span>
          <span className="text-3xl font-bold text-slate-800 leading-none mt-1">
            {value}
          </span>
        </div>
        <div className="shrink-0 w-10 h-10 rounded-xl bg-white/60 border border-white/80 flex items-center justify-center text-indigo-600 shadow-sm">
          {icon}
        </div>
      </div>

      {trend !== undefined && (
        <div
          className={`flex items-center gap-1 text-xs font-medium ${
            isPositiveTrend ? "text-emerald-600" : "text-red-500"
          }`}
          aria-label={`Trend: ${trend > 0 ? "+" : ""}${trend}% ${trendLabel ?? ""}`}
        >
          {isPositiveTrend ? (
            <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span>
            {trend > 0 ? "+" : ""}
            {trend}% {trendLabel}
          </span>
        </div>
      )}

      {progress !== undefined && (
        <div
          className="progress-bar-track"
          role="progressbar"
          aria-valuenow={animatedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${animatedProgress}%`}
        >
          <div
            className="progress-bar-fill"
            style={{
              width: `${animatedProgress}%`,
              background: progressColor,
            }}
          />
        </div>
      )}
    </GlassCard>
  );
}
