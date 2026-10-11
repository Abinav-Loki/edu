import { ReactNode } from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { useCampus } from "../context/CampusContext";
import { Role } from "../data/centralData";
import { ShieldAlert, Loader2, ArrowLeft, LogIn } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { currentUser, isAuthLoading } = useCampus();
  const location = useLocation();

  // 1. Cold-boot authentication check
  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-3 p-6 rounded-2xl glass-card border border-white/60 dark:border-slate-800 shadow-xl">
          <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Verifying campus security session...
          </p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated: Redirect to login immediately
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Pending approval check (Zero-Trust security for unverified staff/faculty/admin)
  if (currentUser.status === "pending_approval") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl glass-card border border-amber-300 dark:border-amber-800 bg-white/80 dark:bg-slate-900/80 shadow-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 flex items-center justify-center mx-auto mb-4 border border-amber-300 dark:border-amber-800 text-amber-600">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Verification Pending
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            Your {currentUser.role === "faculty" ? "Faculty" : "Administrator"} account is currently under institutional review. For campus security compliance, portal access will be granted once verified by campus administration.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-md"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  // 4. Role Authorization: Show explicit Access Restricted screen if role does not match
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    const authorizedPath = currentUser.role === "faculty"
      ? "/faculty"
      : currentUser.role === "admin"
      ? "/admin"
      : "/dashboard";

    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl glass-card border border-rose-200 dark:border-rose-900 bg-white/80 dark:bg-slate-900/80 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center mx-auto mb-4 border border-rose-200 dark:border-rose-800 text-rose-600">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Access Restricted (403)
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
            This portal requires <span className="font-bold text-rose-600 dark:text-rose-400 capitalize">{allowedRoles.join(" or ")}</span> privileges. You are currently authenticated as a <span className="font-bold capitalize">{currentUser.role}</span> ({currentUser.name}).
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={authorizedPath}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to {currentUser.role === "faculty" ? "Faculty" : currentUser.role === "admin" ? "Admin" : "Student"} Portal</span>
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Switch Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
