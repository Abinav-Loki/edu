import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Menu, X, ChevronRight } from "lucide-react";
import HeroSection from "./HeroSection";
import ProblemSection from "./ProblemSection";
import ShiftSection from "./ShiftSection";
import HowItWorksSection from "./HowItWorksSection";
import ExplainableRiskSection from "./ExplainableRiskSection";
import StudentJourneySection from "./StudentJourneySection";
import PersonaSection from "./PersonaSection";
import EcosystemSection from "./EcosystemSection";
import ClosedLoopSection from "./ClosedLoopSection";
import ImpactSection from "./ImpactSection";
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
        className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400 transition-all duration-150 ease-out" 
        style={{ width: `${progress}%` }} 
      />
    </div>
  );
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function scrollToSection(id: string) {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="relative min-h-screen text-slate-800 dark:text-slate-100 font-sans selection:bg-sky-100 selection:text-sky-900 bg-white dark:bg-slate-900 overflow-x-hidden">
      
      <ScrollProgress />
      
      {/* Sticky Top Navigation */}
      <nav className="fixed top-0 w-full z-40 px-6 sm:px-8 py-3.5 flex items-center justify-between bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-2xs transition-all">
        {/* LEFT: Logo & Branding */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black text-base text-slate-900 dark:text-white tracking-tight block leading-none">
              CampusOS
            </span>
            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest block mt-0.5">
              Success Intelligence
            </span>
          </div>
        </Link>

        {/* CENTER: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center gap-6 text-xs font-extrabold text-slate-600 dark:text-slate-300">
          <button onClick={() => scrollToSection("problem-section")} className="hover:text-sky-600 dark:hover:text-sky-400 transition cursor-pointer">
            Problem
          </button>
          <button onClick={() => scrollToSection("how-it-works")} className="hover:text-sky-600 dark:hover:text-sky-400 transition cursor-pointer">
            How It Works
          </button>
          <button onClick={() => scrollToSection("intelligence")} className="hover:text-sky-600 dark:hover:text-sky-400 transition cursor-pointer">
            Intelligence
          </button>
          <button onClick={() => scrollToSection("solutions")} className="hover:text-sky-600 dark:hover:text-sky-400 transition cursor-pointer">
            Solutions
          </button>
          <button onClick={() => scrollToSection("impact")} className="hover:text-sky-600 dark:hover:text-sky-400 transition cursor-pointer">
            Impact
          </button>
        </div>

        {/* RIGHT: Login & Explore Platform Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/student/login"
            className="text-xs font-extrabold text-slate-700 dark:text-slate-200 hover:text-indigo-600 px-3 py-2 transition cursor-pointer"
          >
            Log In
          </Link>
          <Link
            to="/dashboard"
            className="text-xs font-extrabold px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5 flex items-center gap-1 cursor-pointer"
          >
            <span>Explore Platform</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 text-sm font-bold md:hidden shadow-xl animate-fadeIn">
          <button onClick={() => scrollToSection("problem-section")} className="text-left text-slate-700 dark:text-slate-200 py-2 border-b border-slate-100 dark:border-slate-800">
            Problem
          </button>
          <button onClick={() => scrollToSection("how-it-works")} className="text-left text-slate-700 dark:text-slate-200 py-2 border-b border-slate-100 dark:border-slate-800">
            How It Works
          </button>
          <button onClick={() => scrollToSection("intelligence")} className="text-left text-slate-700 dark:text-slate-200 py-2 border-b border-slate-100 dark:border-slate-800">
            Intelligence
          </button>
          <button onClick={() => scrollToSection("solutions")} className="text-left text-slate-700 dark:text-slate-200 py-2 border-b border-slate-100 dark:border-slate-800">
            Solutions
          </button>
          <button onClick={() => scrollToSection("impact")} className="text-left text-slate-700 dark:text-slate-200 py-2 border-b border-slate-100 dark:border-slate-800">
            Impact
          </button>

          <div className="pt-2 flex flex-col gap-2">
            <Link to="/student/login" className="w-full text-center py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white font-extrabold">
              Log In
            </Link>
            <Link to="/dashboard" className="w-full text-center py-3 rounded-xl bg-indigo-600 text-white font-extrabold shadow-md">
              Explore Platform
            </Link>
          </div>
        </div>
      )}

      {/* Main Landing Sections */}
      <main>
        <HeroSection />
        <ProblemSection />
        <ShiftSection />
        <div id="solutions"><HowItWorksSection /></div>
        <ExplainableRiskSection />
        <StudentJourneySection />
        <PersonaSection />
        <EcosystemSection />
        <ClosedLoopSection />
        <div id="impact"><ImpactSection /></div>
        <FinalCTASection />
      </main>
    </div>
  );
}
