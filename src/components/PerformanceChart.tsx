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
import GlassCard from "./GlassCard";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card !rounded-xl p-3 text-sm shadow-lg">
      <p className="font-semibold text-slate-700 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs mb-1">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: entry.color }}
          />
          <span className="text-slate-600 capitalize">{entry.name}:</span>
          <span className="font-semibold text-slate-800">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

export default function PerformanceChart() {
  return (
    <GlassCard as="section" aria-label="Performance Overview chart">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-800">
            Performance Overview
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Last 4 weeks trend</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            Quiz
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
            Assignment
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
            Attendance
          </div>
        </div>
      </div>

      <div className="w-full" style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={performanceData}
            margin={{ top: 4, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(99,102,241,0.08)"
              vertical={false}
            />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend hide />
            <Line
              type="monotone"
              dataKey="quiz"
              stroke="#6366F1"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#6366F1", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#6366F1" }}
            />
            <Line
              type="monotone"
              dataKey="assignment"
              stroke="#8B5CF6"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#8B5CF6", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#8B5CF6" }}
            />
            <Line
              type="monotone"
              dataKey="attendance"
              stroke="#38bdf8"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#38bdf8", strokeWidth: 0 }}
              activeDot={{ r: 6, fill: "#38bdf8" }}
              strokeDasharray="5 3"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
