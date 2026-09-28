import { NavLink } from "react-router-dom";
import { Home, Bot, ClipboardList, TrendingUp, MoreHorizontal } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/tutor", label: "Tutor", icon: Bot },
  { to: "/recovery-plan", label: "Plan", icon: ClipboardList },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/resources", label: "More", icon: MoreHorizontal },
];

export default function BottomTabs() {
  return (
    <nav
      className="bottom-nav md:hidden"
      aria-label="Mobile navigation"
      role="navigation"
    >
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `bottom-nav-item${isActive ? " active" : ""}`
          }
          aria-label={label}
        >
          <Icon className="w-5 h-5" aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
