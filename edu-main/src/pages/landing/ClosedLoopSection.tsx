import React from "react";
import { RefreshCw, CheckCircle2, ArrowRight, ShieldCheck, Zap, Activity } from "lucide-react";

export default function ClosedLoopSection() {
  const loopSteps = [
    { title: "Risk Detected", desc: "AI flags emerging academic decline", icon: ShieldCheck, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-950/50" },
    { title: "Recommendation", desc: "Matched intervention generated", icon: Zap, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-950/50" },
    { title: "Intervention", desc: "1:1 Mentor session + Recovery Plan", icon: RefreshCw, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-950/50" },
    { title: "Student Acts", desc: "Completes adaptive practice modules", icon: Activity, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/50" },
    { title: "Outcome Measured", desc: "Quiz score & engagement verified", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/50" },
    { title: "Risk Recalculated", desc: "Intelligence profile updated", icon: RefreshCw, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-950/50" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-sky-50/60 via-white to-sky-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        
        {/* Eyebrow & Title */}
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            The Key Differentiator
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Intervention isn't the end. It's the next data point.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Unlike static reporting systems that stop at flagging a problem, CampusOS closes the loop by tracking what happens after an intervention and measuring whether student outcomes actually improved.
          </p>
        </div>

        {/* CLOSED LOOP VISUAL CYCLE */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 animate-spin-slow" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-white">Closed-Loop Intelligence Engine</h3>
                <p className="text-xs text-slate-400">Continuous feedback & outcome recalculation</p>
              </div>
            </div>

            <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
              Core Differentiator
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 text-left">
            {loopSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 hover:border-emerald-400 transition-colors group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-8 h-8 rounded-xl ${step.bg} ${step.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-500">0{idx + 1}</span>
                    </div>

                    <h4 className="text-xs font-extrabold text-white mb-1 group-hover:text-emerald-400 transition-colors">
                      {step.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 font-medium leading-tight">
                      {step.desc}
                    </p>
                  </div>

                  {idx < loopSteps.length - 1 && (
                    <div className="mt-3 pt-2 border-t border-slate-700/60 hidden lg:flex items-center justify-end text-emerald-400">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Answers the critical institutional question: <strong className="text-white font-bold">“Did the intervention actually help?”</strong></span>
            </div>
            <span className="text-sky-400 font-bold">Continuous Learning Model</span>
          </div>

        </div>

      </div>
    </section>
  );
}
