import {
  CheckCircle2,
  BookOpen,
  AlertTriangle,
  Bot,
  Clock,
} from "lucide-react";
import { recentActivity, type Activity } from "../data/mock";

const activityConfig: Record<
  Activity["type"],
  { icon: React.ReactNode; color: string; bg: string; border: string }
> = {
  quiz: {
    icon: <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200"
  },
  study: {
    icon: <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />,
    color: "text-sky-500",
    bg: "bg-sky-50",
    border: "border-sky-200"
  },
  assignment: {
    icon: <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200"
  },
  tutor: {
    icon: <Bot className="w-3.5 h-3.5" aria-hidden="true" />,
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    border: "border-indigo-200"
  },
};

const detailColorMap: Record<string, string> = {
  Late: "text-red-500",
  "AI Tutor": "text-indigo-500",
};

export default function RecentActivity() {
  return (
    <div className="glass-card p-6 border-white/60 bg-white/40" aria-label="Recent activity">
      <h2 className="text-lg font-bold text-slate-800 mb-6">
        Recent Activity
      </h2>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-px bg-slate-200/60" aria-hidden="true" />
        
        <div className="space-y-6 relative">
          {recentActivity.map((item) => {
            const config = activityConfig[item.type];
            const detailColor = detailColorMap[item.detail] ?? "text-slate-500";

            return (
              <div key={item.id} className="flex gap-4 group">
                <div className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full ${config.bg} ${config.color} ${config.border} border-2 flex items-center justify-center shrink-0 shadow-sm shadow-black/5 group-hover:scale-110 transition-transform`}
                    aria-hidden="true"
                  >
                    {config.icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm font-semibold text-slate-700 leading-snug">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-bold ${detailColor}`}>
                      {item.detail}
                    </span>
                    <span className="text-slate-300" aria-hidden="true">•</span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {item.time}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
