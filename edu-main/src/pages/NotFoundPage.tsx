import { Link } from "react-router-dom";
import { Compass, ArrowLeft, Home, LogIn } from "lucide-react";
import { useCampus } from "../context/CampusContext";

export default function NotFoundPage() {
  const { currentUser } = useCampus();

  const destinationPath = currentUser?.role === "faculty"
    ? "/faculty"
    : currentUser?.role === "admin"
    ? "/admin"
    : "/dashboard";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-white/80 dark:border-slate-800 shadow-2xl text-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center mx-auto mb-4 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>
        
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 mb-1">
          404 Error
        </span>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
          The URL you entered does not exist or may have been relocated within the ARIVON AI campus system.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {currentUser ? (
            <Link
              to={destinationPath}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-md"
            >
              <Home className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>Go to Login</span>
            </Link>
          )}

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Campus Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
