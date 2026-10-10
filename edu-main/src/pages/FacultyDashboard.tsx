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
import StudentDetailDrawer from "../components/faculty/StudentDetailDrawer";
import { SCORING_DISCLAIMER } from "../intelligence/scoringConfig";

export default function FacultyDashboard() {
  const { currentUser, mentorRequests, updateMentorRequest } = useCampus();

  // Selected Student Drill-Down state
  const [selectedDrillDownStudentId, setSelectedDrillDownStudentId] = useState<string | null>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState<boolean>(false);

  // Student Detail Drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerStudentId, setDrawerStudentId] = useState<string | null>(null);
  const [drawerTab, setDrawerTab] = useState<'overview' | 'message'>('overview');

  // Intervention modal state
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState<boolean>(false);
  const [interventionStudentId, setInterventionStudentId] = useState<string | null>(null);

  // Search & Filter state for Students Who Need Help
  const [helpSearchTerm, setHelpSearchTerm] = useState<string>("");
  const [helpFilter, setHelpFilter] = useState<string>("all");

  // Chart 3 uses this state
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState<string>("all");

  // Refresh trigger
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const overview = getFacultyAnalyticsOverview();
  const allStudents = getStudentList();
  const interventions = getStoredInterventions();

  // Pending mentor requests for current faculty
  const myRequests = mentorRequests.filter(
    (req) => req.mentorId === currentUser?.id && req.status === "pending"
  );

  // Identify Students Who Need Help
  const studentsNeedingHelp = allStudents
    .map((s) => {
      const risks = getExplainableRiskFlags(s.id);
      const breakdown = calculateStudentSuccessScoreBreakdown(s.id);
      return { student: s, risks, breakdown };
    })
    .filter((entry) => entry.risks.length > 0)
    .sort((a, b) => {
      const hasHighA = a.risks.some(r => r.severity === "High");
      const hasHighB = b.risks.some(r => r.severity === "High");
      if (hasHighA && !hasHighB) return -1;
      if (!hasHighA && hasHighB) return 1;
      return b.risks.length - a.risks.length;
    });

  const filteredHelpStudents = studentsNeedingHelp.filter((entry) => {
    const { student, risks } = entry;
    const matchesSearch =
      student.name.toLowerCase().includes(helpSearchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(helpSearchTerm.toLowerCase()) ||
      (student.department || student.course)?.toLowerCase().includes(helpSearchTerm.toLowerCase());

    const matchesFilter =
      helpFilter === "all" ||
      (helpFilter === "high_risk" && risks.some(r => r.severity === "High")) ||
      (helpFilter === "attendance" && risks.some(r => r.category === "Attendance")) ||
      (helpFilter === "academic" && risks.some(r => r.category === "Academic")) ||
      (helpFilter === "placement" && risks.some(r => r.category === "Placement Readiness"));

    return matchesSearch && matchesFilter;
  });

  const handleOpenDrillDown = (sId: string) => {
    setSelectedDrillDownStudentId(sId);
    setIsDrillDownOpen(true);
  };

  const handleOpenDrawer = (sId: string, tab: 'overview' | 'message' = 'overview') => {
    setDrawerStudentId(sId);
    setDrawerTab(tab);
    setIsDrawerOpen(true);
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

        {/* 3. STUDENTS WHO NEED HELP */}
        <div className="glass-card p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">
                Students Who Need Help
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span className="font-bold text-slate-700 dark:text-slate-200">{studentsNeedingHelp.length} student{studentsNeedingHelp.length === 1 ? '' : 's'} need{studentsNeedingHelp.length === 1 ? 's' : ''} attention.</span> Identify and take action before academic challenges escalate.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search students who need help..."
                  value={helpSearchTerm}
                  onChange={(e) => setHelpSearchTerm(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 w-48"
                />
              </div>

              <select
                value={helpFilter}
                onChange={(e) => setHelpFilter(e.target.value)}
                className="py-1.5 px-3 text-xs font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value="all">All Needs ({studentsNeedingHelp.length})</option>
                <option value="high_risk">High Risk</option>
                <option value="attendance">Attendance Concern</option>
                <option value="academic">Academic Performance</option>
                <option value="placement">Placement Support</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredHelpStudents.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  No students match this filter. 
                </p>
              </div>
            ) : (
              filteredHelpStudents.map(({ student, risks, breakdown }) => {
                const primaryRisk = risks[0];
                return (
                  <div key={student.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-100">{student.name}</h4>
                          <p className="text-[11px] text-slate-500 font-medium font-mono">{student.course || student.department} · {student.year} · ID: {student.id}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${primaryRisk.severity === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'}`}>
                          {primaryRisk.severity} Risk
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300 font-medium mb-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <span className={student.attendancePercent < 75 ? "text-rose-600 font-bold" : ""}>Att: {student.attendancePercent}%</span>
                        <span className={(breakdown.categoryScores["quizPerformance"]?.score ?? 100) < 60 ? "text-rose-600 font-bold" : ""}>Quiz Avg: {breakdown.categoryScores["quizPerformance"]?.score ?? student.quizAverage ?? 0}%</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold">Success: {breakdown.overallScore || "N/A"}%</span>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                        <h5 className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">{primaryRisk.title}</h5>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{primaryRisk.reason}</p>
                        {primaryRisk.recommendedAction && (
                          <p className="text-[11px] text-indigo-600 dark:text-indigo-400 mt-1.5 font-medium">↳ {primaryRisk.recommendedAction}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button onClick={() => handleOpenDrawer(student.id, 'overview')} className="flex-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition text-center whitespace-nowrap">
                        View Details
                      </button>
                      <button onClick={() => handleOpenDrawer(student.id, 'message')} className="flex-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition text-center whitespace-nowrap">
                        Send Message
                      </button>
                      <button onClick={() => handleLaunchIntervention(student.id)} className="flex-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md text-center whitespace-nowrap">
                        Support Action
                      </button>
                    </div>
                  </div>
                )
              })
            )}
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

      {/* MODAL 1.5: STUDENT DETAIL DRAWER (View Details & Messaging) */}
      <StudentDetailDrawer
        studentId={drawerStudentId}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        defaultTab={drawerTab}
        onSupport={(sId) => {
          setIsDrawerOpen(false);
          handleLaunchIntervention(sId);
        }}
        onOpen360={(sId) => {
          setIsDrawerOpen(false);
          handleOpenDrillDown(sId);
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
