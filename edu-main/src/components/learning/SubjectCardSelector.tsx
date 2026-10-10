import { Database, Binary, Cpu, Network, Sparkles, ChevronRight, Play } from "lucide-react";
import { subjectWorlds, UserProgressState } from "../../data/learningArenaData";

export interface SubjectCardSelectorProps {
  activeSubjectId: string;
  onSelectSubject: (subjectId: string) => void;
  onExploreMap: (subjectId: string) => void;
  userProgress: UserProgressState;
}

const iconMap: Record<string, any> = {
  Database,
  Binary,
  Cpu,
  Network,
};

export default function SubjectCardSelector({
  activeSubjectId,
  onSelectSubject,
  onExploreMap,
  userProgress,
}: SubjectCardSelectorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-500" />
            Your Learning Worlds
          </h2>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            Choose a subject to explore its interactive learning map and level up!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjectWorlds.map((subject) => {
          const IconComponent = iconMap[subject.iconName] || Database;
          const isSelected = activeSubjectId === subject.id;
          
          // Calculate completed topics
          const completedIds = userProgress.completedTopicIds[subject.id] || [];
          const completedCount = completedIds.length;
          const totalCount = subject.topics.length;
          const progressPercent = Math.round((completedCount / totalCount) * 100);

          // Find current mission topic
          const currentTopicId = userProgress.currentMissionTopicId[subject.id];
          const currentTopic = subject.topics.find((t) => t.id === currentTopicId) || subject.topics[0];

          return (
            <div
              key={subject.id}
              onClick={() => onSelectSubject(subject.id)}
              className={`glass-card p-5 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? "border-sky-400 dark:border-sky-600 bg-white/90 dark:bg-slate-900/90 shadow-xl shadow-sky-500/10 ring-2 ring-sky-400/50"
                  : "border-white/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 hover:border-sky-300 hover:shadow-lg"
              }`}
            >
              <div>
                {/* Header: Icon & Short Title */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105"
                      style={{ background: `linear-gradient(135deg, ${subject.colorTheme.primary}, #6366F1)` }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">
                        {subject.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                        {completedCount} / {totalCount} Topics
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="my-3">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                    <span>Progress</span>
                    <span className="text-sky-600 dark:text-sky-400">{progressPercent}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: subject.colorTheme.primary,
                      }}
                    />
                  </div>
                </div>

                {/* Current Mission Subtitle */}
                <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 my-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Current Focus:
                  </span>
                  <span className="font-bold text-slate-700 dark:text-slate-200 block truncate mt-0.5">
                    {currentTopic ? currentTopic.title : "Completed!"}
                  </span>
                </div>
              </div>

              {/* Footer Button: Explore Map */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExploreMap(subject.id);
                }}
                className="w-full mt-3 py-2.5 px-4 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 group/btn"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>EXPLORE MAP</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
