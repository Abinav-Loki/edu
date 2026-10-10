import { useEffect, useRef, useState } from "react";
import { GraduationCap, Users, Building, Wrench } from "lucide-react";

const pillars = [
  {
    title: "AI Student Support",
    desc: "Detect academic difficulty, recommend interventions, and connect students with targeted learning paths.",
    icon: GraduationCap,
    color: "text-indigo-600",
    bg: "bg-indigo-100",
    border: "border-indigo-200"
  },
  {
    title: "Mentor Intelligence",
    desc: "Match students with optimal mentors, manage smart availability, and support 1:1 workflow.",
    icon: Users,
    color: "text-teal-600",
    bg: "bg-teal-100",
    border: "border-teal-200"
  },
  {
    title: "Smart Campus",
    desc: "Understand campus operations, track resources, aggregate feedback, and monitor infrastructure.",
    icon: Building,
    color: "text-sky-600",
    bg: "bg-sky-100",
    border: "border-sky-200"
  },
  {
    title: "Predictive Maintenance",
    desc: "Monitor assets continuously, identify maintenance risks early, and support proactive intervention.",
    icon: Wrench,
    color: "text-amber-600",
    bg: "bg-amber-100",
    border: "border-amber-200"
  }
];

export default function SolutionSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 relative bg-white/40 backdrop-blur-sm overflow-hidden">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        
        <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-500 mb-20 italic">
            "What if your campus could understand what students and systems need <br className="hidden md:block" />
            <span className="text-slate-800 not-italic font-black">before the problem becomes bigger?</span>"
          </h2>
        </div>

        <div className={`transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="inline-flex flex-col items-center justify-center mb-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center shadow-xl shadow-indigo-500/30 mb-6">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
              CAMPUSOS AI
            </h2>
            <p className="text-xl text-indigo-600 font-bold mt-2">
              The Intelligent Operating Layer for a Modern Campus
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <div 
              key={idx}
              className={`text-left p-6 rounded-3xl bg-white border ${pillar.border} shadow-lg shadow-slate-200/50 hover:-translate-y-2 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
              style={{ transitionDelay: `${600 + (idx * 150)}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${pillar.bg} ${pillar.color}`}>
                <pillar.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{pillar.title}</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
