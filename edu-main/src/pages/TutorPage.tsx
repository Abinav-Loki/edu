import { useState, useRef, useEffect } from "react";
import { Send, Lightbulb, BookOpen, Code2, Bot, Paperclip, FileText, X, Upload, ShieldAlert, Award, Sparkles, Languages } from "lucide-react";
import { initialChatMessages, type ChatMessage } from "../data/mock";
import { useCampus } from "../context/CampusContext";
import { isSupabaseConfigured } from "../lib/supabase";
import { fetchTutorMessagesFromDB, saveTutorMessageToDB } from "../services/supabaseService";
import {
  calculateStudentSuccessScoreBreakdown,
  getExplainableRiskFlags,
  getStudentSegmentation,
} from "../intelligence/analyticsService";
import MobileHeader from "../components/MobileHeader";
import PageHeader from "../components/PageHeader";

let msgCounter = initialChatMessages.length + 1;

interface AttachedFileState {
  name: string;
  size: string;
  type: string;
  content?: string;
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4" aria-live="polite" aria-label="AI is typing">
      <div className="w-8 h-8 rounded-full primary-gradient flex items-center justify-center shrink-0">
        <Bot className="w-4 h-4 text-white" aria-hidden="true" />
      </div>
      <div className="chat-bubble-bot flex items-center gap-1.5 py-3 px-4">
        <div className="typing-dot" />
        <div className="typing-dot" />
        <div className="typing-dot" />
      </div>
    </div>
  );
}

function BotMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div
        className="w-8 h-8 rounded-full primary-gradient flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="flex flex-col gap-1 max-w-[80%]">
        <div className="chat-bubble-bot text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {message.content}
        </div>
        <span className="text-[10px] text-slate-400 ml-1">{message.timestamp}</span>
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex items-end justify-end gap-2 mb-4">
      <div className="flex flex-col gap-1 items-end max-w-[80%]">
        {message.attachedFile && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-600 text-white text-xs font-semibold mb-1 shadow-sm">
            <FileText className="w-3.5 h-3.5 text-sky-200" />
            <span className="truncate max-w-[180px]">{message.attachedFile.name}</span>
            <span className="text-[10px] opacity-80 font-mono">({message.attachedFile.size})</span>
          </div>
        )}
        <div className="chat-bubble-user text-sm leading-relaxed">
          {message.content}
        </div>
        <span className="text-[10px] text-slate-400 mr-1">{message.timestamp}</span>
      </div>
    </div>
  );
}

const quickActions = [
  { id: "score", label: "📊 Explain Success Score", icon: Award, color: "text-indigo-600 bg-indigo-50/70 border-indigo-200 hover:bg-indigo-100" },
  { id: "risk", label: "⚠️ Review Academic Risk", icon: ShieldAlert, color: "text-amber-700 bg-amber-50/70 border-amber-200 hover:bg-amber-100" },
  { id: "materials", label: "📚 Summarize Study Notes", icon: BookOpen, color: "text-emerald-700 bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100" },
  { id: "tanglish", label: "🗣️ Explain in Tanglish", icon: Languages, color: "text-purple-700 bg-purple-50/70 border-purple-200 hover:bg-purple-100" },
  { id: "hint", label: "💡 Hint", icon: Lightbulb, color: "text-amber-600 bg-white/70 border-white/80 hover:bg-white" },
];

