import { useEffect, useRef, useState } from "react";
import { Search, BrainCircuit, Lightbulb, Link2, Play, BarChart3 } from "lucide-react";

const steps = [
  { id: "detect", label: "DETECT", icon: Search },
  { id: "understand", label: "UNDERSTAND", icon: BrainCircuit },
  { id: "recommend", label: "RECOMMEND", icon: Lightbulb },
  { id: "connect", label: "CONNECT", icon: Link2 },
  { id: "act", label: "ACT", icon: Play },
  { id: "measure", label: "MEASURE", icon: BarChart3 },
];

export default function IntelligenceLoopSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && activeStep === -1) {
          // Sequentially activate steps
          steps.forEach((_, idx) => {
            setTimeout(() => {
              setActiveStep(idx);
            }, 500 + idx * 800);
          });
        }
      },
      { threshold: 0.5 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [activeStep]);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-transparent relative border-y border-slate-200/50">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-16">
          The CampusOS Intelligence Loop
        </h2>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 max-w-4xl mx-auto">
          {/* Background connecting line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 bg-slate-100 -translate-y-1/2 z-0 rounded-full" />
          
          {/* Animated progress line */}
          <div 
            className="hidden md:block absolute top-1/2 left-10 h-1 bg-indigo-500 -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-out" 
            style={{ width: activeStep >= 0 ? `${(activeStep / (steps.length - 1)) * 100}%` : '0%' }}
          />

          {steps.map((step, idx) => {
            const isActive = activeStep >= idx;
            
            return (
              <div key={step.id} className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3 w-full md:w-auto">
                <div 
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${isActive ? 'bg-indigo-600 text-white border-indigo-200 scale-110 shadow-lg shadow-indigo-500/30' : 'bg-slate-50 text-slate-400 border-slate-100 scale-100'}`}
                >
                  <step.icon className="w-6 h-6" />
                </div>
                <div className={`font-bold tracking-widest text-xs transition-colors duration-500 ${isActive ? 'text-indigo-700' : 'text-slate-400'}`}>
                  {step.label}
                </div>
                
                {/* Mobile connecting line */}
                {idx < steps.length - 1 && (
                  <div className="md:hidden absolute left-7 top-14 bottom-[-16px] w-0.5 bg-slate-100 -z-10">
                    <div 
                      className="w-full bg-indigo-500 transition-all duration-700" 
                      style={{ height: activeStep > idx ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-20 text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          The difference between <span className="italic text-slate-800">just showing information</span> and <span className="font-bold text-indigo-600">turning information into action.</span>
        </p>
      </div>
    </section>
  );
}
