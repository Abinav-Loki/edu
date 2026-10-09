import React from "react";
import { Link } from "react-router-dom";
import { ArrowDown, Sparkles, ChevronRight } from "lucide-react";
import MascotIllustration from "./MascotIllustration";

export default function HeroSection() {
  function scrollToHowItWorks() {
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-16 overflow-hidden bg-gradient-to-b from-sky-50/80 via-white to-sky-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      {/* Background Soft Lighting Gradients */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-sky-200/40 dark:bg-sky-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-cyan-200/40 dark:bg-cyan-900/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT SIDE: Positioning & Headline */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 dark:bg-sky-900/50 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 text-xs font-extrabold uppercase tracking-wider shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>AI-Powered Student Success Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Turn{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-cyan-500">
                Student Data
              </span>{" "}
              Into{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-sky-600 to-emerald-500">
                Student Success.
              </span>
            </h1>

            {/* Core Product Positioning Paragraph */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
              CampusOS turns scattered student activity, academic performance, engagement and support data into actionable intelligence — helping institutions identify challenges early, understand why they happen, and deliver the right intervention at the right time.
            </p>

            {/* Primary & Secondary Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/dashboard"
                className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore CampusOS</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={scrollToHowItWorks}
                className="px-6 py-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-base transition-all hover:border-sky-300 flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <span>See How It Works</span>
                <ArrowDown className="w-4 h-4 text-sky-500 animate-bounce" />
              </button>
            </div>

            {/* Trust / Value Line */}
            <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse shrink-0" />
              <span>From student signals → to insights → to intervention → to measurable outcomes.</span>
            </div>

          </div>

          {/* RIGHT SIDE: ORIGINAL CAMPUSOS AI MASCOT & ORBITING DATA */}
          <div className="lg:col-span-5 flex justify-center">
            <MascotIllustration />
          </div>

        </div>
      </div>
    </section>
  );
}
