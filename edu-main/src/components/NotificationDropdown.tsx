import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  X,
  Calendar,
  Award,
  BookOpen,
  AlertCircle,
  VolumeX,
  Shield,
  MessageSquare,
  Wrench,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Inbox
} from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import { useCampus } from "../context/CampusContext";
import {
  fetchNotificationsFromDB,
  markNotificationAsReadInDB,
  markAllNotificationsAsReadInDB,
  deleteNotificationFromDB,
  CampusNotificationRecord
} from "../services/supabaseService";

export interface CampusNotification {
  id: string;
  recipientId?: string;
  role?: "student" | "faculty" | "admin" | "all";
  title: string;
  message: string;
  time: string;
  type: "quiz" | "recovery" | "resource" | "mission" | "intervention" | "feedback" | "system" | "admin" | "security";
  priority?: "low" | "medium" | "high" | "urgent";
  read: boolean;
  link?: string;
}

// ─── ROLE-SPECIFIC NOTIFICATION CATALOGS ───

const studentDemoNotifications: CampusNotification[] = [
  {
    id: "notif-stu-1",
    title: "Academic Recovery Milestone",
    message: "Day 3 tasks ready in your personalized Academic Recovery Plan for DBMS Normalization.",
    time: "10m ago",
    type: "recovery",
    priority: "urgent",
    read: false,
    link: "/recovery-plan"
  },
  {
    id: "notif-stu-2",
    title: "Upcoming Assessment Deadline",
    message: "Relational Algebra & Normalization quiz closes tomorrow at 11:59 PM.",
    time: "1h ago",
    type: "quiz",
    priority: "high",
    read: false,
    link: "/quiz"
  },
  {
    id: "notif-stu-3",
    title: "AI Study Material Processed",
    message: "AI Copilot generated topic flashcards and practice questions for DBMS Notes Chap 1.",
    time: "4h ago",
    type: "resource",
    priority: "medium",
    read: false,
    link: "/upload-materials"
  },
  {
    id: "notif-stu-4",
    title: "Topic Mission Complete",
    message: "You completed 'SQL Joins' topic mission in Learning Arena and earned +50 XP and coins!",
    time: "1d ago",
    type: "mission",
    priority: "low",
    read: true,
    link: "/learning-arena"
  },
  {
    id: "notif-stu-5",
    title: "Mentor Session Confirmed",
    message: "Prof. Rahul Kumar confirmed your mentoring session for Monday at 4:30 PM in Room 204.",
    time: "2d ago",
    type: "feedback",
    priority: "medium",
    read: true,
    link: "/find-mentor"
  }
];

const facultyDemoNotifications: CampusNotification[] = [
  {
    id: "notif-fac-1",
    title: "New Student Mentoring Request",
    message: "Arun Kumar (s1) requested a 30-min mentoring session on 'DBMS Normalization & SQL Joins'.",
    time: "20m ago",
    type: "feedback",
    priority: "urgent",
    read: false,
    link: "/faculty/requests"
  },
  {
    id: "notif-fac-2",
    title: "Student Risk Alert: Priya Nair",
    message: "Attendance dropped to 52% in IT 3rd Year DBMS. Early faculty intervention recommended.",
    time: "1h ago",
    type: "intervention",
    priority: "high",
    read: false,
    link: "/faculty/students"
  },
  {
    id: "notif-fac-3",
    title: "Today's Schedule: DBMS Lab",
    message: "Scheduled today at 11:00 AM in Block A, Lab 3 with IT 3rd Year cohort.",
    time: "2h ago",
    type: "resource",
    priority: "medium",
    read: false,
    link: "/faculty/timetable"
  },
  {
    id: "notif-fac-4",
    title: "Student Recovery Follow-up",
    message: "Arun Kumar completed Day 2 of Academic Recovery Plan (+15% quiz accuracy recorded).",
    time: "1d ago",
    type: "recovery",
    priority: "medium",
    read: true,
    link: "/faculty/students"
  }
];

