import { useState } from "react";
import {
  User,
  Bell,
  Moon,
  Shield,
  ChevronRight,
  Globe,
  Palette,
  Volume2,
  Lock,
} from "lucide-react";
import { student } from "../data/mock";
import MobileHeader from "../components/MobileHeader";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";

interface ToggleProps {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}

function Toggle({ id, checked, onChange, label }: ToggleProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-colors ${
        checked ? "bg-indigo-500" : "bg-slate-200"
      }`}
      style={{ minWidth: "40px", height: "22px" }}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-[19px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  toggle?: boolean;
  checked?: boolean;
  onToggle?: (v: boolean) => void;
  toggleId?: string;
}

function SettingRow({ icon, label, description, toggle, checked, onToggle, toggleId }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">{label}</p>
          {description && (
            <p className="text-xs text-slate-400 mt-0.5 truncate">{description}</p>
          )}
        </div>
      </div>
      {toggle && onToggle && toggleId ? (
        <Toggle id={toggleId} checked={!!checked} onChange={onToggle} label={label} />
      ) : (
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" aria-hidden="true" />
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [sounds, setSounds] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-2xl mx-auto">
        <PageHeader title="Settings" subtitle="Manage your account and preferences" />

        {/* Profile card */}
        <GlassCard className="mb-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl primary-gradient flex items-center justify-center text-white text-xl font-bold shrink-0">
              {student.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold text-slate-800">{student.name}</h2>
              <p className="text-sm text-slate-500">
                {student.course} • {student.year}
              </p>
              <span className="inline-block mt-1 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-2 py-0.5">
                Student Account
              </span>
            </div>
            <button
              className="btn-secondary !text-xs !px-3 !py-2 shrink-0"
              aria-label="Edit profile"
            >
              Edit
            </button>
          </div>
        </GlassCard>

        {/* Account settings */}
        <GlassCard className="mb-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
            Account
          </h3>
          <SettingRow
            icon={<User className="w-4 h-4" />}
            label="Personal Information"
            description="Name, email, student ID"
          />
          <SettingRow
            icon={<Globe className="w-4 h-4" />}
            label="Language & Region"
            description="English (India)"
          />
          <SettingRow
            icon={<Lock className="w-4 h-4" />}
            label="Change Password"
            description="Last changed 30 days ago"
          />
          <SettingRow
            icon={<Shield className="w-4 h-4" />}
            label="Two-Factor Authentication"
            description="Add extra security"
            toggle
            checked={twoFactor}
            onToggle={setTwoFactor}
            toggleId="toggle-2fa"
          />
        </GlassCard>

        {/* Preferences */}
        <GlassCard className="mb-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
            Preferences
          </h3>
          <SettingRow
            icon={<Bell className="w-4 h-4" />}
            label="Push Notifications"
            description="Deadlines, quiz reminders"
            toggle
            checked={notifications}
            onToggle={setNotifications}
            toggleId="toggle-notifications"
          />
          <SettingRow
            icon={<Moon className="w-4 h-4" />}
            label="Dark Mode"
            description="Coming soon"
            toggle
            checked={darkMode}
            onToggle={setDarkMode}
            toggleId="toggle-dark"
          />
          <SettingRow
            icon={<Volume2 className="w-4 h-4" />}
            label="Sound Effects"
            description="Quiz & tutor sounds"
            toggle
            checked={sounds}
            onToggle={setSounds}
            toggleId="toggle-sounds"
          />
          <SettingRow
            icon={<Palette className="w-4 h-4" />}
            label="Appearance"
            description="Theme & accent color"
          />
        </GlassCard>

        {/* Version */}
        <p className="text-center text-xs text-slate-400 mt-4">
          EduGuard AI v1.0.0 · Phase 1 Frontend · Built for hackathon demo
        </p>
      </div>
    </>
  );
}
