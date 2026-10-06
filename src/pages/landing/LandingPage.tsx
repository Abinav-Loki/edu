import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import AnimatedBackground from "./AnimatedBackground";
import HeroSection from "./HeroSection";
import ProblemSection from "./ProblemSection";
import SolutionSection from "./SolutionSection";
import IntelligenceLoopSection from "./IntelligenceLoopSection";
import StudentStorySection from "./StudentStorySection";
import UnifiedCampusSection from "./UnifiedCampusSection";
import FinalCTASection from "./FinalCTASection";

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const maxScroll = documentHeight - windowHeight;
      const currentProgress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
      setProgress(currentProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-50">
      <div 
        className="h-full bg-indigo-500 transition-all duration-150 ease-out" 
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Animated Background */}
      <AnimatedBackground />

      <ScrollProgress />
      
      {/* Fixed Top Nav */}
      <nav className="fixed top-0 w-full z-40 px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-teal-400 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-slate-800 tracking-tight">CampusOS AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/student/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
            Log In
          </Link>
          <Link to="/student/signup" className="text-sm font-bold px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition-all hover:-translate-y-0.5">
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="pt-16">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <IntelligenceLoopSection />
        <StudentStorySection />
        <UnifiedCampusSection />
        <FinalCTASection />
      </main>
    </div>
  );
}
