import { Trophy, Flame, Star } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { progressData, performanceData } from "../data/mock";
import MobileHeader from "../components/MobileHeader";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import PerformanceChart from "../components/PerformanceChart";

const radarData = progressData.subjectScores.map((s) => ({
  subject: s.subject.split(" ")[0], // shorten labels
  score: s.score,
}));

export default function ProgressPage() {
  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content">
        <PageHeader title="Progress" subtitle="Track your academic journey" badge="Analytics" />

        {/* Overview stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <GlassCard padding="sm" className="flex flex-col items-center text-center gap-1">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Star className="w-5 h-5 text-indigo-600" aria-hidden="true" />
            </div>
            <span className="text-2xl font-bold text-slate-800">{progressData.overallScore}%</span>
            <span className="text-xs text-slate-500">Overall Score</span>
          </GlassCard>
          <GlassCard padding="sm" className="flex flex-col items-center text-center gap-1">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Flame className="w-5 h-5 text-amber-500" aria-hidden="true" />
            </div>
            <span className="text-2xl font-bold text-slate-800">{progressData.streak}</span>
            <span className="text-xs text-slate-500">Day Streak 🔥</span>
          </GlassCard>
          <GlassCard padding="sm" className="flex flex-col items-center text-center gap-1">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-emerald-600" aria-hidden="true" />
            </div>
            <span className="text-2xl font-bold text-slate-800">
              {progressData.badges.filter((b) => b.earned).length}
            </span>
            <span className="text-xs text-slate-500">Badges Earned</span>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
          <PerformanceChart />

          {/* Radar chart */}
          <GlassCard>
            <h2 className="text-base font-bold text-slate-800 mb-4">Subject Breakdown</h2>
            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(99,102,241,0.1)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#6366F1"
                    fill="#6366F1"
                    fillOpacity={0.18}
                    strokeWidth={2}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, "Score"]}
                    contentStyle={{
                      background: "rgba(255,255,255,0.9)",
                      border: "1px solid rgba(99,102,241,0.15)",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* Subject scores */}
        <GlassCard className="mb-5">
          <h2 className="text-base font-bold text-slate-800 mb-4">Subject Scores</h2>
          <div className="space-y-4">
            {progressData.subjectScores.map((sub) => (
              <div key={sub.subject}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">{sub.subject}</span>
                  <span className="font-bold text-slate-800">{sub.score}%</span>
                </div>
                <div className="progress-bar-track">
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${sub.score}%`,
                      background:
                        sub.score >= 70
                          ? "#22C55E"
                          : sub.score >= 55
                          ? "#F59E0B"
                          : "#F87171",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Badges */}
        <GlassCard>
          <h2 className="text-base font-bold text-slate-800 mb-4">Achievement Badges</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {progressData.badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex flex-col items-center p-3 rounded-xl border text-center transition ${
                  badge.earned
                    ? "bg-indigo-50 border-indigo-100"
                    : "bg-slate-50 border-slate-100 opacity-50 grayscale"
                }`}
                aria-label={`${badge.name} badge — ${badge.earned ? "earned" : "not yet earned"}`}
              >
                <span className="text-2xl mb-1" aria-hidden="true">{badge.icon}</span>
                <span className="text-xs font-semibold text-slate-700">{badge.name}</span>
                {badge.earned && (
                  <span className="mt-1 text-[10px] text-emerald-600 font-medium">Earned ✓</span>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );
}
