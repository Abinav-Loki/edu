import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import MobileHeader from "../../components/MobileHeader";
import {
  AlertTriangle,
  Users,
  Briefcase,
  GraduationCap,
  TrendingDown,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  Eye,
  Sliders,
  Sparkles,
  ExternalLink
} from "lucide-react";
import {
  getStudentList,
  calculateAcademicRisk,
  getExplainableRiskFlags,
  calculateStudentSuccessScoreBreakdown,
  getStoredInterventions,
  getStudentSegmentation,
} from "../../intelligence/analyticsService";
import InterventionModal from "../../components/analytics/InterventionModal";
import StudentDrillDownModal from "../../components/analytics/StudentDrillDownModal";
import type { RiskLevel } from "../../intelligence/types";

export default function AdminAtRiskPage() {
  const allStudents = getStudentList();
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<string | null>(null);
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);
  const [drillDownStudentId, setDrillDownStudentId] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const interventions = getStoredInterventions();

  // Enriched student intelligence records
  const enrichedStudents = allStudents.map((stud) => {
    const risk = calculateAcademicRisk(stud.id);
    const flags = getExplainableRiskFlags(stud.id);
    const breakdown = calculateStudentSuccessScoreBreakdown(stud.id);
    const segmentation = getStudentSegmentation(stud.id);

    const hasPlacementRisk = flags.some((f) => f.category === "Placement Readiness");
    const hasAcademicRisk = flags.some((f) => f.category === "Academic" || f.category === "Attendance");

    return {
      ...stud,
      riskScore: risk.riskScore,
      riskLevel: risk.riskLevel as RiskLevel,
      flags,
      breakdown,
      segmentation,
      hasPlacementRisk,
      hasAcademicRisk,
    };
  });

  const highRiskCount = enrichedStudents.filter((s) => s.riskLevel === "HIGH").length;
  const mediumRiskCount = enrichedStudents.filter((s) => s.riskLevel === "MEDIUM").length;
  const placementRiskCount = enrichedStudents.filter((s) => s.hasPlacementRisk).length;
  const activeInterventionsCount = interventions.filter((i) => i.status !== "Completed" && i.status !== "Dismissed").length;

  const filteredStudents = enrichedStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.course && s.course.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (riskFilter === "high") return s.riskLevel === "HIGH";
    if (riskFilter === "medium") return s.riskLevel === "MEDIUM";
    if (riskFilter === "placement") return s.hasPlacementRisk;
    if (riskFilter === "academic") return s.hasAcademicRisk;
    return true;
  });

  function handleOpenIntervention(studentId?: string) {
    setSelectedStudentForModal(studentId || null);
    setIsInterventionModalOpen(true);
  }

  function handleOpenDrilldown(studentId: string) {
    setDrillDownStudentId(studentId);
    setIsDrillDownOpen(true);
  }

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <PageHeader
            title="At-Risk Identification & Early Interventions"
            subtitle="Predictive Identification of Academic Shortfalls & Placement Outcome Vulnerabilities • Actionable Decision Intelligence"
            badge="ByteXL Criterion 2 • 25%"
          />

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenIntervention()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Dispatch New Intervention</span>
            </button>
          </div>
        </div>

        {/* RISK KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Critical High Risk</span>
              <AlertTriangle className="w-5 h-5 text-rose-500" />
            </div>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">{highRiskCount} Students</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Score &lt; 60 • Immediate Intervention Needed
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/20 dark:bg-amber-950/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Moderate Attention</span>
              <TrendingDown className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">{mediumRiskCount} Students</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Score 60–74 • Monitored Trajectory
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Placement Vulnerability</span>
              <Briefcase className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{placementRiskCount} Students</p>
            <p className="text-[11px] text-slate-500 font-medium mt-1">
              Low Aptitude or Missing Mock Interviews
            </p>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Interventions</span>
              <Clock className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">{activeInterventionsCount} Active</p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              Tracked Across Faculty & Mentors
            </p>
          </div>
        </div>

        {/* AT-RISK REGISTRY & SEARCH */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Explainable At-Risk Student Registry
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Transparent evidence behind every risk flag. Click any student to view 360° metrics or dispatch targeted interventions.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search student, ID, or course..."
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-white border border-transparent focus:border-indigo-500 w-48 sm:w-60"
                />
              </div>

              <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                <option value="all">All Evaluated Students ({allStudents.length})</option>
                <option value="high">Critical High Risk ({highRiskCount})</option>
                <option value="medium">Moderate Risk ({mediumRiskCount})</option>
                <option value="placement">Placement Vulnerability ({placementRiskCount})</option>
                <option value="academic">Academic / Attendance Deficit</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-3">Student</th>
                  <th className="py-3 px-3">Course & Year</th>
                  <th className="py-3 px-3 text-center">Success Score</th>
                  <th className="py-3 px-3 text-center">Risk Level</th>
                  <th className="py-3 px-3">Explainable Risk Evidence</th>
                  <th className="py-3 px-3">Recommended Action</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      No students found matching current risk filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr
                      key={s.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800 dark:text-slate-100">{s.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{s.id}</div>
                      </td>

                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        <div>{s.course || "B.Tech IT"}</div>
                        <div className="text-[10px] text-slate-400">{s.year || "3rd Year"}</div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                          {s.breakdown.overallScore !== null ? `${s.breakdown.overallScore}%` : "—"}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            s.riskLevel === "HIGH"
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                              : s.riskLevel === "MEDIUM"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                              : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                          }`}
                        >
                          {s.riskLevel}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {s.flags.length === 0 ? (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                              ✓ Stable Progression
                            </span>
                          ) : (
                            s.flags.slice(0, 2).map((flag, idx) => (
                              <span
                                key={idx}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  flag.severity === "High"
                                    ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-900"
                                    : "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900"
                                }`}
                              >
                                {flag.title}
                              </span>
                            ))
                          )}
                          {s.flags.length > 2 && (
                            <span className="text-[10px] text-slate-400 font-bold">
                              +{s.flags.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                        {s.hasAcademicRisk && s.hasPlacementRisk ? (
                          <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">
                            Academic + Placement Support
                          </span>
                        ) : s.hasAcademicRisk ? (
                          <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                            Faculty Mentoring & Recovery
                          </span>
                        ) : s.hasPlacementRisk ? (
                          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                            Coding & Mock Interview Bootcamps
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">Maintain Momentum</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDrilldown(s.id)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                            title="View 360° Student Intelligence"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenIntervention(s.id)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition cursor-pointer"
                          >
                            Intervene
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ACTIVE INTERVENTIONS LOG */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Active Campus Interventions & Outcome Tracker
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Decision intelligence closed loop: every flagged risk converts to an assigned intervention and measurable student recovery.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {interventions.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                    {item.studentName}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      item.status === "Completed"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                        : "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                  {item.category}
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                  {item.recommendation}
                </p>

                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                  <span>Assigned: {item.assignedFaculty}</span>
                  <span>Due: {item.dueDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* INTERVENTION MODAL */}
      <InterventionModal
        isOpen={isInterventionModalOpen}
        onClose={() => setIsInterventionModalOpen(false)}
        preselectedStudentId={selectedStudentForModal}
        onInterventionsChanged={() => setRefreshTrigger((r) => r + 1)}
      />

      {/* STUDENT 360 DRILL DOWN MODAL */}
      {drillDownStudentId && (
        <StudentDrillDownModal
          isOpen={isDrillDownOpen}
          onClose={() => setIsDrillDownOpen(false)}
          studentId={drillDownStudentId}
        />
      )}
    </>
  );
}
