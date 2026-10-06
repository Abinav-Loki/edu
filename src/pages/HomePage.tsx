import { Link } from "react-router-dom";
import {
  UserCheck,
  ClipboardCheck,
  FileText,
  AlertTriangle,
  AlarmClock,
  ArrowRight,
  Sparkles,
  PlayCircle,
  FileQuestion,
  BookOpen as BookOpenIcon,
  UploadCloud,
  Bot
} from "lucide-react";
import { student, quote } from "../data/mock";
import StatCard from "../components/StatCard";
import PerformanceChart from "../components/PerformanceChart";
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

      <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8 mobile-content max-w-[1400px] mx-auto">
        {/* ─── HERO SECTION ─── */}
        <section
          className="mb-8 rounded-[2rem] overflow-hidden glass-card flex flex-col xl:flex-row relative shadow-lg shadow-sky-500/5 border border-white/80"
          style={{
            background: "linear-gradient(135deg, rgba(240, 249, 255, 0.7) 0%, rgba(224, 242, 254, 0.5) 100%)",
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

        {/* ─── STAT CARDS ─── */}
        <section
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8"
          aria-label="Academic statistics"
        >
          <StatCard
            label="Attendance"
            value={`${student.attendancePercent}%`}
            trend={student.attendanceTrend}
            trendLabel="this month"
            progress={student.attendancePercent}
            progressColor="#8B5CF6"
            icon={<UserCheck className="w-6 h-6" aria-hidden="true" />}
            tintClass="bg-gradient-to-br from-pink-50/60 to-purple-50/60 border-white/60"
          />
          <StatCard
            label="Quiz Average"
            value={`${student.quizAverage}%`}
            trend={student.quizTrend}
            trendLabel="this month"
            progress={student.quizAverage}
            progressColor="#F43F5E"
            icon={<ClipboardCheck className="w-6 h-6" aria-hidden="true" />}
            tintClass="bg-gradient-to-br from-orange-50/60 to-pink-50/60 border-white/60"
          />
          <StatCard
            label="Assignment Avg"
            value={`${student.assignmentAverage}%`}
            trend={student.assignmentTrend}
            trendLabel="this month"
            progress={student.assignmentAverage}
            progressColor="#0EA5E9"
            icon={<FileText className="w-6 h-6" aria-hidden="true" />}
            tintClass="bg-gradient-to-br from-emerald-50/60 to-sky-50/60 border-white/60"
          />
          <StatCard
            label="Late Submissions"
            value={`${student.lateSubmissions} / ${student.totalAssignments}`}
            icon={<AlarmClock className="w-6 h-6" aria-hidden="true" />}
            tintClass="bg-gradient-to-br from-amber-50/60 to-orange-50/60 border-white/60"
            progressColor="#F59E0B"
            progress={(student.lateSubmissions / student.totalAssignments) * 100}
          />
        </section>

        {/* ─── QUICK ACTIONS ─── */}
        <section className="mb-8 hidden md:block">
          <div className="grid grid-cols-4 gap-4">
            <Link to="/tutor" className="glass-card card-hover p-4 flex items-center gap-3 bg-white/70">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Bot className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-slate-700">Ask AI Tutor</span>
            </Link>
            <Link to="/quiz" className="glass-card card-hover p-4 flex items-center gap-3 bg-white/70">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                <FileQuestion className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-slate-700">Start Quiz</span>
            </Link>
            <Link to="/recovery-plan" className="glass-card card-hover p-4 flex items-center gap-3 bg-white/70">
              <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-violet-600">
                <PlayCircle className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-slate-700">View Recovery Plan</span>
            </Link>
            <button className="glass-card card-hover p-4 flex items-center gap-3 bg-white/70 text-left">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm text-slate-700">Upload Notes</span>
            </button>
          </div>
        </section>

        {/* ─── MAIN GRID ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <PerformanceChart />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WeakTopics />
              <AIRobotCard />
            </div>

            <RecoveryPlanCard />
          </div>

          {/* Right column */}
          <div className="space-y-6 lg:space-y-8">
            
            {/* AI Insight Card */}
            <div className="glass-card p-6 border-sky-100 bg-gradient-to-b from-white/80 to-sky-50/50 shadow-md shadow-sky-500/5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                </div>
                <h3 className="font-bold text-slate-800">AI Insight</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-medium mb-4">
                "Your SQL performance improved after practicing joins. Keep the momentum going!"
              </p>
              <Link to="/tutor" className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1">
                Practice Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <RecentActivity />
          </div>
        </div>
      </div>
    </>
  );
}
