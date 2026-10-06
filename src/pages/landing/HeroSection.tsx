import { ArrowRight, BookOpen, Laptop, GraduationCap } from "lucide-react";

export default function HeroSection() {
  function scrollToNext() {
    document.getElementById("problem-section")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-12 overflow-hidden">
      {/* Subtle Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl animate-[pulse_8s_infinite_ease-in-out]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl animate-[pulse_10s_infinite_ease-in-out_1s]" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold mb-8 animate-[pageEnter_0.6s_ease-out]">
          <GraduationCap className="w-4 h-4" />
          <span>CAMPUSOS AI</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tight leading-[1.1] mb-6 animate-[pageEnter_0.8s_ease-out]">
          THE INTELLIGENT <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">
            OPERATING LAYER
          </span> <br className="hidden md:block" />
          FOR A MODERN CAMPUS
        </h1>

        <p className="text-lg md:text-xl text-slate-600 font-medium mb-12 max-w-2xl mx-auto animate-[pageEnter_1s_ease-out]">
          One intelligent platform connecting students, mentors, campus operations, and academic intelligence into a single seamless experience.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[pageEnter_1.2s_ease-out]">
          <a href="/student/login" className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-1 w-full sm:w-auto">
            Enter CampusOS AI
          </a>
        </div>
      </div>

      {/* Floating study elements */}
      <div className="absolute top-1/3 right-10 md:right-32 opacity-20 hidden lg:block animate-[typingBounce_4s_infinite_ease-in-out]">
        <BookOpen className="w-16 h-16 text-indigo-800" />
      </div>
      <div className="absolute bottom-1/3 left-10 md:left-32 opacity-20 hidden lg:block animate-[typingBounce_5s_infinite_ease-in-out_1s]">
        <Laptop className="w-16 h-16 text-teal-800" />
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-60 hover:opacity-100 transition-opacity" onClick={scrollToNext}>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Scroll to explore</span>
        <ArrowRight className="w-4 h-4 text-slate-400 rotate-90 animate-bounce" />
      </div>
    </section>
  );
}
