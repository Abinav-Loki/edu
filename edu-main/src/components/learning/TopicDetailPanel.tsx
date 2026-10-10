import { X, Clock, Star, Lock, Play, CheckCircle2, Award, Zap } from "lucide-react";
import { TopicNode, TopicStatus } from "../../data/learningArenaData";

export interface TopicDetailPanelProps {
  topic: TopicNode | null;
  status: TopicStatus;
  onClose: () => void;
  onStartMission: (topic: TopicNode) => void;
}

export default function TopicDetailPanel({
  topic,
  status,
  onClose,
  onStartMission,
}: TopicDetailPanelProps) {
  if (!topic) return null;

  const isLocked = status === "LOCKED";
  const isCompleted = status === "COMPLETED";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-white/80 dark:border-slate-800 p-6 shadow-2xl overflow-hidden">
        {/* Top Glow Accent */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
              isCompleted
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                : isLocked
                ? "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                : "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : isLocked ? (
              <Lock className="w-3.5 h-3.5" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-amber-500" />
            )}
            <span>{status}</span>
          </span>
          <span className="text-xs font-semibold text-slate-400">
            Difficulty: {topic.difficulty}
          </span>
        </div>

        {/* Title & Description */}
        <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight mb-2">
          {topic.title}
        </h2>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          {topic.description}
        </p>

        {/* Metrics Grid (Time, XP, Missions) */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800 text-center">
            <Clock className="w-5 h-5 text-sky-500 mx-auto mb-1" />
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Est. Time</span>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{topic.estimatedMinutes} min</span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 text-center">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500 mx-auto mb-1" />
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase block">Reward</span>
            <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300">+{topic.xp} XP</span>
          </div>

          <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 text-center">
            <Award className="w-5 h-5 text-purple-500 mx-auto mb-1" />
            <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase block">Missions</span>
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300">{topic.missions.length} Quiz</span>
          </div>
        </div>

        {/* Mission Preview Box */}
        {topic.missions.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-sky-50/80 dark:bg-slate-800/60 border border-sky-100 dark:border-slate-700">
            <h4 className="text-xs font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wide mb-1">
              Active Mission Goal:
            </h4>
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
              {topic.missions[0].description} ({topic.missions[0].questions.length} questions)
            </p>
          </div>
        )}

        {/* Action Button */}
        {isLocked ? (
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs font-semibold text-center flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            <span>Complete prerequisite topics to unlock this mission.</span>
          </div>
        ) : (
          <button
            onClick={() => onStartMission(topic)}
            className="w-full py-3.5 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-sm shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2 group"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isCompleted ? "Replay Mission" : "Start Mission"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
