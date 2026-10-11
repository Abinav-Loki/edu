import { supabase, isSupabaseConfigured, authGetSession } from "../../lib/supabase";
import { DocumentChunk, DocumentSourceCitation, RetrievalResult } from "./types";

/**
 * Vector Cosine Similarity Helper (for unit tests and validation)
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  const len = Math.min(vecA.length, vecB.length);
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < len; i++) {
    dot += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Perform Vector Similarity Search via Authenticated Server-Side Edge Function or Supabase RPC
 */
export async function retrieveRelevantPassages(
  question: string,
  options?: {
    studentId?: string;
    subject?: string;
    topK?: number;
    matchThreshold?: number;
    materialTitlesMap?: Record<string, string>;
  }
): Promise<RetrievalResult> {
  const {
    subject = "",
    topK = 4,
    matchThreshold = 0.22,
    materialTitlesMap = {}
  } = options || {};

  if (!question || question.trim().length === 0) {
    return { chunks: [], citations: [], query: question, status: "success" };
  }

  if (!isSupabaseConfigured()) {
    return {
      chunks: [],
      citations: [],
      query: question,
      status: "infrastructure_unavailable",
      errorMessage: "Supabase database environment variables are not configured in .env"
    };
  }

  try {
    const session = await authGetSession();
    const token = session?.access_token || "";

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
    const edgeFunctionUrl = `${supabaseUrl}/functions/v1/rag-search`;

    // Try server-side Edge Function first
    const res = await fetch(edgeFunctionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
      },
      body: JSON.stringify({
        question,
        subject,
        topK,
        matchThreshold
      })
    });

    if (res.ok) {
      const data = await res.json();
      return {
        chunks: [],
        citations: data.sources || [],
        query: question,
        status: data.retrievalStatus || "success"
      };
    }

    // Direct RPC Fallback if Edge Function is un-deployed
    console.warn(`[RAG Retrieval] Edge Function search response (${res.status}), attempting direct RPC match.`);
    
    // Note: Direct query embedding call is removed from browser to protect Gemini key.
    return {
      chunks: [],
      citations: [],
      query: question,
      status: "infrastructure_unavailable",
      errorMessage: `Server-side vector search function pending deployment (${res.status}).`
    };
  } catch (err: any) {
    console.error("[RAG Retrieval Exception]:", err);
    return {
      chunks: [],
      citations: [],
      query: question,
      status: "error",
      errorMessage: err.message || "Vector retrieval failed."
    };
  }
}
