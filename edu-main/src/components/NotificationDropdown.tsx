import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Check, X, Calendar, Award, BookOpen, AlertCircle, VolumeX } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export interface CampusNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "quiz" | "recovery" | "resource" | "mission";
  read: boolean;
  link?: string;
}

const initialNotifications: CampusNotification[] = [
  {
    id: "notif-1",
    title: "Upcoming Quiz Deadline",
    message: "Relational Algebra & Normalization quiz closes tomorrow at 11:59 PM.",
    time: "10m ago",
    type: "quiz",
    read: false,
    link: "/quiz"
  },
  {
    id: "notif-2",
    title: "Academic Recovery Milestone",
    message: "Day 3 tasks ready in your personalized Academic Recovery Plan.",
    time: "2h ago",
    type: "recovery",
    read: false,
    link: "/recovery-plan"
  },
  {
    id: "notif-3",
    title: "New Course Notes Uploaded",
    message: "Prof. Sarah Jenkins posted updated slides for Operating Systems.",
    time: "5h ago",
    type: "resource",
    read: false,
    link: "/resources"
  },
  {
    id: "notif-4",
    title: "Daily Mission Completed",
    message: "You completed 'SQL Mastery I' and earned +50 XP and coins!",
    time: "1d ago",
    type: "mission",
    read: true,
    link: "/learning-arena"
  }
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<CampusNotification[]>(() => {
    const saved = localStorage.getItem("campus_notifications");
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const { settings, updateSettings, playSound } = useSettings();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("campus_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleOpen = () => {
    if (!isOpen) {
      playSound("notification");
    }
    setIsOpen((prev) => !prev);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    playSound("success");
  };

  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type: CampusNotification["type"]) => {
    switch (type) {
      case "quiz":
        return <Calendar className="w-4 h-4 text-amber-500" />;
      case "recovery":
        return <AlertCircle className="w-4 h-4 text-purple-500" />;
      case "resource":
        return <BookOpen className="w-4 h-4 text-sky-500" />;
      case "mission":
        return <Award className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={toggleOpen}
        className="relative w-10 h-10 rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/80 dark:border-slate-700/80 flex items-center justify-center text-slate-500 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-white/90 dark:hover:bg-slate-700/90 hover:-translate-y-[1px] transition-all shadow-sm cursor-pointer"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-5 h-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"
            aria-label={`${unreadCount} unread notifications`}
          />
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/80 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          role="region"
          aria-label="Notifications panel"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-800 dark:text-slate-100">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Muted Warning Banner if Notifications are disabled in Settings */}
          {!settings.pushNotificationsEnabled && (
            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-100 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-700 dark:text-amber-400">
              <div className="flex items-center gap-2">
                <VolumeX className="w-3.5 h-3.5 shrink-0" />
                <span>Notifications paused</span>
              </div>
              <button
                onClick={() => updateSettings({ pushNotificationsEnabled: true })}
                className="underline font-bold hover:text-amber-900 dark:hover:text-amber-300 cursor-pointer"
              >
                Enable
              </button>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="py-8 px-4 text-center text-slate-400 dark:text-slate-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">All caught up!</p>
                <p className="text-xs mt-0.5">No new campus notifications.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors flex items-start gap-3 relative group ${
                    !notif.read ? "bg-indigo-50/40 dark:bg-indigo-950/20" : ""
                  }`}
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    {notif.link ? (
                      <Link
                        to={notif.link}
                        onClick={() => setIsOpen(false)}
                        className="text-xs font-bold text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 block truncate"
                      >
                        {notif.title}
                      </Link>
                    ) : (
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{notif.title}</p>
                    )}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-1 block">
                      {notif.time}
                    </span>
                  </div>

                  <button
                    onClick={(e) => dismissNotification(notif.id, e)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                    aria-label="Dismiss notification"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50/80 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center">
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              Notification Settings →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
