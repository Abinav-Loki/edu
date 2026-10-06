import { Bell, GraduationCap } from "lucide-react";

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-sky-500/20 border border-white/20">
      {initials}
    </div>
  );
}

export default function MobileHeader() {
  return (
    <header
      className="md:hidden flex items-center justify-between px-5 py-3 bg-white/70 backdrop-blur-md border-b border-white/60 sticky top-0 z-30 shadow-sm"
      role="banner"
    >
      {/* Logo + greeting */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
          <GraduationCap className="w-6 h-6 text-white" aria-hidden="true" />
        </div>
        <div className="py-0.5">
          <div className="text-sm font-bold text-slate-800 leading-tight">
            Hello, Arun 👋
          </div>
          <div className="text-[11px] font-medium text-slate-500 leading-tight mt-0.5">
            B.Tech IT • 3rd Year
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          className="relative w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm border border-slate-100 flex items-center justify-center text-slate-500 shadow-sm"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" aria-hidden="true" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-400 rounded-full border-2 border-white" aria-label="Unread notifications" />
        </button>
        <Avatar name="Arun Kumar" />
      </div>
    </header>
  );
}
