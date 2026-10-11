export type ProcessingStatus = 'pending' | 'processing' | 'indexed' | 'failed';

export interface DocumentChunk {
  id: string;
  materialId: string;
  chunkIndex: number;
  content: string;
  tokenCount: number;
  pageNumber: number;
  subject: string;
  studentId?: string;
  visibility?: 'public' | 'private' | 'faculty' | 'course';
  embedding?: number[];
  createdAt?: string;
}

export interface DocumentSourceCitation {
  materialId: string;
  title: string;
  pageNumber: number;
  excerpt: string;
  similarity: number;
  subject: string;
}

export interface RetrievalResult {
  chunks: DocumentChunk[];
  citations: DocumentSourceCitation[];
  query: string;
  status: 'success' | 'infrastructure_unavailable' | 'error';
  errorMessage?: string;
}

export interface GroundedAnswerResponse {
  answer: string;
  sources: DocumentSourceCitation[];
  grounded: boolean;
  retrievalStatus: 'success' | 'no_passages_found' | 'infrastructure_unavailable' | 'error';
  errorMessage?: string;
}

export interface IngestionResult {
  success: boolean;
  materialId: string;
  totalChunks: number;
  status: ProcessingStatus;
  error?: string;
}