function generateGroundedFallbackResponse(
  userPrompt: string,
  studentName: string,
  studentId: string,
  breakdown: ReturnType<typeof calculateStudentSuccessScoreBreakdown>,
  riskFlags: ReturnType<typeof getExplainableRiskFlags>,
  segment: ReturnType<typeof getStudentSegmentation>,
  studentMaterials: any[]
): string {
  const p = userPrompt.toLowerCase();
  const overallScore = breakdown.overallScore ?? 0;
  const riskLevel = riskFlags.some(f => f.severity === "High")
    ? "HIGH"
    : (riskFlags.some(f => f.severity === "Medium") ? "MODERATE" : "LOW");

  if (p.includes("score") || p.includes("success") || p.includes("coverage") || p.includes("breakdown") || p.includes("weight")) {
    const acad = breakdown.categoryScores["academic"];
    const att = breakdown.categoryScores["attendance"];
    const lms = breakdown.categoryScores["lmsActivity"];
    const sp = breakdown.categoryScores["skillsPlacement"];
    const eng = breakdown.categoryScores["engagement"];
    const fb = breakdown.categoryScores["feedback"];

    return `### 📊 Verified Success Score Analysis for ${studentName} (${studentId})
[Source: Institutional Analytics Engine - Verified Record]

**Overall Success Score:** **${overallScore}/100** (${breakdown.statusLabel})  
*Coverage: ${breakdown.dataCoveragePercent}% indicators present (${breakdown.validCategoriesCount} of ${breakdown.totalCategoriesCount} Categories)*

#### Category Weights & Contributions (Re-normalized to 100%):
- **Academic Performance:** **${acad?.score ?? "N/A"}/100** (Configured: ${acad?.configuredWeight}%, Re-normalized: ${acad?.reNormalizedWeight}%)
- **Attendance:** **${att?.score ?? "N/A"}/100** (Configured: ${att?.configuredWeight}%, Re-normalized: ${att?.reNormalizedWeight}%)
- **LMS Completion:** **${lms?.score ?? "N/A"}/100** (Configured: ${lms?.configuredWeight}%, Re-normalized: ${lms?.reNormalizedWeight}%)
- **Skills & Placement:** **${sp?.score ?? "N/A"}/100** (Configured: ${sp?.configuredWeight}%, Re-normalized: ${sp?.reNormalizedWeight}%)
- **Campus Engagement:** **${eng?.score ?? "N/A"}/100** (Configured: ${eng?.configuredWeight}%, Re-normalized: ${eng?.reNormalizedWeight}%)
- **Feedback:** **${fb?.score ?? "N/A"}/100** (Configured: ${fb?.configuredWeight}%, Re-normalized: ${fb?.reNormalizedWeight}%)

**Key Drivers:**
- **Positive Drivers:** ${breakdown.explanation.positiveDrivers.join(", ") || "Steady across evaluated dimensions"}
- **Attention Areas:** ${breakdown.explanation.attentionAreas.join(", ") || "None flagged"}
- **Status:** ${breakdown.statusLabel}`;
  }

  if (p.includes("risk") || p.includes("flag") || p.includes("warning") || p.includes("support") || p.includes("recovery")) {
    return `### ⚠️ Explainable Academic Risk Audit for ${studentName}
[Source: Institutional Analytics Engine - Verified Record]

**Overall Risk Classification:** **${riskLevel} RISK** (${riskFlags.length} active flag${riskFlags.length === 1 ? '' : 's'})
*Evaluation Date: ${new Date().toLocaleDateString()} | Threshold Rule Engine: Active*

#### Triggered Indicators & Documented Actions:
${riskFlags.length === 0 ? "✅ **No active risk flags!** Your attendance, academic grades, and LMS tasks meet or exceed institutional standards." : riskFlags.map(f => `- **[${f.severity.toUpperCase()} RISK] ${f.title}:** ${f.reason}\n  - *Supporting Data:* \`${f.supportingData}\`\n  - *Recommended Action:* ${f.recommendedAction}`).join("\n")}

**Current Student Segment:** **${segment.primarySegment}**  
*Segment Rationale:* ${segment.reasoning}`;
  }

  if (p.includes("tanglish") || p.includes("tamil")) {
    const attScore = breakdown.categoryScores["attendance"]?.score ?? 0;
    return `### 🗣️ Academic Summary in Tanglish (தமிழ் + English)
[Source: Institutional Analytics Engine & AI Tutor]

Vanakkam **${studentName}**! Unga academic profile-oda quick update idho:

