import { useState } from "react";
import {
  Trophy,
  Flame,
  Star,
  Award,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Sparkles,
  Info,
  Calendar,
  Briefcase,
  Layers,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { progressData as defaultProgressData } from "../data/mock";
import { useCampus } from "../context/CampusContext";
import { useLearning } from "../context/LearningContext";
import MobileHeader from "../components/MobileHeader";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import PerformanceChart from "../components/PerformanceChart";
import {
  calculateStudentSuccessScoreBreakdown,
  getExplainableRiskFlags,
  getStudentSegmentation,
  simulateWhatIfScenario,
  getStoredInterventions,
} from "../intelligence/analyticsService";
import { SCORING_DISCLAIMER } from "../intelligence/scoringConfig";

export default function ProgressPage() {
  const { currentUser, students } = useCampus();
  const { profile, skills, achievements } = useLearning();

  const isStaff = currentUser?.role === "faculty" || currentUser?.role === "admin";
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    if (currentUser?.role === "student") return currentUser.id;
    return students[0]?.id || "s1";
  });

  const [showWhatIf, setShowWhatIf] = useState<boolean>(false);
  const [hypoAttendance, setHypoAttendance] = useState<number>(85);
  const [hypoQuiz, setHypoQuiz] = useState<number>(80);
  const [hypoPlacement, setHypoPlacement] = useState<number>(75);

  // For students: strictly their own ID. For staff: selected student ID.
  const effectiveStudentId = currentUser?.role === "student" ? currentUser.id : selectedStudentId;

  const currentStudent =
    students.find((s) => s.id === effectiveStudentId) ||
    (currentUser?.id === effectiveStudentId ? (currentUser as any) : students[0]);

  const studentId = currentStudent?.id || effectiveStudentId || "s1";

  // Calculate Unified Intelligence Breakdown for the effective student
  const breakdown = calculateStudentSuccessScoreBreakdown(studentId);
  const risks = getExplainableRiskFlags(studentId);
  const seg = getStudentSegmentation(studentId);
  
  const allInterventions = getStoredInterventions();
  const myInterventions = allInterventions.filter((i) => i.studentId === studentId);
  const staffManagedInterventions = isStaff && currentUser
    ? allInterventions.filter((i) =>
        i.assignedFaculty.toLowerCase().includes(currentUser.name.toLowerCase()) ||
        i.assignedFaculty.toLowerCase().includes("rahul")
      )
    : [];

  const streak = profile?.streak ?? defaultProgressData.streak;

  // Multi-axis topic radar data (5 distinct topics to prevent single-line collapse)
  const radarData =
    skills && skills.length >= 3
      ? skills.map((s) => ({
          subject: s.name.length > 14 ? s.name.slice(0, 12) + "…" : s.name,
          score: s.proficiency,
        }))
      : [
          { subject: "Fundamentals", score: 85 },
          { subject: "SQL Queries", score: 78 },
          { subject: "ER Modeling", score: 70 },
          { subject: "Normalization", score: 55 },
          { subject: "Transactions", score: 62 },
        ];

  const subjectScores =
    skills && skills.length > 0
      ? skills.map((s) => ({ subject: s.name, score: s.proficiency }))
      : defaultProgressData.subjectScores;

  const badges =
    achievements && achievements.length > 0
      ? achievements.map((a) => ({ id: a.id, name: a.title, icon: a.icon, earned: a.unlocked }))
      : defaultProgressData.badges;

  const earnedBadgesCount = badges.filter((b) => b.earned).length;

  const simulation = simulateWhatIfScenario(studentId, {
    attendance: hypoAttendance,
    quizAverage: hypoQuiz,
    placementScore: hypoPlacement,
  });

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <PageHeader
            title="Student 360° Analytics"
            subtitle="Holistic performance, success scores, and personalized success pathways"
            badge="AI Success Engine"
          />

          <button
            onClick={() => setShowWhatIf(!showWhatIf)}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 transition flex items-center gap-2 self-start sm:self-auto shadow-xs"
          >
            <Sliders className="w-4 h-4" />
            {showWhatIf ? "Hide Simulator" : "Explore What-If Simulator"}
          </button>
        </div>

        {/* STAFF AUDIT BAR & FACULTY WORKLOAD OVERVIEW (WHEN VIEWED BY STAFF) */}
        {isStaff && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                  {currentStudent?.name?.charAt(0) || "S"}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
                      Staff Progress Inspection Mode
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      Role: {currentUser?.role?.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    Inspecting Student: {currentStudent?.name} ({studentId}) • {currentStudent?.course} ({currentStudent?.year})
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label htmlFor="student-selector" className="text-xs font-semibold text-slate-600 dark:text-slate-400 shrink-0">
                  Select Student:
                </label>
                <select
                  id="student-selector"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-xs focus:ring-2 focus:ring-indigo-500"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.id}) — {s.course}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Staff Work & Faculty Personal Metrics Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <GlassCard className="p-4 border-l-4 border-l-purple-600">
                <div className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  My Faculty Interventions
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
                  {staffManagedInterventions.length} Assigned
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {staffManagedInterventions.filter(i => i.status === "Completed").length} completed, {staffManagedInterventions.filter(i => i.status !== "Completed").length} in progress
                </p>
              </GlassCard>

              <GlassCard className="p-4 border-l-4 border-l-sky-600">
                <div className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  Mentored Cohort
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
                  {students.filter(s => s.assignedMentorId === currentUser?.id).length || students.length} Students
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Academic mentoring & risk oversight
                </p>
              </GlassCard>

              <GlassCard className="p-4 border-l-4 border-l-amber-600">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  My Faculty Learning XP
                </div>
                <div className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">
                  {profile?.totalXP || 0} XP
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Level {profile?.level || 1} • {profile?.quizzesCompleted || 0} quizzes taken
                </p>
              </GlassCard>
            </div>
          </div>
        )}

        {/* 1. STUDENT SUCCESS SCORE BANNER */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Main Success Score */}
          <GlassCard className="p-5 flex flex-col justify-between border-l-4 border-l-indigo-600">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Student Success Score
              </span>
              <Award className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100">
                  {breakdown.overallScore !== null ? `${breakdown.overallScore}%` : "N/A"}
                </span>
                <span className="text-xs text-slate-500 font-medium">Weighted Index</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Data Coverage: <strong className="text-slate-600 dark:text-slate-300">{breakdown.dataCoveragePercent}%</strong> ({breakdown.validCategoriesCount} of 6)
              </p>
            </div>
          </GlassCard>

          {/* Student Segment */}
          <GlassCard className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Academic Archetype
              </span>
              <Layers className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="mt-2">
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${seg.badgeColor}`}>
                {seg.primarySegment}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                {seg.reasoning}
              </p>
            </div>
          </GlassCard>

          {/* Day Streak */}
          <GlassCard className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Study Consistency
              </span>
              <Flame className="w-5 h-5 text-amber-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100">
                {streak}
              </span>
              <span className="text-xs text-amber-500 font-bold">Days Active 🔥</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Consistent daily missions completed</p>
          </GlassCard>

          {/* Badges Earned */}
          <GlassCard className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Milestones
              </span>
              <Trophy className="w-5 h-5 text-emerald-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-slate-100">
                {earnedBadgesCount} / {badges.length}
              </span>
              <span className="text-xs text-emerald-600 font-bold">Unlocked</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Platform achievements</p>
          </GlassCard>
        </div>

        {/* 2. WHAT-IF SIMULATOR DRAWER (IF TOGGLED) */}
        {showWhatIf && (
          <GlassCard className="p-6 border-2 border-indigo-200 dark:border-indigo-800 bg-indigo-50/20 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Personal Scenario Simulator
                </h3>
              </div>
              <span className="text-[11px] text-indigo-600 font-bold">Interactive Projection</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Goal Attendance:</span>
                  <span className="font-bold text-indigo-600">{hypoAttendance}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={hypoAttendance}
                  onChange={(e) => setHypoAttendance(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Goal Quiz/Internal Score:</span>
                  <span className="font-bold text-indigo-600">{hypoQuiz}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={hypoQuiz}
                  onChange={(e) => setHypoQuiz(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Goal Placement Index:</span>
                  <span className="font-bold text-indigo-600">{hypoPlacement}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={hypoPlacement}
                  onChange={(e) => setHypoPlacement(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-between border border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-600 dark:text-slate-300">
                Baseline: <strong>{simulation.baselineScore}%</strong> ➔ Projected Success Score:{" "}
                <strong className="text-indigo-600 text-sm">{simulation.simulatedScore}%</strong>
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                simulation.scoreDelta >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
              }`}>
                {simulation.scoreDelta >= 0 ? `+${simulation.scoreDelta}` : simulation.scoreDelta} pts
              </span>
            </div>
          </GlassCard>
        )}

        {/* 3. 6-CATEGORY NORMALIZED BREAKDOWN BARS */}
        <GlassCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Success Score Category Breakdown
              </h3>
              <p className="text-xs text-slate-400">
                Weighted across Academic (30%), Attendance (20%), LMS (15%), Placement (15%), Skills (10%), Engagement (10%)
              </p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {breakdown.statusLabel}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {Object.values(breakdown.categoryScores).map((cat) => {
              const score = cat.score ?? 0;
              const isMissing = !cat.hasValidData;
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {cat.label} ({cat.configuredWeight}%)
                    </span>
                    <span className="font-mono font-bold">
                      {isMissing ? (
                        <span className="text-slate-400 italic text-[11px]">Excluded (No Record)</span>
                      ) : (
                        <span className={score >= 75 ? "text-emerald-600" : score >= 60 ? "text-indigo-600" : "text-rose-600"}>
                          {score}%
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    {isMissing ? (
                      <div className="h-full bg-slate-200 dark:bg-slate-700 w-full opacity-40" />
                    ) : (
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          score >= 75 ? "bg-emerald-500" : score >= 60 ? "bg-indigo-500" : "bg-rose-500"
                        }`}
                        style={{ width: `${Math.max(5, score)}%` }}
                      />
                    )}
                  </div>

                  <p className="text-[10px] text-slate-400">{cat.supportingMetric}</p>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-[11px] text-slate-500 border border-slate-100 dark:border-slate-800">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Methodology: </span>
            {SCORING_DISCLAIMER}
          </div>
        </GlassCard>

        {/* 4. PERFORMANCE CHARTS & MULTI-AXIS RADAR */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <PerformanceChart studentId={studentId} />

          {/* Radar chart (Fixed 5-axis polygon) */}
          <GlassCard className="p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Topic Proficiency Breakdown
              </h2>
              <span className="text-xs text-indigo-600 font-semibold">5 Knowledge Areas</span>
            </div>
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(99,102,241,0.15)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fontSize: 11, fill: "#64748b", fontWeight: 600 }}
                  />
                  <Radar
                    name="Proficiency"
                    dataKey="score"
                    stroke="#6366F1"
                    fill="#6366F1"
                    fillOpacity={0.25}
                    strokeWidth={2.5}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${value}%`, "Proficiency"]}
                    contentStyle={{
                      background: "rgba(255,255,255,0.95)",
                      border: "1px solid rgba(99,102,241,0.2)",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>

        {/* 5. ACTIVE SUPPORT RECOMMENDATIONS & INTERVENTIONS */}
        {myInterventions.length > 0 && (
          <GlassCard className="p-6 space-y-3">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Active Faculty Support Recommendations ({myInterventions.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {myInterventions.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-100 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {item.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {item.recommendation}
                  </p>
                  <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                    <span>Mentor: {item.assignedFaculty}</span>
                    <span>Due: {item.dueDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* 6. SUBJECT SCORES PROGRESS */}
        <GlassCard className="p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Course Topic Scores</h2>
          <div className="space-y-3.5">
            {subjectScores.map((sub) => (
              <div key={sub.subject}>
                <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
                  <span className="text-slate-700 dark:text-slate-300">{sub.subject}</span>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{sub.score}%</span>
                </div>
                <div className="progress-bar-track h-2">
                  <div
                    className="progress-bar-fill h-2 rounded-full"
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

        {/* 7. ACHIEVEMENT BADGES (FIXED CONTRAST & READABILITY) */}
        <GlassCard className="p-6">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">Achievement Badges</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex flex-col items-center p-4 rounded-2xl border text-center transition-all ${
                  badge.earned
                    ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 shadow-xs"
                    : "bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 shadow-2xs"
                }`}
                aria-label={`${badge.name} badge — ${badge.earned ? "earned" : "in progress"}`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-2xl mb-2 ${
                    badge.earned
                      ? "bg-indigo-100 dark:bg-indigo-900/60 shadow-xs"
                      : "bg-slate-100 dark:bg-slate-700/60"
                  }`}
                >
                  <span aria-hidden="true">{badge.icon}</span>
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                  {badge.name}
                </span>
                {badge.earned ? (
                  <span className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    Earned ✓
                  </span>
                ) : (
                  <span className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                    In Progress
                  </span>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

      </div>
    </>
  );
}
