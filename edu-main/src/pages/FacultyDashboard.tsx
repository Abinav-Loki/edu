import { useState } from "react";
import { useCampus } from "../context/CampusContext";
import PageHeader from "../components/PageHeader";
import MobileHeader from "../components/MobileHeader";
import GlassCard from "../components/GlassCard";
import {
  Users,
  Award,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Sliders,
  Plus,
  ChevronRight,
  Info,
  Calendar,
  Briefcase,
  Layers,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  getFacultyAnalyticsOverview,
  calculateStudentSuccessScoreBreakdown,
  getExplainableRiskFlags,
  getStudentSegmentation,
  getStudentList,
  getStoredInterventions,
} from "../intelligence/analyticsService";
import StudentDrillDownModal from "../components/analytics/StudentDrillDownModal";
import InterventionModal from "../components/analytics/InterventionModal";
import { SCORING_DISCLAIMER } from "../intelligence/scoringConfig";

export default function FacultyDashboard() {
  const { currentUser, mentorRequests, updateMentorRequest } = useCampus();

  // Selected Student Drill-Down state
  const [selectedDrillDownStudentId, setSelectedDrillDownStudentId] = useState<string | null>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState<boolean>(false);

  // Intervention modal state
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState<boolean>(false);
  const [interventionStudentId, setInterventionStudentId] = useState<string | null>(null);

  // Search & Filter state for students directory
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState<string>("all");
  const [riskOnlyFilter, setRiskOnlyFilter] = useState<boolean>(false);

  // Refresh trigger
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const overview = getFacultyAnalyticsOverview();
  const allStudents = getStudentList();
  const interventions = getStoredInterventions();

  // Pending mentor requests for current faculty
  const myRequests = mentorRequests.filter(
    (req) => req.mentorId === currentUser?.id && req.status === "pending"
  );

  // Filtered students for interactive table
  const filteredStudents = allStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const seg = getStudentSegmentation(student.id);
    const matchesSegment =
      selectedSegmentFilter === "all" || seg.primarySegment === selectedSegmentFilter;

    const risks = getExplainableRiskFlags(student.id);
    const isAtRisk = risks.some((r) => r.severity === "High" || r.severity === "Medium");
    const matchesRisk = !riskOnlyFilter || isAtRisk;

    return matchesSearch && matchesSegment && matchesRisk;
  });

  const handleOpenDrillDown = (sId: string) => {
    setSelectedDrillDownStudentId(sId);
    setIsDrillDownOpen(true);
  };

  const handleLaunchIntervention = (sId: string) => {
    setInterventionStudentId(sId);
    setIsInterventionModalOpen(true);
  };

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <PageHeader
            title="Smart Campus Analytics Hub"
            subtitle={`AI-Powered Cohort Intelligence & Student Success • Welcome, Professor ${
              currentUser?.name.split(" ")[0] || "User"
            }`}
            badge="Hackathon 2026 Edition"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setInterventionStudentId(null);
                setIsInterventionModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
            >
              <Plus className="w-4 h-4" />
              Manage Interventions ({overview.openInterventionsCount})
            </button>
          </div>
        </div>

        {/* 1. TOP 8 KPI ANALYTICS METRICS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Metric 1: Total Students */}
          <div className="glass-card p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Analyzed Students</span>
              <Users className="w-4 h-4 text-sky-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
                {overview.totalStudents}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Cohort Total</span>
            </div>
          </div>

          {/* Metric 2: Average Success Score */}
          <div className="glass-card p-4 flex flex-col justify-between border-l-4 border-l-indigo-500">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Avg Success Score</span>
              <Award className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {overview.averageSuccessScore}%
              </span>
              <span className="text-[11px] text-slate-400 font-medium" title={SCORING_DISCLAIMER}>
                Weighted 6-Cat Index
              </span>
            </div>
          </div>

          {/* Metric 3: Students Requiring Review */}
          <div className="glass-card p-4 flex flex-col justify-between border-l-4 border-l-rose-500">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Needs Review</span>
              <AlertTriangle className="w-4 h-4 text-rose-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
                {overview.reviewRequiredCount}
              </span>
              <span className="text-[11px] text-rose-500 font-semibold">Active Flags</span>
            </div>
          </div>

          {/* Metric 4: Academic Risk Count */}
          <div className="glass-card p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Academic Risk</span>
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
                {overview.academicRiskCount}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Quiz &lt; 60%</span>
            </div>
          </div>

          {/* Metric 5: Attendance Risk Count */}
          <div className="glass-card p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Attendance Concern</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
                {overview.attendanceRiskCount}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">&lt; 75% Threshold</span>
            </div>
          </div>

          {/* Metric 6: Placement Risk Count */}
          <div className="glass-card p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Placement Lag</span>
              <Briefcase className="w-4 h-4 text-purple-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
                {overview.placementRiskCount}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Coding &lt; 60%</span>
            </div>
          </div>

          {/* Metric 7: Incomplete Data Count */}
          <div className="glass-card p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Incomplete Profiles</span>
              <Info className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100">
                {overview.incompleteDataCount}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">&lt; 100% Coverage</span>
            </div>
          </div>

          {/* Metric 8: Open Interventions */}
          <div className="glass-card p-4 flex flex-col justify-between border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Open Actions</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {overview.openInterventionsCount}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold">Active Workflows</span>
            </div>
          </div>
        </div>

        {/* 2. INTERACTIVE VISUALIZATIONS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart 1: Success Score Distribution */}
          <GlassCard className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Success Score Distribution
                </h3>
                <p className="text-[11px] text-slate-400">Normalized weighted score bands</p>
              </div>
              <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold text-slate-500">
                {overview.totalStudents} Students
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overview.scoreDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    formatter={(val: any) => [`${val} students`, "Count"]}
                    contentStyle={{ borderRadius: "0.75rem", fontSize: "11px" }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {overview.scoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Chart 2: Risk Breakdown by Category */}
          <GlassCard className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Risk Category Breakdown
                </h3>
                <p className="text-[11px] text-slate-400">Students flagged across risk dimensions</p>
              </div>
            </div>

            <div className="space-y-3 pt-1">
              {overview.riskBreakdown.map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 dark:text-slate-300">{item.category}</span>
                    <span className="font-bold font-mono text-slate-800 dark:text-slate-100">{item.count}</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(8, (item.count / overview.totalStudents) * 100)}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Chart 3: Student Segmentation Distribution */}
          <GlassCard className="p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                  Student Segmentation
                </h3>
                <p className="text-[11px] text-slate-400">Rule-based support archetypes</p>
              </div>
              <span className="text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold">
                6 Segments
              </span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-48 pr-1">
              {overview.segmentDistribution.map((item) => (
                <div
                  key={item.segment}
                  onClick={() => setSelectedSegmentFilter(selectedSegmentFilter === item.segment ? "all" : item.segment)}
                  className={`p-2 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition ${
                    selectedSegmentFilter === item.segment
                      ? "bg-indigo-50 border-indigo-300 dark:bg-indigo-950/50 dark:border-indigo-800"
                      : "bg-white/60 dark:bg-slate-800/60 border-slate-100 dark:border-slate-800 hover:border-slate-300"
                  }`}
                >
                  <span className="font-semibold text-slate-700 dark:text-slate-300 truncate mr-2">
                    {item.segment}
                  </span>
                  <span className="font-bold font-mono text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 shrink-0">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* 3. SEARCHABLE & FILTERABLE STUDENT ANALYTICS DIRECTORY */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                Cohort Student Analytics Directory
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Unified data, weighted heuristic scores, risk indicators, and 360° profile drill-down
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 w-48"
                />
              </div>

              <select
                value={selectedSegmentFilter}
                onChange={(e) => setSelectedSegmentFilter(e.target.value)}
                className="py-1.5 px-3 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="all">All Segments</option>
                <option value="Strong Academics / Strong Placement Readiness">Strong Academics & Placement</option>
                <option value="Strong Academics / Placement Support Needed">Placement Support Needed</option>
                <option value="Academic Support Needed / Good Engagement">Academic Support Needed</option>
                <option value="Attendance Concern / Declining Academics">Attendance Concern</option>
                <option value="Strong Skills / Placement Preparation Incomplete">Skills Strong / Placement Incomplete</option>
                <option value="Insufficient Data for Segmentation">Insufficient Data</option>
              </select>

              <button
                onClick={() => setRiskOnlyFilter(!riskOnlyFilter)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  riskOnlyFilter
                    ? "bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-400"
                    : "bg-white border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Needs Review Only
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-3">Department</th>
                  <th className="py-3 px-3 text-center">Success Score</th>
                  <th className="py-3 px-3 text-center">Coverage</th>
                  <th className="py-3 px-3 text-center">Attendance</th>
                  <th className="py-3 px-3 text-center">Placement</th>
                  <th className="py-3 px-4">Risk Flags & Segment</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white/70 dark:bg-slate-900/40">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-400 font-medium">
                      No students match the selected search and filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => {
                    const breakdown = calculateStudentSuccessScoreBreakdown(s.id);
                    const risks = getExplainableRiskFlags(s.id);
                    const seg = getStudentSegmentation(s.id);
                    const isHighRisk = risks.some((r) => r.severity === "High");

                    return (
                      <tr
                        key={s.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition group cursor-pointer"
                        onClick={() => handleOpenDrillDown(s.id)}
                      >
                        {/* Student Name & ID */}
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-100">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold">{s.name}</span>
                              {isHighRisk && (
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" title="High severity flag" />
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono font-medium">
                              {s.id} • {s.year}
                            </span>
                          </div>
                        </td>

                        {/* Department */}
                        <td className="py-3.5 px-3 text-slate-600 dark:text-slate-400 font-medium">
                          {s.department || s.course}
                        </td>

                        {/* Success Score */}
                        <td className="py-3.5 px-3 text-center">
                          {breakdown.overallScore !== null ? (
                            <div className="inline-flex items-center gap-1 font-mono font-black text-sm px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/60">
                              {breakdown.overallScore}%
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                              Insufficient Data
                            </span>
                          )}
                        </td>

                        {/* Coverage */}
                        <td className="py-3.5 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            breakdown.dataCoveragePercent === 100
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            {breakdown.dataCoveragePercent}% ({breakdown.validCategoriesCount}/6)
                          </span>
                        </td>

                        {/* Attendance */}
                        <td className="py-3.5 px-3 text-center font-mono font-bold">
                          <span className={s.attendancePercent < 75 ? "text-rose-600" : "text-emerald-600"}>
                            {s.attendancePercent}%
                          </span>
                        </td>

                        {/* Placement Score */}
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-700 dark:text-slate-300">
                          {breakdown.categoryScores["placementReadiness"]?.score !== null
                            ? `${breakdown.categoryScores["placementReadiness"].score}%`
                            : "—"}
                        </td>

                        {/* Risk Flags & Segment */}
                        <td className="py-3.5 px-4 space-y-1">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${seg.badgeColor}`}>
                            {seg.primarySegment}
                          </span>
                          {risks.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {risks.slice(0, 2).map((r) => (
                                <span
                                  key={r.id}
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    r.severity === "High"
                                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400"
                                      : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                                  }`}
                                >
                                  {r.category}: {r.severity}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div
                            className="flex items-center justify-end gap-1.5"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => handleOpenDrillDown(s.id)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 text-xs font-bold transition"
                            >
                              Drill-Down 360°
                            </button>
                            <button
                              onClick={() => handleLaunchIntervention(s.id)}
                              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
                            >
                              + Action
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. PRESERVED PENDING MENTOR REQUESTS SECTION */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-500" />
              Pending 1-on-1 Mentorship Requests ({myRequests.length})
            </h3>
            <span className="text-xs text-slate-400 font-medium">Faculty Direct Office Hours</span>
          </div>

          {myRequests.length === 0 ? (
            <div className="p-6 text-center text-slate-400 text-xs font-medium bg-slate-50/50 dark:bg-slate-800/40 rounded-xl">
              No pending mentorship requests at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myRequests.map((req) => {
                const student = allStudents.find((s) => s.id === req.studentId);
                return (
                  <div key={req.id} className="p-4 rounded-xl bg-white dark:bg-slate-800 border-l-4 border-l-indigo-500 shadow-xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                          {student?.name || "Student"}
                        </h4>
                        <p className="text-xs text-slate-400">{student?.course} • ID: {req.studentId}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">
                        <Clock className="w-3 h-3" /> Pending
                      </span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-lg text-xs space-y-1">
                      <p><span className="font-bold text-slate-500">Subject: </span>{req.subject}</p>
                      <p><span className="font-bold text-slate-500">Requested Slot: </span>{req.date} at {req.time}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => updateMentorRequest(req.id, "confirmed")}
                        className="flex-1 bg-indigo-600 text-white rounded-xl py-1.5 text-xs font-bold hover:bg-indigo-700 transition"
                      >
                        Accept Slot
                      </button>
                      <button
                        onClick={() => updateMentorRequest(req.id, "suggest_alternate", "Tomorrow 10:00 AM")}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl py-1.5 text-xs font-bold transition"
                      >
                        Suggest Alternate
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* MODAL 1: STUDENT DRILL-DOWN 360 */}
      <StudentDrillDownModal
        studentId={selectedDrillDownStudentId}
        isOpen={isDrillDownOpen}
        onClose={() => setIsDrillDownOpen(false)}
        onCreateIntervention={(sId) => {
          setIsDrillDownOpen(false);
          handleLaunchIntervention(sId);
        }}
      />

      {/* MODAL 2: INTERVENTION MANAGEMENT WORKFLOW */}
      <InterventionModal
        isOpen={isInterventionModalOpen}
        onClose={() => setIsInterventionModalOpen(false)}
        preselectedStudentId={interventionStudentId}
        onInterventionsChanged={() => setRefreshKey((k) => k + 1)}
      />
    </>
  );
}