const adminDemoNotifications: CampusNotification[] = [
  {
    id: "notif-adm-1",
    title: "Placement Readiness Vulnerability Alert",
    message: "12 students in B.Tech IT 3rd Year flagged with coding assessment deficit (<55%). Career cell intervention recommended.",
    time: "15m ago",
    type: "admin",
    priority: "urgent",
    read: false,
    link: "/admin/at-risk"
  },
  {
    id: "notif-adm-2",
    title: "Pending Faculty Access Request",
    message: "Dr. Meera N. (AI/DS Dept) submitted faculty registration. Access token verification pending.",
    time: "1h ago",
    type: "security",
    priority: "high",
    read: false,
    link: "/admin"
  },
  {
    id: "notif-adm-3",
    title: "Cohort Risk Escalation: Attendance Debarment",
    message: "4 students in B.Tech IT 3rd Year dropped below 60% attendance threshold this week.",
    time: "3h ago",
    type: "intervention",
    priority: "urgent",
    read: false,
    link: "/admin/at-risk"
  },
  {
    id: "notif-adm-4",
    title: "Urgent Campus Support Ticket",
    message: "Support ticket #TIC-104: Block C Wi-Fi speed degradation escalated to Administration.",
    time: "6h ago",
    type: "system",
    priority: "high",
    read: true,
    link: "/support"
  },
  {
    id: "notif-adm-5",
    title: "7-Stream Student Data Integration Synced",
    message: "Attendance, LMS, examinations, and feedback data pipeline synced with 99.4% health index.",
    time: "1d ago",
    type: "system",
    priority: "low",
    read: true,
    link: "/admin/data-integration"
  }
];

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [filterTab, setFilterTab] = useState<"all" | "unread" | "urgent">("all");
  const { currentUser, activeRole } = useCampus();
  const { settings, updateSettings, playSound } = useSettings();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentRole = currentUser?.role || activeRole || "student";
  const userId = currentUser?.id || `usr_${currentRole}`;
  const isDemo = currentUser?.isDemo !== false;

  // Determine baseline notifications for current user/role
  const baselineNotifications = useMemo(() => {
    if (currentRole === "admin") return adminDemoNotifications;
    if (currentRole === "faculty") return facultyDemoNotifications;
    return studentDemoNotifications;
  }, [currentRole]);

  // Notifications state tied to current user and role
  const [notifications, setNotifications] = useState<CampusNotification[]>(() => {
    const userKey = `campus_notifications_${userId}_${currentRole}`;
    const saved = localStorage.getItem(userKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return baselineNotifications;
  });

  // Sync notifications whenever user ID or role changes
  useEffect(() => {
    const userKey = `campus_notifications_${userId}_${currentRole}`;

    if (isDemo) {
      const saved = localStorage.getItem(userKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setNotifications(parsed);
            return;
          }
        } catch (e) {}
      }
      setNotifications(baselineNotifications);
      localStorage.setItem(userKey, JSON.stringify(baselineNotifications));
      return;
    }

    // Real Supabase user
    fetchNotificationsFromDB(userId).then((dbNotifs) => {
      if (dbNotifs && dbNotifs.length > 0) {
        setNotifications(dbNotifs as CampusNotification[]);
      } else {
        const welcomeNotif: CampusNotification = {
          id: `notif_welcome_${userId}`,
          title: `Welcome to ARIVON AI ${currentRole === "admin" ? "Admin" : currentRole === "faculty" ? "Faculty" : "Student"} Portal!`,
          message: currentRole === "admin"
            ? "Campus overview is active. Review cohort performance and institutional asset status."
            : currentRole === "faculty"
            ? "Your faculty portal is ready. View student risk metrics and timetable."
            : "Your personal learning dashboard is initialized. Start topic missions in Learning Arena.",
          time: "Just now",
          type: "system",
          priority: "high",
          read: false,
          link: currentRole === "admin" ? "/admin" : currentRole === "faculty" ? "/faculty" : "/learning-arena"
        };
        setNotifications([welcomeNotif]);
        localStorage.setItem(userKey, JSON.stringify([welcomeNotif]));
      }
    }).catch(() => {
      setNotifications(baselineNotifications);
    });
  }, [userId, currentRole, isDemo, baselineNotifications]);

  // Save changes to localStorage
  useEffect(() => {
    if (!userId) return;
    const userKey = `campus_notifications_${userId}_${currentRole}`;
    try {
      localStorage.setItem(userKey, JSON.stringify(notifications));
    } catch (e) {}
  }, [notifications, userId, currentRole]);

  // Click outside to close panel
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
  const urgentCount = notifications.filter((n) => n.priority === "urgent" || n.priority === "high").length;

  const filteredNotifications = useMemo(() => {
    if (filterTab === "unread") return notifications.filter((n) => !n.read);
    if (filterTab === "urgent") return notifications.filter((n) => n.priority === "urgent" || n.priority === "high");
    return notifications;
  }, [notifications, filterTab]);

  const toggleOpen = () => {
    if (!isOpen) {
      playSound("notification");
    }
    setIsOpen((prev) => !prev);
  };

  // Click a notification: marks as read, plays sound, navigates to target link, closes dropdown
  const handleNotificationClick = (notif: CampusNotification) => {
    if (!notif.read) {
      markSingleAsRead(notif.id);
    }
    playSound("notification");
    setIsOpen(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  // Mark single item read
  const markSingleAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    if (!isDemo && userId) {
      markNotificationAsReadInDB(id, userId).catch(console.warn);
    }
  };

  // Mark all items read
  const markAllAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    playSound("success");
    if (!isDemo && userId) {
      markAllNotificationsAsReadInDB(userId).catch(console.warn);
    }
  };

  // Dismiss notification
  const dismissNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (!isDemo && userId) {
      deleteNotificationFromDB(id, userId).catch(console.warn);
    }
  };

  const getIcon = (type: CampusNotification["type"], priority?: CampusNotification["priority"]) => {
    if (priority === "urgent") {
      return <AlertTriangle className="w-4 h-4 text-rose-500 animate-pulse" />;
    }
    switch (type) {
      case "quiz":
        return <Calendar className="w-4 h-4 text-amber-500" />;
      case "recovery":
        return <AlertCircle className="w-4 h-4 text-purple-500" />;
      case "resource":
        return <BookOpen className="w-4 h-4 text-sky-500" />;
      case "mission":
        return <Award className="w-4 h-4 text-emerald-500" />;
      case "intervention":
        return <AlertCircle className="w-4 h-4 text-rose-500" />;
      case "feedback":
        return <MessageSquare className="w-4 h-4 text-indigo-500" />;
      case "admin":
        return <Wrench className="w-4 h-4 text-cyan-500" />;
      case "security":
        return <Shield className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-500" />;
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
            className="absolute -top-1 -right-1 px-1.5 min-w-[18px] h-[18px] bg-rose-500 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm animate-pulse"
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-84 sm:w-96 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-white/80 dark:border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
          role="region"
          aria-label="Notifications panel"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                {currentRole === "admin" ? "Admin Alerts" : currentRole === "faculty" ? "Faculty Updates" : "Student Notifications"}
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                title="Mark all notifications as read"
              >
                <Check className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* Filter Tabs (All / Unread / Urgent) */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 text-xs font-semibold">
            <button
              onClick={() => setFilterTab("all")}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                filterTab === "all"
                  ? "bg-indigo-600 text-white shadow-xs font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilterTab("unread")}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                filterTab === "unread"
                  ? "bg-indigo-600 text-white shadow-xs font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilterTab("urgent")}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                filterTab === "urgent"
                  ? "bg-rose-600 text-white shadow-xs font-bold"
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              Urgent ({urgentCount})
            </button>
          </div>

          {/* Muted Warning Banner if Notifications are disabled in Settings */}
          {!settings.pushNotificationsEnabled && (
            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-950/30 border-b border-amber-100 dark:border-amber-900/50 flex items-center justify-between text-xs text-amber-700 dark:text-amber-400">
              <div className="flex items-center gap-2">
                <VolumeX className="w-3.5 h-3.5 shrink-0" />
                <span>Audio cues muted</span>
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
          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 px-4 text-center text-slate-400 dark:text-slate-500">
                <Inbox className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
                  {filterTab === "unread" ? "No unread notifications" : filterTab === "urgent" ? "No urgent alerts" : "All caught up!"}
                </p>
                <p className="text-xs mt-0.5">
                  {filterTab === "all" ? "You have reviewed all campus updates." : "Switch to 'All' to review previous updates."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex items-start gap-3 relative group cursor-pointer border-l-2 ${
                    !notif.read
                      ? "bg-indigo-50/50 dark:bg-indigo-950/25 border-indigo-600 dark:border-indigo-400"
                      : "border-transparent"
                  }`}
                >
                  {/* Icon */}
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    {getIcon(notif.type, notif.priority)}
                  </div>

                  {/* Body Content */}
                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className={`text-xs font-bold truncate ${!notif.read ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                        {notif.title}
                      </p>
                      {notif.priority === "urgent" && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                          Urgent
                        </span>
                      )}
                      {notif.priority === "high" && (
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          High
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed font-medium">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                        {notif.time}
                      </span>
                      {notif.link && (
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline flex items-center gap-0.5">
                          View details <ChevronRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions (Mark Read & Dismiss) */}
                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                    {!notif.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markSingleAsRead(notif.id);
                        }}
                        className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-800 flex items-center justify-center transition-all p-1 cursor-pointer"
                        title="Mark as read"
                        aria-label="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => dismissNotification(notif.id, e)}
                      className="w-6 h-6 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-all p-1 cursor-pointer"
                      title="Dismiss notification"
                      aria-label="Dismiss notification"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 bg-slate-50/80 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/settings");
              }}
              className="text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Configure Notification Channels →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
