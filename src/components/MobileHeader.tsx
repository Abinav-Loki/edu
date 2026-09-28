import { Bell, Shield } from "lucide-react";
import { student } from "../data/mock";

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full primary-gradient flex items-center justify-center text-white text-xs font-bold">
      {initials}
    </div>
  );
}

export default function MobileHeader() {
  return (
    <header
      className="md:hidden flex items-center justify-between px-4 py-3 bg-white/70 backdrop-blur-sm border-b border-white/60 sticky top-0 z-30"
      role="banner"
    >
      {/* Logo + greeting */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg primary-gradient flex items-center justify-center shadow-sm">
          <Shield className="w-4 h-4 text-white" aria-hidden="true" />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-800">
            Hello, {student.firstName} 👋
          </div>
          <div className="text-[10px] text-slate-500">
            {student.course} • {student.year}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          className="relative w-9 h-9 rounded-xl bg-white/80 border border-indigo-100 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" aria-hidden="true" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-400 rounded-full" aria-label="Unread notifications" />
        </button>
        <Avatar name={student.name} />
      </div>
    </header>
  );
}
