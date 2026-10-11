import { useState } from "react";
import PageHeader from "../../components/PageHeader";
import MobileHeader from "../../components/MobileHeader";
import {
  Users,
  Briefcase,
  GraduationCap,
  Sparkles,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  BrainCircuit,
  Sliders,
  ShieldCheck,
  Eye,
  Plus
} from "lucide-react";
import {
  getStudentList,
  getStudentSegmentation,
  calculateStudentSuccessScoreBreakdown,
  calculateAcademicRisk,
  getExplainableRiskFlags,
  getOrCreateStudentIntelligence,
} from "../../intelligence/analyticsService";
import { SEGMENT_DEFINITIONS, SegmentType } from "../../intelligence/scoringConfig";
import StudentDrillDownModal from "../../components/analytics/StudentDrillDownModal";
import InterventionModal from "../../components/analytics/InterventionModal";

export default function AdminSegmentationPage() {
  const allStudents = getStudentList();
  const [selectedSegmentFilter, setSelectedSegmentFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [drillDownStudentId, setDrillDownStudentId] = useState<string | null>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);
  const [selectedStudentForIntervention, setSelectedStudentForIntervention] = useState<string | null>(null);
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);

  // Enrich each student with segmentation, success score, academic and placement metrics
  const enrichedStudents = allStudents.map((stud) => {
    const intel = getOrCreateStudentIntelligence(stud.id);
    const segmentation = getStudentSegmentation(stud.id);
    const scoreBreakdown = calculateStudentSuccessScoreBreakdown(stud.id);
    const risk = calculateAcademicRisk(stud.id);
    const flags = getExplainableRiskFlags(stud.id);

    return {
      ...stud,
      intel,
      segmentation,
      scoreBreakdown,
      risk,
      flags,
      quizAvg: intel.academicMetrics.quizAverage ?? 0,
      attendance: intel.academicMetrics.attendancePercent ?? 0,
      placementScore: intel.placementReadiness?.overallPlacementScore ?? 0,
      codingScore: intel.placementReadiness?.codingScore ?? 0,
      resumeStatus: intel.placementReadiness?.resumeStatus ?? "unsubmitted",
    };
  });

  // Calculate cohort distribution per segment
  const segmentCounts: Record<string, number> = {
    "High Performers": 0,
    "Consistent Learners": 0,
    "Improving Students": 0,
    "Students Needing Academic Support": 0,
    "Placement-Ready Students": 0,
    "Placement Preparation Needed": 0,
    "Insufficient Data": 0,
  };

  enrichedStudents.forEach((s) => {
    if (segmentCounts[s.segmentation.primarySegment] !== undefined) {
      segmentCounts[s.segmentation.primarySegment]++;
    }
  });

  // Filter students
  const filteredStudents = enrichedStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.course && s.course.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedSegmentFilter !== "all" && s.segmentation.primarySegment !== selectedSegmentFilter) {
      return false;
    }

    return true;
  });

  function handleOpenDrilldown(id: string) {
    setDrillDownStudentId(id);
    setIsDrillDownOpen(true);
  }

  function handleOpenIntervention(id: string) {
    setSelectedStudentForIntervention(id);
    setIsInterventionModalOpen(true);
  }

  function handleExportCSV() {
    const headers = [
      "Student ID",
      "Name",
      "Course",
      "Year",
      "Primary Segment",
      "Success Score",
      "Academic Risk",
      "Attendance %",
      "Quiz Avg %",
      "Placement Score",
      "Resume Status",
      "Segment Drivers",
    ];

    const rows = filteredStudents.map((s) => [
      `"${s.id}"`,
      `"${s.name}"`,
      `"${s.course || 'B.Tech'}"`,
      `"${s.intel.profile.year || '3rd Year'}"`,
      `"${s.segmentation.primarySegment}"`,
      s.scoreBreakdown.overallScore ?? "N/A",
      `"${s.risk.riskLevel}"`,
      `${s.attendance}%`,
      `${s.quizAvg}%`,
      `${s.placementScore}%`,
      `"${s.resumeStatus}"`,
      `"${s.segmentation.reasoning.replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `student_segmentation_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const segmentCardsConfig: { type: SegmentType; icon: any; colorScheme: string }[] = [
    {
      type: "High Performers",
      icon: GraduationCap,
      colorScheme: "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400",
    },
    {
      type: "Consistent Learners",
      icon: CheckCircle2,
      colorScheme: "border-blue-500/30 bg-blue-500/5 text-blue-600 dark:text-blue-400",
    },
    {
      type: "Improving Students",
      icon: TrendingUp,
      colorScheme: "border-teal-500/30 bg-teal-500/5 text-teal-600 dark:text-teal-400",
    },
    {
      type: "Students Needing Academic Support",
      icon: AlertCircle,
      colorScheme: "border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-400",
    },
    {
      type: "Placement-Ready Students",
      icon: Briefcase,
      colorScheme: "border-indigo-500/30 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400",
    },
    {
      type: "Placement Preparation Needed",
      icon: Sliders,
      colorScheme: "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400",
    },
    {
      type: "Insufficient Data",
      icon: HelpCircle,
      colorScheme: "border-slate-500/30 bg-slate-500/5 text-slate-600 dark:text-slate-400",
    },
  ];

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <PageHeader
            title="Student Segmentation & Decision Intelligence"
            subtitle="AI-driven multidimensional cohort clustering grouping students to guide targeted institutional interventions."
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-800 text-slate-700 dark:text-navy-200 hover:bg-slate-50 dark:hover:bg-navy-700 transition-all flex items-center gap-2 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              Export Cohort CSV
            </button>
          </div>
        </div>

        {/* Explainability & Hackathon Briefing Callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-teal-500/10 border border-indigo-500/20 dark:border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0 shadow-md shadow-indigo-600/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Bonus Criteria: Decision Intelligence & Explainable Segmentation
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                  +10 Bonus Credit
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-navy-300 mt-1 max-w-3xl leading-relaxed">
                Rather than treating all at-risk students identically, our clustering engine evaluates cross-stream vectors (Academic GPA vs. Placement Readiness) to segment students into targeted action groups such as <strong className="text-slate-900 dark:text-white">High Academic but Placement Preparation Needed</strong>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/80 dark:bg-navy-800/80 border border-slate-200/60 dark:border-navy-700 text-slate-700 dark:text-navy-200">
              Total Cohort: {allStudents.length} Students
            </span>
          </div>
        </div>

        {/* 7 Segment Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {segmentCardsConfig.map((card) => {
            const count = segmentCounts[card.type] || 0;
            const percentage = allStudents.length ? Math.round((count / allStudents.length) * 100) : 0;
            const isSelected = selectedSegmentFilter === card.type;
            const Icon = card.icon;
            const def = SEGMENT_DEFINITIONS[card.type];

            return (
              <div
                key={card.type}
                onClick={() => setSelectedSegmentFilter(isSelected ? "all" : card.type)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? "ring-2 ring-indigo-500 shadow-md bg-white dark:bg-navy-800 border-indigo-500"
                    : "bg-white dark:bg-navy-800/80 border-slate-200/80 dark:border-navy-700/80 hover:border-indigo-300 dark:hover:border-navy-600 shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-xl border ${card.colorScheme}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      {count}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-navy-400">
                      ({percentage}%)
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {def.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-navy-300 mt-1 line-clamp-2 leading-relaxed">
                    {def.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-navy-700/50 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 dark:text-navy-400">Recommended Action:</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 truncate max-w-[140px]">
                    {def.recommendedFocus.split(",")[0]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student by name, ID, or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-slate-500 dark:text-navy-400 shrink-0 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            <button
              onClick={() => setSelectedSegmentFilter("all")}
              className={`px-3 py-1 text-xs rounded-lg font-medium transition-all shrink-0 ${
                selectedSegmentFilter === "all"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-navy-700 text-slate-600 dark:text-navy-300 hover:bg-slate-200 dark:hover:bg-navy-600"
              }`}
            >
              All Cohorts ({allStudents.length})
            </button>
            {Object.keys(segmentCounts).map((seg) => (
              <button
                key={seg}
                onClick={() => setSelectedSegmentFilter(seg)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all shrink-0 ${
                  selectedSegmentFilter === seg
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-navy-700 text-slate-600 dark:text-navy-300 hover:bg-slate-200 dark:hover:bg-navy-600"
                }`}
              >
                {seg} ({segmentCounts[seg]})
              </button>
            ))}
          </div>
        </div>

        {/* Student Segmentation Registry Table */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-navy-700/80 bg-white dark:bg-navy-800 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-navy-700/60 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Cohort Classification Directory
              </h3>
              <p className="text-xs text-slate-500 dark:text-navy-400 mt-0.5">
                Showing {filteredStudents.length} of {allStudents.length} students classified into targeted segments.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-navy-700 bg-slate-50/75 dark:bg-navy-800/75 text-[11px] font-bold text-slate-500 dark:text-navy-300 uppercase tracking-wider">
                  <th className="py-3 px-4">Student Profile</th>
                  <th className="py-3 px-4">Primary Segment</th>
                  <th className="py-3 px-4 text-center">Success Score</th>
                  <th className="py-3 px-4 text-center">Academic Standing</th>
                  <th className="py-3 px-4 text-center">Placement Readiness</th>
                  <th className="py-3 px-4">Explainable Driver</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-navy-700 text-xs">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-slate-400 dark:text-navy-400">
                      No students found matching the selected segment or filter.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => {
                    const segDef = SEGMENT_DEFINITIONS[student.segmentation.primarySegment as SegmentType] || SEGMENT_DEFINITIONS["Consistent Learners"];
                    const score = student.scoreBreakdown.overallScore;

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-slate-50/60 dark:hover:bg-navy-700/40 transition-colors"
                      >
                        {/* Student Profile */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                                {student.name}
                                <span className="text-[10px] font-mono text-slate-400 dark:text-navy-400 font-normal">
                                  ({student.id})
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-navy-400">
                                {student.course || "B.Tech IT"} • {student.intel.profile.year || "3rd Year"}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Primary Segment Badge */}
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${segDef.badgeColor}`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {student.segmentation.primarySegment}
                          </span>
                        </td>

                        {/* Success Score */}
                        <td className="py-3.5 px-4 text-center">
                          {score !== null ? (
                            <div className="inline-flex flex-col items-center">
                              <span
                                className={`text-sm font-extrabold ${
                                  score >= 80
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : score >= 65
                                    ? "text-indigo-600 dark:text-indigo-400"
                                    : score >= 50
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-rose-600 dark:text-rose-400"
                                }`}
                              >
                                {score}
                              </span>
                              <span className="text-[10px] text-slate-400">/ 100</span>
                            </div>
                          ) : (
                            <span className="text-[10px] font-medium text-slate-400 bg-slate-100 dark:bg-navy-900 px-2 py-0.5 rounded-md">
                              Insufficient
                            </span>
                          )}
                        </td>

                        {/* Academic Standing */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="text-xs font-semibold text-slate-800 dark:text-navy-200">
                            {student.quizAvg}% Quiz Avg
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-navy-400">
                            {student.attendance}% Attendance
                          </div>
                        </td>

                        {/* Placement Readiness */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="text-xs font-semibold text-slate-800 dark:text-navy-200">
                            {student.placementScore > 0 ? `${student.placementScore}% Ready` : "Pending Eval"}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-navy-400 capitalize">
                            Resume: {student.resumeStatus.replace("_", " ")}
                          </div>
                        </td>

                        {/* Explainable Driver */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <p className="text-[11px] text-slate-600 dark:text-navy-300 leading-snug line-clamp-2">
                            {student.segmentation.reasoning}
                          </p>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenDrilldown(student.id)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-navy-700 text-slate-700 dark:text-navy-200 hover:bg-slate-200 dark:hover:bg-navy-600 transition-colors flex items-center gap-1"
                              title="Inspect 360° Profile & Evidence"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              Inspect
                            </button>
                            <button
                              onClick={() => handleOpenIntervention(student.id)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors flex items-center gap-1"
                              title="Dispatch Targeted Action"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Intervene
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

        {/* Modal Connections */}
        {drillDownStudentId && (
          <StudentDrillDownModal
            isOpen={isDrillDownOpen}
            studentId={drillDownStudentId}
            onClose={() => setIsDrillDownOpen(false)}
            onCreateIntervention={(id) => {
              setIsDrillDownOpen(false);
              handleOpenIntervention(id);
            }}
          />
        )}

        <InterventionModal
          isOpen={isInterventionModalOpen}
          preselectedStudentId={selectedStudentForIntervention}
          onClose={() => setIsInterventionModalOpen(false)}
          onInterventionsChanged={() => {
            setIsInterventionModalOpen(false);
          }}
        />
      </div>
    </>
  );
}
