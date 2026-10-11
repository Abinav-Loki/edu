-- ============================================================================
-- EduGuard AI / CampusOS — RAG Vector Database Migration
-- Migration File: 20261011_rag_vector_schema.sql
-- ============================================================================
-- This migration adds pgvector extensions, RAG document chunk tables,
-- persistent storage path tracking, and vector similarity search RPC functions.
-- ============================================================================

-- 1. Enable UUID and Vector Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Extend Materials Table for RAG Pipeline Tracking
ALTER TABLE public.materials
  ADD COLUMN IF NOT EXISTS storage_path TEXT,
  ADD COLUMN IF NOT EXISTS file_url TEXT,
  ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'indexed', 'failed')),
  ADD COLUMN IF NOT EXISTS error_message TEXT,
  ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'course'));

-- 3. Document Chunks Table
CREATE TABLE IF NOT EXISTS public.document_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id TEXT NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL,
  content TEXT NOT NULL,
  token_count INT DEFAULT 0,
  page_number INT DEFAULT 1,
  subject TEXT NOT NULL,
  student_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  visibility TEXT DEFAULT 'public',
  embedding vector(768), -- 768-dimensional vector matching Gemini embedding models
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Indexes
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding
  ON public.document_chunks
  USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_document_chunks_material ON public.document_chunks(material_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_subject ON public.document_chunks(subject);

-- 5. Vector Similarity Search Function (RPC)
CREATE OR REPLACE FUNCTION match_document_chunks (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  filter_subject text DEFAULT NULL,
  requesting_student_id text DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  material_id TEXT,
  chunk_index INT,
  content TEXT,
  page_number INT,
  subject TEXT,
  student_id TEXT,
  visibility TEXT,
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    dc.id,
    dc.material_id,
    dc.chunk_index,
    dc.content,
    dc.page_number,
    dc.subject,
    dc.student_id,
    dc.visibility,
    (1 - (dc.embedding <=> query_embedding))::float AS similarity
  FROM public.document_chunks dc
  WHERE (1 - (dc.embedding <=> query_embedding)) >= match_threshold
    AND (filter_subject IS NULL OR filter_subject = '' OR LOWER(dc.subject) = LOWER(filter_subject))
    AND (
      dc.visibility = 'public'
      OR requesting_student_id IS NULL
      OR dc.student_id = requesting_student_id
    )
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 6. Row Level Security for document_chunks
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access policy for document_chunks" ON public.document_chunks;
CREATE POLICY "Public access policy for document_chunks" ON public.document_chunks
  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
