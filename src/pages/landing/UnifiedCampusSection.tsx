import { useEffect, useRef, useState } from "react";
import { GraduationCap, Users, Building, Wrench } from "lucide-react";

export default function UnifiedCampusSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.4 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-32 px-6 bg-transparent relative overflow-hidden border-y border-slate-200/50">
      
      {/* Background glow */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[100px] transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <h2 className={`text-5xl md:text-7xl font-black tracking-tight mb-8 transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <span className="block mb-2 text-slate-400">One campus.</span>
          <span className="block mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">One intelligence layer.</span>
          <span className="block text-slate-800">Connected outcomes.</span>
        </h2>
        
        <p className={`text-xl text-slate-500 font-medium max-w-2xl mx-auto transition-all duration-1000 delay-300 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Breaking down the silos between academic performance, faculty mentoring, and campus operations.
        </p>

        <div className={`mt-20 flex flex-wrap justify-center gap-6 transition-all duration-1000 delay-500 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {[
            { label: "Student Success", icon: GraduationCap },
            { label: "Faculty Insight", icon: Users },
            { label: "Smart Operations", icon: Building },
            { label: "Proactive Maintenance", icon: Wrench },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-slate-200 shadow-sm text-slate-700">
              <item.icon className="w-5 h-5 text-indigo-600" />
              <span className="font-bold text-sm tracking-wide">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
