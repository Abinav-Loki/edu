import React from "react";
import { AlertTriangle, TrendingDown, ArrowRight, CheckCircle2, UserCheck, RefreshCw } from "lucide-react";

export default function ExplainableRiskSection() {
  return (
    <section id="intelligence" className="py-20 bg-gradient-to-b from-sky-50/60 via-white to-sky-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Eyebrow & Title */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3.5 py-1.5 rounded-full border border-amber-200 dark:border-amber-800">
            Explainable AI Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Don’t just predict risk. Understand it.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            A single percentage risk score alone is not enough to guide faculty or student intervention. CampusOS breaks down the contributing drivers and provides clear reasoning behind every alert.
          </p>
        </div>

        {/* INTERACTIVE EXPLAINABLE RISK CARD MOCKUP */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl overflow-hidden text-left">
          
          {/* Card Header Bar */}
          <div className="p-6 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                  Student Intelligence Breakdown • Illustrative Demo
                </span>
                <h3 className="text-lg font-bold text-white">Student: Arun Kumar (B.Tech IT - 3rd Year)</h3>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Success Score</span>
                <span className="text-2xl font-black text-amber-400">62 / 100</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                Declining
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Contributing Signals Breakdown */}
            <div className="lg:col-span-6 space-y-5">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                1. Contributing Signals Breakdown
              </h4>

              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Attendance Rate</span>
                    <span className="text-amber-600 font-mono">65% (Threshold: 75%)</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[65%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Quiz Performance</span>
                    <span className="text-rose-600 font-mono">49% Average</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full w-[49%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Assignment Completion</span>
                    <span className="text-indigo-600 font-mono">72% Rate</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full w-[72%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Learning Consistency</span>
                    <span className="text-sky-600 font-mono">Inconsistent</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-sky-500 rounded-full w-[55%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Reasoning & Recommended Action */}
            <div className="lg:col-span-6 space-y-5 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">
                  2. Why is performance declining?
                </h4>
                <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>Attendance dropped by 8% over the past 2 weeks during DBMS lectures.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                    <span>Weak scores detected on DBMS Normalization & SQL Joins quizzes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                    <span>Learning activity gaps observed between weekly assignments.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <h4 className="text-xs font-black text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" />
                  <span>3. Recommended Next Step</span>
                </h4>
                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-800 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>Schedule 1:1 Mentor Follow-up with Prof. Rahul</span>
                    <ArrowRight className="w-3.5 h-3.5 text-sky-500" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-sky-200 dark:border-sky-800 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                    <span>Generate AI Study Recovery Plan</span>
                    <ArrowRight className="w-3.5 h-3.5 text-sky-500" />
                  </div>
                </div>
              </div>

            </div>

          </div>

          <div className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-500 dark:text-slate-400 text-center border-t border-slate-200 dark:border-slate-700">
            Illustrative demonstration showing how CampusOS turns raw risk metrics into transparent, actionable interventions.
          </div>
        </div>

      </div>
    </section>
  );
}
