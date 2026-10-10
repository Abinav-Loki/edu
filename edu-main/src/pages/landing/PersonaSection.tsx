import React from "react";
import { GraduationCap, Users, Building2, CheckCircle2 } from "lucide-react";

const personas = [
  {
    role: "STUDENT",
    headline: "Know where you stand.",
    subhead: "Empowering self-directed learning and early self-correction.",
    icon: GraduationCap,
    gradient: "from-sky-500 to-indigo-600",
    badge: "Student Portal",
    features: [
      "Personalized learning insights & mastery radar",
      "AI Study Planner with schedule generation",
      "Socratic AI Tutor for 24/7 concept breakdown",
      "Adaptive Practice Quizzes & XP rewards",
      "Gamified Learning Arena float islands",
      "Contextual Recovery Plan support"
    ]
  },
  {
    role: "FACULTY / MENTOR",
    headline: "Know who needs attention.",
    subhead: "Prioritizing 1:1 faculty support where it matters most.",
    icon: Users,
    gradient: "from-indigo-600 to-purple-600",
    badge: "Faculty Suite",
    features: [
      "AI Priority Queue ranking students by need",
      "Comprehensive Student 360 profile views",
      "Transparent risk factor driver breakdowns",
      "Historical journey & velocity tracking",
      "One-click 1:1 mentor booking & scheduling",
      "Closed-loop intervention outcome tracking"
    ]
  },
  {
    role: "INSTITUTION",
    headline: "Know what is happening at scale.",
    subhead: "Macro analytics for deans, chairs, and administrators.",
    icon: Building2,
    gradient: "from-purple-600 to-cyan-600",
    badge: "Executive Control Room",
    features: [
      "Departmental & cohort risk distribution",
      "Common systemic risk factor identification",
      "Subject-level & course performance benchmarks",
      "Intervention effectiveness & ROI analytics",
      "Historical student success retention trends",
      "Universal Campus Support Ticket dispatch"
    ]
  }
];

export default function PersonaSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-sky-50/50 via-white to-sky-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
        
        {/* Eyebrow & Title */}
        <div className="max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3.5 py-1.5 rounded-full border border-sky-200 dark:border-sky-800">
            Tailored Experiences
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Built for every campus stakeholder.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            CampusOS provides dedicated interfaces for students, mentors, and leadership — all connected through a single intelligence layer.
          </p>
        </div>

        {/* 3 PERSONA CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {personas.map((persona, idx) => {
            const Icon = persona.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all flex flex-col justify-between"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${persona.gradient} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      {persona.badge}
                    </span>
                  </div>

                  <span className="text-xs font-black text-sky-600 dark:text-sky-400 uppercase tracking-wider block mb-1">
                    FOR THE {persona.role}
                  </span>

                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                    “{persona.headline}”
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6 leading-relaxed">
                    {persona.subhead}
                  </p>

                  <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {persona.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 text-center">
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer">
                    Explore {persona.role} Experience →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
