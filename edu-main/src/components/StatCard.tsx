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
  glassVariant?: "purple" | "rose" | "sky" | "amber" | "default";
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
  glassVariant = "default",
}: StatCardProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (progress === undefined) return;
    const timer = setTimeout(() => setAnimatedProgress(progress), 150);
    return () => clearTimeout(timer);
  }, [progress]);

  const isPositiveTrend = trend !== undefined && trend >= 0;

  const variantStyles = {
    purple: "glass-stat-purple",
    rose: "glass-stat-rose",
    sky: "glass-stat-sky",
    amber: "glass-stat-amber",
    default: "",
  };

  const selectedGlassClass = variantStyles[glassVariant] || variantStyles.default;

  return (
    <GlassCard
      hover
      className={`relative overflow-hidden group transition-all duration-300 ${selectedGlassClass} ${tintClass} flex flex-col gap-3.5 min-w-0`}
    >
      {/* Glossy shine reflection overlay */}
      <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-white/30 dark:bg-white/10 blur-2xl group-hover:bg-white/50 transition-all duration-500 pointer-events-none" />

      <div className="flex items-start justify-between gap-2 relative z-10">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">
            {label}
          </span>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none mt-1.5 tracking-tight">
            {value}
          </span>
        </div>
        <div className="shrink-0 w-11 h-11 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-white/90 dark:border-slate-700/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-md shadow-indigo-500/5 backdrop-blur-md group-hover:scale-105 transition-transform duration-300">
          {icon}
        </div>
      </div>

      {trend !== undefined && (
        <div
          className={`flex items-center gap-1.5 text-xs font-semibold relative z-10 ${
            isPositiveTrend ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
          }`}
          aria-label={`Trend: ${trend > 0 ? "+" : ""}${trend}% ${trendLabel ?? ""}`}
        >
          <div className={`p-0.5 rounded-full ${isPositiveTrend ? "bg-emerald-100 dark:bg-emerald-950/60" : "bg-rose-100 dark:bg-rose-950/60"}`}>
            {isPositiveTrend ? (
              <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
            )}
          </div>
          <span>
            {trend > 0 ? "+" : ""}
            {trend}% {trendLabel}
          </span>
        </div>
      )}

      {progress !== undefined && (
        <div
          className="progress-bar-track relative z-10 h-2 bg-slate-200/70 dark:bg-slate-700/60 backdrop-blur-md rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={animatedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${label}: ${animatedProgress}%`}
        >
          <div
            className="progress-bar-fill h-full rounded-full transition-all duration-700 ease-out shadow-sm"
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
