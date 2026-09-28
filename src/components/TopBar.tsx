import { Search, Bell, ChevronDown } from "lucide-react";
import { student } from "../data/mock";

// Avatar with initials
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="w-8 h-8 rounded-full primary-gradient flex items-center justify-center text-white text-xs font-bold shrink-0"
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
}

export default function TopBar() {
  return (
    <header
      className="hidden md:flex items-center gap-4 px-4 lg:px-6 py-3 bg-white/50 backdrop-blur-sm border-b border-white/60 shrink-0 z-20"
      role="banner"
    >
      {/* Search */}
      <div className="flex-1 max-w-lg relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400"
          aria-hidden="true"
        />
        <input
          type="search"
          placeholder="Search topics, questions, or upload a file..."
          className="w-full pl-9 pr-16 py-2 rounded-xl text-sm bg-white/70 border border-indigo-100 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
          aria-label="Search topics, questions, or upload a file"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-500 text-[10px] font-semibold">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notification bell */}
        <button
          className="relative w-9 h-9 rounded-xl bg-white/70 border border-indigo-100 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-white transition"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" aria-hidden="true" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full" aria-label="3 unread notifications" />
        </button>

        {/* User profile */}
        <button
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl bg-white/70 border border-indigo-100 hover:bg-white transition"
          aria-label="User menu"
          aria-haspopup="true"
        >
          <Avatar name={student.name} />
          <div className="text-left hidden lg:block">
            <div className="text-xs font-semibold text-slate-800 leading-tight">
              {student.name}
            </div>
            <div className="text-[10px] text-slate-500 leading-tight">
              {student.course} • {student.year}
            </div>
          </div>
          <ChevronDown
            className="w-3.5 h-3.5 text-slate-400 hidden lg:block"
            aria-hidden="true"
          />
        </button>
      </div>
    </header>
  );
}
