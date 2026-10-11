import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Layers,
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  Target,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  Laptop,
  Code2,
  CheckSquare,
  Clock,
  ExternalLink,
  FileText,
  Users,
  Calendar,
  Activity,
  Check,
  ChevronRight,
  PlusCircle,
  Building2,
  ShieldCheck,
  CheckCircle,
  BarChart3,
  Bot,
  Compass
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  ReferenceLine
} from "recharts";
import { progressData as defaultProgressData } from "../data/mock";
import { useCampus } from "../context/CampusContext";
import { useLearning } from "../context/LearningContext";
import MobileHeader from "../components/MobileHeader";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import {
  calculateStudentSuccessScoreBreakdown,
  getExplainableRiskFlags,
  getStudentSegmentation,
  simulateWhatIfScenario,
  getStoredInterventions,
  getOrCreateStudentIntelligence,
} from "../intelligence/analyticsService";
import { SCORING_DISCLAIMER } from "../intelligence/scoringConfig";

export default function ProgressPage() {
  const { currentUser, students } = useCampus();
  const { profile, skills, achievements } = useLearning();
  const navigate = useNavigate();

  const isStaff = currentUser?.role === "faculty" || currentUser?.role === "admin";
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    if (currentUser?.role === "student") return currentUser.id;
    return students[0]?.id || "s1";
  });

  // Sub-Module Navigation: Overview | Academics | Placements | Engagements | LMS
  const [activeSubModule, setActiveSubModule] = useState<
    "overview" | "academics" | "placements" | "engagements" | "lms"
  >("overview");

  // Interactive Respective Jobs Task Completion State
  const [completedJobs, setCompletedJobs] = useState<Record<string, boolean>>({});

  const toggleJob = (jobId: string) => {
    setCompletedJobs((prev) => ({ ...prev, [jobId]: !prev[jobId] }));
  };

  const [chartView, setChartView] = useState<"dimensions" | "weekly">("dimensions");
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
  const intel = getOrCreateStudentIntelligence(studentId);

  const acadMetrics = intel?.academicMetrics;
  const placement = intel?.placementReadiness;
  const lms = intel?.lmsActivity;
  const campusEngagement = intel?.campusEngagement;
  
  const allInterventions = getStoredInterventions();
  const myInterventions = allInterventions.filter((i) => i.studentId === studentId);

  const streak = profile?.streak ?? defaultProgressData.streak;

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

  // 1. Data for Core 360 Dimensions Bar Chart
  const dimensionBarData = Object.values(breakdown.categoryScores).map((cat) => {
    let shortName = cat.label;
    if (shortName.includes("Academic")) shortName = "Academics";
    else if (shortName.includes("Attendance")) shortName = "Attendance";
    else if (shortName.includes("LMS")) shortName = "LMS Practice";
    else if (shortName.includes("Placement")) shortName = "Placement";
    else if (shortName.includes("Skills")) shortName = "Tech Skills";
    else if (shortName.includes("Engagement") || shortName.includes("Feedback")) shortName = "Engagement";

    return {
      key: cat.category,
      category: shortName,
      fullName: cat.label,
      score: cat.score ?? 0,
      weight: cat.configuredWeight,
      metric: cat.supportingMetric,
      hasValidData: cat.hasValidData
    };
  });

  // 2. Data for Weekly Progression Bar Chart
  const weeklyBarData = [
    {
      period: "Week 1",
      Quiz: Math.min(100, Math.round((currentStudent?.quizAverage || 75) * 0.95)),
      Assignments: Math.min(100, Math.round((currentStudent?.assignmentAverage || 80) * 0.96)),
      Attendance: Math.min(100, Math.round((currentStudent?.attendancePercent || 82) * 0.98))
    },
    {
      period: "Week 2",
      Quiz: Math.min(100, Math.round((currentStudent?.quizAverage || 75) * 0.98)),
      Assignments: Math.min(100, Math.round((currentStudent?.assignmentAverage || 80) * 0.98)),
      Attendance: Math.min(100, Math.round((currentStudent?.attendancePercent || 82) * 1.00))
    },
    {
      period: "Week 3",
      Quiz: Math.min(100, Math.round((currentStudent?.quizAverage || 75) * 1.02)),
      Assignments: Math.min(100, Math.round((currentStudent?.assignmentAverage || 80) * 1.01)),
      Attendance: Math.min(100, Math.round((currentStudent?.attendancePercent || 82) * 1.01))
    },
    {
      period: "Week 4",
      Quiz: currentStudent?.quizAverage || 75,
      Assignments: currentStudent?.assignmentAverage || 80,
      Attendance: currentStudent?.attendancePercent || 82
    }
  ];

  const getBarColor = (score: number) => {
    if (score >= 75) return "#10B981"; // Emerald
    if (score >= 60) return "#38BDF8"; // Sky
    if (score >= 45) return "#F59E0B"; // Amber
    return "#F43F5E"; // Rose
  };

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-7xl mx-auto space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <PageHeader
            title="Student 360° Analytics"
            subtitle="Clear, holistic performance overview and success index across all key dimensions"
            badge="ARIVON Analytics"
          />

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowWhatIf(!showWhatIf)}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-750 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showWhatIf ? "Hide Simulator" : "What-If Simulator"}</span>
            </button>
          </div>
        </div>

        {/* STAFF AUDIT SWITCHER (ONLY FOR FACULTY/ADMIN) */}
        {isStaff && (
          <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-slate-800/80 border border-indigo-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                Staff Inspection: <span className="text-indigo-600 dark:text-indigo-400">{currentStudent?.name}</span> ({studentId})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="student-picker" className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Switch Student:
              </label>
              <select
                id="student-picker"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 shadow-2xs focus:ring-2 focus:ring-indigo-500"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.id}) — {s.course}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* 1. TOP 4 CLEAN METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Success Score */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                360° Success Score
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {breakdown.overallScore !== null ? `${breakdown.overallScore}%` : "N/A"}
                </span>
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                  (breakdown.overallScore || 0) >= 75
                    ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    : "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                }`}>
                  {breakdown.statusLabel}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                Weighted across 6 performance pillars
              </p>
            </div>
          </div>

          {/* Card 2: Academic Archetype */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Academic Profile
              </span>
              <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div>
              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-extrabold border ${seg.badgeColor}`}>
                {seg.primarySegment}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 font-medium">
                {seg.reasoning}
              </p>
            </div>
          </div>

          {/* Card 3: Consistency Streak */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Study Streak
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {streak}
                </span>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Days Active 🔥</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                Consistent learning activity logged
              </p>
            </div>
          </div>

          {/* Card 4: Milestones */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Milestones & Badges
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  {earnedBadgesCount} / {badges.length}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Unlocked</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
                Academic achievement milestones
              </p>
            </div>
          </div>

        </div>

        {/* 2. WHAT-IF PROJECTION SIMULATOR (DRAWER) */}
        {showWhatIf && (
          <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-indigo-200 dark:border-indigo-800/60 p-5 shadow-sm space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  What-If Performance Simulator
                </h3>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                Adjust sliders to project your new score
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Target Attendance:</span>
                  <span className="text-indigo-600 font-extrabold">{hypoAttendance}%</span>
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
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Target Quiz/Internal:</span>
                  <span className="text-indigo-600 font-extrabold">{hypoQuiz}%</span>
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
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Placement Preparation:</span>
                  <span className="text-indigo-600 font-extrabold">{hypoPlacement}%</span>
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

            <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl flex items-center justify-between border border-indigo-100 dark:border-indigo-900/50">
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Current Baseline: <strong>{simulation.baselineScore}%</strong> ➔ Projected 360 Score:{" "}
                <strong className="text-indigo-600 dark:text-indigo-400 text-sm">{simulation.simulatedScore}%</strong>
              </span>
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                simulation.scoreDelta >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
              }`}>
                {simulation.scoreDelta >= 0 ? `+${simulation.scoreDelta}% Boost` : `${simulation.scoreDelta}%`}
              </span>
            </div>
          </div>
        )}

        {/* SUB-MODULE SELECTOR TABS UNDER STUDENT 360° ANALYTICS */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveSubModule("overview")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeSubModule === "overview"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-750"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>360° Overview</span>
            </button>

            <button
              onClick={() => setActiveSubModule("academics")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeSubModule === "academics"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-750"
              }`}
            >
              <GraduationCap className="w-4 h-4 text-sky-500" />
              <span>Academics Sub-Module</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300">
                {breakdown.categoryScores["academic"]?.score ?? 82}%
              </span>
            </button>

            <button
              onClick={() => setActiveSubModule("placements")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeSubModule === "placements"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-750"
              }`}
            >
              <Briefcase className="w-4 h-4 text-emerald-500" />
              <span>Placements & Jobs</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                {placement?.overallPlacementScore || breakdown.categoryScores["skillsPlacement"]?.score || 78}%
              </span>
            </button>

            <button
              onClick={() => setActiveSubModule("engagements")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeSubModule === "engagements"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-750"
              }`}
            >
              <Star className="w-4 h-4 text-amber-500" />
              <span>Engagements</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                {campusEngagement?.engagementScore || breakdown.categoryScores["engagement"]?.score || 85}%
              </span>
            </button>

            <button
              onClick={() => setActiveSubModule("lms")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeSubModule === "lms"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-750"
              }`}
            >
              <Laptop className="w-4 h-4 text-purple-500" />
              <span>LMS Activity & Frequency</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                {lms?.assignmentCompletionRate || breakdown.categoryScores["lmsActivity"]?.score || 92}%
              </span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUB-MODULE VIEW 1: 360° OVERVIEW (HOLISTIC PERFORMANCE & 6-PILLAR MATRIX) */}
        {/* ========================================================================= */}
        {activeSubModule === "overview" && (
          <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
            {/* Primary Bar Chart Card */}
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      Student 360° Performance Bar Chart
                    </h2>
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    {chartView === "dimensions"
                      ? "Normalized score distribution across all 6 core success categories"
                      : "Weekly performance trajectory across Quizzes, Assignments, and Attendance"}
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl self-start sm:self-auto border border-slate-200/60 dark:border-slate-700">
                  <button
                    onClick={() => setChartView("dimensions")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      chartView === "dimensions"
                        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    360 Dimensions
                  </button>
                  <button
                    onClick={() => setChartView("weekly")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      chartView === "weekly"
                        ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                    }`}
                  >
                    Weekly Trends
                  </button>
                </div>
              </div>

              <div className="w-full h-[320px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartView === "dimensions" ? (
                    <BarChart data={dimensionBarData} margin={{ top: 15, right: 10, left: -15, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.12} vertical={false} />
                      <XAxis
                        dataKey="category"
                        tick={{ fontSize: 11, fontWeight: 700, fill: "#64748B" }}
                        axisLine={{ stroke: "#E2E8F0" }}
                        tickLine={false}
                        interval={0}
                      />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} unit="%" />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl text-xs space-y-1">
                              <p className="font-extrabold text-slate-900 dark:text-white">{data.fullName}</p>
                              <p className="font-black text-indigo-600 dark:text-indigo-400 text-sm">
                                Score: {data.score}%
                              </p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                Category Weight: {data.weight}%
                              </p>
                              <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                                Metric: {data.metric}
                              </p>
                            </div>
                          );
                        }}
                      />
                      <ReferenceLine
                        y={75}
                        stroke="#10B981"
                        strokeDasharray="4 4"
                        label={{
                          value: "Target 75%",
                          position: "insideTopRight",
                          fill: "#10B981",
                          fontSize: 10,
                          fontWeight: 800,
                        }}
                      />
                      <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={55}>
                        {dimensionBarData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                        ))}
                      </Bar>
                    </BarChart>
                  ) : (
                    <BarChart data={weeklyBarData} margin={{ top: 15, right: 10, left: -15, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.12} vertical={false} />
                      <XAxis dataKey="period" tick={{ fontSize: 12, fontWeight: 700, fill: "#64748B" }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} unit="%" />
                      <Tooltip
                        contentStyle={{
                          background: "rgba(255, 255, 255, 0.95)",
                          borderRadius: "0.75rem",
                          border: "1px solid #E2E8F0",
                          fontSize: "12px",
                          fontWeight: "bold",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px", fontWeight: "bold" }} />
                      <Bar dataKey="Quiz" fill="#38BDF8" radius={[6, 6, 0, 0]} maxBarSize={28} />
                      <Bar dataKey="Assignments" fill="#6366F1" radius={[6, 6, 0, 0]} maxBarSize={28} />
                      <Bar dataKey="Attendance" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={28} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 mt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> &gt;= 75% Strong
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" /> 60-74% On Track
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> &lt; 60% Focus Needed
                  </span>
                </div>
                <span className="text-[10px] italic">Benchmark Target: 75% across all 6 core categories</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODULE VIEW 2: 🎓 ACADEMICS SUB-MODULE (MARKS, COURSES & ACADEMIC JOBS) */}
        {/* ========================================================================= */}
        {activeSubModule === "academics" && (
          <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
            {/* Academic KPIs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Cumulative GPA</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {currentStudent?.gpa || acadMetrics?.gpa || 3.4}
                  </span>
                  <span className="text-xs font-bold text-sky-600">/ 4.0 Scale</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Equivalent to 8.5 / 10 CGPA benchmark</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Internal Quiz Avg</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {acadMetrics?.quizAverage || currentStudent?.quizAverage || 78}%
                  </span>
                  <span className="text-xs font-bold text-emerald-600">Continuous Assessment</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Weighted internal exams & unit quizzes</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Attendance Shortage Alert</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {acadMetrics?.attendancePercent || currentStudent?.attendancePercent || 82}%
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    (acadMetrics?.attendancePercent || 82) >= 75
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  }`}>
                    {(acadMetrics?.attendancePercent || 82) >= 75 ? "Eligible (>75%)" : "Shortage Warning"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Minimum 75% required for university exam hall ticket</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Active Course Backlogs</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">0</span>
                  <span className="text-xs font-bold text-emerald-600">All Papers Clear</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">No standing backlogs recorded on transcript</p>
              </div>
            </div>

            {/* Subject-Wise Performance Matrix */}
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    Enrolled Courses & Academic Diagnostic Breakdown
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Performance tracking across current semester curriculum</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                  5 Registered Subjects
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { subject: "Database Management Systems", score: 82, quiz: 78, assignment: 85, attendance: 88, status: "Optimal" },
                  { subject: "Operating Systems", score: 74, quiz: 70, assignment: 76, attendance: 78, status: "Good" },
                  { subject: "Data Structures & Algorithms", score: 86, quiz: 84, assignment: 88, attendance: 92, status: "Optimal" },
                  { subject: "Computer Networks", score: 79, quiz: 75, assignment: 82, attendance: 84, status: "Good" },
                  { subject: "Software Engineering", score: 88, quiz: 86, assignment: 90, attendance: 86, status: "Optimal" },
                ].map((s) => (
                  <div key={s.subject} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 flex flex-col justify-between space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-extrabold text-xs text-slate-800 dark:text-white leading-snug">{s.subject}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        {s.status}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                        <span>Course Score:</span>
                        <span className="font-bold text-indigo-600">{s.score}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${s.score}%` }} />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                        <span>Quiz: {s.quiz}%</span>
                        <span>Assign: {s.assignment}%</span>
                        <span>Att: {s.attendance}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academic Jobs & Action Items */}
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-sky-600" />
                    Respective Academic Jobs & Revision Tasks
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Coursework jobs, homework, and remedial study objectives</p>
                </div>
                <button
                  onClick={() => navigate("/tutor")}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Launch AI Tutor</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: "acad-job-1", title: "DBMS Normalization (1NF to BCNF) Problem Set Review", subject: "Database Management Systems", due: "Due in 2 days", priority: "High", xp: "+40 XP" },
                  { id: "acad-job-2", title: "Operating Systems Memory Management & Paging Exercise", subject: "Operating Systems", due: "Due in 4 days", priority: "Medium", xp: "+30 XP" },
                  { id: "acad-job-3", title: "Data Structures Balanced Binary Trees (AVL & Red-Black)", subject: "Data Structures & Algorithms", due: "Due in 6 days", priority: "High", xp: "+50 XP" },
                  { id: "acad-job-4", title: "Computer Networks IP Subnetting & CIDR Worksheet", subject: "Computer Networks", due: "Due in 1 week", priority: "Low", xp: "+25 XP" },
                ].map((job) => {
                  const isDone = !!completedJobs[job.id];
                  return (
                    <div
                      key={job.id}
                      onClick={() => toggleJob(job.id)}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isDone
                          ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 text-slate-400 line-through"
                          : "bg-slate-50 dark:bg-slate-800/60 border-slate-200/70 hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                          isDone ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white dark:bg-slate-900"
                        }`}>
                          {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{job.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{job.subject} • {job.due}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          job.priority === "High" ? "bg-rose-100 text-rose-700" : "bg-sky-100 text-sky-700"
                        }`}>
                          {job.priority} Priority
                        </span>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {job.xp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODULE VIEW 3: 💼 PLACEMENTS SUB-MODULE (JOBS, APTITUDE & READINESS) */}
        {/* ========================================================================= */}
        {activeSubModule === "placements" && (
          <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
            {/* Placement Diagnostic KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Placement Readiness Index</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {placement?.overallPlacementScore || 78}%
                  </span>
                  <span className="text-xs font-bold text-emerald-600">Drive Ready</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Weighted Aptitude, Coding & Mock Interview scores</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Quantitative & Logical Aptitude</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {placement?.aptitudeScore || 76}%
                  </span>
                  <span className="text-xs font-bold text-sky-600">Passed Threshold</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Numerical ability & logical problem solving</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Technical Coding & DSA</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {placement?.codingScore || 74}%
                  </span>
                  <span className="text-xs font-bold text-indigo-600">Medium DSA Level</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Data structures, recursion, dynamic programming</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Mock Technical Interview</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {placement?.mockInterviewScore || 80}%
                  </span>
                  <span className="text-xs font-bold text-emerald-600">Cleared</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Evaluated by campus corporate placement panel</p>
              </div>
            </div>

            {/* Target Job Roles & Industry Alignment Matrix */}
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    Target Job Roles & Campus Drive Eligibility Matrix
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Profile alignment, salary package brackets, and institutional drive qualification
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                  4 Active Placement Tracks
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    role: "Full-Stack Software Engineer",
                    companyTier: "Tier 1 Product Companies",
                    ctcRange: "12 - 18 LPA",
                    matchPercent: 88,
                    requiredSkills: ["React", "TypeScript", "Node.js", "PostgreSQL", "System Design"],
                    minCGPA: 7.5,
                    status: "Assessment Ready",
                    statusColor: "bg-emerald-100 text-emerald-700",
                    action: "Take Practice Assessment",
                  },
                  {
                    role: "Data & AI/ML Engineer",
                    companyTier: "Enterprise AI Labs",
                    ctcRange: "14 - 20 LPA",
                    matchPercent: 78,
                    requiredSkills: ["Python", "SQL", "Scikit-Learn", "Vector DBs", "RAG Pipelines"],
                    minCGPA: 7.5,
                    status: "Interview Shortlisted",
                    statusColor: "bg-sky-100 text-sky-700",
                    action: "Practice Python Problem Set",
                  },
                  {
                    role: "Cloud & DevOps Associate",
                    companyTier: "Global Cloud Services",
                    ctcRange: "10 - 15 LPA",
                    matchPercent: 72,
                    requiredSkills: ["Docker", "Linux", "Kubernetes Basics", "CI/CD Pipelines", "AWS"],
                    minCGPA: 7.0,
                    status: "Preparation in Progress",
                    statusColor: "bg-indigo-100 text-indigo-700",
                    action: "Review Cloud Architecture",
                  },
                  {
                    role: "Systems & Security Analyst",
                    companyTier: "Cybersecurity Systems",
                    ctcRange: "9 - 14 LPA",
                    matchPercent: 68,
                    requiredSkills: ["Network Protocols", "OS Internals", "Wireshark", "Cryptography"],
                    minCGPA: 7.0,
                    status: "Eligible for Drive",
                    statusColor: "bg-purple-100 text-purple-700",
                    action: "Review Security Lab",
                  },
                ].map((job) => (
                  <div key={job.role} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-750 flex flex-col justify-between space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-black text-sm text-slate-800 dark:text-white">{job.role}</h4>
                        <p className="text-[11px] text-slate-500 font-semibold">{job.companyTier} • {job.ctcRange}</p>
                      </div>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${job.statusColor}`}>
                        {job.status}
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-600 dark:text-slate-300">Skill Match Profile:</span>
                        <span className="text-indigo-600 font-black">{job.matchPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${job.matchPercent}%` }} />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.requiredSkills.map((sk) => (
                        <span key={sk} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                          {sk}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => navigate("/quiz")}
                      className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <span>{job.action}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Placement Preparation Jobs & Action Items */}
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                Respective Placement Jobs & Practice Sprints
              </h3>

              <div className="space-y-2.5">
                {[
                  { id: "place-job-1", title: "Complete 5 DSA LeetCode Medium Challenges (Arrays, Trees, DP)", target: "Technical Coding Round", due: "Due this Friday", priority: "High", pts: "+60 Placement Pts" },
                  { id: "place-job-2", title: "45-Minute Quantitative Aptitude Timed Assessment (Speed & Logic)", target: "Aptitude Screening", due: "Due in 3 days", priority: "High", pts: "+40 Placement Pts" },
                  { id: "place-job-3", title: "AI Mock Technical & Behavioral Interview Round", target: "Tech Interview Prep", due: "Due in 5 days", priority: "Medium", pts: "+50 Placement Pts" },
                  { id: "place-job-4", title: "Verify ATS-Compliant Resume on Institutional Placement Portal", target: "Resume Clearance", due: "Due next week", priority: "Low", pts: "+20 Placement Pts" },
                ].map((job) => {
                  const isDone = !!completedJobs[job.id];
                  return (
                    <div
                      key={job.id}
                      onClick={() => toggleJob(job.id)}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isDone
                          ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 text-slate-400 line-through"
                          : "bg-slate-50 dark:bg-slate-800/60 border-slate-200/70 hover:border-emerald-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                          isDone ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white dark:bg-slate-900"
                        }`}>
                          {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{job.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{job.target} • {job.due}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                          {job.priority} Priority
                        </span>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {job.pts}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODULE VIEW 4: 🌟 ENGAGEMENTS SUB-MODULE (EVENTS, CLUBS & JOBS) */}
        {/* ========================================================================= */}
        {activeSubModule === "engagements" && (
          <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
            {/* Engagement Diagnostic KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Campus Engagement Score</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {campusEngagement?.engagementScore || 82}%
                  </span>
                  <span className="text-xs font-bold text-amber-600">Active Pillar</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Club, hackathon, and campus activity index</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Hackathons & Competitions</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {campusEngagement?.hackathonsCount || 2}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">1 Finalist Award</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">ByteXL Hackathon & State Tech Sprints</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Active Campus Clubs</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {campusEngagement?.clubParticipationsCount || 2}
                  </span>
                  <span className="text-xs font-bold text-indigo-600">Leadership Role</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Google Developer Student Club & ACM Student Chapter</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Verified Certifications</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {campusEngagement?.certificationsCount || 3}
                  </span>
                  <span className="text-xs font-bold text-sky-600">On Record</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Verified industry & open-source credentials</p>
              </div>
            </div>

            {/* Engagement Jobs & Campus Tasks */}
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-amber-500" />
                    Respective Campus Engagement Jobs & Initiatives
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Community projects, club sprints, and hackathon deliverables</p>
                </div>
                <button
                  onClick={() => navigate("/learning-arena")}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Open Learning Arena</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: "eng-job-1", title: "ByteXL Hackathon Milestone: Submit Architecture Diagram & Video", type: "Hackathon Track", due: "Due Tomorrow", priority: "High", pts: "+100 Engagement Pts" },
                  { id: "eng-job-2", title: "GDSC Peer Study Circle: Lead DBMS Revision for Juniors", type: "Club Leadership", due: "Scheduled Saturday", priority: "Medium", pts: "+50 Engagement Pts" },
                  { id: "eng-job-3", title: "Complete Weekly Learning Arena Algorithmic Sprint", type: "Learning Arena", due: "Active Sprint", priority: "Medium", pts: "+75 XP" },
                  { id: "eng-job-4", title: "Upload AWS / Oracle Cloud Certificate to Student Portfolio", type: "Certification", due: "Due in 2 weeks", priority: "Low", pts: "+30 Engagement Pts" },
                ].map((job) => {
                  const isDone = !!completedJobs[job.id];
                  return (
                    <div
                      key={job.id}
                      onClick={() => toggleJob(job.id)}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isDone
                          ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 text-slate-400 line-through"
                          : "bg-slate-50 dark:bg-slate-800/60 border-slate-200/70 hover:border-amber-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                          isDone ? "bg-amber-600 border-amber-600 text-white" : "border-slate-300 bg-white dark:bg-slate-900"
                        }`}>
                          {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{job.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{job.type} • {job.due}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-700">
                          {job.priority} Priority
                        </span>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {job.pts}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUB-MODULE VIEW 5: 💻 LMS ACTIVITY (LOGIN FREQUENCY & ASSIGNMENT JOBS) */}
        {/* ========================================================================= */}
        {activeSubModule === "lms" && (
          <div className="space-y-6 animate-[fadeIn_0.2s_ease-out]">
            {/* LMS Diagnostic KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Total LMS Logins</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {lms?.totalLogins || 148}
                  </span>
                  <span className="text-xs font-bold text-purple-600">Active Sessions</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Logged across mobile and campus desktop portal</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Weekly Login Cadence</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">5.4</span>
                  <span className="text-xs font-bold text-emerald-600">Days / Week Active</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Consistent study schedule maintained</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Assignment Completion Rate</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {lms?.assignmentCompletionRate || 92}%
                  </span>
                  <span className="text-xs font-bold text-emerald-600">High Punctuality</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">22 of 24 term assignments submitted on time</p>
              </div>

              <div className="bg-white/80 dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">Average Session Duration</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-3xl font-black text-slate-900 dark:text-white">
                    {lms?.averageSessionDurationMins || 38}m
                  </span>
                  <span className="text-xs font-bold text-indigo-600">Deep Work</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Time spent reviewing slides, labs & readings</p>
              </div>
            </div>

            {/* 7-Day LMS Activity & Login Minutes Chart */}
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-purple-600" />
                    7-Day LMS Login Frequency & Active Study Minutes
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Daily time spent inside course material and interactive modules</p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700">
                  360 Minutes Total This Week
                </span>
              </div>

              <div className="w-full h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { day: "Mon", minutes: 55, logins: 4 },
                      { day: "Tue", minutes: 70, logins: 5 },
                      { day: "Wed", minutes: 40, logins: 3 },
                      { day: "Thu", minutes: 65, logins: 5 },
                      { day: "Fri", minutes: 50, logins: 4 },
                      { day: "Sat", minutes: 35, logins: 2 },
                      { day: "Sun", minutes: 45, logins: 3 },
                    ]}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.12} vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fontWeight: 700, fill: "#64748B" }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} unit="m" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        return (
                          <div className="bg-white/95 dark:bg-slate-900/95 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg text-xs">
                            <p className="font-extrabold text-slate-900 dark:text-white">{d.day}</p>
                            <p className="text-purple-600 font-bold">{d.minutes} mins active ({d.logins} logins)</p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="minutes" fill="#8B5CF6" radius={[6, 6, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* LMS Assignment Jobs & Tasks */}
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-purple-600" />
                    Respective LMS Assignment Completion Jobs
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Pending lab sheets, LMS quizzes, and assignment submissions</p>
                </div>
                <button
                  onClick={() => navigate("/upload-materials")}
                  className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 text-xs font-bold hover:bg-purple-100 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Upload Solution</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {[
                  { id: "lms-job-1", title: "Submit DBMS Lab 3: Relational Algebra & Complex SQL Queries", course: "Database Management Systems", due: "Tomorrow 11:59 PM", priority: "Urgent", xp: "+35 Course XP" },
                  { id: "lms-job-2", title: "Operating Systems Module 4 IPC Concept Check Quiz", course: "Operating Systems", due: "Due in 3 days", priority: "Medium", xp: "+25 Course XP" },
                  { id: "lms-job-3", title: "Computer Networks Discussion Forum: TCP Handshake vs UDP", course: "Computer Networks", due: "Due in 5 days", priority: "Low", xp: "+20 Course XP" },
                  { id: "lms-job-4", title: "Consistency Streak: Maintain 5+ Weekly Login Days", course: "Institutional LMS Cadence", due: "Active Goal (4/5 days logged)", priority: "Streak Goal", xp: "+50 XP Bonus" },
                ].map((job) => {
                  const isDone = !!completedJobs[job.id];
                  return (
                    <div
                      key={job.id}
                      onClick={() => toggleJob(job.id)}
                      className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        isDone
                          ? "bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 text-slate-400 line-through"
                          : "bg-slate-50 dark:bg-slate-800/60 border-slate-200/70 hover:border-purple-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                          isDone ? "bg-purple-600 border-purple-600 text-white" : "border-slate-300 bg-white dark:bg-slate-900"
                        }`}>
                          {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{job.title}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{job.course} • {job.due}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-700">
                          {job.priority}
                        </span>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {job.xp}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
