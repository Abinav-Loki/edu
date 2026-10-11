import { useState, useMemo } from "react";
import PageHeader from "../../components/PageHeader";
import MobileHeader from "../../components/MobileHeader";
import {
  Search,
  Filter,
  Users,
  AlertTriangle,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
  Eye,
  Activity,
  Plus,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import {
  calculateStudentSuccessScoreBreakdown,
  getExplainableRiskFlags,
  getStudentSegmentation,
  getStudentList,
  getStoredInterventions
} from "../../intelligence/analyticsService";
import StudentDrillDownModal from "../../components/analytics/StudentDrillDownModal";
import InterventionModal from "../../components/analytics/InterventionModal";
import StudentDetailDrawer from "../../components/faculty/StudentDetailDrawer";

export default function FacultyStudents() {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedSegment, setSelectedSegment] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedAttendance, setSelectedAttendance] = useState("all");
  const [selectedDataCoverage, setSelectedDataCoverage] = useState("all");
  const [filterRisk, setFilterRisk] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modals state
  const [drillDownStudentId, setDrillDownStudentId] = useState<string | null>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);

  const [interventionStudentId, setInterventionStudentId] = useState<string | null>(null);
  const [isInterventionOpen, setIsInterventionOpen] = useState(false);

  const [drawerStudentId, setDrawerStudentId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Sorting state
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  const students = getStudentList();
  const interventions = getStoredInterventions();

  // Filter students based on all selected criteria
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.course.toLowerCase().includes(searchTerm.toLowerCase());

      const risks = getExplainableRiskFlags(s.id);
      const isAtRisk = risks.some((r) => r.severity === "High" || r.severity === "Medium");

      const seg = getStudentSegmentation(s.id);
      const breakdown = calculateStudentSuccessScoreBreakdown(s.id);

      const matchesRisk = filterRisk ? isAtRisk : true;
      const matchesDepartment = selectedDepartment === "all" || s.course.toLowerCase().includes(selectedDepartment.toLowerCase());
      const matchesSegment = selectedSegment === "all" || seg.primarySegment === selectedSegment;
      const matchesYear = selectedYear === "all" || s.year === selectedYear;
      
      let matchesAttendance = true;
      if (selectedAttendance === "below") matchesAttendance = s.attendancePercent < 75;
      if (selectedAttendance === "above") matchesAttendance = s.attendancePercent >= 75;

      let matchesData = true;
      if (selectedDataCoverage === "complete") matchesData = breakdown.dataCoveragePercent === 100;
      if (selectedDataCoverage === "incomplete") matchesData = breakdown.dataCoveragePercent < 100;

      return matchesSearch && matchesRisk && matchesDepartment && matchesSegment && matchesYear && matchesAttendance && matchesData;
    });
  }, [students, searchTerm, filterRisk, selectedDepartment, selectedSegment, selectedYear, selectedAttendance, selectedDataCoverage]);

  // Sort students
  const sortedStudents = useMemo(() => {
    let sortableStudents = [...filteredStudents];
    if (sortConfig !== null) {
      sortableStudents.sort((a, b) => {
        let aVal: any = a[sortConfig.key as keyof typeof a];
        let bVal: any = b[sortConfig.key as keyof typeof b];

        // Custom getters for computed fields
        if (sortConfig.key === 'successScore') {
           aVal = calculateStudentSuccessScoreBreakdown(a.id).overallScore || 0;
           bVal = calculateStudentSuccessScoreBreakdown(b.id).overallScore || 0;
        } else if (sortConfig.key === 'academicStatus') {
           aVal = getStudentSegmentation(a.id).primarySegment;
           bVal = getStudentSegmentation(b.id).primarySegment;
        }

        if (aVal < bVal) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aVal > bVal) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableStudents;
  }, [filteredStudents, sortConfig]);

  // Derived Summary metrics
  const totalStudents = students.length;
  const studentsAtRiskCount = useMemo(() => students.filter(s => getExplainableRiskFlags(s.id).some(r => r.severity === "High" || r.severity === "Medium")).length, [students]);
  
  const studentsRequiringSupportCount = useMemo(() => {
    const studentsWithActiveTickets = new Set(
      interventions.filter(i => i.status === "Open" || i.status === "In Progress").map(i => i.studentId)
    );
    return studentsWithActiveTickets.size;
  }, [interventions]);

  // Pagination logic
  const totalPages = pageSize === -1 ? 1 : Math.ceil(sortedStudents.length / pageSize);
  
  // Ensure valid page if filters change
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const displayedStudents = useMemo(() => {
    if (pageSize === -1) return sortedStudents;
    const start = (currentPage - 1) * pageSize;
    return sortedStudents.slice(start, start + pageSize);
  }, [sortedStudents, currentPage, pageSize]);

  // Handler for reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("all");
    setSelectedSegment("all");
    setSelectedYear("all");
    setSelectedAttendance("all");
    setSelectedDataCoverage("all");
    setFilterRisk(false);
    setSortConfig(null);
    setCurrentPage(1);
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortHeader = (key: string, label: string) => (
    <th 
      className="py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition select-none"
      onClick={() => handleSort(key)}
    >
      <div className="flex items-center gap-1">
        {label}
        {sortConfig?.key === key ? (
          sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3 text-indigo-500" /> : <ArrowDown className="w-3 h-3 text-indigo-500" />
        ) : (
          <ArrowUp className="w-3 h-3 text-transparent" /> 
        )}
      </div>
    </th>
  );

  // Helper for unique values for dropdowns
  const uniqueDepartments = Array.from(new Set(students.map(s => s.course)));
  const uniqueYears = Array.from(new Set(students.map(s => s.year)));

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader
            title="Student Management"
            subtitle="Monitor student performance, identify academic risks, and coordinate support."
          />
          <div className="hidden md:flex items-center relative">
            <div className="mr-32">
              <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Felix&backgroundColor=eef2ff" alt="AI Robot" className="w-20 h-20 -mt-6 animate-bounce [animation-duration:3s]" />
            </div>
            <div className="absolute right-0 top-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl rounded-tl-none shadow-sm text-xs font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">
              Understand your<br/>students better! ✨
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer hover:border-indigo-300 transition" onClick={handleResetFilters}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{totalStudents}</h3>
                <p className="text-[11px] font-semibold text-slate-500">Total Students</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer hover:border-rose-300 transition" onClick={() => setFilterRisk(true)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-rose-600">{studentsAtRiskCount}</h3>
                <p className="text-[11px] font-semibold text-slate-500">Students At Risk</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer hover:border-amber-300 transition" onClick={() => {}}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-amber-600">{studentsRequiringSupportCount}</h3>
                <p className="text-[11px] font-semibold text-slate-500">Requiring Support</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer hover:border-emerald-300 transition" onClick={() => {}}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              </div>
              <div>
                <h3 className="text-2xl font-black text-purple-600">{students.filter(s => getStudentSegmentation(s.id).primarySegment.includes('Strong')).length}</h3>
                <p className="text-[11px] font-semibold text-slate-500">Strong Performers</p>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER TOOLBAR */}
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by student name, ID, or course..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-200"
              />
            </div>
            <div className="flex gap-2 items-center">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-200 focus:outline-none"
              >
                <option value={10}>10 Entries</option>
                <option value={25}>25 Entries</option>
                <option value={50}>50 Entries</option>
                <option value={-1}>All Entries</option>
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <option value="all">All Departments</option>
              {uniqueDepartments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <select value={selectedSegment} onChange={(e) => setSelectedSegment(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <option value="all">All Segments</option>
              <option value="Strong Academics / Strong Placement Readiness">Strong Academics & Placement</option>
              <option value="Strong Academics / Placement Support Needed">Placement Support Needed</option>
              <option value="Academic Support Needed / Good Engagement">Academic Support Needed</option>
              <option value="Attendance Concern / Declining Academics">Attendance Concern</option>
            </select>

            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <option value="all">All Years</option>
              {uniqueYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <select value={selectedAttendance} onChange={(e) => setSelectedAttendance(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <option value="all">All Attendance</option>
              <option value="below">Below 75% (Risk)</option>
              <option value="above">75% and Above</option>
            </select>

            <select value={selectedDataCoverage} onChange={(e) => setSelectedDataCoverage(e.target.value)} className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200">
              <option value="all">All Records</option>
              <option value="complete">Complete (100%)</option>
              <option value="incomplete">Incomplete Records</option>
            </select>

            <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-semibold cursor-pointer select-none">
              <input type="checkbox" checked={filterRisk} onChange={(e) => setFilterRisk(e.target.checked)} className="accent-rose-500" />
              <span className={filterRisk ? "text-rose-600 font-bold" : "text-slate-700 dark:text-slate-200"}>At Risk Only</span>
            </label>

            <button onClick={handleResetFilters} className="px-3 py-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400">
              Reset Filters
            </button>
          </div>
        </div>

        {/* STUDENT TABLE */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">S.NO.</th>
                  {renderSortHeader("name", "Student")}
                  {renderSortHeader("course", "Department / Year")}
                  {renderSortHeader("attendancePercent", "Attendance")}
                  {renderSortHeader("quizAverage", "Quiz & Internal Avg")}
                  {renderSortHeader("successScore", "Success Score")}
                  {renderSortHeader("academicStatus", "Status")}
                  {renderSortHeader("dataCoverage", "Data Coverage")}
                  <th className="py-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayedStudents.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center">
                        <Users className="w-10 h-10 mb-2 opacity-20" />
                        <p className="font-semibold text-slate-600 dark:text-slate-400">No students found matching your criteria.</p>
                        <button onClick={handleResetFilters} className="text-indigo-600 font-medium text-sm mt-2">Clear search and filters</button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayedStudents.map((student, index) => {
                    const breakdown = calculateStudentSuccessScoreBreakdown(student.id);
                    const risks = getExplainableRiskFlags(student.id);
                    const seg = getStudentSegmentation(student.id);
                    const isAtRisk = risks.some((r) => r.severity === "High" || r.severity === "Medium");
                    
                    const serialNumber = pageSize === -1 ? index + 1 : (currentPage - 1) * pageSize + index + 1;

                    return (
                      <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition">
                        <td className="py-2 px-3 text-sm font-semibold text-slate-500">{serialNumber}.</td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs shrink-0">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap">{student.name}</div>
                              <div className="text-[10px] text-slate-500 whitespace-nowrap">{breakdown.dataCoveragePercent}% Data ({breakdown.validCategoriesCount}/{breakdown.totalCategoriesCount})</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-3 whitespace-nowrap">
                          <div className="text-sm text-slate-700 dark:text-slate-300 font-bold">{student.course}</div>
                          <div className="text-[10px] text-slate-500">{student.year}</div>
                        </td>
                        <td className="py-2 px-3 min-w-[90px]">
                          <div className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">{student.attendancePercent}%</div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${student.attendancePercent < 75 ? "bg-rose-500" : "bg-emerald-500"}`} style={{ width: `${student.attendancePercent}%` }} />
                          </div>
                        </td>
                        <td className="py-2 px-3 min-w-[90px]">
                          <div className="text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">{student.quizAverage}%</div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                            <div className={`h-1.5 rounded-full ${student.quizAverage < 60 ? "bg-rose-500" : "bg-indigo-500"}`} style={{ width: `${student.quizAverage}%` }} />
                          </div>
                        </td>
                        <td className="py-2 px-3">
                          {breakdown.overallScore !== null ? (
                            <span className="text-sm font-black font-mono text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-800/50">
                              {breakdown.overallScore}%
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">N/A</span>
                          )}
                        </td>
                        <td className="py-2 px-3 max-w-[120px]">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border truncate w-full max-w-full block ${
                            isAtRisk ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                            seg.primarySegment.includes('Support') ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`} title={isAtRisk ? risks[0]?.title : seg.primarySegment}>
                            {isAtRisk && <AlertTriangle className="w-3 h-3 mr-1 shrink-0 inline-block" />}
                            <span className="truncate">{isAtRisk ? risks[0]?.title : seg.primarySegment}</span>
                          </span>
                        </td>
                        <td className="py-2 px-3 min-w-[90px]">
                          <div className="text-[11px] font-bold text-slate-700 dark:text-slate-200 mb-1">{breakdown.dataCoveragePercent}% <span className="text-[9px] text-slate-400 font-normal">({breakdown.validCategoriesCount}/{breakdown.totalCategoriesCount})</span></div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5">
                            <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${breakdown.dataCoveragePercent}%` }} />
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={() => {
                              setDrawerStudentId(student.id);
                              setIsDrawerOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-bold text-xs transition border border-indigo-100 dark:border-indigo-800/30 whitespace-nowrap"
                          >
                            <Eye className="w-3.5 h-3.5" /> View Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
              <div className="text-xs text-slate-500 font-medium">
                Showing {pageSize === -1 ? 1 : (currentPage - 1) * pageSize + 1}–{pageSize === -1 ? sortedStudents.length : Math.min(currentPage * pageSize, sortedStudents.length)} of {sortedStudents.length} students
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 text-slate-600 transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-50 text-slate-600 transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      <StudentDetailDrawer
        studentId={drawerStudentId}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSupport={(sId) => {
          setIsDrawerOpen(false);
          setInterventionStudentId(sId);
          setIsInterventionOpen(true);
        }}
        onOpen360={(sId) => {
          setIsDrawerOpen(false);
          setDrillDownStudentId(sId);
          setIsDrillDownOpen(true);
        }}
      />

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

      <InterventionModal
        isOpen={isInterventionOpen}
        onClose={() => setIsInterventionOpen(false)}
        preselectedStudentId={interventionStudentId}
      />
    </>
  );
}
