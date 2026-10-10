import React from "react";
import { Brain, Bot, Calendar, Gamepad2, BookOpen, ShieldAlert, TrendingUp, RefreshCw, Sparkles } from "lucide-react";

const modules = [
  { name: "Student 360", icon: TrendingUp, pos: "top-0 left-1/2 -translate-x-1/2" },
  { name: "AI Tutor", icon: Bot, pos: "top-12 right-6 sm:right-12" },
  { name: "Study Planner", icon: Calendar, pos: "top-1/2 -translate-y-1/2 right-0" },
  { name: "Learning Arena", icon: Gamepad2, pos: "bottom-12 right-6 sm:right-12" },
  { name: "Recovery Plan", icon: RefreshCw, pos: "bottom-0 left-1/2 -translate-x-1/2" },
  { name: "Faculty Control", icon: ShieldAlert, pos: "bottom-12 left-6 sm:left-12" },
  { name: "Digital Library", icon: BookOpen, pos: "top-1/2 -translate-y-1/2 left-0" },
  { name: "Adaptive Quiz", icon: Sparkles, pos: "top-12 left-6 sm:left-12" }
];

export default function EcosystemSection() {
  return (
    <section className="py-20 bg-white dark:bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        
        {/* Eyebrow & Title */}
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800">
            Connected Product Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            The Connected Success Ecosystem
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            All CampusOS features work together through a single intelligence layer — converting everyday student activity into continuous insights.
          </p>
        </div>

        {/* ECOSYSTEM INTERACTIVE HUB GRAPHIC */}
        <div className="relative w-full max-w-3xl mx-auto h-[440px] flex items-center justify-center py-6">
          
          {/* Outer Orbital Rings */}
          <div className="absolute w-[360px] h-[360px] rounded-full border border-sky-200/80 dark:border-sky-800/40 pointer-events-none" />
          <div className="absolute w-[280px] h-[280px] rounded-full border border-dashed border-indigo-200/60 dark:border-indigo-800/40 animate-[spin_50s_linear_infinite] pointer-events-none" />

          {/* CENTER HUB */}
          <div className="relative z-20 w-44 h-44 rounded-full bg-gradient-to-br from-indigo-600 via-sky-600 to-cyan-500 p-1 shadow-2xl shadow-sky-500/30 flex items-center justify-center text-white animate-[pulse_4s_infinite_ease-in-out]">
            <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
              <Brain className="w-8 h-8 text-sky-400 mb-1" />
              <span className="text-[10px] font-black text-sky-300 uppercase tracking-widest">CampusOS</span>
              <span className="text-xs font-black leading-tight">STUDENT SUCCESS INTELLIGENCE</span>
            </div>
          </div>

          {/* SATELLITE MODULE NODES */}
          {modules.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <div
                key={idx}
                className={`absolute z-20 ${mod.pos} transform hover:scale-110 transition-transform cursor-pointer`}
              >
                <div className="px-3 py-2 rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-none flex items-center gap-2 text-xs font-extrabold text-slate-800 dark:text-white">
                  <div className="w-6 h-6 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{mod.name}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
