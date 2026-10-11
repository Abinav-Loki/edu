import { useState, useEffect } from "react";
import { Search, FileText, ThumbsUp, ThumbsDown, BookOpen, Sparkles, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useCampus } from "../context/CampusContext";
import { isSupabaseConfigured } from "../lib/supabase";
import { saveFeedbackToDB } from "../services/supabaseService";
import { generateGroundedAnswer, GroundedAnswerResponse } from "../services/rag";
import MobileHeader from "../components/MobileHeader";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";

export default function KnowledgePage() {
  const { currentUser, materials } = useCampus();
  
  const [query, setQuery] = useState("What happens if I miss my exam due to illness?");
  const [loading, setLoading] = useState(false);
  const [ragResult, setRagResult] = useState<GroundedAnswerResponse | null>(null);
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    // Initial grounded search on page load
    executeSearch(query);
  }, []);

  async function executeSearch(searchQuery: string) {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    setFeedback(null);

    const titlesMap: Record<string, string> = {};
    materials.forEach(m => { titlesMap[m.id] = m.fileName; });

    const response = await generateGroundedAnswer(searchQuery, {
      studentId: currentUser?.id || "s1",
      materialTitlesMap: titlesMap
    });

    setRagResult(response);
    setLoading(false);
  }

  function handleFeedback(type: "up" | "down") {
    setFeedback(type);
    if (isSupabaseConfigured()) {
      saveFeedbackToDB({
        id: `fb-${Date.now()}`,
        category: "Knowledge Base",
        text: `RAG Query: "${query}" - Feedback: ${type} - Grounded: ${ragResult?.grounded}`,
        createdAt: new Date().toISOString()
      }).catch(console.error);
    }
  }

  return (
    <>
      <MobileHeader />
      <div className="px-4 sm:px-6 lg:px-8 py-5 lg:py-7 mobile-content max-w-3xl mx-auto">
        <PageHeader
          title="University Knowledge Base"
          subtitle="Ask anything from uploaded syllabus notes, policies & course guides"
          badge="Live pgvector RAG"
        />

        {/* Disclaimer */}
        <div
          className="mb-4 px-3.5 py-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-800 font-medium flex items-center justify-between"
          role="note"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Grounded vector retrieval across <strong>{materials.length}</strong> course materials.</span>
          </div>
        </div>

        {/* Search Input */}
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
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && executeSearch(query)}
                placeholder="Ask anything from your university resources..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm bg-white/70 border border-indigo-100 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition min-h-[44px]"
                aria-label="Search university knowledge base"
              />
            </div>
            <button
              onClick={() => executeSearch(query)}
              disabled={loading}
              className="btn-primary !rounded-xl min-w-[70px] flex items-center justify-center gap-1.5"
              aria-label="Search"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ask RAG"}
            </button>
          </div>

          {/* Suggestion pills */}
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              "What are the attendance requirements?",
              "DBMS Normalization steps and rules",
              "SQL Joins and multi-table queries",
            ].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => {
                  setQuery(suggestion);
                  executeSearch(suggestion);
                }}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition border border-indigo-100 min-h-[32px]"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Loading State */}
        {loading && (
          <GlassCard className="p-8 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-sm font-bold text-slate-700">Searching pgvector database for relevant passages...</p>
            <p className="text-xs text-slate-400">Generating 768d query embedding & performing vector cosine similarity search</p>
          </GlassCard>
        )}

        {/* Answer Result */}
        {!loading && ragResult && (
          <div className="space-y-4">
            {/* Question echo */}
            <div className="flex items-start gap-2">
              <Search className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-sm text-slate-600 italic">"{query}"</p>
            </div>

            {/* Answer card */}
            <GlassCard aria-label="Answer">
              <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg primary-gradient flex items-center justify-center">
                    <BookOpen className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    Grounded AI Answer
                  </p>
                </div>
                {ragResult.grounded ? (
                  <span className="text-[11px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Grounded in Materials
                  </span>
                ) : (
                  <span className="text-[11px] font-bold bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> No Direct Passages
                  </span>
                )}
              </div>

              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {ragResult.answer}
              </div>
            </GlassCard>

            {/* Source Citations List */}
            {ragResult.sources && ragResult.sources.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Verifiable Source Passages ({ragResult.sources.length})
                </h3>

                <div className="space-y-2">
                  {ragResult.sources.map((src, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-indigo-100 bg-white shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          {src.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            Page {src.pageNumber}
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                            {(src.similarity * 100).toFixed(0)}% match
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-serif leading-relaxed">
                        "{src.excerpt}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback */}
            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-slate-500 font-medium">
                Was this answer helpful?
              </span>
              <button
                onClick={() => handleFeedback("up")}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition min-h-[36px] ${
                  feedback === "up"
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "bg-white/70 text-slate-500 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
                aria-label="Mark as helpful"
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
              >
                <ThumbsDown className="w-3.5 h-3.5" aria-hidden="true" />
                👎
              </button>
              {feedback && (
                <span className="text-xs text-slate-400">
                  {feedback === "up" ? "Thanks for your feedback!" : "We'll improve retrieval."}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
