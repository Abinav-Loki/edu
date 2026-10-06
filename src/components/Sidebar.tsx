import { NavLink } from "react-router-dom";
import {
  Home,
  Bot,
  ClipboardList,
  TrendingUp,
  Search,
  Calendar,
  Users,
  ShieldAlert,
  Wrench,
  GraduationCap,
  Ticket,
  Settings,
  Gamepad2,
  Clock,
  BookOpen
} from "lucide-react";
import { useCampus } from "../context/CampusContext";

const studentNav = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/tutor", label: "AI Copilot", icon: Bot },
  { to: "/learning-arena", label: "Learning Arena", icon: Gamepad2 },
  { to: "/recovery-plan", label: "Recovery Plan", icon: ClipboardList },
  { to: "/progress", label: "Student 360", icon: TrendingUp },
  { to: "/find-mentor", label: "Find Mentor", icon: Search },
  { to: "/library", label: "Digital Library", icon: BookOpen },
  { to: "/upload-materials", label: "Upload Materials", icon: ClipboardList },
  { to: "/support", label: "Support Tickets", icon: Ticket },
  { to: "/settings", label: "Profile", icon: Settings },
];

const facultyNav = [
  { to: "/faculty", label: "Dashboard", icon: Home },
  { to: "/faculty/timetable", label: "Timetable", icon: Calendar },
  { to: "/faculty/availability", label: "Availability", icon: Clock },
  { to: "/faculty/students", label: "Students", icon: Users },
  { to: "/faculty/requests", label: "Mentor Requests", icon: ClipboardList },
  { to: "/settings", label: "Profile", icon: Settings },
];

const adminNav = [
  { to: "/admin", label: "Control Room", icon: ShieldAlert },
  { to: "/admin/assets", label: "Assets & QR", icon: Search },
  { to: "/admin/maintenance", label: "Maintenance", icon: Wrench },
  { to: "/support", label: "Campus Tickets", icon: Ticket },
  { to: "/settings", label: "Profile", icon: Settings },
];

function PlantIllustration() {
  return (
    <svg width="48" height="52" viewBox="0 0 48 52" fill="none" aria-hidden="true" className="opacity-90">
      <path d="M14 38h20l-3 10H17L14 38z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      <rect x="12" y="35" width="24" height="5" rx="2" fill="rgba(255,255,255,0.25)" />
      <line x1="24" y1="35" x2="24" y2="22" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 28 Q16 22 15 14 Q22 16 24 28z" fill="#22C55E" opacity="0.9" />
      <path d="M24 24 Q32 18 33 10 Q26 12 24 24z" fill="#16A34A" opacity="0.8" />
      <path d="M24 22 Q20 12 24 6 Q28 12 24 22z" fill="#4ADE80" opacity="0.85" />
    </svg>
  );
}

export default function Sidebar() {
  const { activeRole } = useCampus();

  const navItems = 
    activeRole === "student" ? studentNav :
    activeRole === "faculty" ? facultyNav :
    adminNav;

  return (
    <aside
      className="hidden lg:flex flex-col w-[245px] shrink-0 sidebar-gradient rounded-[20px] shadow-xl shadow-indigo-500/15 m-3 h-[calc(100vh-24px)] border border-white/20"
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shadow-lg shadow-black/5 backdrop-blur-sm">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="text-white font-bold text-lg leading-tight tracking-tight">
            CampusOS AI
          </div>
          <div className="text-white/80 text-[11px] font-medium leading-tight mt-0.5 tracking-wide">
            Smart Campus Layer
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/dashboard" || to === "/faculty" || to === "/admin"}
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
            aria-label={label}
          >
            <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span className="font-semibold">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom motivational card */}
      <div className="mx-4 mb-6 p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-lg shadow-black/5 hover:bg-white/15 transition-colors cursor-default">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-white font-semibold text-xs leading-snug">
              Small steps create<br />big results!
            </p>
            <p className="text-white/80 text-[10px] mt-1.5 font-medium">
              You're doing great! 🌱
            </p>
          </div>
          <PlantIllustration />
        </div>
      </div>
    </aside>
  );
}
