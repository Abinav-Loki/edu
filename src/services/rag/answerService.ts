import { isSupabaseConfigured, authGetSession } from "../../lib/supabase";
import { GroundedAnswerResponse } from "./types";

/**
 * Grounded Answer Generation via Authenticated Server-Side Edge Function (rag-search)
 * Strictly enforces server-side Gemini embeddings and pgvector retrieval.
 * No client-side Gemini API key exposure or localStorage vector fallbacks.
 */
export async function generateGroundedAnswer(
  question: string,
  options?: {
    studentId?: string;
    subject?: string;
    materialId?: string;
    materialTitlesMap?: Record<string, string>;
  }
): Promise<GroundedAnswerResponse> {
  const { subject = "", materialId } = options || {};

  if (!question || question.trim().length === 0) {
    return {
      answer: "Please enter a valid question to search your course materials.",
      sources: [],
      grounded: false,
      retrievalStatus: "no_passages_found"
    };
  }

  if (isSupabaseConfigured()) {
    try {
      const session = await authGetSession();
      const token = session?.access_token || "";

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
      const edgeFunctionUrl = `${supabaseUrl}/functions/v1/rag-search`;

      // Invoke Server-Side Supabase Edge Function rag-search
      const res = await fetch(edgeFunctionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify({
          question,
          subject,
          materialId,
          topK: 4,
          matchThreshold: 0.22
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.grounded && data.sources && data.sources.length > 0) {
          return {
            answer: data.answer || "Response generated from retrieved context.",
            sources: data.sources || [],
            grounded: true,
            retrievalStatus: data.retrievalStatus || "success"
          };
        }
      }
    } catch (err: any) {
      console.warn("[RAG Server Search Notice] Edge function search notice:", err);
    }
  }

  return {
    answer: `I couldn't find enough information about this in your selected course material.`,
    sources: [],
    grounded: false,
    retrievalStatus: "no_passages_found"
  };
}
