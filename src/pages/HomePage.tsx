import { Link } from "react-router-dom";
import {
  UserCheck,
  ClipboardCheck,
  FileText,
  AlertTriangle,
  AlarmClock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { student, quote } from "../data/mock";
import StatCard from "../components/StatCard";
import PerformanceChart from "../components/PerformanceChart";
import WeakTopics from "../components/WeakTopics";
import RecoveryPlanCard from "../components/RecoveryPlanCard";
import RecentActivity from "../components/RecentActivity";
import AIRobotCard from "../components/AIRobotCard";
import MobileHeader from "../components/MobileHeader";

// Mountain/landscape hero illustration
function HeroIllustration() {
  return (
    <svg
      width="160"
      height="90"
      viewBox="0 0 160 90"
      fill="none"
      aria-hidden="true"
      className="shrink-0 opacity-70"
    >
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EEF2FF" />
          <stop offset="100%" stopColor="#E0F2FE" />
        </linearGradient>
        <linearGradient id="mountain1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <linearGradient id="mountain2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect width="160" height="90" fill="url(#sky)" rx="8" />
      {/* Stars */}
      <circle cx="20" cy="12" r="1" fill="#C7D2FE" opacity="0.8" />
      <circle cx="80" cy="8" r="1.5" fill="#C7D2FE" opacity="0.6" />
      <circle cx="130" cy="15" r="1" fill="#C7D2FE" opacity="0.7" />
      <circle cx="55" cy="20" r="1" fill="#C7D2FE" opacity="0.5" />
      {/* Far mountain */}
      <path
        d="M0 70 L40 30 L80 70 Z"
        fill="url(#mountain2)"
        opacity="0.5"
      />
      {/* Main mountain */}
      <path
        d="M30 90 L90 20 L150 90 Z"
        fill="url(#mountain1)"
        opacity="0.8"
      />
      {/* Snow cap */}
      <path d="M90 20 L75 45 L90 40 L105 45 Z" fill="white" opacity="0.6" />
      {/* Ground */}
      <rect x="0" y="80" width="160" height="10" rx="2" fill="#6366F1" opacity="0.2" />
      {/* Trees */}
      <path d="M8 80 L14 65 L20 80 Z" fill="#22C55E" opacity="0.7" />
      <path d="M140 80 L148 62 L156 80 Z" fill="#16A34A" opacity="0.6" />
      <path d="M148 80 L154 68 L160 80 Z" fill="#22C55E" opacity="0.5" />
    </svg>
  );
}

// Quote card plant
function QuotePlant() {
  return (
    <svg
      width="36"
      height="44"
      viewBox="0 0 36 44"
      fill="none"
      aria-hidden="true"
    >
      <path d="M18 42 L18 28" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 34 Q10 26 9 18 Q17 20 18 34z" fill="#22C55E" opacity="0.8" />
      <path d="M18 30 Q26 22 27 14 Q19 16 18 30z" fill="#16A34A" opacity="0.7" />
      <rect x="10" y="36" width="16" height="4" rx="2" fill="#A78BFA" opacity="0.6" />
      <path d="M8 40 h20 l-2 4 H10 Z" fill="#8B5CF6" opacity="0.4" />
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

      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-[1400px] mx-auto">
        {/* ─── HERO SECTION ─── */}
        <section
          className="mb-6 rounded-2xl overflow-hidden"
          aria-labelledby="hero-heading"
          style={{
            background:
              "linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(139,92,246,0.04) 100%)",
            border: "1px solid rgba(99,102,241,0.1)",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-start gap-4 p-5 md:p-6">
            {/* Left: greeting */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 rounded-full px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                  <Sparkles className="w-3 h-3" aria-hidden="true" />
                  Progress, not perfection
                </span>
              </div>
              <h1
                id="hero-heading"
                className="text-2xl sm:text-3xl font-bold text-slate-800 leading-snug"
              >
                {getGreeting()}, {student.firstName}! 👋
              </h1>
              <p className="text-sm text-slate-500 mt-1.5 max-w-md">
                Here's your learning summary. Keep going — you're closer than
                you think!
              </p>
            </div>

            {/* Right: illustration (desktop only) */}
            <div className="hidden md:block shrink-0">
              <HeroIllustration />
            </div>
          </div>

          {/* Academic alert */}
          <div
            className="mx-5 mb-5 rounded-xl p-3.5 flex items-center justify-between gap-3"
            style={{
              background: "rgba(248,113,113,0.07)",
              border: "1px solid rgba(248,113,113,0.18)",
            }}
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle
                  className="w-3.5 h-3.5 text-red-500"
                  aria-hidden="true"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-700">
                  Academic Attention Needed
                </p>
                <p className="text-xs text-red-500/80 mt-0.5">
                  Your performance has dropped in the last 2 weeks.
                </p>
              </div>
            </div>
            <Link
              to="/progress"
              className="shrink-0 flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 transition whitespace-nowrap"
              aria-label="View performance details"
            >
              View Details
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
        </section>

        {/* ─── STAT CARDS ─── */}
        <section
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
          aria-label="Academic statistics"
        >
          <StatCard
            label="Attendance"
            value={`${student.attendancePercent}%`}
            trend={student.attendanceTrend}
            trendLabel="this month"
            progress={student.attendancePercent}
            progressColor="#38bdf8"
            icon={<UserCheck className="w-5 h-5" aria-hidden="true" />}
            tintClass="bg-sky-50/30"
          />
          <StatCard
            label="Quiz Average"
            value={`${student.quizAverage}%`}
            trend={student.quizTrend}
            trendLabel="this month"
            progress={student.quizAverage}
            progressColor="#6366F1"
            icon={<ClipboardCheck className="w-5 h-5" aria-hidden="true" />}
            tintClass="bg-indigo-50/30"
          />
          <StatCard
            label="Assignment Avg"
            value={`${student.assignmentAverage}%`}
            trend={student.assignmentTrend}
            trendLabel="this month"
            progress={student.assignmentAverage}
            progressColor="#8B5CF6"
            icon={<FileText className="w-5 h-5" aria-hidden="true" />}
            tintClass="bg-violet-50/30"
          />
          <StatCard
            label="Late Submissions"
            value={`${student.lateSubmissions} / ${student.totalAssignments}`}
            icon={<AlarmClock className="w-5 h-5" aria-hidden="true" />}
            tintClass="bg-amber-50/30"
            progressColor="#F59E0B"
            progress={(student.lateSubmissions / student.totalAssignments) * 100}
          />
        </section>

        {/* ─── MAIN GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left column — chart + AI robot */}
          <div className="lg:col-span-2 space-y-5">
            <PerformanceChart />

            {/* Weak topics + AI robot side by side on medium screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <WeakTopics />
              <AIRobotCard />
            </div>

            {/* Recovery plan */}
            <RecoveryPlanCard />
          </div>

          {/* Right column — activity + quote */}
          <div className="space-y-5">
            <RecentActivity />

            {/* Quote card */}
            <div
              className="glass-card p-5 flex items-center gap-3"
              role="complementary"
              aria-label="Motivational quote"
            >
              <QuotePlant />
              <div>
                <p className="text-sm font-semibold text-slate-700 italic leading-snug">
                  "{quote.text}"
                </p>
                <p className="text-xs text-slate-400 mt-1.5">
                  — {quote.author}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
