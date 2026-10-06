import { useState } from "react";
import { CheckCircle2, ArrowRight, ChevronRight } from "lucide-react";
import { quizQuestions } from "../data/mock";
import { useLearning } from "../context/LearningContext";
import MobileHeader from "../components/MobileHeader";
import GlassCard from "../components/GlassCard";
import { useNavigate } from "react-router-dom";

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const { completeQuiz } = useLearning();
  const navigate = useNavigate();

  const question = quizQuestions[currentIndex];
  const totalQuestions = quizQuestions.length;

  function handleNext() {
    const isCorrect = question.options.find(o => o.id === selectedId)?.correct;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedId(null);
      setShowExplanation(false);
    } else {
      if (typeof completeQuiz === "function") {
        completeQuiz(question.topic, newScore, totalQuestions);
      }
      navigate('/learning-arena');
    }
  }

  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-slate-800">Adaptive Quiz</h1>
          <p className="text-sm text-slate-500 mt-0.5">Based on your weak topics</p>

          {/* Tags + progress */}
          <div className="flex items-center justify-between mt-3 gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="badge-pill bg-indigo-50 text-indigo-700 border border-indigo-100">
                {question.topic}
              </span>
              <span
                className={`badge-pill ${
                  question.difficulty === "medium"
                    ? "badge-medium"
                    : question.difficulty === "hard"
                    ? "badge-high"
                    : "badge-low"
                }`}
              >
                {question.difficulty.charAt(0).toUpperCase() +
                  question.difficulty.slice(1)}
              </span>
            </div>
            <span className="text-sm font-semibold text-slate-600">
              {currentIndex + 1} / {totalQuestions}
            </span>
          </div>

          {/* Progress bar */}
          <div className="progress-bar-track mt-3" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={totalQuestions}>
            <div
              className="progress-bar-fill primary-gradient"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question card */}
        <GlassCard className="mb-4">
          <p className="text-base font-semibold text-slate-800 leading-relaxed">
            {question.question}
          </p>
        </GlassCard>

        {/* Options */}
        <div className="space-y-3 mb-5" role="radiogroup" aria-label="Answer options">
          {question.options.map((option) => {
            const isSelected = selectedId === option.id;
            return (
              <button
                key={option.id}
                onClick={() => {
                  setSelectedId(option.id);
                  setShowExplanation(false);
                }}
                className={`quiz-option w-full text-left${isSelected ? " selected" : ""}`}
                role="radio"
                aria-checked={isSelected}
                aria-label={`Option ${option.label}: ${option.text}`}
              >
                <div className={`option-label${isSelected ? " !bg-emerald-500 !text-white" : ""}`}>
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    option.label
                  )}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isSelected ? "text-emerald-800" : "text-slate-700"
                  }`}
                >
                  {option.text}
                </span>
              </button>
            );
          })}
        </div>

        {/* Explanation toggle */}
        {selectedId && (
          <button
            onClick={() => setShowExplanation((s) => !s)}
            className="w-full text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 mb-4 min-h-[44px] transition"
          >
            <ChevronRight
              className={`w-4 h-4 transition-transform ${showExplanation ? "rotate-90" : ""}`}
              aria-hidden="true"
            />
            {showExplanation ? "Hide" : "Show"} Explanation
          </button>
        )}

        {showExplanation && (
          <GlassCard className="mb-4 border-l-4 border-indigo-400 !rounded-xl">
            <p className="text-sm text-slate-700 leading-relaxed">
              {question.explanation}
            </p>
          </GlassCard>
        )}

        {/* CTA */}
        <button
          onClick={handleNext}
          disabled={!selectedId || currentIndex === totalQuestions - 1}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Next question"
        >
          {currentIndex === totalQuestions - 1 ? "Finish Quiz" : "Next"}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </>
  );
}
