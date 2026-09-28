import { useState } from "react";
import { CheckCircle2, Circle, Play, BookOpen, HelpCircle, RotateCcw, Target } from "lucide-react";
import { recoveryPlan } from "../data/mock";
import MobileHeader from "../components/MobileHeader";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";

const taskTypeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  Video: { icon: <Play className="w-3.5 h-3.5" />, color: "text-indigo-600 bg-indigo-50" },
  Quiz: { icon: <HelpCircle className="w-3.5 h-3.5" />, color: "text-violet-600 bg-violet-50" },
  Reading: { icon: <BookOpen className="w-3.5 h-3.5" />, color: "text-sky-600 bg-sky-50" },
  Revision: { icon: <RotateCcw className="w-3.5 h-3.5" />, color: "text-emerald-600 bg-emerald-50" },
};

export default function RecoveryPlanPage() {
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    new Set(
      recoveryPlan.dailyTasks
        .filter((t) => t.completed)
        .map((t) => t.id)
    )
  );

  function toggleTask(id: string) {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const completedCount = completedIds.size;
  const totalTasks = recoveryPlan.dailyTasks.length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-3xl mx-auto">
        <PageHeader
          title="Recovery Plan"
          subtitle={`Day ${recoveryPlan.currentDay} of ${recoveryPlan.days}`}
          badge="7-Day Plan"
        />

        {/* Progress overview card */}
        <GlassCard className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Today's Progress
              </p>
              <p className="text-2xl font-bold text-slate-800 mt-0.5">
                {completedCount} / {totalTasks} tasks
              </p>
            </div>
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: `conic-gradient(#6366F1 ${progressPercent * 3.6}deg, rgba(99,102,241,0.1) 0deg)`,
              }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`${progressPercent}% complete`}
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xs font-bold text-indigo-600">
                {progressPercent}%
              </div>
            </div>
          </div>

          <div className="progress-bar-track">
            <div
              className="progress-bar-fill primary-gradient"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-xs text-slate-400 mt-2">
            Focus: {recoveryPlan.focus}
          </p>
        </GlassCard>

        {/* Today's tasks */}
        <GlassCard className="mb-5">
          <h2 className="text-base font-bold text-slate-800 mb-4">
            Today's Tasks
          </h2>
          <div className="space-y-3">
            {recoveryPlan.dailyTasks.map((task) => {
              const isCompleted = completedIds.has(task.id);
              const typeConf = taskTypeConfig[task.type];

              return (
                <button
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition ${
                    isCompleted
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-transparent bg-white/60 hover:border-indigo-100 hover:bg-white/80"
                  }`}
                  aria-pressed={isCompleted}
                  aria-label={`${task.title} — ${isCompleted ? "completed" : "not completed"}`}
                  style={{ minHeight: "56px" }}
                >
                  {/* Check icon */}
                  <div className="shrink-0">
                    {isCompleted ? (
                      <CheckCircle2
                        className="w-5 h-5 text-emerald-500"
                        aria-hidden="true"
                      />
                    ) : (
                      <Circle
                        className="w-5 h-5 text-slate-300"
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  {/* Task type badge */}
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${typeConf.color}`}
                    aria-hidden="true"
                  >
                    {typeConf.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold leading-snug ${
                        isCompleted ? "line-through text-slate-400" : "text-slate-800"
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {task.type} • {task.duration}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* CTA */}
          <button
            className="btn-primary w-full mt-5"
            aria-label="Mark all remaining tasks as complete"
            onClick={() =>
              setCompletedIds(new Set(recoveryPlan.dailyTasks.map((t) => t.id)))
            }
          >
            <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
            Mark as Complete
          </button>
        </GlassCard>

        {/* Weekly goals */}
        <GlassCard>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-indigo-600" aria-hidden="true" />
            <h2 className="text-base font-bold text-slate-800">Weekly Goals</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Topics", value: recoveryPlan.weeklyGoals.topics, color: "#6366F1" },
              { label: "Quizzes", value: recoveryPlan.weeklyGoals.quizzes, color: "#8B5CF6" },
              { label: "Assignment", value: recoveryPlan.weeklyGoals.assignments, color: "#38bdf8" },
            ].map((g) => (
              <div
                key={g.label}
                className="flex flex-col items-center p-3 rounded-xl bg-white/60 border border-white/80"
              >
                <span
                  className="text-2xl font-bold"
                  style={{ color: g.color }}
                >
                  {g.value}
                </span>
                <span className="text-xs text-slate-500 font-medium mt-0.5">
                  {g.label}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </>
  );
}
