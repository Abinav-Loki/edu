import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { weakTopics as defaultWeakTopics, type Priority } from "../data/mock";
import { useCampus } from "../context/CampusContext";

const priorityConfig: Record<
  Priority,
  { label: string; className: string; dot: string; progressColor: string }
> = {
  high: {
    label: "High Priority",
    className: "badge-pill badge-high bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-500",
    progressColor: "#EF4444"
  },
  medium: {
    label: "Medium",
    className: "badge-pill badge-medium bg-amber-50 text-amber-600 border-amber-200",
    dot: "bg-amber-500",
    progressColor: "#F59E0B"
  },
  low: {
    label: "Needs Practice",
    className: "badge-pill badge-low bg-emerald-50 text-emerald-600 border-emerald-200",
    dot: "bg-emerald-500",
    progressColor: "#10B981"
  },
};

// Generating a pseudo-random progress value based on string length to simulate real data
const getProgress = (str: string) => 40 + (str.length * 3) % 40;

export default function WeakTopics() {
  const { currentUser, students } = useCampus();
  const currentStudent = (currentUser?.role === "student" ? (currentUser as any) : null) || students.find(s => s.id === currentUser?.id) || students[0];

  const topics = currentStudent?.weakTopics && currentStudent.weakTopics.length > 0
    ? currentStudent.weakTopics.map((name: string, i: number) => ({
        id: `wt-${i}`,
        name,
        priority: (i === 0 ? "high" : i === 1 ? "medium" : "low") as Priority
      }))
    : defaultWeakTopics;

  return (
    <div className="glass-card p-6 border-white/60 bg-white/40" aria-label="Weak topics requiring attention">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Weak Topics</h2>
          <p className="text-sm text-slate-500 font-medium">Topics that need more attention</p>
        </div>
        <Link
          to="/progress"
          className="flex items-center gap-1 text-sm font-bold text-sky-600 hover:text-sky-700 transition"
          aria-label="View all weak topics"
        >
          View All
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="space-y-3">
        {topics.map((topic: { id: string; name: string; priority: Priority }) => {
          const config = priorityConfig[topic.priority];
          const progress = getProgress(topic.name);
          return (
            <div
              key={topic.id}
              className="p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/80 hover:bg-white/80 transition-all shadow-sm hover:shadow-md hover:-translate-y-[1px]"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {topic.name}
                  </p>
                </div>
                <span className={config.className} aria-label={`Priority: ${config.label}`}>
                  {config.label}
                </span>
              </div>
              
              {/* Progress Indicator */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progress}%`, backgroundColor: config.progressColor }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-600">{progress}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
