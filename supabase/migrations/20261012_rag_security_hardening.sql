-- ============================================================================
-- EduGuard AI / CampusOS — RAG Security Hardening Migration
-- Migration File: 20261012_rag_security_hardening.sql
-- ============================================================================
-- FIX CRITICAL BLOCKER 1: Eliminate requesting_student_id parameter trust.
-- Enforce auth.uid() as the sole trusted identity for vector search.
-- Unauthenticated calls NEVER receive private document chunks.
-- ============================================================================

-- 1. Ensure Vector Extension and Schema Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Add Tracking & Provenance Columns to Materials
ALTER TABLE public.materials
  ADD COLUMN IF NOT EXISTS storage_path TEXT,
  ADD COLUMN IF NOT EXISTS file_url TEXT,
  ADD COLUMN IF NOT EXISTS processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'indexed', 'failed')),
  ADD COLUMN IF NOT EXISTS error_message TEXT,
  ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'faculty', 'course')),
  ADD COLUMN IF NOT EXISTS embedding_model TEXT DEFAULT 'gemini-embedding-2',
  ADD COLUMN IF NOT EXISTS embedding_dim INT DEFAULT 768;

-- 3. Document Chunks Table Provenance Updates
ALTER TABLE public.document_chunks
  ADD COLUMN IF NOT EXISTS embedding_model TEXT DEFAULT 'gemini-embedding-2';

-- 4. Replace match_document_chunks with Strict Server-Side auth.uid() Validation
CREATE OR REPLACE FUNCTION match_document_chunks (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  filter_subject text DEFAULT NULL,
  filter_material_id text DEFAULT NULL
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
DECLARE
  current_auth_uid text;
BEGIN
  -- 1. Retrieve authenticated Supabase identity from trusted Auth context ONLY
  current_auth_uid := auth.uid()::text;

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
  WHERE 
    -- Vector distance threshold check
    (1 - (dc.embedding <=> query_embedding)) >= match_threshold
    -- Subject filter (case-insensitive)
    AND (filter_subject IS NULL OR filter_subject = '' OR LOWER(dc.subject) = LOWER(filter_subject))
    -- Material ID filter (material-specific retrieval)
    AND (filter_material_id IS NULL OR filter_material_id = '' OR dc.material_id = filter_material_id)
    -- STRICT AUTHORIZATION RULES:
    -- Rule A: Public chunks are accessible to all users.
    -- Rule B: Private chunks are accessible ONLY if current_auth_uid IS NOT NULL AND matches dc.student_id.
    -- Rule C: Unauthenticated callers (current_auth_uid IS NULL) CANNOT access private chunks.
    AND (
      dc.visibility = 'public'
      OR (
        current_auth_uid IS NOT NULL 
        AND dc.student_id IS NOT NULL 
        AND dc.student_id = current_auth_uid
      )
    )
  ORDER BY dc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- 5. Grant Execution to Authenticated and Anonymous Roles
GRANT EXECUTE ON FUNCTION match_document_chunks TO authenticated, anon;

-- 6. Tighten Row Level Security for document_chunks
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public access policy for document_chunks" ON public.document_chunks;
DROP POLICY IF EXISTS "Authorized read policy for document_chunks" ON public.document_chunks;
DROP POLICY IF EXISTS "Owner write policy for document_chunks" ON public.document_chunks;

-- Read Policy: Public chunks accessible to all, private chunks restricted strictly to auth.uid()
CREATE POLICY "Authorized read policy for document_chunks" ON public.document_chunks
  FOR SELECT TO authenticated, anon
  USING (
    visibility = 'public' 
    OR (auth.uid() IS NOT NULL AND student_id = auth.uid()::text)
  );

-- Write Policy: Insert/Update/Delete allowed ONLY if student_id matches authenticated auth.uid()
CREATE POLICY "Owner write policy for document_chunks" ON public.document_chunks
  FOR ALL TO authenticated
  USING (
    auth.uid() IS NOT NULL AND student_id = auth.uid()::text
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND student_id = auth.uid()::text
  );
