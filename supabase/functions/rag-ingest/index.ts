import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.117.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY") || "";

    if (!supabaseUrl || !geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "server_misconfiguration" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1. CRITICAL BLOCKER 2: Enforce JWT Authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);

    if (authErr || !user) {
      return new Response(
        JSON.stringify({ error: "unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const authenticatedUserId = user.id;

    // 2. Validate Payload
    const { materialId, subject, chunks, visibility } = await req.json();

    if (!materialId || !chunks || !Array.isArray(chunks) || chunks.length === 0) {
      return new Response(
        JSON.stringify({ error: "invalid_payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. CRITICAL BLOCKER 3: Enforce Material Ownership Server-Side
    const { data: existingMaterial } = await supabase
      .from("materials")
      .select("student_id")
      .eq("id", materialId)
      .maybeSingle();

    if (existingMaterial && existingMaterial.student_id && existingMaterial.student_id !== authenticatedUserId) {
      return new Response(
        JSON.stringify({ error: "forbidden" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4. Generate 768d Vector Embeddings Server-Side using gemini-embedding-2
    const indexedChunks = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const text = chunk.content;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${geminiApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "models/gemini-embedding-2",
            content: { parts: [{ text }] },
            outputDimensionality: 768
          })
        }
      );

      const embedData = await res.json();
      if (!embedData.embedding?.values || !Array.isArray(embedData.embedding.values)) {
        throw new Error(`Embedding failed for chunk ${i}: ${embedData.error?.message || "Invalid structure"}`);
      }

      indexedChunks.push({
        material_id: materialId,
        chunk_index: i,
        content: text,
        token_count: Math.ceil(text.length / 4),
        page_number: chunk.pageNumber || 1,
        subject: subject || "General",
        student_id: authenticatedUserId, // Derived strictly from verified JWT
        visibility: visibility || "public",
        embedding: embedData.embedding.values,
        embedding_model: "gemini-embedding-2"
      });
    }

    // Delete existing document chunks for re-indexing idempotency (ownership already verified)
    await supabase.from("document_chunks").delete().eq("material_id", materialId);

    // Insert new chunks
    const { error: insertError } = await supabase.from("document_chunks").insert(indexedChunks);
    if (insertError) throw insertError;

    // Update material processing status
    await supabase
      .from("materials")
      .update({
        processing_status: "indexed",
        error_message: null,
        embedding_model: "gemini-embedding-2",
        embedding_dim: 768
      })
      .eq("id", materialId);

    return new Response(
      JSON.stringify({ success: true, materialId, totalChunks: indexedChunks.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "ingestion_failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
