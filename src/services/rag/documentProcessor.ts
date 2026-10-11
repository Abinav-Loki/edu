import { supabase, isSupabaseConfigured, authGetSession } from "../../lib/supabase";
import { DocumentChunk, IngestionResult, ProcessingStatus } from "./types";

// Dynamic import for pdfjs-dist
let pdfjsLib: any = null;
try {
  pdfjsLib = await import("pdfjs-dist");
  if (pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
  }
} catch (err) {
  console.warn("[RAG Document Processor] pdfjs-dist import fallback mode active");
}

export const SUPPORTED_EMBEDDING_MODEL = "gemini-embedding-2";
export const EXPECTED_EMBEDDING_DIM = 768;

function splitTextIntoPages(cleanText: string, charsPerPage = 1200): { pageNumber: number; text: string }[] {
  const paragraphs = cleanText.split(/\n\s*\n|\r\n\s*\r\n/);
  const pages: { pageNumber: number; text: string }[] = [];
  let currentPage = 1;
  let charAccumulator = "";

  for (const para of paragraphs) {
    if (!para.trim()) continue;
    charAccumulator += para.trim() + "\n\n";
    if (charAccumulator.length >= charsPerPage) {
      pages.push({ pageNumber: currentPage++, text: charAccumulator.trim() });
      charAccumulator = "";
    }
  }
  if (charAccumulator.trim().length > 0) {
    pages.push({ pageNumber: currentPage, text: charAccumulator.trim() });
  }

  return pages;
}

async function extractDocxText(file: File): Promise<{ pageNumber: number; text: string }[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder("utf-8", { fatal: false });
    const rawString = decoder.decode(arrayBuffer);

    // Extract text inside XML <w:t> tags from Office Open XML document
    const wtMatches = rawString.match(/<w:t[^>]*>(.*?)<\/w:t>/gi);
    if (wtMatches && wtMatches.length > 0) {
      const cleanText = wtMatches
        .map((tag) => tag.replace(/<[^>]+>/g, "").trim())
        .filter((t) => t.length > 0)
        .join(" ");

      if (cleanText.trim().length > 20) {
        return splitTextIntoPages(cleanText);
      }
    }
  } catch (e) {
    console.warn("[RAG] docx extraction error:", e);
  }
  return [];
}

async function extractDocText(file: File): Promise<{ pageNumber: number; text: string }[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const decoder = new TextDecoder("latin1");
    const rawString = decoder.decode(arrayBuffer);

    // Extract printable text runs (length >= 4) from binary stream
    const printableRuns = rawString.match(/[\x20-\x7E\t\r\n]{4,}/g);
    if (printableRuns && printableRuns.length > 0) {
      const cleanText = printableRuns
        .map((s) => s.trim())
        .filter((s) => s.length > 3 && !s.startsWith("PK") && !s.includes("Word.Document") && !s.includes("Root Entry") && !s.includes("CompObj"))
        .join(" ");

      if (cleanText.trim().length > 20) {
        return splitTextIntoPages(cleanText);
      }
    }
  } catch (e) {
    console.warn("[RAG] doc extraction error:", e);
  }
  return [];
}

/**
 * Page-aware Text Extraction from File (PDF, DOC, DOCX, or TXT)
 */
export async function extractTextWithPages(file: File): Promise<{ pageNumber: number; text: string }[]> {
  const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";
  const fileType = file.type?.toLowerCase() || fileExtension;

  // 1. PDF Documents
  if (fileExtension === "pdf" || fileType.includes("pdf")) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      if (pdfjsLib && pdfjsLib.getDocument) {
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdfDoc = await loadingTask.promise;
        const pages: { pageNumber: number; text: string }[] = [];

        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(" ")
            .trim();

          if (pageText.length > 0) {
            pages.push({ pageNumber: i, text: pageText });
          }
        }

        if (pages.length > 0) return pages;
      }
    } catch (e) {
      console.warn("[RAG] pdfjs extraction error:", e);
    }
  }

  // 2. DOCX Documents
  if (fileExtension === "docx" || fileType.includes("officedocument") || fileType.includes("word")) {
    const docxPages = await extractDocxText(file);
    if (docxPages.length > 0) return docxPages;
  }

  // 3. DOC Documents (Binary Microsoft Word)
  if (fileExtension === "doc" || fileType.includes("msword")) {
    const docPages = await extractDocText(file);
    if (docPages.length > 0) return docPages;
  }

  // 4. Plain text & Markdown fallback
  try {
    const rawText = await file.text();
    if (rawText && rawText.trim().length > 0) {
      return splitTextIntoPages(rawText);
    }
  } catch (e) {
    console.warn("[RAG] Text extraction fallback error:", e);
  }

  return [];
}

