import React from "react";
import { ArrowRight, CheckCircle2, XCircle, Sparkles } from "lucide-react";

export default function ShiftSection() {
  const beforeSteps = [
    { title: "Raw Data", desc: "Siloed in databases" },
    { title: "Static Reports", desc: "Spreadsheets & PDFs" },
    { title: "Manual Review", desc: "Time-consuming audit" },
    { title: "Late Action", desc: "Missed intervention" }
  ];

  const afterSteps = [
    { title: "Student Signals", desc: "Multi-stream input" },
    { title: "AI Analytics", desc: "Pattern detection" },
    { title: "Risk & Driver Analysis", desc: "Explains WHY" },
    { title: "Recommended Action", desc: "Targeted support" },
    { title: "Outcome Tracking", desc: "Measures impact" },
    { title: "Continuous Learning", desc: "Closed-loop system" }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-sky-50/50 via-white to-sky-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        
        {/* Eyebrow & Title */}
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800">
            The Paradigm Shift
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            From monitoring students to understanding students.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Legacy institutional tools collect data to create static spreadsheets. CampusOS transforms continuous signals into explainable insights and closed-loop interventions.
          </p>
        </div>

        {/* COMPARISON CARDS (BEFORE VS AFTER) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-left">
          
          {/* TRADITIONAL APPROACH (BEFORE) */}
          <div className="lg:col-span-4 p-8 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-extrabold text-sm mb-4">
                <XCircle className="w-5 h-5" />
                <span className="uppercase tracking-wider">Traditional Approach</span>
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-200 mb-6">
                Reactive Monitoring
              </h3>

              <div className="space-y-4">
                {beforeSteps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 font-mono text-xs flex items-center justify-center shrink-0 font-bold">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{step.title}</h4>
                      <p className="text-[11px] text-slate-400">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-500">
              Result: Disconnected interventions with unmeasured outcomes.
            </div>
          </div>

          {/* CAMPUSOS APPROACH (AFTER) */}
          <div className="lg:col-span-8 p-8 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-sky-950 text-white shadow-2xl relative overflow-hidden border border-indigo-500/30 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-sm mb-4">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <span className="uppercase tracking-wider">CampusOS AI Intelligence</span>
              </div>
              <h3 className="text-2xl font-black mb-6 text-white">
                Proactive Closed-Loop Student Success
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {afterSteps.map((step, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:border-sky-400/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                        STAGE 0{idx + 1}
                      </span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <h4 className="text-sm font-extrabold text-white mb-1">{step.title}</h4>
                    <p className="text-xs text-slate-300 font-medium">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-sky-300">
              <span>Result: Continuous intelligence that tracks intervention effectiveness.</span>
              <div className="flex items-center gap-1 text-emerald-400">
                <span>Closed Loop</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
