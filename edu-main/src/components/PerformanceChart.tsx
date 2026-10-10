import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { performanceData as defaultPerformanceData } from "../data/mock";
import { useCampus } from "../context/CampusContext";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-xl p-4 shadow-xl shadow-sky-500/10">
      <p className="font-bold text-slate-800 mb-3">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-3 text-sm mb-2 last:mb-0">
          <span
            className="w-3 h-3 rounded-full shadow-sm"
            style={{ background: entry.color }}
          />
          <span className="text-slate-600 font-medium capitalize">{entry.name}:</span>
          <span className="font-bold text-slate-800 ml-auto">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

interface PerformanceChartProps {
  studentId?: string;
}

export default function PerformanceChart({ studentId }: PerformanceChartProps = {}) {
  const { currentUser, students } = useCampus();
  const effectiveId = studentId || (currentUser?.role === "student" ? currentUser.id : null);
  const currentStudent = effectiveId
    ? students.find((s) => s.id === effectiveId) || (currentUser?.id === effectiveId ? (currentUser as any) : null)
    : students[0];

  const chartData = currentStudent ? [
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

  return (
    <div className="glass-card p-6 border-white/60 bg-white/40" aria-label="Performance Overview chart">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Performance Overview
          </h2>
          <p className="text-sm text-slate-500 mt-0.5 font-medium">Your academic performance over the last 4 weeks</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 bg-white/50 px-3 py-1.5 rounded-full border border-white/60">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            Quiz
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            Assignment
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
            Attendance
          </div>
        </div>
      </div>

      <div className="w-full" style={{ height: 260 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 15, left: 0, bottom: 0 }}
            className="animate-[pageEnter_0.6s_ease-out_forwards]"
          >
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="rgba(148, 163, 184, 0.15)"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              width={42}
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}%`}
              dx={-4}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(56, 189, 248, 0.2)', strokeWidth: 2 }} />
            <Line
              type="monotone"
              dataKey="quiz"
              stroke="#38BDF8"
              strokeWidth={3}
              dot={{ r: 4, fill: "#38BDF8", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#38BDF8", stroke: "#fff", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="assignment"
              stroke="#6366F1"
              strokeWidth={3}
              dot={{ r: 4, fill: "#6366F1", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#6366F1", stroke: "#fff", strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ r: 4, fill: "#8B5CF6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#8B5CF6", stroke: "#fff", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
