import { GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function FinalCTASection() {
  return (
    <section className="py-24 px-6 bg-white/40 backdrop-blur-sm relative overflow-hidden border-t border-slate-200/50">
      
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-teal-400 shadow-lg shadow-indigo-500/20 mb-8">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-6">
          Ready to experience a smarter campus?
        </h2>
        
        <p className="text-xl text-slate-600 font-medium mb-12">
          Join the future of connected education and intelligent campus operations.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/student/login" className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 group">
            Enter CampusOS AI
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="mt-12 pt-12 border-t border-slate-200 flex flex-wrap justify-center gap-6 md:gap-12">
          <Link to="/student/login" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
            Student Login
          </Link>
          <Link to="/faculty/login" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
            Faculty / Mentor Login
          </Link>
          <Link to="/admin/login" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
            Campus Admin Login
          </Link>
        </div>
      </div>
    </section>
  );
}
