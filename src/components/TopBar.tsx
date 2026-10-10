import { useNavigate, useLocation } from "react-router-dom";
import { Search, Bell, ChevronDown } from "lucide-react";
import RoleSwitcher from "./RoleSwitcher";
import { useCampus } from "../context/CampusContext";

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="w-8 h-8 rounded-full primary-gradient flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md shadow-sky-500/20"
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
}

export default function TopBar() {
  const { currentUser, logout } = useCampus();
  const navigate = useNavigate();
  const location = useLocation();

  const hideSearchBar = ["/find-mentor", "/settings", "/support", "/profile", "/library"].includes(location.pathname);

  return (
    <header
      className="hidden md:flex items-center gap-6 px-6 lg:px-8 py-4 bg-transparent shrink-0 z-20 mt-2"
      role="banner"
    >
      <RoleSwitcher />
      {/* Search or Campus Status Pill */}
      {!hideSearchBar ? (
        <div className="flex-1 max-w-2xl relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-400 group-focus-within:text-sky-500 transition-colors"
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search topics, questions, or upload a file..."
            className="w-full pl-11 pr-16 py-2.5 rounded-2xl text-sm bg-white/60 backdrop-blur-md border border-white/80 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:bg-white/80 transition-all shadow-sm"
            aria-label="Search topics, questions, or upload a file"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded border border-slate-200 text-slate-400 text-[10px] font-semibold bg-white/50 backdrop-blur-sm">
            ⌘ K
          </kbd>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="hidden lg:flex items-center gap-2.5 px-4 py-1.5 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-white/90 dark:border-slate-700/80 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>CampusOS Academic Portal</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold capitalize">
              {location.pathname.replace('/', '').replace('-', ' ')}
            </span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 ml-auto">
        {/* Notification bell */}
        <button
          className="relative w-10 h-10 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 flex items-center justify-center text-slate-500 hover:text-sky-600 hover:bg-white/90 hover:-translate-y-[1px] transition-all shadow-sm"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" aria-hidden="true" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-400 rounded-full border-2 border-white" aria-label="unread notifications" />
        </button>

        {/* User profile dropdown */}
        <div className="relative group">
          <button
            className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/80 dark:border-slate-700/80 hover:bg-white/90 dark:hover:bg-slate-700 hover:-translate-y-[1px] transition-all shadow-sm"
            aria-label="User menu"
            aria-haspopup="true"
          >
            <Avatar name={currentUser?.name || "User"} />
            <div className="text-left hidden lg:block py-0.5">
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {currentUser?.name || "User"}
              </div>
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight mt-0.5 capitalize truncate max-w-[120px]">
                {currentUser?.department || currentUser?.role}
              </div>
            </div>
            <ChevronDown
              className="w-4 h-4 text-slate-400 hidden lg:block ml-1 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors"
              aria-hidden="true"
            />
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all origin-top-right scale-95 group-hover:scale-100 overflow-hidden z-50">
            <button 
              onClick={() => navigate('/settings')}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors"
            >
              Profile
            </button>
            <button 
              onClick={() => navigate('/settings')}
              className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors border-b border-slate-100 dark:border-slate-700"
            >
              Settings
            </button>
            <button 
              onClick={() => {
                const role = currentUser?.role || 'student';
                logout();
                navigate(`/${role}/login`);
              }}
              className="w-full text-left px-4 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
