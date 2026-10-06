import { NavLink } from "react-router-dom";
import { Home, Bot, ClipboardList, TrendingUp, MoreHorizontal } from "lucide-react";

const tabs = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/tutor", label: "Tutor", icon: Bot },
  { to: "/recovery-plan", label: "Plan", icon: ClipboardList },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/resources", label: "More", icon: MoreHorizontal },
];

export default function BottomTabs() {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-white/80 backdrop-blur-xl border-t border-white/60 flex items-center justify-around px-2 pb-safe z-50 shadow-[0_-4px_24px_rgba(0,0,0,0.02)]"
      aria-label="Mobile navigation"
      role="navigation"
    >
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/dashboard"}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-200 ${
              isActive 
                ? "bg-gradient-to-br from-sky-400 to-indigo-500 text-white shadow-lg shadow-sky-500/25 -translate-y-1" 
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`
          }
          aria-label={label}
        >
          <Icon className="w-5 h-5 mb-0.5" aria-hidden="true" />
          <span className="text-[10px] font-bold tracking-wide">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
