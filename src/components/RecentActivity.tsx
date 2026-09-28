import {
  CheckCircle2,
  BookOpen,
  FileText,
  MessageCircle,
  Clock,
} from "lucide-react";
import { recentActivity, type Activity } from "../data/mock";
import GlassCard from "./GlassCard";

const activityConfig: Record<
  Activity["type"],
  { icon: React.ReactNode; color: string; bg: string }
> = {
  quiz: {
    icon: <CheckCircle2 className="w-4 h-4" aria-hidden="true" />,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  study: {
    icon: <BookOpen className="w-4 h-4" aria-hidden="true" />,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  assignment: {
    icon: <FileText className="w-4 h-4" aria-hidden="true" />,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  tutor: {
    icon: <MessageCircle className="w-4 h-4" aria-hidden="true" />,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
};

const detailColorMap: Record<string, string> = {
  Late: "text-red-500",
  "AI Tutor": "text-violet-600",
};

export default function RecentActivity() {
  return (
    <GlassCard as="section" aria-label="Recent activity">
      <h2 className="text-base font-bold text-slate-800 mb-4">
        Recent Activity
      </h2>

      <div className="space-y-3">
        {recentActivity.map((item) => {
          const config = activityConfig[item.type];
          const detailColor =
            detailColorMap[item.detail] ?? "text-slate-500";

          return (
            <div
              key={item.id}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/50 border border-white/70 hover:bg-white/70 transition"
            >
              <div
                className={`w-8 h-8 rounded-lg ${config.bg} ${config.color} flex items-center justify-center shrink-0`}
                aria-hidden="true"
              >
                {config.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 leading-snug">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-xs font-semibold ${detailColor}`}>
                    {item.detail}
                  </span>
                  <span className="text-slate-300" aria-hidden="true">•</span>
                  <span className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" aria-hidden="true" />
                    {item.time}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
