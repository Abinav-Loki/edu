import { useState } from "react";
import { useCampus } from "../../context/CampusContext";
import PageHeader from "../../components/PageHeader";
import MobileHeader from "../../components/MobileHeader";
import GlassCard from "../../components/GlassCard";
import {
  Search,
  Filter,
  AlertTriangle,
  TrendingUp,
  Award,
  ChevronRight,
  Briefcase,
  Clock,
  Plus,
} from "lucide-react";
import {
  calculateStudentSuccessScoreBreakdown,
  getExplainableRiskFlags,
  getStudentSegmentation,
  getStudentList,
} from "../../intelligence/analyticsService";
import StudentDrillDownModal from "../../components/analytics/StudentDrillDownModal";
import InterventionModal from "../../components/analytics/InterventionModal";

export default function FacultyStudents() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterRisk, setFilterRisk] = useState<boolean>(false);
  const [selectedSegment, setSelectedSegment] = useState<string>("all");

  const [drillDownStudentId, setDrillDownStudentId] = useState<string | null>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState<boolean>(false);

  const [interventionStudentId, setInterventionStudentId] = useState<string | null>(null);
  const [isInterventionOpen, setIsInterventionOpen] = useState<boolean>(false);

  const students = getStudentList();

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.course.toLowerCase().includes(searchTerm.toLowerCase());

    const risks = getExplainableRiskFlags(s.id);
    const isAtRisk = risks.some((r) => r.severity === "High" || r.severity === "Medium");

    const seg = getStudentSegmentation(s.id);
    const matchesSegment = selectedSegment === "all" || seg.primarySegment === selectedSegment;

    if (filterRisk && !isAtRisk) return false;
    if (!matchesSegment) return false;
    return matchesSearch;
  });

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <PageHeader
            title="My Students Directory"
            subtitle="Monitor holistic performance, risk flags, and student segmentation"
          />
          <button
            onClick={() => {
              setInterventionStudentId(null);
              setIsInterventionOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            + New Intervention
          </button>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, ID, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200"
            />
          </div>

          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Segments ({students.length})</option>
            <option value="Strong Academics / Strong Placement Readiness">Strong Academics & Placement</option>
            <option value="Strong Academics / Placement Support Needed">Placement Support Needed</option>
            <option value="Academic Support Needed / Good Engagement">Academic Support Needed</option>
            <option value="Attendance Concern / Declining Academics">Attendance Concern</option>
            <option value="Strong Skills / Placement Preparation Incomplete">Skills Strong / Placement Incomplete</option>
            <option value="Insufficient Data for Segmentation">Insufficient Data</option>
          </select>

          <button
            onClick={() => setFilterRisk(!filterRisk)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              filterRisk
                ? "bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800"
                : "bg-white border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:bg-slate-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            At Risk Only
          </button>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((student) => {
            const breakdown = calculateStudentSuccessScoreBreakdown(student.id);
            const risks = getExplainableRiskFlags(student.id);
            const seg = getStudentSegmentation(student.id);
            const isAtRisk = risks.some((r) => r.severity === "High" || r.severity === "Medium");

            return (
              <GlassCard
                key={student.id}
                className={`p-5 transition-transform hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between ${
                  isAtRisk ? "border-l-4 border-l-rose-500" : "border-l-4 border-l-emerald-500"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">
                        {student.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        ID: {student.id} • {student.course} • {student.year}
                      </p>
                    </div>

                    {breakdown.overallScore !== null ? (
                      <div className="text-right">
                        <span className="text-sm font-black font-mono text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900/50">
                          {breakdown.overallScore}%
                        </span>
                        <span className="block text-[9px] text-slate-400 mt-0.5">Success Score</span>
                      </div>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        Incomplete
                      </span>
                    )}
                  </div>

                  {/* Segment Badge */}
                  <div className="mb-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${seg.badgeColor}`}>
                      {seg.primarySegment}
                    </span>
                  </div>

                  {/* Metrics Bars */}
                  <div className="space-y-2.5 mb-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1 font-semibold">
                        <span className="text-slate-500 dark:text-slate-400">Attendance</span>
                        <span className={student.attendancePercent < 75 ? "text-rose-600" : "text-emerald-600"}>
                          {student.attendancePercent}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${student.attendancePercent < 75 ? "bg-rose-500" : "bg-emerald-500"}`}
                          style={{ width: `${student.attendancePercent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-semibold">
                        <span className="text-slate-500 dark:text-slate-400">Quiz & Internal Avg</span>
                        <span className={student.quizAverage < 60 ? "text-rose-600" : "text-indigo-600"}>
                          {student.quizAverage}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${student.quizAverage < 60 ? "bg-rose-500" : "bg-indigo-500"}`}
                          style={{ width: `${student.quizAverage}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 font-semibold">
                        <span className="text-slate-500 dark:text-slate-400">Data Coverage</span>
                        <span className="text-slate-700 dark:text-slate-300">
                          {breakdown.dataCoveragePercent}% ({breakdown.validCategoriesCount}/6)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-slate-400"
                          style={{ width: `${breakdown.dataCoveragePercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Active Risk Flags */}
                  {risks.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 text-xs space-y-1 mb-3">
                      <div className="flex items-center gap-1 font-bold text-rose-700 dark:text-rose-400">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{risks[0].title}</span>
                      </div>
                      <p className="text-[11px] text-rose-600 dark:text-rose-300 leading-tight">
                        {risks[0].reason}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center gap-2">
                  <button
                    onClick={() => {
                      setDrillDownStudentId(student.id);
                      setIsDrillDownOpen(true);
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition text-center"
                  >
                    360° Profile
                  </button>
                  <button
                    onClick={() => {
                      setInterventionStudentId(student.id);
                      setIsInterventionOpen(true);
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition text-center"
                  >
                    + Support
                  </button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>

      {/* MODAL 1: DRILL-DOWN */}
      <StudentDrillDownModal
        studentId={drillDownStudentId}
        isOpen={isDrillDownOpen}
        onClose={() => setIsDrillDownOpen(false)}
        onCreateIntervention={(sId) => {
          setIsDrillDownOpen(false);
          setInterventionStudentId(sId);
          setIsInterventionOpen(true);
        }}
      />

      {/* MODAL 2: INTERVENTION */}
      <InterventionModal
        isOpen={isInterventionOpen}
        onClose={() => setIsInterventionOpen(false)}
        preselectedStudentId={interventionStudentId}
      />
    </>
  );
}
