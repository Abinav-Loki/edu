import { useState } from "react";
import {
  User as UserIcon,
  Bell,
  Moon,
  Shield,
  ChevronRight,
  Globe,
  Palette,
  Volume2,
  Lock,
  Save,
  Check
} from "lucide-react";
import { useCampus } from "../context/CampusContext";
import { useSettings } from "../context/SettingsContext";
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
        checked ? "bg-indigo-500" : "bg-slate-200 dark:bg-slate-700"
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
  onClick?: () => void;
  toggleId?: string;
}

function SettingRow({ icon, label, description, toggle, checked, onToggle, toggleId, onClick }: SettingRowProps) {
  return (
    <div 
      className={`flex items-center justify-between gap-3 py-3 border-b border-slate-100 dark:border-slate-800/50 last:border-0 ${onClick && !toggle ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg px-2 -mx-2 transition-colors' : ''}`}
      onClick={onClick && !toggle ? onClick : undefined}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</p>
          {description && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">{description}</p>
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

// Modal Component
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">&times;</button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { currentUser, updateProfile } = useCampus();
  const { settings, updateSettings, playSound } = useSettings();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDept, setEditDept] = useState("");

  // Modals state
  const [activeModal, setActiveModal] = useState<"language" | "password" | "appearance" | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Initialize edit state when toggling
  function startEditing() {
    setEditName(currentUser?.name || "");
    setEditDept(currentUser?.department || "");
    setIsEditingProfile(true);
  }

  function handleSaveProfile() {
    updateProfile({ name: editName, department: editDept });
    playSound("success");
    setIsEditingProfile(false);
  }

  function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    // Mock save
    setTimeout(() => {
      setPasswordSuccess(true);
      playSound("success");
      setTimeout(() => setActiveModal(null), 1500);
    }, 500);
  }

  if (!currentUser) return null;

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-2xl mx-auto">
        <PageHeader title="Profile & Settings" subtitle="Manage your account and preferences" />

        {/* Profile card */}
        <GlassCard className="mb-5">
          <div className="flex items-start sm:items-center flex-col sm:flex-row gap-4">
            <div className="w-14 h-14 rounded-2xl primary-gradient flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-lg">
              {currentUser.name.split(" ").map((n) => n[0]).join("").substring(0,2)}
            </div>
            
            <div className="flex-1 w-full min-w-0">
              {isEditingProfile ? (
                <div className="space-y-3 w-full">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Full Name</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full text-sm font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Department / Course</label>
                    <input 
                      type="text" 
                      value={editDept}
                      onChange={(e) => setEditDept(e.target.value)}
                      className="w-full text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Department / Course"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 block">Student ID (Managed by institution)</label>
                    <input 
                      type="text" 
                      value={currentUser.id}
                      disabled
                      className="w-full text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 cursor-not-allowed"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{currentUser.name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {currentUser.department || "No department specified"} 
                    {currentUser.role === 'student' && (currentUser as any).year ? ` • ${(currentUser as any).year}` : ''}
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="inline-block text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20 rounded-full px-2 py-0.5">
                      {currentUser.role} Account
                    </span>
                    <span className="inline-block text-[10px] uppercase font-bold text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-full px-2 py-0.5">
                      ID: {currentUser.id}
                    </span>
                  </div>
                </>
              )}
            </div>
            
            <div className="shrink-0 flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              {isEditingProfile ? (
                <>
                  <button onClick={handleSaveProfile} className="btn-primary !text-xs !px-4 !py-2 flex-1 sm:flex-none">
                    <Save className="w-3 h-3 mr-1" /> Save
                  </button>
                  <button onClick={() => setIsEditingProfile(false)} className="btn-secondary !text-xs !px-4 !py-2 flex-1 sm:flex-none">
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={startEditing}
                  className="btn-secondary !text-xs !px-4 !py-2 w-full sm:w-auto"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Account settings */}
        <GlassCard className="mb-4">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 px-1">
            Account
          </h3>
          <SettingRow
            icon={<UserIcon className="w-4 h-4" />}
            label="Personal Information"
            description="Edit your profile details"
            onClick={startEditing}
          />
          <SettingRow
            icon={<Globe className="w-4 h-4" />}
            label="Language & Region"
            description={`${settings.language} (${settings.region})`}
            onClick={() => setActiveModal("language")}
          />
          <SettingRow
            icon={<Lock className="w-4 h-4" />}
            label="Change Password"
            description="Update your security credentials"
            onClick={() => setActiveModal("password")}
          />
          <SettingRow
            icon={<Shield className="w-4 h-4" />}
            label="Two-Factor Authentication"
            description={settings.twoFactorEnabled ? "2FA is enabled" : "Add extra security"}
            toggle
            checked={settings.twoFactorEnabled}
            onToggle={(val) => {
              updateSettings({ twoFactorEnabled: val });
              if (val) playSound("success");
            }}
            toggleId="toggle-2fa"
          />
        </GlassCard>

        {/* Preferences */}
        <GlassCard className="mb-4">
          <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 px-1">
            Preferences
          </h3>
          <SettingRow
            icon={<Bell className="w-4 h-4" />}
            label="Push Notifications"
            description="Deadlines, quiz reminders"
            toggle
            checked={settings.pushNotificationsEnabled}
            onToggle={(val) => updateSettings({ pushNotificationsEnabled: val })}
            toggleId="toggle-notifications"
          />
          <SettingRow
            icon={<Moon className="w-4 h-4" />}
            label="Dark Mode"
            description="Toggle dark theme"
            toggle
            checked={settings.theme === "dark"}
            onToggle={(val) => {
              updateSettings({ theme: val ? "dark" : "light" });
              playSound("notification");
            }}
            toggleId="toggle-dark"
          />
          <SettingRow
            icon={<Volume2 className="w-4 h-4" />}
            label="Sound Effects"
            description="Quiz & tutor sounds"
            toggle
            checked={settings.soundEffectsEnabled}
            onToggle={(val) => {
              updateSettings({ soundEffectsEnabled: val });
              if (val) {
                // Manually play sound to demonstrate it turning on
                console.log("[Sound System] Playing success sound.");
              }
            }}
            toggleId="toggle-sounds"
          />
          <SettingRow
            icon={<Palette className="w-4 h-4" />}
            label="Appearance"
            description={`Accent: ${settings.accentColor}`}
            onClick={() => setActiveModal("appearance")}
          />
        </GlassCard>

        <p className="text-center text-xs text-slate-400 mt-6 pb-4">
          CampusOS AI v2.0 · Settings synchronized
        </p>
      </div>

      {/* Language Modal */}
      <Modal isOpen={activeModal === "language"} onClose={() => setActiveModal(null)} title="Language & Region">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Language</label>
            <select 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value })}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">Region</label>
            <select 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
              value={settings.region}
              onChange={(e) => updateSettings({ region: e.target.value })}
            >
              <option value="India">India</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
            </select>
          </div>
          <button onClick={() => { setActiveModal(null); playSound("success"); }} className="btn-primary w-full mt-4">
            Save Preferences
          </button>
        </div>
      </Modal>

      {/* Password Modal */}
      <Modal isOpen={activeModal === "password"} onClose={() => {setActiveModal(null); setPasswordSuccess(false); setPasswordError("");}} title="Change Password">
        {passwordSuccess ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">Password Updated!</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Your password has been successfully changed.</p>
          </div>
        ) : (
          <form onSubmit={handleChangePassword} className="space-y-4">
            {passwordError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-900/50">
                {passwordError}
              </div>
            )}
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1">Current Password</label>
              <input 
                type="password" 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1">New Password</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-1">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full mt-2">
              Update Password
            </button>
          </form>
        )}
      </Modal>

      {/* Appearance Modal */}
      <Modal isOpen={activeModal === "appearance"} onClose={() => setActiveModal(null)} title="Appearance Settings">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-3">Theme</label>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => updateSettings({ theme: "light" })}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${settings.theme === "light" ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "border-slate-200 dark:border-slate-700 hover:border-slate-300"}`}
              >
                <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">☀️</div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Light</span>
              </button>
              <button 
                onClick={() => updateSettings({ theme: "dark" })}
                className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${settings.theme === "dark" ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "border-slate-200 dark:border-slate-700 hover:border-slate-300"}`}
              >
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">🌙</div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Dark</span>
              </button>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-3">Accent Color</label>
            <div className="flex gap-4 justify-center">
              {[
                { id: "indigo", color: "bg-indigo-500" },
                { id: "blue", color: "bg-sky-500" },
                { id: "teal", color: "bg-teal-500" }
              ].map(accent => (
                <button
                  key={accent.id}
                  onClick={() => updateSettings({ accentColor: accent.id as any })}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform ${accent.color} ${settings.accentColor === accent.id ? "ring-4 ring-offset-2 ring-indigo-200 dark:ring-indigo-900 scale-110" : "hover:scale-105"}`}
                >
                  {settings.accentColor === accent.id && <Check className="w-6 h-6 text-white" />}
                </button>
              ))}
            </div>
          </div>
          
          <button onClick={() => { setActiveModal(null); playSound("success"); }} className="btn-primary w-full mt-2">
            Done
          </button>
        </div>
      </Modal>
    </>
  );
}
