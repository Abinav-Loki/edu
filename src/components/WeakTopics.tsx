import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { weakTopics, type Priority } from "../data/mock";
import GlassCard from "./GlassCard";

const priorityConfig: Record<
  Priority,
  { label: string; className: string; dot: string }
> = {
  high: {
    label: "High Priority",
    className: "badge-pill badge-high",
    dot: "bg-red-400",
  },
  medium: {
    label: "Medium",
    className: "badge-pill badge-medium",
    dot: "bg-amber-400",
  },
  low: {
    label: "Low",
    className: "badge-pill badge-low",
    dot: "bg-emerald-400",
  },
};

export default function WeakTopics() {
  return (
    <GlassCard as="section" aria-label="Weak topics requiring attention">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-800">Weak Topics</h2>
        <Link
          to="/progress"
          className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
          aria-label="View all weak topics"
        >
          View All
          <ArrowRight className="w-3 h-3" aria-hidden="true" />
        </Link>
      </div>

      <div className="space-y-3">
        {weakTopics.map((topic) => {
          const config = priorityConfig[topic.priority];
          return (
            <div
              key={topic.id}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/50 border border-white/70 hover:bg-white/70 transition"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${config.dot}`}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {topic.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {topic.subject}
                  </p>
                </div>
              </div>
              <span className={config.className} aria-label={`Priority: ${config.label}`}>
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
