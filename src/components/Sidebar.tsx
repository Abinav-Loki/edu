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
  BookOpen,
  Menu,
  X
} from "lucide-react";
import { useCampus } from "../context/CampusContext";
import { useSidebar } from "../context/SidebarContext";

const studentNav = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/tutor", label: "AI Copilot", icon: Bot },
  { to: "/learning-arena", label: "Learning Arena", icon: Gamepad2 },
  { to: "/study-planner", label: "Study Planner", icon: Calendar },
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
    <svg width="48" height="52" viewBox="0 0 48 52" fill="none" aria-hidden="true" className="opacity-90 shrink-0">
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
  const { isExpanded, toggleExpanded, isMobileOpen, closeMobile } = useSidebar();

  const navItems = 
    activeRole === "student" ? studentNav :
    activeRole === "faculty" ? facultyNav :
    adminNav;

  return (
    <>
      {/* ─── MOBILE DRAWER BACKDROP & OVERLAY ─── */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-[rgba(15,27,61,0.15)] backdrop-blur-xs transition-opacity duration-300 ${
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeMobile}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <aside
        id="mobile-sidebar"
        className={`md:hidden fixed top-0 left-0 z-50 flex flex-col w-[255px] shrink-0 sidebar-gradient rounded-[20px] shadow-2xl shadow-indigo-950/40 m-3 h-[calc(100vh-24px)] border border-white/20 transform transition-transform duration-300 ease-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile main navigation"
        aria-hidden={!isMobileOpen}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
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
          <button
            onClick={closeMobile}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard" || to === "/faculty" || to === "/admin"}
              onClick={closeMobile}
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

        <div className="mx-4 mb-6 p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-lg shadow-black/5 cursor-default">
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

      {/* ─── DESKTOP COLLAPSIBLE ICON RAIL SIDEBAR ─── */}
      <aside
        id="desktop-sidebar"
        className={`hidden md:flex flex-col relative shrink-0 sidebar-gradient rounded-[20px] shadow-xl shadow-indigo-500/15 my-3 ml-3 mr-1 h-[calc(100vh-24px)] border border-white/20 transition-[width] duration-300 ease-in-out z-30 overflow-hidden ${
          isExpanded ? "w-[245px]" : "w-[72px]"
        }`}
        aria-label="Main navigation"
      >
        {/* Header with Hamburger Button + Logo */}
        <div className="flex items-center px-4 py-5 border-b border-white/10 relative min-h-[72px]">
          <button
            onClick={toggleExpanded}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all shrink-0 cursor-pointer shadow-sm hover:scale-105 active:scale-95"
            aria-label={isExpanded ? "Collapse navigation" : "Expand navigation"}
            aria-expanded={isExpanded}
          >
            <Menu className="w-5 h-5 text-white" aria-hidden="true" />
          </button>

          {/* Logo Brand (smooth fade in/out when expanding) */}
          <div
            className={`flex items-center gap-2.5 ml-3 transition-all duration-300 whitespace-nowrap overflow-hidden ${
              isExpanded ? "opacity-100 max-w-[170px]" : "opacity-0 max-w-0 pointer-events-none"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center shadow-md backdrop-blur-sm shrink-0">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-base leading-tight tracking-tight">
                CampusOS AI
              </div>
              <div className="text-white/80 text-[10px] font-medium leading-tight tracking-wide">
                Smart Campus Layer
              </div>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-5 space-y-2 overflow-y-auto overflow-x-hidden">
          {navItems.map(({ to, label, icon: Icon }) => (
            <div key={to} className="relative group flex items-center justify-center">
              <NavLink
                to={to}
                end={to === "/dashboard" || to === "/faculty" || to === "/admin"}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""} ${
                    isExpanded ? "justify-start px-3" : "justify-center px-0 w-10 h-10 mx-auto"
                  }`
                }
                aria-label={label}
              >
                <Icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                <span
                  className={`font-semibold transition-all duration-300 whitespace-nowrap overflow-hidden ${
                    isExpanded ? "opacity-100 max-w-[150px] ml-1" : "opacity-0 max-w-0"
                  }`}
                >
                  {label}
                </span>
              </NavLink>

              {/* Hover Tooltip when Collapsed */}
              {!isExpanded && (
                <div
                  role="tooltip"
                  className="absolute left-full ml-3 px-3 py-1.5 bg-slate-900/90 text-white text-xs font-semibold rounded-lg shadow-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 border border-white/20"
                >
                  {label}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Bottom Motivational Card */}
        <div
          className={`mx-3 mb-5 p-3.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md shadow-lg shadow-black/5 cursor-default transition-all duration-300 overflow-hidden ${
            isExpanded ? "opacity-100 max-h-36" : "opacity-0 max-h-0 pointer-events-none p-0 border-none mb-0"
          }`}
        >
          <div className="flex items-end justify-between whitespace-nowrap">
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
    </>
  );
}
