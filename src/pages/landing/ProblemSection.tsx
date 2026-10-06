import { useEffect, useRef, useState } from "react";
import { UserX, FileWarning, SearchX, Ticket, Wrench, ShieldAlert } from "lucide-react";

const problems = [
  { icon: UserX, text: "Attendance Gaps", color: "text-rose-500", bg: "bg-rose-100", delay: 0 },
  { icon: FileWarning, text: "Missed Assignments", color: "text-amber-500", bg: "bg-amber-100", delay: 100 },
  { icon: SearchX, text: "Finding Mentors", color: "text-indigo-500", bg: "bg-indigo-100", delay: 200 },
  { icon: Ticket, text: "Support Tickets", color: "text-teal-500", bg: "bg-teal-100", delay: 300 },
  { icon: Wrench, text: "Facilities", color: "text-sky-500", bg: "bg-sky-100", delay: 400 },
  { icon: ShieldAlert, text: "Maintenance", color: "text-purple-500", bg: "bg-purple-100", delay: 500 },
];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="problem-section" ref={sectionRef} className="py-24 px-6 relative bg-transparent border-y border-slate-200/50">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className={`text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Campus life is connected.<br />
          <span className="text-slate-400">Campus systems aren't.</span>
        </h2>
        
        <p className={`mt-6 text-lg text-slate-500 max-w-2xl mx-auto font-medium transition-all duration-700 delay-100 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          Students struggle to find support. Faculty lack visibility into academic risk. 
          Campus teams manage reactive maintenance across disconnected tools. 
          The result is a fragmented experience.
        </p>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-6">
          {problems.map((prob, idx) => (
            <div 
              key={idx}
              className={`p-6 rounded-2xl border border-slate-100 shadow-sm bg-slate-50 flex flex-col items-center justify-center gap-3 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'}`}
              style={{ transitionDelay: `${prob.delay + 300}ms` }}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${prob.bg} ${prob.color}`}>
                <prob.icon className="w-6 h-6" />
              </div>
              <span className="font-bold text-slate-700 text-sm">{prob.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
