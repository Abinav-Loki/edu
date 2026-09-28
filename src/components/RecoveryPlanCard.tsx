import { Link } from "react-router-dom";
import { ArrowRight, Calendar, CheckSquare, HelpCircle } from "lucide-react";
import { recoveryPlan } from "../data/mock";

export default function RecoveryPlanCard() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5 text-white"
      style={{
        background:
          "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #3B82F6 100%)",
      }}
      role="region"
      aria-label="Recovery Plan summary"
    >
      {/* Background decorative circle */}
      <div
        className="absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-15"
        style={{ background: "rgba(255,255,255,0.3)" }}
        aria-hidden="true"
      />
      <div
        className="absolute -right-2 bottom-4 w-24 h-24 rounded-full opacity-10"
        style={{ background: "rgba(255,255,255,0.4)" }}
        aria-hidden="true"
      />

      <div className="relative z-10">
        <h2 className="text-base font-bold leading-snug">
          {recoveryPlan.title}
        </h2>
        <p className="text-white/70 text-xs mt-1">{recoveryPlan.subtitle}</p>

        <div className="mt-3 inline-flex items-center gap-1.5 bg-white/15 rounded-lg px-2.5 py-1 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-300" aria-hidden="true" />
          Focus: {recoveryPlan.focus}
        </div>

        <div className="flex items-center gap-4 mt-4">
          <Stat icon={<Calendar className="w-3.5 h-3.5" />} value={`${recoveryPlan.days} Days`} />
          <Stat icon={<CheckSquare className="w-3.5 h-3.5" />} value={`${recoveryPlan.tasks} Tasks`} />
          <Stat icon={<HelpCircle className="w-3.5 h-3.5" />} value={`${recoveryPlan.quizzes} Quizzes`} />
        </div>

        <Link
          to="/recovery-plan"
          className="mt-4 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/25 rounded-xl px-4 py-2.5 text-sm font-semibold transition"
          aria-label="Start your 7-day recovery plan"
        >
          Start Recovery Plan
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function Stat({
  icon,
  value,
}: {
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-white/85">
      {icon}
      <span className="text-xs font-semibold">{value}</span>
    </div>
  );
}
