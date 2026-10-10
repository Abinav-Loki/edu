import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Sparkles, TrendingUp } from "lucide-react";
import MascotIllustration from "./MascotIllustration";

export default function FinalCTASection() {
  return (
    <section className="py-20 bg-gradient-to-b from-sky-500 via-indigo-600 to-slate-900 text-white relative overflow-hidden">
      {/* Background Lighting Gradients */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT SIDE: CTA HEADLINE & BUTTONS */}
          <div className="lg:col-span-7 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sky-200 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>CampusOS Student Success Intelligence</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              From student signals to meaningful action.
            </h2>

            <p className="text-base sm:text-lg text-sky-100 font-medium leading-relaxed max-w-xl">
              CampusOS gives institutions the intelligence to understand every student journey and act when it matters.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                to="/dashboard"
                className="px-8 py-4 rounded-2xl bg-white text-indigo-950 font-black text-base hover:bg-sky-50 shadow-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore the Platform</span>
                <ChevronRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/progress"
                className="px-6 py-4 rounded-2xl bg-indigo-950/60 backdrop-blur-md border border-white/20 text-white font-bold text-base hover:bg-indigo-900/80 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-sky-400" />
                <span>See Student Intelligence</span>
              </Link>
            </div>

            <div className="pt-4 text-xs font-semibold text-sky-200">
              KPMG India Challenge • AI-Powered Student Analytics and Success Platform
            </div>
          </div>

          {/* RIGHT SIDE: CELEBRATORY MASCOT */}
          <div className="lg:col-span-5 flex justify-center scale-90 sm:scale-100">
            <MascotIllustration />
          </div>

        </div>
      </div>
    </section>
  );
}
