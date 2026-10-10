import React from "react";
import { Layers, Clock, HelpCircle, Unlink } from "lucide-react";

const problems = [
  {
    icon: Layers,
    title: "Signals Are Scattered",
    subtitle: "Fragmented Data",
    description: "Academic, attendance, LMS engagement, and support ticket data live in isolated silos across campus.",
    color: "text-sky-600",
    bg: "bg-sky-50 dark:bg-sky-950/50",
    border: "border-sky-100 dark:border-sky-900/50"
  },
  {
    icon: Clock,
    title: "Problems Are Found Late",
    subtitle: "Delayed Detection",
    description: "By the time term grades drop significantly, crucial intervention windows have already closed.",
    color: "text-amber-600",
    bg: "bg-amber-50 dark:bg-amber-950/50",
    border: "border-amber-100 dark:border-amber-900/50"
  },
  {
    icon: HelpCircle,
    title: "The 'Why' Is Unclear",
    subtitle: "Black-Box Metrics",
    description: "A single risk percentage score alone fails to explain which factors are actually driving student struggle.",
    color: "text-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-950/50",
    border: "border-indigo-100 dark:border-indigo-900/50"
  },
  {
    icon: Unlink,
    title: "Interventions Are Disconnected",
    subtitle: "Unmeasured Support",
    description: "Campus support is often reactive and rarely tracked to verify if interventions improved student outcomes.",
    color: "text-rose-600",
    bg: "bg-rose-50 dark:bg-rose-950/50",
    border: "border-rose-100 dark:border-rose-900/50"
  }
];

export default function ProblemSection() {
  return (
    <section id="problem-section" className="py-20 bg-white dark:bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        
        {/* Eyebrow & Title */}
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3.5 py-1.5 rounded-full border border-sky-200 dark:border-sky-800">
            The Institutional Challenge
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Students leave signals everywhere.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            Attendance, assessments, assignments, engagement, learning activity and support interactions contain valuable signals. The problem is that these signals are often scattered across systems — making it difficult to understand the complete student journey.
          </p>
        </div>

        {/* 4 Problem Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {problems.map((prob, idx) => {
            const Icon = prob.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl border ${prob.border} bg-white dark:bg-slate-800/80 shadow-md shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${prob.bg} ${prob.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                    {prob.subtitle}
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 leading-snug">
                    {prob.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {prob.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
