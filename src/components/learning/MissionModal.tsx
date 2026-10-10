import { useState } from "react";
import { X, CheckCircle2, AlertCircle, ArrowRight, Star, Sparkles, Trophy } from "lucide-react";
import { TopicNode, MissionQuestion } from "../../data/learningArenaData";

export interface MissionModalProps {
  topic: TopicNode;
  onClose: () => void;
  onCompleteMission: (topicId: string, xpEarned: number) => void;
}

export default function MissionModal({
  topic,
  onClose,
  onCompleteMission,
}: MissionModalProps) {
  const mission = topic.missions[0] || {
    id: "default-m",
    title: topic.title,
    description: topic.description,
    questions: [
      {
        id: "q1",
        question: `What is the primary concept behind ${topic.title}?`,
        options: ["Core execution model", "Theoretical foundation", "All of the above", "None"],
        correctIndex: 2,
        explanation: "Mastering foundational concepts provides comprehensive knowledge.",
      },
    ],
  };

  const questions: MissionQuestion[] = mission.questions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleFinish = () => {
    onCompleteMission(topic.id, topic.xp);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-white/80 dark:border-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Top Glow Accent */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {!isFinished ? (
          <div>
            {/* Header: Mission Step Indicator */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  Mission: {topic.title}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-400">
                Question {currentIndex + 1} of {questions.length}
              </span>
            </div>

            {/* Step Progress Bar */}
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 leading-snug">
              {currentQuestion.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctIndex;
                
                let optionStyle = "border-slate-200 dark:border-slate-800 hover:border-sky-300 bg-slate-50/60 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200";
                if (isAnswered) {
                  if (isCorrect) {
                    optionStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-400/50";
                  } else if (isSelected) {
                    optionStyle = "border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 ring-2 ring-rose-400/50";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && (
                      isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : isSelected ? (
                        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      ) : null
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback Explanation & Next Button */}
            {isAnswered && (
              <div className="mb-6 p-4 rounded-2xl bg-sky-50 dark:bg-slate-800/80 border border-sky-100 dark:border-slate-700 animate-[fadeIn_0.2s_ease-out]">
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {isAnswered && (
              <button
                onClick={handleNext}
                className="w-full py-3.5 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>{currentIndex + 1 < questions.length ? "Next Question" : "Complete Mission"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          /* MISSION COMPLETE SCREEN */
          <div className="text-center py-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-950/80 border border-amber-200 flex items-center justify-center mx-auto mb-4 text-amber-500 shadow-xl shadow-amber-500/20">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 font-extrabold text-xs mb-2 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5" />
              MISSION COMPLETE!
            </div>

            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              {topic.title} Mastered!
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">
              You scored {score} out of {questions.length} questions correctly and unlocked the next path!
            </p>

            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-black text-lg shadow-lg shadow-orange-500/30 mb-8">
              <Star className="w-6 h-6 fill-white" />
              <span>+{topic.xp} XP EARNED!</span>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-3.5 px-6 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-sm shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Continue Learning Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
