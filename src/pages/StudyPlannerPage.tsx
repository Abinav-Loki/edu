import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Sparkles,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Bot,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  Target,
  Flame,
  Sliders,
  Play,
  HelpCircle,
  Check,
  RefreshCw
} from "lucide-react";
import MobileHeader from "../components/MobileHeader";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import { useLearning } from "../context/LearningContext";
import { subjectWorlds } from "../data/learningArenaData";

export interface StudyTask {
  id: string;
  day: string; // e.g. "Monday"
  subjectId: string;
  subjectName: string;
  topicTitle: string;
  durationMinutes: number;
  activityType: "Learn" | "Practice" | "Quiz" | "Revision" | "AI Tutor" | "Assignment";
  completed: boolean;
  priority: "High" | "Medium" | "Low";
}

const initialTasks: StudyTask[] = [
  {
    id: "st-1",
    day: "Monday",
    subjectId: "dbms",
    subjectName: "Database Systems",
    topicTitle: "SQL Joins & Multi-Table Queries",
    durationMinutes: 45,
    activityType: "Practice",
    completed: true,
    priority: "High",
  },
  {
    id: "st-2",
    day: "Monday",
    subjectId: "dsa",
    subjectName: "Data Structures",
    topicTitle: "Array Sliding Window Technique",
    durationMinutes: 60,
    activityType: "Learn",
    completed: true,
    priority: "Medium",
  },
  {
    id: "st-3",
    day: "Tuesday",
    subjectId: "os",
    subjectName: "Operating Systems",
    topicTitle: "CPU Process Scheduling Gantt Charts",
    durationMinutes: 45,
    activityType: "AI Tutor",
    completed: false,
    priority: "High",
  },
  {
    id: "st-4",
    day: "Tuesday",
    subjectId: "cn",
    subjectName: "Computer Networks",
    topicTitle: "IP Subnetting & CIDR Calculation",
    durationMinutes: 30,
    activityType: "Quiz",
    completed: false,
    priority: "Medium",
  },
  {
    id: "st-5",
    day: "Wednesday",
    subjectId: "dbms",
    subjectName: "Database Systems",
    topicTitle: "Functional Dependencies & 3NF Normalization",
    durationMinutes: 60,
    activityType: "Practice",
    completed: false,
    priority: "High",
  },
  {
    id: "st-6",
    day: "Thursday",
    subjectId: "dsa",
    subjectName: "Data Structures",
    topicTitle: "Binary Search Tree Traversal",
    durationMinutes: 45,
    activityType: "Revision",
    completed: false,
    priority: "Low",
  },
  {
    id: "st-7",
    day: "Friday",
    subjectId: "os",
    subjectName: "Operating Systems",
    topicTitle: "Deadlocks & Banker's Algorithm",
    durationMinutes: 50,
    activityType: "Assignment",
    completed: false,
    priority: "High",
  },
];

