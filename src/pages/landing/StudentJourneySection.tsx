import React from "react";
import { CheckCircle2, TrendingUp, AlertTriangle, ShieldCheck } from "lucide-react";

const journeySteps = [
  { step: "01", label: "Joined University", status: "Baseline", desc: "Orientation & enrollment profile setup", icon: CheckCircle2, color: "text-sky-500", bg: "bg-sky-50" },
  { step: "02", label: "Strong Start", status: "Active", desc: "High engagement in early weeks", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50" },
  { step: "03", label: "Attendance Declines", status: "Signal", desc: "Missed 3 consecutive DBMS lectures", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-50" },
  { step: "04", label: "Quiz Scores Drop", status: "Signal", desc: "Scored 48% on Normalization quiz", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50" },
  { step: "05", label: "Risk Detected", status: "Alert", desc: "AI flags emerging academic risk", icon: ShieldCheck, color: "text-indigo-500", bg: "bg-indigo-50" },
  { step: "06", label: "Mentor Session", status: "Action", desc: "Prof. Rahul holds 1:1 consultation", icon: CheckCircle2, color: "text-sky-500", bg: "bg-sky-50" },
  { step: "07", label: "Recovery Plan", status: "Intervention", desc: "Customized 14-day study plan generated", icon: CheckCircle2, color: "text-indigo-500", bg: "bg-indigo-50" },
  { step: "08", label: "Outcome Tracked", status: "Improved", desc: "Quiz score recovers to 82%", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" }
];

export default function StudentJourneySection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        
        {/* Eyebrow & Title */}
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800">
            Trajectory Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Every student has a journey. CampusOS makes it visible.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            CampusOS tracks change over time rather than relying on a single static snapshot — giving educators full visibility into the student lifecycle.
          </p>
        </div>

        {/* TIMELINE PROGRESSION CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {journeySteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-sky-400 hover:shadow-lg transition-all group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-extrabold text-slate-400">
                    STAGE {step.step}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${step.bg} ${step.color}`}>
                    {step.status}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${step.color} shrink-0`} />
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                    {step.label}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
