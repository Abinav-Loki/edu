import { UserCheck, TrendingDown, TrendingUp, Target } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, ReferenceLine, Tooltip } from "recharts";
import GlassCard from "./GlassCard";

export interface AttendanceRhythmCardProps {
  currentPercent: number;
  trend: number;
  targetPercent?: number;
  history: { week: string; attendance: number }[];
  accentColor?: string;
}

export default function AttendanceRhythmCard({
  currentPercent,
  trend,
  targetPercent = 75,
  history,
  accentColor = "#0EA5E9",
}: AttendanceRhythmCardProps) {
  const isPositive = trend >= 0;

  return (
    <GlassCard
      hover
      className="relative overflow-hidden flex flex-col justify-between p-5 border border-white/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-lg shadow-sky-500/5 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 group rounded-3xl"
    >
      {/* Background soft sky glow gradient */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-200/50 dark:bg-sky-900/20 rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100/90 dark:bg-sky-950/80 border border-sky-200/80 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Attendance Rhythm
            </span>
          </div>

          <div
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
              isPositive
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            <span>
              {trend > 0 ? "+" : ""}
              {trend}% this month
            </span>
          </div>
        </div>

        {/* Integrated Metric + Target Benchmark */}
        <div className="flex items-baseline justify-between gap-3 mt-2 mb-3">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">
              {currentPercent}%
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 block">
              Current Rate
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50/90 border border-sky-100/80 text-xs font-semibold text-sky-700 dark:bg-sky-950/60 dark:border-sky-800/60 dark:text-sky-300">
            <Target className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>Target: {targetPercent}%</span>
          </div>
        </div>

        {/* Smooth Rhythm Curve Visualization */}
        <div className="h-24 w-full my-2 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 8, right: 4, left: 4, bottom: 4 }}>
              <defs>
                <linearGradient id="attendanceRhythmGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <ReferenceLine
                y={targetPercent}
                stroke="#0EA5E9"
                strokeDasharray="3 3"
                strokeOpacity={0.5}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg border border-slate-700">
                        <p className="font-bold">{payload[0].payload.week}</p>
                        <p className="text-sky-300">Attendance: {payload[0].value}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="attendance"
                stroke={accentColor}
                strokeWidth={3}
                fill="url(#attendanceRhythmGrad)"
                dot={{ r: 3, fill: accentColor, strokeWidth: 2, stroke: "#fff" }}
                activeDot={{ r: 5, fill: "#0EA5E9", stroke: "#fff", strokeWidth: 2 }}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Context Insight Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400">
        <span>Your attendance has softened over the last 3 weeks.</span>
      </div>
    </GlassCard>
  );
}
