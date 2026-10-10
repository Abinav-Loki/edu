import { useState } from "react";
import { Search, FileText, ExternalLink, ThumbsUp, ThumbsDown, BookOpen } from "lucide-react";
import { knowledgeAnswer } from "../data/mock";
import { isSupabaseConfigured } from "../lib/supabase";
import { saveFeedbackToDB } from "../services/supabaseService";
import MobileHeader from "../components/MobileHeader";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";

export default function KnowledgePage() {
  const [query, setQuery] = useState(knowledgeAnswer.query);
  const [showAnswer, setShowAnswer] = useState(true);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  function handleFeedback(type: "up" | "down") {
    setFeedback(type);
    if (isSupabaseConfigured()) {
      saveFeedbackToDB({
        id: `fb-${Date.now()}`,
        category: "Knowledge Base",
        text: `Knowledge query: "${query}" - Feedback: ${type}`,
        createdAt: new Date().toISOString()
      }).catch(console.error);
    }
  }

  function handleSearch() {
    if (query.trim()) setShowAnswer(true);
  }

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-3xl mx-auto">
        <PageHeader
          title="University Knowledge"
          subtitle="Ask anything from your syllabus, policies & guides"
          badge="RAG-Powered"
        />

        {/* Disclaimer */}
        <div
          className="mb-4 px-3 py-2 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-700 font-medium"
          role="note"
        >
          ⚠️ {knowledgeAnswer.disclaimer}
        </div>

        {/* Search */}
        <GlassCard className="mb-5">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowAnswer(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Ask anything from your university resources..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-white/70 border border-indigo-100 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition min-h-[44px]"
                aria-label="Search university knowledge base"
              />
            </div>
            <button
              onClick={handleSearch}
              className="btn-primary !rounded-xl"
              aria-label="Search"
            >
              Ask
            </button>
          </div>

          {/* Suggestion pills */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "What are the attendance requirements?",
              "How to apply for a re-evaluation?",
              "Scholarship eligibility criteria",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setQuery(suggestion);
                  setShowAnswer(false);
                }}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition border border-indigo-100 min-h-[32px]"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Answer */}
        {showAnswer && (
          <div className="space-y-4">
            {/* Question echo */}
            <div className="flex items-start gap-2">
              <Search className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-slate-600 italic">"{query}"</p>
            </div>

            {/* Answer card */}
            <GlassCard aria-label="Answer">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg primary-gradient flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  Here's what I found:
                </p>
              </div>

              <ol className="space-y-3" role="list">
                {knowledgeAnswer.answer.map((step, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed"
                  >
                    <span
                      className="w-5 h-5 rounded-full primary-gradient flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </GlassCard>

            {/* Source card */}
            <div
              className="flex items-center justify-between gap-3 p-4 rounded-xl border-2 border-indigo-100 bg-indigo-50/50"
              role="region"
              aria-label="Source document"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-white border border-indigo-100 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 truncate">
                    {knowledgeAnswer.source.filename}
                  </p>
                  <p className="text-xs text-slate-500">
                    Page {knowledgeAnswer.source.page} • Section{" "}
                    {knowledgeAnswer.source.section}
                  </p>
                </div>
              </div>
              <button
                className="btn-secondary !px-3 !py-2 !text-xs shrink-0 flex items-center gap-1.5"
                aria-label="View source document"
              >
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                View Document
              </button>
            </div>

            {/* Feedback */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Was this helpful?
              </span>
              <button
                onClick={() => handleFeedback("up")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition min-h-[36px] ${
                  feedback === "up"
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-white/70 text-slate-500 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
                aria-label="Mark as helpful"
                aria-pressed={feedback === "up"}
              >
                <ThumbsUp className="w-3.5 h-3.5" aria-hidden="true" />
                👍
              </button>
              <button
                onClick={() => handleFeedback("down")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition min-h-[36px] ${
                  feedback === "down"
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-white/70 text-slate-500 border border-slate-200 hover:bg-red-50 hover:text-red-600"
                }`}
                aria-label="Mark as not helpful"
                aria-pressed={feedback === "down"}
              >
                <ThumbsDown className="w-3.5 h-3.5" aria-hidden="true" />
                👎
              </button>
              {feedback && (
                <span className="text-xs text-slate-400">
                  {feedback === "up" ? "Thanks for the feedback!" : "We'll improve this."}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
