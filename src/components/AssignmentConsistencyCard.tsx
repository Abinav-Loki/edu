import { FileText, TrendingDown, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";
import GlassCard from "./GlassCard";

export interface AssignmentConsistencyCardProps {
  averageScore: number;
  trend: number;
  totalSubmissions: number;
  lateSubmissions: number;
  history: { week: string; assignment: number }[];
  accentColor?: string;
}

export default function AssignmentConsistencyCard({
  averageScore,
  trend,
  totalSubmissions = 6,
  lateSubmissions = 2,
  history,
  accentColor = "#0EA5E9",
}: AssignmentConsistencyCardProps) {
  const isPositive = trend >= 0;
  const onTimeCount = totalSubmissions - lateSubmissions;
  const onTimePercent = Math.round((onTimeCount / totalSubmissions) * 100);

  return (
    <GlassCard
      hover
      className="relative overflow-hidden flex flex-col justify-between p-5 border border-white/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-lg shadow-sky-500/5 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 group rounded-3xl"
    >
      {/* Background soft glow gradient */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-sky-200/40 rounded-full blur-2xl pointer-events-none" />

      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-sky-100/90 dark:bg-sky-950/80 border border-sky-200/80 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Assignment Consistency
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
              {trend}%
            </span>
          </div>
        </div>

        {/* Integrated Metric + Completion Rate */}
        <div className="flex items-baseline justify-between gap-3 mt-2 mb-3">
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">
              {averageScore}%
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 block">
              Assignment Average
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50/90 border border-sky-100/80 text-xs font-semibold text-sky-700">
            <CheckCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>{onTimePercent}% On-Time</span>
          </div>
        </div>

        {/* Connected Node Timeline Completion Visualization */}
        <div className="my-3 p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2">
            <span>Submission Timeline</span>
            <span className="text-slate-700 dark:text-slate-300">
              {onTimeCount} On Time · {lateSubmissions} Late
            </span>
          </div>

          <div className="relative flex items-center justify-between px-1 py-1">
            {/* Horizontal Connecting Line */}
            <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-700 rounded-full z-0" />

            {/* Submission Timeline Nodes */}
            {Array.from({ length: totalSubmissions }).map((_, idx) => {
              const isLate = idx >= onTimeCount;
              return (
                <div
                  key={idx}
                  className="relative z-10 flex flex-col items-center group/node"
                  title={`Submission ${idx + 1}: ${isLate ? "Late" : "On Time"}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-transform group-hover/node:scale-125 border-2 ${
                      isLate
                        ? "bg-amber-500 border-amber-200 shadow-md shadow-amber-500/30 text-white"
                        : "bg-emerald-500 border-emerald-200 shadow-md shadow-emerald-500/30 text-white"
                    }`}
                  >
                    {isLate ? (
                      <Clock className="w-2.5 h-2.5" />
                    ) : (
                      <CheckCircle className="w-2.5 h-2.5" />
                    )}
                  </div>
                  <span className="text-[9px] font-semibold text-slate-400 mt-1">
                    M{idx + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Assignment Trend Area Curve */}
        <div className="h-16 w-full my-1 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 6, right: 4, left: 4, bottom: 2 }}>
              <defs>
                <linearGradient id="assignmentConsistencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg border border-slate-700">
                        <p className="font-bold">{payload[0].payload.week}</p>
                        <p className="text-sky-300">Assignment: {payload[0].value}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="assignment"
                stroke={accentColor}
                strokeWidth={2.5}
                fill="url(#assignmentConsistencyGrad)"
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
        <span>67% on-time submission rate across 6 coursework modules.</span>
      </div>
    </GlassCard>
  );
}