1. **Success Score:** Ungaloda current score **${overallScore}/100** irukku. ${overallScore >= 80 ? "Super performance! Neenga nalla track-la irukinga." : "Konjam focus panna innum periya improvement varum!"}
2. **Attendance Status:** ${attScore}% attendance irukku. Institutional 75% threshold-ah vida maintain pannanum.
3. **Risk Level:** Unga risk classification ipo **${riskLevel}**. ${riskFlags.length > 0 ? `Alert: ${riskFlags[0].title} - ${riskFlags[0].recommendedAction}` : "Active risk warnings edhum illai!"}
4. **Primary Segment:** **${segment.primarySegment}** — Reason: ${segment.reasoning}

Edhavadhu specific subject or syllabus doubt irundha kooda kelunga, naan step-by-step explain panren!`;
  }

  if (p.includes("material") || p.includes("study") || p.includes("notes") || p.includes("syllabus") || p.includes("dbms")) {
    return `### 📚 Authorized Study Material Retrieval for ${studentName}
[Source: Student Document Vault - Isolation Verified]

**Access Scope:** Student ID \`${studentId}\` (Private Sandbox)

${studentMaterials.length === 0 ? "You haven't uploaded any study materials yet. Head over to the **Upload Materials** tab to add your lecture notes or syllabus!" : `Found **${studentMaterials.length}** authorized document(s) in your repository:\n\n` + studentMaterials.map(m => `#### 📄 ${m.fileName} (${m.subject})
- **File Type:** ${m.fileType}
- **Description:** ${m.description}
- **Key Concepts:** Relational Data Models, Entity-Relationship Schemas, Primary & Foreign Keys, Normalization (1NF, 2NF, 3NF, BCNF).
- **Study Tip:** Focus on ER-to-Relational conversion rules and ACID properties for university examinations.
[Source: Material Document - ${m.fileName}]`).join("\n\n")}`;
  }

  return `### 🤖 ARIVON AI Academic Guidance for ${studentName}
[Source: Grounded Institutional Copilot]

I am your personalized academic copilot. Here is your current snapshot:
- **Success Score:** ${overallScore}/100 (${breakdown.statusLabel})
- **Risk Status:** ${riskLevel} (${riskFlags.length} active flag${riskFlags.length === 1 ? '' : 's'})
- **Segment:** ${segment.primarySegment}

How can I help you today?
1. *"Explain my Success Score and individual component weights"*
2. *"What are my active risk flags and how do I resolve them?"*
3. *"Summarize my uploaded study materials and key concepts"*
4. *"Explain my status or topics in Tanglish"*`;
}