const activityTypeConfig: Record<string, { icon: React.ReactNode; badgeClass: string }> = {
  Learn: { icon: <BookOpen className="w-3.5 h-3.5" />, badgeClass: "bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800" },
  Practice: { icon: <Play className="w-3.5 h-3.5" />, badgeClass: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800" },
  Quiz: { icon: <HelpCircle className="w-3.5 h-3.5" />, badgeClass: "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800" },
  Revision: { icon: <RotateCcw className="w-3.5 h-3.5" />, badgeClass: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" },
  "AI Tutor": { icon: <Bot className="w-3.5 h-3.5" />, badgeClass: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  Assignment: { icon: <Target className="w-3.5 h-3.5" />, badgeClass: "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800" },
};

export default function StudyPlannerPage() {
  const { profile } = useLearning();

  const [tasks, setTasks] = useState<StudyTask[]>(initialTasks);
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("All");

  // Wizard state
  const [goal, setGoal] = useState("Prepare for upcoming Midterms");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(["dbms", "dsa", "os"]);
  const [dailyHours, setDailyHours] = useState<number>(2);
  const [targetExam, setTargetExam] = useState("Midterm Exam (in 2 weeks)");
  const [confidence, setConfidence] = useState("Intermediate");
  const [isGenerating, setIsGenerating] = useState(false);

  // Recovery recommendation trigger
  const needsRecovery = true; // Based on Student Intelligence detecting weak DBMS mastery

  const toggleTaskCompleted = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      // Generate custom AI schedule based on inputs
      const newPlan: StudyTask[] = [
        {
          id: `gen-1`,
          day: "Monday",
          subjectId: "dbms",
          subjectName: "Database Systems",
          topicTitle: "Relational Algebra & Outer Joins",
          durationMinutes: Math.round((dailyHours * 60) * 0.5),
          activityType: "Practice",
          completed: false,
          priority: "High",
        },
        {
          id: `gen-2`,
          day: "Monday",
          subjectId: "dsa",
          subjectName: "Data Structures",
          topicTitle: "Two Pointers & String Matching",
          durationMinutes: Math.round((dailyHours * 60) * 0.5),
          activityType: "Learn",
          completed: false,
          priority: "Medium",
        },
        {
          id: `gen-3`,
          day: "Tuesday",
          subjectId: "os",
          subjectName: "Operating Systems",
          topicTitle: "Multi-threading & Semaphore Mutex",
          durationMinutes: Math.round((dailyHours * 60) * 0.6),
          activityType: "AI Tutor",
          completed: false,
          priority: "High",
        },
        {
          id: `gen-4`,
          day: "Wednesday",
          subjectId: "dbms",
          subjectName: "Database Systems",
          topicTitle: "SQL Aggregations & GROUP BY HAVING",
          durationMinutes: Math.round((dailyHours * 60) * 0.5),
          activityType: "Quiz",
          completed: false,
          priority: "High",
        },
        {
          id: `gen-5`,
          day: "Thursday",
          subjectId: "dsa",
          subjectName: "Data Structures",
          topicTitle: "Floyd's Cycle Detection Algorithm",
          durationMinutes: Math.round((dailyHours * 60) * 0.5),
          activityType: "Practice",
          completed: false,
          priority: "Medium",
        },
        {
          id: `gen-6`,
          day: "Friday",
          subjectId: "cn",
          subjectName: "Computer Networks",
          topicTitle: "TCP 3-Way Handshake & Congestion Control",
          durationMinutes: Math.round((dailyHours * 60) * 0.5),
          activityType: "Revision",
          completed: false,
          priority: "Medium",
        },
      ];

      setTasks(newPlan);
      setIsGenerating(false);
      setShowWizardModal(false);
    }, 1000);
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalHoursPlanned = Math.round(
    tasks.reduce((sum, t) => sum + t.durationMinutes, 0) / 60
  );

  const daysList = ["All", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const filteredTasks =
    selectedDay === "All" ? tasks : tasks.filter((t) => t.day === selectedDay);

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-5xl mx-auto space-y-6">
        
        {/* PAGE HEADER */}
        <PageHeader
          title="AI Study Planner"
          subtitle="Proactively plan your study goals, generate personalized weekly schedules, and track learning progress."
          badge="Proactive Learning Layer"
        />

        {/* ─── CONTEXTUAL RECOVERY PLAN RECOMMENDATION BANNER ─── */}
        {needsRecovery && (
          <div className="p-4 sm:p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-slate-800 dark:text-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md shadow-md animate-[fadeIn_0.3s_ease-out]">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-sm">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <div className="font-black text-sm text-amber-900 dark:text-amber-300 flex items-center gap-2">
                  <span>⚠️ Recovery Plan Recommended</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    Student Intelligence
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300 mt-1 leading-relaxed max-w-2xl">
                  Your recent activity suggests you may have fallen behind in Database Management Systems (DBMS). Would you like to start a structured catch-up path?
                </p>
              </div>
            </div>

            <Link
              to="/recovery-plan"
              className="shrink-0 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-xs rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 whitespace-nowrap hover:scale-105 active:scale-95"
            >
              <span>View Recovery Plan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* ─── OVERVIEW METRICS CARD ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassCard className="flex items-center gap-4 p-5">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly Tasks</div>
              <div className="text-xl font-black text-slate-800 dark:text-white mt-0.5">
                {completedCount} / {totalCount} Completed
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-sky-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="flex items-center gap-4 p-5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Planned Study Time</div>
              <div className="text-xl font-black text-slate-800 dark:text-white mt-0.5">
                {totalHoursPlanned} Hours / Week
              </div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                ~{dailyHours} Hours / Day
              </div>
            </div>
          </GlassCard>

          <GlassCard className="flex items-center gap-4 p-5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Optimizer</div>
              <div className="text-xl font-black text-slate-800 dark:text-white mt-0.5">
                Active & Adaptive
              </div>
              <button
                onClick={() => setShowWizardModal(true)}
                className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline mt-1 flex items-center gap-1"
              >
                <span>Customize Plan</span>
                <Sliders className="w-3 h-3" />
              </button>
            </div>
          </GlassCard>
        </div>

        {/* ─── ACTION BAR (CREATE PLAN / FILTER) ─── */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Day Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {daysList.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  selectedDay === day
                    ? "bg-sky-600 text-white shadow-md shadow-sky-600/30"
                    : "bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* AI Plan Wizard Button */}
          <button
            onClick={() => setShowWizardModal(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-500/25 hover:brightness-110 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
            <span>Generate AI Study Plan</span>
          </button>
        </div>

        {/* ─── TASKS SCHEDULE LIST ─── */}
        <GlassCard>
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-200/60 dark:border-slate-800">
            <div>
              <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-sky-500" />
                <span>{selectedDay === "All" ? "Weekly Study Schedule" : `${selectedDay}'s Plan`}</span>
              </h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                Check off completed tasks to earn XP and level up your mastery.
              </p>
            </div>

            <span className="text-xs font-bold font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-xl">
              {filteredTasks.filter((t) => t.completed).length}/{filteredTasks.length} Completed
            </span>
          </div>

          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs font-semibold">
                No study tasks scheduled for {selectedDay}.
              </div>
            ) : (
              filteredTasks.map((task) => {
                const typeInfo = activityTypeConfig[task.activityType] || activityTypeConfig.Learn;

                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      task.completed
                        ? "bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 opacity-80"
                        : "bg-white dark:bg-slate-900/90 border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-sky-300 dark:hover:border-sky-700"
                    }`}
                  >
                    {/* Left: Checkbox & Task details */}
                    <div className="flex items-start gap-3.5 min-w-0">
                      <button
                        onClick={() => toggleTaskCompleted(task.id)}
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors cursor-pointer ${
                          task.completed
                            ? "bg-emerald-500 text-white shadow-sm"
                            : "border-2 border-slate-300 dark:border-slate-600 hover:border-sky-500"
                        }`}
                      >
                        {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                      </button>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-2 py-0.5 rounded-md border border-sky-100 dark:border-sky-900">
                            {task.day}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                            {task.subjectName}
                          </span>
                        </div>

                        <h4 className={`text-sm font-extrabold leading-snug ${task.completed ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-800 dark:text-white"}`}>
                          {task.topicTitle}
                        </h4>
                      </div>
                    </div>

                    {/* Right: Badges & Controls */}
                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                      <div className={`px-2.5 py-1 rounded-lg border text-xs font-extrabold flex items-center gap-1.5 ${typeInfo.badgeClass}`}>
                        {typeInfo.icon}
                        <span>{task.activityType}</span>
                      </div>

                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{task.durationMinutes}m</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </GlassCard>

        {/* ─── AI PLAN CREATION WIZARD MODAL ─── */}
        {showWizardModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                    <Sparkles className="w-5 h-5 fill-amber-300 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white">AI Study Plan Generator</h3>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Personalize your study schedule</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowWizardModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleGeneratePlan} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Goal
                  </label>
                  <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    placeholder="e.g. Master DBMS & DSA for Midterms"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Exam / Deadline
                  </label>
                  <input
                    type="text"
                    value={targetExam}
                    onChange={(e) => setTargetExam(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Daily Available Hours
                    </label>
                    <select
                      value={dailyHours}
                      onChange={(e) => setDailyHours(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white"
                    >
                      <option value={1}>1 Hour / Day</option>
                      <option value={2}>2 Hours / Day</option>
                      <option value={3}>3 Hours / Day</option>
                      <option value={4}>4+ Hours / Day</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Current Confidence
                    </label>
                    <select
                      value={confidence}
                      onChange={(e) => setConfidence(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white"
                    >
                      <option value="Beginner">Beginner (Needs Foundations)</option>
                      <option value="Intermediate">Intermediate (Practice Focused)</option>
                      <option value="Advanced">Advanced (Exam Sprint)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Target Subjects
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {subjectWorlds.map((s) => {
                      const isSelected = selectedSubjects.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setSelectedSubjects((prev) =>
                              isSelected ? prev.filter((id) => id !== s.id) : [...prev, s.id]
                            );
                          }}
                          className={`p-2.5 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                            isSelected
                              ? "bg-sky-50 dark:bg-sky-950/60 border-sky-400 text-sky-900 dark:text-white"
                              : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500"
                          }`}
                        >
                          <span>{s.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-sky-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowWizardModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 shadow-lg hover:brightness-110 flex items-center gap-2 cursor-pointer"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 fill-amber-300 text-amber-300" />
                        <span>Generate Schedule</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
