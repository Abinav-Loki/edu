import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, AlertCircle, BookOpen, ClipboardList, Target } from "lucide-react";
import { calendarEvents as initialCalendarEvents } from "../data/mock";
import { useCampus } from "../context/CampusContext";
import { isSupabaseConfigured } from "../lib/supabase";
import { fetchCalendarEventsFromDB } from "../services/supabaseService";
import MobileHeader from "../components/MobileHeader";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";

const eventTypeConfig: Record<
  string,
  { color: string; bg: string; icon: React.ReactNode; label: string }
> = {
  quiz: { color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", icon: <BookOpen className="w-3.5 h-3.5" />, label: "Quiz" },
  assignment: { color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: <ClipboardList className="w-3.5 h-3.5" />, label: "Assignment" },
  exam: { color: "text-red-700", bg: "bg-red-50 border-red-200", icon: <AlertCircle className="w-3.5 h-3.5" />, label: "Exam" },
  plan: { color: "text-violet-700", bg: "bg-violet-50 border-violet-200", icon: <Target className="w-3.5 h-3.5" />, label: "Plan" },
};

// Simple calendar grid for October 2026
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const OCT_START_DAY = 4; // Oct 1, 2026 is a Thursday (index 4)
const OCT_DAYS = 31;

export default function CalendarPage() {
  const { currentUser } = useCampus();
  const [events, setEvents] = useState<any[]>(initialCalendarEvents);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchCalendarEventsFromDB(currentUser?.id).then(dbEvents => {
        if (dbEvents && dbEvents.length > 0) {
          setEvents(dbEvents);
        }
      }).catch(console.error);
    }
  }, [currentUser?.id]);

  const eventDates = new Set(events.map((e) => parseInt(e.date?.split("-")?.[2] || "0")));
  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content">
        <PageHeader
          title="Calendar"
          subtitle="Upcoming deadlines and study sessions"
          badge="October 2026"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Calendar grid */}
          <GlassCard className="lg:col-span-2">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800">October 2026</h2>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-lg bg-white/70 border border-white/80 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition" aria-label="Previous month">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-lg bg-white/70 border border-white/80 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition" aria-label="Next month">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells before start */}
              {Array.from({ length: OCT_START_DAY }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {/* Days */}
              {Array.from({ length: OCT_DAYS }, (_, i) => i + 1).map((day) => {
                const hasEvent = eventDates.has(day);
                const isToday = day === 1; // mock today
                return (
                  <button
                    key={day}
                    className={`relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium transition min-h-[36px] ${
                      isToday
                        ? "primary-gradient text-white shadow-sm"
                        : hasEvent
                        ? "bg-indigo-50 text-indigo-800 border border-indigo-100"
                        : "text-slate-700 hover:bg-white/80"
                    }`}
                    aria-label={`October ${day}${hasEvent ? " — has events" : ""}${isToday ? " — today" : ""}`}
                  >
                    {day}
                    {hasEvent && !isToday && (
                      <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-indigo-500" aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          </GlassCard>

          {/* Upcoming events */}
          <GlassCard>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-indigo-600" aria-hidden="true" />
              <h2 className="text-base font-bold text-slate-800">Upcoming</h2>
            </div>

            <div className="space-y-3">
              {events.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No upcoming events scheduled.</p>
              ) : (
                events
                  .slice()
                  .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
                  .map((event) => {
                    const conf = eventTypeConfig[event.type] || eventTypeConfig.plan;
                    const date = new Date(event.date);
                    return (
                      <div
                        key={event.id}
                        className={`flex items-start gap-3 p-3 rounded-xl border ${conf.bg}`}
                        role="listitem"
                        aria-label={`${event.title} on ${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${event.time}`}
                      >
                        <div className={`${conf.color} mt-0.5`} aria-hidden="true">
                          {conf.icon}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-xs font-bold uppercase tracking-wide ${conf.color} mb-0.5`}>
                            {conf.label}
                          </p>
                          <p className="text-sm font-semibold text-slate-800 leading-snug">
                            {event.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {date.toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {event.time}
                          </p>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}
