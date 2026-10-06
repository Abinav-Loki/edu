import { useEffect, useRef, useState } from "react";
import { TrendingDown, AlertCircle, Sparkles, UserCheck, CheckCircle2 } from "lucide-react";

const storySteps = [
  { icon: TrendingDown, text: "DBMS Quiz Score Drops to 55%", color: "text-rose-500", bg: "bg-rose-100" },
  { icon: AlertCircle, text: "AI Detects Academic Risk Pattern", color: "text-amber-500", bg: "bg-amber-100" },
  { icon: Sparkles, text: "CampusOS Generates DBMS Recovery Quest", color: "text-indigo-500", bg: "bg-indigo-100" },
  { icon: UserCheck, text: "System Matches Student with Faculty Mentor", color: "text-teal-500", bg: "bg-teal-100" },
  { icon: CheckCircle2, text: "Student Progress Restored to 85%", color: "text-emerald-500", bg: "bg-emerald-100" },
];

export default function StudentStorySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && activeStep === -1) {
          storySteps.forEach((_, idx) => {
            setTimeout(() => {
              setActiveStep(idx);
            }, 600 + idx * 1000);
          });
        }
      },
      { threshold: 0.4 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [activeStep]);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-indigo-50/60 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold mb-4">
            Student Experience
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-6">
            A real-time safety net for every student.
          </h2>
          <p className="text-lg text-slate-600 font-medium">
            CampusOS AI doesn't wait for end-of-semester reports. It detects early signals of academic distress and immediately triggers a personalized recovery pathway.
          </p>
        </div>

        <div className="flex-1 w-full max-w-md">
          <div className="relative border-l-2 border-slate-200 ml-6 pl-8 space-y-8">
            {storySteps.map((step, idx) => {
              const isActive = activeStep >= idx;
              
              return (
                <div key={idx} className="relative">
                  <div 
                    className={`absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-white transition-colors duration-500 ${isActive ? step.bg : 'bg-slate-200'}`} 
                  />
                  
                  <div 
                    className={`p-4 rounded-xl border bg-white shadow-sm flex items-center gap-4 transition-all duration-700 transform ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isActive ? step.bg : 'bg-slate-100'} ${isActive ? step.color : 'text-slate-400'}`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <p className={`text-sm font-bold transition-colors duration-500 ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                      {step.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
