import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  TrendingDown,
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Info
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot
} from "recharts";
import GlassCard from "./GlassCard";
import { performanceData as defaultPerformanceData } from "../data/mock";
import { useCampus } from "../context/CampusContext";

export default function LearningHealthCurve() {
  const { currentUser, students } = useCampus();
  const currentStudent = (currentUser?.role === "student" ? (currentUser as any) : null) || students.find(s => s.id === currentUser?.id) || students[0];

  const studentPerf = currentStudent ? [
    {
      week: "Week 1",
      quiz: Math.min(100, Math.round((currentStudent.quizAverage || 75) * 1.05)),
      assignment: Math.min(100, Math.round((currentStudent.assignmentAverage || 80) * 1.02)),
      attendance: Math.min(100, Math.round((currentStudent.attendancePercent || 82) * 1.03))
    },
    {
      week: "Week 2",
      quiz: Math.min(100, Math.round((currentStudent.quizAverage || 75) * 1.02)),
      assignment: Math.min(100, Math.round((currentStudent.assignmentAverage || 80) * 0.98)),
      attendance: Math.min(100, Math.round((currentStudent.attendancePercent || 82) * 1.01))
    },
    {
      week: "Week 3",
      quiz: Math.min(100, Math.round((currentStudent.quizAverage || 75) * 0.95)),
      assignment: Math.min(100, Math.round((currentStudent.assignmentAverage || 80) * 0.96)),
      attendance: Math.min(100, Math.round((currentStudent.attendancePercent || 82) * 0.98))
    },
    {
      week: "Week 4",
      quiz: currentStudent.quizAverage || 75,
      assignment: currentStudent.assignmentAverage || 80,
      attendance: currentStudent.attendancePercent || 82
    }
  ] : defaultPerformanceData;

  const healthCurveData = studentPerf.map((item, idx) => {
    const compositeScore = Math.round(
      item.attendance * 0.35 + item.quiz * 0.45 + item.assignment * 0.20
    );
    let eventMarker: string | null = null;
    if (idx === 1) eventMarker = "Attendance drop";
    if (idx === 3) eventMarker = "Quiz drop";
    return {
      ...item,
      healthScore: compositeScore,
      eventMarker,
    };
  });

  // Current score is the latest week (Week 4), previous is Week 1
  const latestPoint = healthCurveData[healthCurveData.length - 1];
  const initialPoint = healthCurveData[0];
  const deltaPoints = latestPoint.healthScore - initialPoint.healthScore;
  const isDeclining = deltaPoints < 0;

  return (
    <GlassCard className="p-6 border border-white/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-xl shadow-sky-500/5 rounded-3xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
        
        {/* LEFT COLUMN: Large Learning Health Curve Visualization (2/3 width) */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div>
            {/* Header + Health Signal */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-950/80 border border-sky-200/80 flex items-center justify-center text-sky-600 dark:text-sky-400">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Learning Health Trajectory
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mt-1">
                  <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">
                    {latestPoint.healthScore}{" "}
                    <span className="text-base font-bold text-slate-400 dark:text-slate-500">
                      / 100
                    </span>
                  </h3>
                  <div
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      isDeclining
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>
                      {deltaPoints} points · {isDeclining ? "Declining" : "Improving"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status pill badge */}
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-700 dark:bg-amber-950/60 dark:border-amber-800 dark:text-amber-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Attention Required</span>
              </div>
            </div>

            <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-4">
              Your overall learning consistency has weakened over the last 3 weeks.
            </p>
          </div>

          {/* Smooth Learning Health Curve Chart */}
          <div className="h-56 w-full relative my-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthCurveData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="learningHealthCurveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.45} />
                    <stop offset="90%" stopColor="#0EA5E9" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.6} />
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748B", fontSize: 11, fontWeight: 600 }}
                />
                <YAxis
                  domain={[40, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 10 }}
                />
                
                {/* Multi-Metric Interactive Tooltip */}
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-slate-700/80 min-w-[170px]">
                          <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-1.5 mb-2">
                            <span className="font-extrabold text-xs text-sky-300">{d.week}</span>
                            <span className="text-[10px] bg-sky-900/80 text-sky-200 px-2 py-0.5 rounded-full font-bold">
                              Health: {d.healthScore}
                            </span>
                          </div>
                          <div className="space-y-1 text-xs">
                            <div className="flex justify-between text-slate-300">
                              <span>Attendance:</span>
                              <span className="font-bold text-sky-300">{d.attendance}%</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span>Quiz Score:</span>
                              <span className="font-bold text-rose-300">{d.quiz}%</span>
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span>Assignment:</span>
                              <span className="font-bold text-emerald-300">{d.assignment}%</span>
                            </div>
                          </div>
                          {d.eventMarker && (
                            <div className="mt-2 pt-1.5 border-t border-slate-800 text-[10px] text-amber-300 font-bold flex items-center gap-1">
                              <span>⚠️ Signal: {d.eventMarker}</span>
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Main Curve Area */}
                <Area
                  type="monotone"
                  dataKey="healthScore"
                  stroke="#0EA5E9"
                  strokeWidth={3.5}
                  fill="url(#learningHealthCurveGrad)"
                  dot={{ r: 4, fill: "#0EA5E9", strokeWidth: 2, stroke: "#ffffff" }}
                  activeDot={{ r: 7, fill: "#0284C7", stroke: "#ffffff", strokeWidth: 3 }}
                  isAnimationActive={true}
                />

                {/* Event Signal Reference Dots */}
                <ReferenceDot
                  x="Week 2"
                  y={healthCurveData[1].healthScore}
                  r={6}
                  fill="#F59E0B"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
                <ReferenceDot
                  x="Week 4"
                  y={healthCurveData[3].healthScore}
                  r={6}
                  fill="#F43F5E"
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Event Signal Legend Footer */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 text-[11px] font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white" />
              <span>Week 2: Attendance drop</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-white" />
              <span>Week 4: Quiz drop</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: "WHAT CHANGED?" Panel (1/3 width) */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-slate-50/90 to-sky-50/60 dark:from-slate-800/60 dark:to-sky-950/40 border border-sky-100/80 dark:border-sky-900/50">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4 pb-2 border-b border-sky-100 dark:border-sky-900/60">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  What Changed?
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                Last 30 Days
              </span>
            </div>

            {/* List of significant metric shifts */}
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400 flex items-center justify-center shrink-0">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                      Quiz performance
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">Assessment score drop</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-950 dark:text-sky-300 px-2 py-1 rounded-lg">
                  -18%
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400 flex items-center justify-center shrink-0">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                      Assignment avg
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">2 late submissions</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-950 dark:text-sky-300 px-2 py-1 rounded-lg">
                  -12%
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400 flex items-center justify-center shrink-0">
                    <ArrowDownRight className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                      Attendance rate
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">68% current rate</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-950 dark:text-sky-300 px-2 py-1 rounded-lg">
                  -7%
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                      SQL practice
                    </span>
                    <span className="text-[10px] font-medium text-slate-500">AI Tutor sessions</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-1 rounded-lg">
                  +12%
                </span>
              </div>
            </div>
          </div>

          {/* Action Link Footer */}
          <div className="pt-3 border-t border-sky-100 dark:border-sky-900/60">
            <Link
              to="/progress"
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all group"
            >
              <span>View Progress Analytics</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

      </div>
    </GlassCard>
  );
}
