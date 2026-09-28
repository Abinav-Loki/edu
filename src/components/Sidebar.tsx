import { NavLink } from "react-router-dom";
import {
  Home,
  Bot,
  ClipboardList,
  TrendingUp,
  BookOpen,
  Calendar,
  Settings,
  Shield,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/tutor", label: "AI Tutor", icon: Bot },
  { to: "/recovery-plan", label: "Recovery Plan", icon: ClipboardList },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/resources", label: "Resources", icon: BookOpen },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/settings", label: "Settings", icon: Settings },
];

// Subtle potted plant SVG illustration
function PlantIllustration() {
  return (
    <svg
      width="48"
      height="52"
      viewBox="0 0 48 52"
      fill="none"
      aria-hidden="true"
      className="opacity-80"
    >
      {/* Pot */}
      <path
        d="M14 38h20l-3 10H17L14 38z"
        fill="#2D3F8A"
        stroke="rgba(165,180,252,0.3)"
        strokeWidth="0.5"
      />
      <rect x="12" y="35" width="24" height="5" rx="2" fill="#3D4FAA" />
      {/* Stem */}
      <line
        x1="24"
        y1="35"
        x2="24"
        y2="22"
        stroke="#4ADE80"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Left leaf */}
      <path
        d="M24 28 Q16 22 15 14 Q22 16 24 28z"
        fill="#22C55E"
        opacity="0.9"
      />
      {/* Right leaf */}
      <path
        d="M24 24 Q32 18 33 10 Q26 12 24 24z"
        fill="#16A34A"
        opacity="0.8"
      />
      {/* Top leaf */}
      <path
        d="M24 22 Q20 12 24 6 Q28 12 24 22z"
        fill="#4ADE80"
        opacity="0.85"
      />
    </svg>
  );
}

export default function Sidebar() {
  return (
    <aside
      className="hidden lg:flex flex-col w-60 xl:w-64 shrink-0 sidebar-gradient"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl primary-gradient flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-tight">
            EduGuard AI
          </div>
          <div className="text-indigo-300/70 text-[10px] leading-tight mt-0.5">
            Your Academic Companion
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
            aria-label={label}
          >
            <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom motivational card */}
      <div className="mx-3 mb-4 p-4 rounded-2xl bg-white/8 border border-white/10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white/90 font-semibold text-xs leading-snug">
              Small steps create
              <br />
              big results!
            </p>
            <p className="text-indigo-300/70 text-[10px] mt-1.5">
              You're doing great! 👍
            </p>
          </div>
          <PlantIllustration />
        </div>
      </div>
    </aside>
  );
}
