import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY") || "";

    if (!geminiApiKey) {
      return new Response(
        JSON.stringify({ error: "missing_api_key" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { prompt, studentName = "Student", course = "Computer Science" } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "invalid_prompt" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemInstruction = `You are CampusOS AI Copilot, a friendly, highly intelligent, and articulate academic AI study companion for university students (interacting with ${studentName}, studying ${course}).

GUIDELINES:
1. Answer the user's question directly, naturally, and accurately.
2. For casual or conversational questions (e.g. "why are you here?", "what is your name?", "how are you?"), respond warmly and naturally in 1-3 sentences without academic jargon or robotic template headers.
3. For educational doubts, concepts, programming questions, or exam tips, provide a clear, well-structured explanation using markdown, bullet points, and code blocks where helpful.
4. NEVER output awkward boilerplate text like "### Academic Guidance: [Prompt]" or pretend simple conversational questions are academic subjects.
5. Keep your tone encouraging, clear, and student-focused.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await res.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm here to help you with your studies! What would you like to learn today?";

    return new Response(
      JSON.stringify({ replyText, status: "success" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "copilot_generation_failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
