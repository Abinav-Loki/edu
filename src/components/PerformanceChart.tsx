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
import { performanceData } from "../data/mock";

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

export default function PerformanceChart() {
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
            data={performanceData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
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
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: "#64748b", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}%`}
              dx={-10}
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
