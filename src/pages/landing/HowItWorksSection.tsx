import React from "react";
import { Database, BrainCircuit, ShieldAlert, Zap, BarChart3, ChevronRight } from "lucide-react";

const stages = [
  {
    step: "01",
    title: "COLLECT",
    icon: Database,
    headline: "Unified Signal Ingestion",
    description: "Bring together academic marks, attendance records, LMS engagement, adaptive quiz results, and support interactions into a single intelligence profile.",
    badge: "Multi-Source"
  },
  {
    step: "02",
    title: "UNDERSTAND",
    icon: BrainCircuit,
    headline: "Journey Trend Analysis",
    description: "Identify subtle velocity changes, learning patterns, and trajectory shifts over time rather than looking at isolated static snapshots.",
    badge: "Pattern Engine"
  },
  {
    step: "03",
    title: "DETECT",
    icon: ShieldAlert,
    headline: "Explainable Risk Identification",
    description: "Detect emerging academic or engagement risk early and clearly highlight the primary contributing factors driving the change.",
    badge: "Explainable AI"
  },
  {
    step: "04",
    title: "ACT",
    icon: Zap,
    headline: "Targeted Interventions",
    description: "Automatically recommend context-matched actions: Faculty Mentor Follow-up, AI Study Planner, Recovery Plan, or Learning Arena practice.",
    badge: "Smart Recommendations"
  },
  {
    step: "05",
    title: "MEASURE",
    icon: BarChart3,
    headline: "Closed-Loop Impact Tracking",
    description: "Measure whether the intervention improved student performance, recalculate risk scores, and refine future institutional recommendations.",
    badge: "Outcome Engine"
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        
        {/* Eyebrow & Title */}
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3.5 py-1.5 rounded-full border border-sky-200 dark:border-sky-800">
            End-to-End Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Intelligence that closes the loop.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            CampusOS connects raw signals to institutional action and measures intervention efficacy to drive continuous student success.
          </p>
        </div>

        {/* 5 STAGES TIMELINE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 text-left">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-slate-50/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-lg hover:-translate-y-1 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black font-mono px-2.5 py-1 rounded-xl bg-sky-600 text-white shadow-2xs">
                      {stage.step}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {stage.badge}
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3 shadow-2xs group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-xs font-black text-sky-600 dark:text-sky-400 tracking-wider uppercase mb-1">
                    {stage.title}
                  </h3>

                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white mb-2 leading-tight">
                    {stage.headline}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-bold text-slate-400 group-hover:text-sky-600 transition-colors">
                  <span>Step {stage.step} of 05</span>
                  {idx < stages.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