export default function TutorPage() {
  const { currentUser, materials } = useCampus();
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [input, setInput] = useState("");
  const [attachedFile, setAttachedFile] = useState<AttachedFileState | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const studentId = currentUser?.id || "s1";
  const studentName = currentUser?.name || "Student";
  const studentMaterials = materials ? materials.filter(m => m.studentId === studentId) : [];

  // Load chat history from Supabase if configured
  useEffect(() => {
    if (isSupabaseConfigured() && currentUser?.id) {
      fetchTutorMessagesFromDB(currentUser.id).then(dbMessages => {
        if (dbMessages && dbMessages.length > 0) {
          setMessages(dbMessages as ChatMessage[]);
        }
      }).catch(console.error);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeFormatted = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${Math.round(file.size / 1024)} KB`;

    const isTextFile =
      file.type.startsWith("text/") ||
      file.name.endsWith(".md") ||
      file.name.endsWith(".json") ||
      file.name.endsWith(".js") ||
      file.name.endsWith(".ts") ||
      file.name.endsWith(".py") ||
      file.name.endsWith(".sql") ||
      file.name.endsWith(".csv");

    if (isTextFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setAttachedFile({
          name: file.name,
          size: sizeFormatted,
          type: file.type || "Document",
          content: text,
        });
      };
      reader.readAsText(file);
    } else {
      setAttachedFile({
        name: file.name,
        size: sizeFormatted,
        type: file.type || "Document",
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function sendMessage(content: string) {
    if (!content.trim() && !attachedFile) return;

    const currentFile = attachedFile;
    const userText = content.trim() || (currentFile ? `Please analyze the uploaded file: ${currentFile.name}` : "");
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg: ChatMessage = {
      id: `msg-${++msgCounter}`,
      role: "user",
      content: userText,
      timestamp: now,
      attachedFile: currentFile
        ? {
            name: currentFile.name,
            size: currentFile.size,
            type: currentFile.type,
          }
        : undefined,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setAttachedFile(null);
    setIsTyping(true);

    if (isSupabaseConfigured()) {
      saveTutorMessageToDB({
        id: userMsg.id,
        studentId: studentId,
        role: "user",
        content: userMsg.content,
        timestamp: new Date().toISOString(),
        attachedFile: userMsg.attachedFile
      }).catch(console.error);
    }

    // Retrieve verified student metrics for grounding
    const breakdown = calculateStudentSuccessScoreBreakdown(studentId);
    const riskFlags = getExplainableRiskFlags(studentId);
    const segment = getStudentSegmentation(studentId);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

      // Prepare text content including attached file data for Gemini
      let promptWithFile = userText;
      if (currentFile) {
        if (currentFile.content) {
          promptWithFile = `[ATTACHED FILE: ${currentFile.name} (${currentFile.size})]\n\`\`\`\n${currentFile.content.slice(0, 3000)}\n\`\`\`\n\nUSER PROMPT: ${userText}`;
        } else {
          promptWithFile = `[ATTACHED DOCUMENT: ${currentFile.name} (${currentFile.size})]\n\nUSER PROMPT: ${userText}`;
        }
      }

      let replyText = "";

      if (apiKey) {
        // Format history for Gemini API
        const geminiContents = newMessages.map((msg, index) => {
          const isLastMsg = index === newMessages.length - 1;
          return {
            role: msg.role === "bot" ? "model" : "user",
            parts: [{ text: isLastMsg ? promptWithFile : msg.content }]
          };
        });

        const overallScore = breakdown.overallScore ?? 0;
        const riskLevel = riskFlags.some(f => f.severity === "High")
          ? "HIGH"
          : (riskFlags.some(f => f.severity === "Medium") ? "MODERATE" : "LOW");
        const acad = breakdown.categoryScores["academic"];
        const att = breakdown.categoryScores["attendance"];
        const lms = breakdown.categoryScores["lmsActivity"];
        const sp = breakdown.categoryScores["skillsPlacement"];
        const eng = breakdown.categoryScores["engagement"];
        const fb = breakdown.categoryScores["feedback"];

        const systemInstructionText = `You are the ARIVON AI Academic Copilot & Socratic Tutor for higher education analytics and student success.
You are interacting with student: ${studentName} (ID: ${studentId}, Department: ${currentUser?.department || "CSE"}).

=== VERIFIED INSTITUTIONAL STUDENT ANALYTICS (GROUND TRUTH - DO NOT INVENT OR OVERRIDE THESE NUMBERS) ===
- Student Success Score: ${overallScore}/100 (${breakdown.statusLabel})
- Calculation Coverage: ${breakdown.dataCoveragePercent}% of indicators verified (${breakdown.validCategoriesCount} of ${breakdown.totalCategoriesCount} Categories)
- Component Breakdown:
  * Academic Performance: Score = ${acad?.score ?? "N/A"}/100 (Weight = ${acad?.configuredWeight}%, Re-normalized = ${acad?.reNormalizedWeight}%)
  * Attendance: Score = ${att?.score ?? "N/A"}/100 (Weight = ${att?.configuredWeight}%, Re-normalized = ${att?.reNormalizedWeight}%)
  * LMS & Assignment Completion: Score = ${lms?.score ?? "N/A"}/100 (Weight = ${lms?.configuredWeight}%, Re-normalized = ${lms?.reNormalizedWeight}%)
  * Skills & Placement Readiness: Score = ${sp?.score ?? "N/A"}/100 (Weight = ${sp?.configuredWeight}%, Re-normalized = ${sp?.reNormalizedWeight}%)
  * Extracurricular Engagement: Score = ${eng?.score ?? "N/A"}/100 (Weight = ${eng?.configuredWeight}%, Re-normalized = ${eng?.reNormalizedWeight}%)
  * Student & Faculty Feedback: Score = ${fb?.score ?? "N/A"}/100 (Weight = ${fb?.configuredWeight}%, Re-normalized = ${fb?.reNormalizedWeight}%)
- Positive Drivers: ${breakdown.explanation.positiveDrivers.join(", ") || "Steady across evaluated dimensions"}
- Attention Areas: ${breakdown.explanation.attentionAreas.join(", ") || "None flagged"}
- Academic Decision-Support Risk Classification: ${riskLevel} RISK (${riskFlags.length} active flags)
- Active Triggered Risk Warnings:
${riskFlags.length === 0 ? "  * No active risk warnings." : riskFlags.map(f => `  * [${f.severity.toUpperCase()} RISK] ${f.title}: ${f.reason} | Evidence: ${f.supportingData} | Action: ${f.recommendedAction}`).join("\n")}
- Student Segment: "${segment.primarySegment}" - Criteria: ${segment.reasoning}

=== AUTHORIZED UPLOADED STUDY MATERIALS (STUDENT DATA ISOLATION ENFORCED) ===
${studentMaterials.length === 0 ? "No study materials currently uploaded by this student." : studentMaterials.map(m => `- Material [ID: ${m.id}]: "${m.fileName}" (${m.fileType}) - Subject: ${m.subject}. Description: ${m.description}`).join("\n")}

=== RESPONSE BEHAVIOR & CITATION GUIDELINES (MANDATORY) ===
1. When discussing academic standing, success score, or risk levels, ground your statements in the verified numbers above. Tag statements with "[Source: Institutional Analytics Engine - Verified Record]". Never invent or change these scores.
2. If asked about study materials or syllabus, retrieve information from the authorized uploaded list or attached file. Tag statements with "[Source: Material Document - <fileName>]". If an answer is not present in their materials, clearly state: "This topic is not found in your currently uploaded study materials."
3. When requested by the student, support explanations in simple English or Tanglish (Tamil + English blended conversation).
4. Maintain a supportive, motivating, pedagogical tone.`;

        // Try multiple model endpoints in order for maximum compatibility and resilience
        const modelsToTry = [
          "gemini-2.5-flash",
          "gemini-2.0-flash",
          "gemini-2.0-flash-lite",
          "gemini-1.5-flash",
          "gemini-1.5-flash-8b",
          "gemini-1.5-pro",
          "gemini-flash-latest"
        ];

        for (const model of modelsToTry) {
          let attempts = 0;
          const maxAttempts = 2;

          while (attempts < maxAttempts && !replyText) {
            try {
              attempts++;
              const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    systemInstruction: {
                      parts: [{ text: systemInstructionText }]
                    },
                    contents: geminiContents
                  })
                }
              );

              const data = await response.json();
              if (data.candidates && data.candidates.length > 0 && data.candidates[0].content?.parts?.[0]?.text) {
                replyText = data.candidates[0].content.parts[0].text;
                break;
              } else if (data.error) {
                if (data.error.message?.toLowerCase().includes("demand") || data.error.code === 503 || data.error.code === 429) {
                  await new Promise((res) => setTimeout(res, 600));
                } else {
                  break;
                }
              }
            } catch {
              break;
            }
          }

          if (replyText) break;
        }
      }

      // If Gemini API is not configured or network failed, provide grounded deterministic fallback
      if (!replyText) {
        replyText = generateGroundedFallbackResponse(
          userText,
          studentName,
          studentId,
          breakdown,
          riskFlags,
          segment,
          studentMaterials
        );
      }

      const botResponse: ChatMessage = {
        id: `msg-${++msgCounter}`,
        role: "bot",
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      
      setMessages((prev) => [...prev, botResponse]);

      if (isSupabaseConfigured()) {
        saveTutorMessageToDB({
          id: botResponse.id,
          studentId: studentId,
          role: "bot",
          content: botResponse.content,
          timestamp: new Date().toISOString()
        }).catch(console.error);
      }
    } catch (err: any) {
      // Fallback response with verified numbers
      const fallback = generateGroundedFallbackResponse(
        userText,
        studentName,
        studentId,
        breakdown,
        riskFlags,
        segment,
        studentMaterials
      );
      const errorResponse: ChatMessage = {
        id: `msg-${++msgCounter}`,
        role: "bot",
        content: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleQuickAction(actionId: string) {
    let prompt = "";
    if (actionId === "hint") prompt = "Can you give me a small hint to help me figure out the answer on my own?";
    if (actionId === "explain") prompt = "Can you explain this concept to me simply?";
    if (actionId === "score") prompt = "Explain my Success Score, component weights, and what drove this score.";
    if (actionId === "risk") prompt = "Review my academic risk classification and show me the exact triggering indicators and recommended actions.";
    if (actionId === "materials") prompt = "Summarize my uploaded study materials and key revision concepts.";
    if (actionId === "tanglish") prompt = "Explain my current academic status and study plan in Tanglish.";
    
    if (prompt) {
      sendMessage(prompt);
    }
  }

  return (
    <>
      <MobileHeader />
      <div className="flex flex-col h-full mobile-content">
        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-8 pt-5 pb-3 shrink-0">
          <PageHeader
            title="AI Tutor"
            subtitle="Socratic Learning • Upload & analyze study materials"
            badge="AI-Powered"
          />

          {/* Quick actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {quickActions.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => handleQuickAction(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/70 border border-white/80 text-xs font-semibold ${color} hover:bg-white transition min-h-[44px] cursor-pointer`}
                aria-label={label}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {label}
              </button>
            ))}

            {/* Upload Material Shortcut */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-50 border border-sky-100 text-xs font-semibold text-sky-700 hover:bg-sky-100 transition min-h-[44px] cursor-pointer"
              aria-label="Upload document or study material"
            >
              <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Upload Material</span>
            </button>

            {/* Hint shortcut */}
            <button
              onClick={() => handleQuickAction("hint")}
              className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition min-h-[44px] cursor-pointer"
              aria-label="Give me a hint"
            >
              <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />
              💡 Give me a hint
            </button>
          </div>
        </div>

        {/* Chat messages */}
        <div
          className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4"
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
        >
          {messages.map((msg) =>
            msg.role === "bot" ? (
              <BotMessage key={msg.id} message={msg} />
            ) : (
              <UserMessage key={msg.id} message={msg} />
            )
          )}
          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="px-4 sm:px-6 lg:px-8 pb-4 shrink-0">
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept=".pdf,.docx,.doc,.txt,.md,.csv,.json,.js,.ts,.py,.sql,.png,.jpg,.jpeg"
            className="hidden"
          />

          {/* Attachment Preview Box */}
          {attachedFile && (
            <div className="mb-2 p-2.5 px-3.5 rounded-xl bg-sky-50 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 flex items-center justify-between gap-3 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{attachedFile.name}</p>
                  <p className="text-[10px] font-semibold text-sky-600 dark:text-sky-400">{attachedFile.size} • Ready for AI analysis</p>
                </div>
              </div>

              <button
                onClick={() => setAttachedFile(null)}
                className="w-6 h-6 rounded-lg bg-slate-200/80 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-slate-500 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Remove attached file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="glass-card !rounded-2xl p-2 flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
              title="Attach file or study material"
              aria-label="Attach file"
            >
              <Paperclip className="w-4.5 h-4.5" />
            </button>

            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder={attachedFile ? `Ask AI about ${attachedFile.name}...` : "Type your response..."}
              className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none px-2 py-2 min-h-[44px]"
              aria-label="Type your message to the AI tutor"
            />
            
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() && !attachedFile}
              className="btn-primary !rounded-xl !px-3.5 !py-2.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