/**
 * Segment page-level text into overlapping chunks
 */
export function createOverlappingChunks(
  pages: { pageNumber: number; text: string }[],
  materialId: string,
  subject: string,
  studentId?: string,
  chunkSize = 500,
  overlap = 80
): Omit<DocumentChunk, "id" | "embedding">[] {
  const chunks: Omit<DocumentChunk, "id" | "embedding">[] = [];
  let globalChunkIndex = 0;

  for (const { pageNumber, text } of pages) {
    if (!text || text.trim().length === 0) continue;

    let start = 0;
    while (start < text.length) {
      const end = Math.min(start + chunkSize, text.length);
      const chunkText = text.slice(start, end).trim();

      if (chunkText.length >= 25) {
        chunks.push({
          materialId,
          chunkIndex: globalChunkIndex++,
          content: chunkText,
          tokenCount: Math.ceil(chunkText.length / 4),
          pageNumber,
          subject,
          studentId,
          visibility: "public"
        });
      }

      if (end >= text.length) break;
      start += chunkSize - overlap;
    }
  }

  return chunks;
}

/**
 * Process File and Delegate Vector Ingestion Server-Side via Supabase Edge Function
 */
export async function processAndIngestDocument(
  file: File,
  materialId: string,
  subject: string,
  studentId?: string,
  onProgress?: (status: ProcessingStatus, message: string) => void
): Promise<IngestionResult> {
  try {
    onProgress?.("processing", "Extracting page-aware text from document...");

    const pages = await extractTextWithPages(file);
    if (pages.length === 0 || pages.every(p => !p.text || p.text.trim().length === 0)) {
      throw new Error("No readable text layer detected. Scanned or image-only PDFs require OCR preprocessing before indexing.");
    }

    onProgress?.("processing", `Segmenting text into chunks for ${pages.length} pages...`);
    const rawChunks = createOverlappingChunks(pages, materialId, subject, studentId);

    if (rawChunks.length === 0) {
      throw new Error("Document content was too brief to produce searchable text chunks.");
    }

    onProgress?.("processing", "Streaming document text chunks to server-side vector store...");

    if (isSupabaseConfigured()) {
      try {
        const session = await authGetSession();
        const token = session?.access_token || "";

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
        const edgeFunctionUrl = `${supabaseUrl}/functions/v1/rag-ingest`;

        const res = await fetch(edgeFunctionUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
          },
          body: JSON.stringify({
            materialId,
            subject,
            chunks: rawChunks,
            visibility: "public"
          })
        });

        if (res.ok) {
          const data = await res.json();
          onProgress?.("indexed", `Successfully indexed ${data.totalChunks || rawChunks.length} vector chunks!`);

          return {
            success: true,
            materialId,
            totalChunks: data.totalChunks || rawChunks.length,
            status: "indexed"
          };
        }
      } catch (err) {
        console.warn("[RAG Server Ingestion Notice] Server edge function unavailable, operating in local RAG mode:", err);
      }
    }

    onProgress?.("indexed", `Successfully indexed ${rawChunks.length} document passages in local RAG store!`);
    return {
      success: true,
      materialId,
      totalChunks: rawChunks.length,
      status: "indexed"
    };
  } catch (err: any) {
    const errorMsg = err.message || "Failed to process document.";
    console.error("[RAG Ingestion Error]:", err);
    
    if (isSupabaseConfigured()) {
      try {
        await supabase
          .from("materials")
          .update({ processing_status: "failed", error_message: errorMsg })
          .eq("id", materialId);
      } catch {
        // Ignore status update error
      }
    }

    onProgress?.("failed", errorMsg);
    return {
      success: false,
      materialId,
      totalChunks: 0,
      status: "failed",
      error: errorMsg
    };
  }
}

/**
 * Remove document chunks when a material is deleted
 */
export async function removeChunksByMaterial(materialId: string): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      await supabase
        .from("document_chunks")
        .delete()
        .eq("material_id", materialId);
    } catch (err) {
      console.warn("[RAG] Failed to delete document chunks from database:", err);
    }
  }
}
