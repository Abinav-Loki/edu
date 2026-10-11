import { Link } from "react-router-dom";
import { TrendingDown, Activity, ArrowRight, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, Cell, XAxis, Tooltip } from "recharts";
import GlassCard from "./GlassCard";
import { performanceData as defaultPerformanceData } from "../data/mock";
import { useCampus } from "../context/CampusContext";

export default function LearningHealthSection() {
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

  const consistencyData = studentPerf.map((d) => ({
    week: d.week,
    score: Math.round(d.quiz * 0.4 + d.attendance * 0.4 + d.assignment * 0.2),
  }));
  return (
    <section className="mb-8" aria-label="Learning Health Analytics">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
          <Activity className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white leading-tight">
            Learning Health
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Multi-week consistency & behavioral shift detection
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
        {/* LEFT COLUMN: Learning Consistency */}
        <GlassCard className="p-5 flex flex-col justify-between border border-white/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl shadow-lg shadow-indigo-500/5">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Learning Consistency
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100/90 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200/60">
                <TrendingDown className="w-3.5 h-3.5" />
                Declining
              </span>
            </div>

            <p className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-4 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Learning consistency is declining over recent weeks
            </p>

            {/* Weekly Activity Bars */}
            <div className="h-32 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={consistencyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(15, 23, 42, 0.9)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      color: "#ffffff",
                    }}
                    formatter={(val: any) => [`${val}%`, "Consistency Index"]}
                  />
                  <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                    {consistencyData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index >= consistencyData.length - 2 ? "#F43F5E" : "#6366F1"}
                        opacity={0.85 - index * 0.08}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span>4-Week Activity Index</span>
            <span className="text-slate-700 dark:text-slate-300 font-bold">Week 1 (77%) → Week 4 (63%)</span>
          </div>
        </GlassCard>

        {/* RIGHT COLUMN: What's Changing? */}
        <GlassCard className="p-5 flex flex-col justify-between border border-amber-200/80 dark:border-amber-900/40 bg-gradient-to-br from-amber-50/70 via-white/60 to-orange-50/50 dark:from-slate-900/80 dark:to-amber-950/20 backdrop-blur-xl shadow-lg shadow-amber-500/5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-slate-800 dark:text-white">
                What's Changing?
              </h3>
            </div>

            <div className="space-y-2 mb-5">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                Quiz performance has dropped <strong className="text-rose-600 dark:text-rose-400 font-bold">18%</strong> over the last month. Attendance is also trending down by <strong className="text-amber-600 dark:text-amber-400 font-bold">7%</strong>.
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                This combination indicates that concepts introduced in recent DBMS & SQL modules require additional practice and targeted study support.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Detector: Performance & Attendance Shift
            </span>
            <Link
              to="/progress"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/20 active:scale-95"
            >
              View Insights
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
