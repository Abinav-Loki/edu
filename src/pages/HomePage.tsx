import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  Sparkles,
  PlayCircle,
  FileQuestion,
  Target,
  Users
} from "lucide-react";
import { student, performanceData } from "../data/mock";
import AttendanceRhythmCard from "../components/AttendanceRhythmCard";
import AssessmentMomentumCard from "../components/AssessmentMomentumCard";
import AssignmentConsistencyCard from "../components/AssignmentConsistencyCard";
import LearningHealthCurve from "../components/LearningHealthCurve";
import WeakTopics from "../components/WeakTopics";
import RecoveryPlanCard from "../components/RecoveryPlanCard";
import RecentActivity from "../components/RecentActivity";
import AIRobotCard from "../components/AIRobotCard";
import MobileHeader from "../components/MobileHeader";

// Premium modern hero illustration
function HeroIllustration() {
  return (
    <svg
      width="200"
      height="120"
      viewBox="0 0 200 120"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0F2FE" />
          <stop offset="100%" stopColor="#F0F9FF" />
        </linearGradient>
        <linearGradient id="mount1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="mount2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
      </defs>
      
      {/* Background */}
      <rect width="200" height="120" rx="16" fill="url(#skyGrad)" opacity="0.4" />
      
      {/* Floating Stars */}
      <path d="M 25 20 l 2 -6 l 2 6 l 6 2 l -6 2 l -2 6 l -2 -6 l -6 -2 Z" fill="#8B5CF6" opacity="0.4" />
      <path d="M 170 30 l 1.5 -4.5 l 1.5 4.5 l 4.5 1.5 l -4.5 1.5 l -1.5 4.5 l -1.5 -4.5 l -4.5 -1.5 Z" fill="#38BDF8" opacity="0.5" />
      <circle cx="50" cy="15" r="2" fill="#6366F1" opacity="0.3" />
      <circle cx="140" cy="25" r="1.5" fill="#0EA5E9" opacity="0.4" />
      <circle cx="160" cy="10" r="2.5" fill="#8B5CF6" opacity="0.2" />

      {/* Far Mountain */}
      <path d="M 10 100 L 70 40 L 130 100 Z" fill="url(#mount1)" opacity="0.3" />
      {/* Main Mountain */}
      <path d="M 50 110 L 120 30 L 190 110 Z" fill="url(#mount2)" opacity="0.7" />
      {/* Snow Cap */}
      <path d="M 120 30 L 105 50 L 120 45 L 135 50 Z" fill="white" opacity="0.8" />
      
      {/* Graduation Cap */}
      <g transform="translate(140, 50) rotate(-15) scale(0.6)">
        <path d="M 0 15 L 20 5 L 40 15 L 20 25 Z" fill="#6366F1" />
        <path d="M 10 20 L 10 30 C 10 35 30 35 30 30 L 30 20 Z" fill="#4F46E5" />
        <path d="M 35 20 L 35 35" stroke="#F59E0B" strokeWidth="2" />
        <circle cx="35" cy="35" r="2" fill="#F59E0B" />
      </g>
      
      {/* Plant */}
      <path d="M 35 90 Q 25 80 20 70 Q 35 70 35 90 Z" fill="#22C55E" opacity="0.8" />
      <path d="M 35 90 Q 45 75 55 65 Q 45 85 35 90 Z" fill="#16A34A" opacity="0.9" />
      
      {/* Ground Line */}
      <rect x="15" y="105" width="170" height="2" rx="1" fill="#0EA5E9" opacity="0.2" />
    </svg>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomePage() {
  return (
    <>
      {/* Mobile sticky header */}
      <MobileHeader />

      <div className="relative px-4 sm:px-6 lg:px-8 py-6 lg:py-8 mobile-content max-w-[1400px] mx-auto">
        {/* Soft atmospheric ambient backdrop glows */}
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-purple-200/25 dark:bg-purple-900/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-96 right-1/4 w-[32rem] h-[32rem] bg-sky-200/30 dark:bg-sky-900/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-200/20 dark:bg-indigo-900/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* ─── HERO SECTION ─── */}
        <section
          className="mb-8 rounded-3xl overflow-hidden glass-card flex flex-col xl:flex-row relative shadow-lg shadow-sky-500/5 border border-white/80 dark:border-slate-800/80"
          style={{
            background: "linear-gradient(135deg, rgba(240, 249, 255, 0.75) 0%, rgba(224, 242, 254, 0.55) 100%)",
          }}
          aria-labelledby="hero-heading"
        >
          <div className="flex-1 flex flex-col md:flex-row items-center justify-between p-6 md:p-8 relative z-10 gap-6">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 bg-white/60 backdrop-blur-md border border-white/80 rounded-full px-3 py-1 text-xs font-bold text-sky-600 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                  Progress, not perfection
                </span>
              </div>
              <h1
                id="hero-heading"
                className="text-3xl md:text-4xl lg:text-[40px] font-bold text-slate-800 leading-tight tracking-tight"
              >
                {getGreeting()}, Arun! 👋
              </h1>
              <p className="text-base text-slate-600 mt-2 max-w-lg font-medium">
                Here's your learning summary. Keep going — you're closer than
                you think.
              </p>
            </div>
            <div className="hidden md:block shrink-0 drop-shadow-md">
              <HeroIllustration />
            </div>
          </div>

          {/* Academic alert (Right side on desktop, bottom on mobile) */}
          <div className="xl:w-[340px] xl:border-l border-white/40 p-6 flex flex-col justify-center bg-gradient-to-br from-red-50/50 to-pink-50/50">
            <div
              className="rounded-2xl p-4 bg-white/60 backdrop-blur-md border border-red-100 shadow-sm shadow-red-500/5"
              role="alert"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0 border border-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-500" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-700 leading-tight">
                    Academic Attention Needed
                  </p>
                  <p className="text-xs text-red-600/80 mt-1 font-medium leading-snug">
                    Your performance has dropped in the last 2 weeks.
                  </p>
                  <Link
                    to="/progress"
                    className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-800 transition-colors mt-2"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3 DISTINCT PERFORMANCE INSIGHT CARDS ─── */}
        <section
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          aria-label="Academic Analytics Performance Insights"
        >
          <AttendanceRhythmCard
            currentPercent={student.attendancePercent}
            trend={student.attendanceTrend}
            targetPercent={75}
            history={performanceData.map((d) => ({
              week: d.week,
              attendance: d.attendance,
            }))}
          />

          <AssessmentMomentumCard
            currentAverage={student.quizAverage}
            trend={student.quizTrend}
            history={performanceData.map((d) => ({
              week: d.week,
              quiz: d.quiz,
            }))}
            strongestTopic="SQL Joins"
            weakestTopic="Normalization"
          />

          <AssignmentConsistencyCard
            averageScore={student.assignmentAverage}
            trend={student.assignmentTrend}
            totalSubmissions={student.totalAssignments}
            lateSubmissions={student.lateSubmissions}
            history={performanceData.map((d) => ({
              week: d.week,
              assignment: d.assignment,
            }))}
          />
        </section>

        {/* ─── LEARNING HEALTH CURVE ─── */}
        <section className="mb-8" aria-label="Learning Health Curve">
          <LearningHealthCurve />
        </section>

        {/* ─── RECOMMENDED NEXT STEPS ─── */}
        <section className="mb-8" aria-label="Recommended Next Steps">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recommended Next Steps</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/tutor"
              className="glass-card p-5 rounded-3xl border border-white/80 dark:border-slate-800/80 hover:border-sky-300 dark:hover:border-sky-700 hover:shadow-xl hover:shadow-sky-500/10 transition-all duration-300 group flex flex-col justify-between bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-sky-100/90 dark:bg-sky-950/80 flex items-center justify-center text-sky-600 dark:text-sky-400 mb-3 group-hover:scale-105 transition-transform border border-sky-200/60 dark:border-sky-800/60 shadow-sm">
                  <PlayCircle className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  Practice SQL
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                  Improve your weakest topic with AI tutor guidance.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-sky-600 dark:text-sky-400">
                Start Practice <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/quiz"
              className="glass-card p-5 rounded-3xl border border-white/80 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 group flex flex-col justify-between bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-100/90 dark:bg-indigo-950/80 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3 group-hover:scale-105 transition-transform border border-indigo-200/60 dark:border-indigo-800/60 shadow-sm">
                  <FileQuestion className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  Adaptive Quiz
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                  Test your understanding and measure growth.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400">
                Take Quiz <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/recovery-plan"
              className="glass-card p-5 rounded-3xl border border-white/80 dark:border-slate-800/80 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group flex flex-col justify-between bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-purple-100/90 dark:bg-purple-950/80 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3 group-hover:scale-105 transition-transform border border-purple-200/60 dark:border-purple-800/60 shadow-sm">
                  <Target className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Recovery Plan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                  Follow your personalized recovery tasks.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-purple-600 dark:text-purple-400">
                View Plan <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link
              to="/find-mentor"
              className="glass-card p-5 rounded-3xl border border-white/80 dark:border-slate-800/80 hover:border-rose-300 dark:hover:border-rose-700 hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300 group flex flex-col justify-between bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl"
            >
              <div>
                <div className="w-10 h-10 rounded-2xl bg-rose-100/90 dark:bg-rose-950/80 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-3 group-hover:scale-105 transition-transform border border-rose-200/60 dark:border-rose-800/60 shadow-sm">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  Find a Mentor
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                  Get targeted 1-on-1 academic support.
                </p>
              </div>
              <div className="mt-4 flex items-center text-xs font-bold text-rose-600 dark:text-rose-400">
                Get Support <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

        {/* ─── MAIN GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WeakTopics />
              <AIRobotCard />
            </div>

            <RecoveryPlanCard />
          </div>

          {/* Right column */}
          <div className="space-y-6 lg:space-y-8">
            {/* AI Insight Card (Enhanced Decision Support Element) */}
            <div className="glass-card p-6 border border-white/80 dark:border-slate-800/80 bg-gradient-to-b from-white/85 to-sky-50/60 dark:from-slate-900/85 dark:to-sky-950/40 backdrop-blur-xl shadow-lg shadow-sky-500/5 rounded-3xl">
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-100 dark:bg-sky-950 flex items-center justify-center border border-sky-200 dark:border-sky-800">
                    <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  </div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                    AI INSIGHT
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60">
                  Your strongest signal
                </span>
              </div>

              <blockquote className="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug mb-4 border-l-2 border-sky-400 pl-3">
                "Quiz performance has declined faster than attendance."
              </blockquote>

              <div className="mb-5 pt-3 border-t border-sky-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Why this matters
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium mt-1 leading-relaxed">
                  Recent assessment performance suggests that some topics may need additional practice.
                </p>
              </div>

              <Link
                to="/tutor"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all hover:shadow-lg"
              >
                <span>Practice Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <RecentActivity />
          </div>
        </div>
      </div>
    </>
  );
}
