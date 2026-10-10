import React from "react";
import { Clock, Eye, Target, BarChart2 } from "lucide-react";

const impacts = [
  {
    tag: "EARLIER",
    headline: "Proactive Lead Time",
    description: "Identify emerging academic and engagement challenges weeks before traditional midterms or end-term marks.",
    icon: Clock,
    color: "text-sky-600",
    bg: "bg-sky-50 dark:bg-sky-950/50",
    border: "border-sky-100 dark:border-sky-900/50"
  },
  {
    tag: "CLEARER",
    headline: "Transparent Driver Reasoning",
    description: "Understand the exact contributing signals driving student risk instead of guessing behind a black-box score.",
    icon: Eye,
    color: "text-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-950/50",
    border: "border-indigo-100 dark:border-indigo-900/50"
  },
  {
    tag: "TARGETED",
    headline: "Matched Support Action",
    description: "Recommend specific, personalized support pathways (Mentor 1:1, Recovery Plan, AI Tutor) tailored to student needs.",
    icon: Target,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-950/50",
    border: "border-purple-100 dark:border-purple-900/50"
  },
  {
    tag: "MEASURABLE",
    headline: "Closed-Loop Efficacy",
    description: "Track whether faculty consultations and study plans actually resulted in measurable grade & retention recovery.",
    icon: BarChart2,
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/50",
    border: "border-emerald-100 dark:border-emerald-900/50"
  }
];

export default function ImpactSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        
        {/* Eyebrow & Title */}
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3.5 py-1.5 rounded-full border border-sky-200 dark:border-sky-800">
            Institutional Value
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Designed for better student outcomes.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            CampusOS helps institutions move from uncoordinated reactive efforts to data-driven, measurable student success.
          </p>
        </div>

        {/* 4 IMPACT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {impacts.map((imp, idx) => {
            const Icon = imp.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-3xl border ${imp.border} bg-white dark:bg-slate-800/80 shadow-md shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-2xl ${imp.bg} ${imp.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black tracking-widest px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {imp.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 leading-snug">
                    {imp.headline}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    {imp.description}
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
