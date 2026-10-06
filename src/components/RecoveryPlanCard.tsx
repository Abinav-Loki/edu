import { Link } from "react-router-dom";
import { ArrowRight, Calendar, CheckSquare, HelpCircle } from "lucide-react";
import { recoveryPlan } from "../data/mock";

export default function RecoveryPlanCard() {
  return (
    <div
      className="relative overflow-hidden rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-500/10 border border-white/20"
      style={{
        background: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #38BDF8 100%)",
      }}
      role="region"
      aria-label="Recovery Plan summary"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-300 opacity-20 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" aria-hidden="true" />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold leading-tight">Your 7-Day Recovery Plan</h2>
            <p className="text-white/80 text-sm mt-1 font-medium">A personalized path back on track.</p>
            
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl px-3 py-1.5 text-sm font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-yellow-300 shadow-[0_0_8px_rgba(253,224,71,0.8)]" aria-hidden="true" />
              Focus: {recoveryPlan.focus}
            </div>
          </div>
          
          <div className="flex gap-4 bg-black/10 rounded-2xl p-3 border border-white/10 backdrop-blur-sm self-start">
            <Stat icon={<Calendar className="w-4 h-4" />} value={`${recoveryPlan.days} Days`} />
            <div className="w-px h-6 bg-white/20" />
            <Stat icon={<CheckSquare className="w-4 h-4" />} value={`${recoveryPlan.tasks} Tasks`} />
            <div className="w-px h-6 bg-white/20" />
            <Stat icon={<HelpCircle className="w-4 h-4" />} value={`${recoveryPlan.quizzes} Quizzes`} />
          </div>
        </div>

        {/* Timeline Progress */}
        <div className="mb-6 flex-1">
          <div className="flex justify-between items-center relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/20 rounded-full" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[14%] h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <div key={day} className="relative z-10 flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  day === 1 
                    ? "bg-white text-indigo-600 shadow-lg shadow-white/20 scale-110" 
                    : "bg-indigo-900/40 border border-white/20 text-white/70"
                }`}>
                  {day}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${day === 1 ? "text-white" : "text-white/60"}`}>
                  Day {day}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Link
          to="/recovery-plan"
          className="mt-auto flex items-center justify-center gap-2 w-full sm:w-auto self-start bg-white text-indigo-600 hover:bg-white/90 rounded-xl px-6 py-3 text-sm font-bold transition-transform hover:-translate-y-0.5 shadow-lg shadow-black/10"
          aria-label="Start your 7-day recovery plan"
        >
          Start Plan
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function Stat({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <div className="flex flex-col justify-center gap-1 text-white">
      <div className="flex items-center gap-1.5 opacity-80">
        {icon}
      </div>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}
