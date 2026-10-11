import { useState, useRef, useEffect } from "react";
import {
  Send,
  BookOpen,
  Code2,
  Bot,
  Sparkles,
  Compass,
  CheckCircle2,
  BarChart3,
  AlertTriangle
} from "lucide-react";
import { type ChatMessage, student, weakTopics, recentActivity, recoveryPlan } from "../data/mock";
import { useCampus } from "../context/CampusContext";
import { useLearning } from "../context/LearningContext";
import { isSupabaseConfigured } from "../lib/supabase";
import { fetchTutorMessagesFromDB, saveTutorMessageToDB } from "../services/supabaseService";
import { generateCopilotResponse } from "../services/copilot";
import { CopilotStudentContext } from "../services/copilot/types";
import {
  calculateStudentSuccessScoreBreakdown,
  getExplainableRiskFlags
} from "../intelligence/analyticsService";
import MobileHeader from "../components/MobileHeader";
import PageHeader from "../components/PageHeader";

let msgCounter = 10;

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-4" aria-live="polite" aria-label="AI Copilot is typing">
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

function BotMessage({ message, onFollowUp }: { message: ChatMessage; onFollowUp?: (text: string) => void }) {
  return (
    <div className="flex items-end gap-2 mb-4">
      <div
        className="w-8 h-8 rounded-full primary-gradient flex items-center justify-center shrink-0"
        aria-hidden="true"
      >
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="flex flex-col gap-1 max-w-[85%]">
        <div className="chat-bubble-bot text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {message.content}
        </div>

        {message.suggestedFollowUps && message.suggestedFollowUps.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {message.suggestedFollowUps.map((fu, idx) => (
              <button
                key={idx}
                onClick={() => onFollowUp?.(fu)}
                className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1 rounded-lg border border-indigo-100 transition cursor-pointer"
              >
                💡 {fu}
              </button>
            ))}
          </div>
        )}
        
        <span className="text-[10px] text-slate-400 ml-1">{message.timestamp}</span>
      </div>
    </div>
  );
}

function UserMessage({ message }: { message: ChatMessage }) {
  return (
    <div className="flex items-end justify-end gap-2 mb-4">
      <div className="flex flex-col gap-1 items-end max-w-[80%]">
        <div className="chat-bubble-user text-sm leading-relaxed">
          {message.content}
        </div>
        <span className="text-[10px] text-slate-400 mr-1">{message.timestamp}</span>
      </div>
    </div>
  );
}

const suggestedPrompts = [
  { id: "status", label: "My Academic Status", icon: BarChart3, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { id: "quizzes", label: "How many quizzes finished?", icon: CheckCircle2, color: "text-violet-700 bg-violet-50 border-violet-200" },
  { id: "weak", label: "What are my weak topics?", icon: AlertTriangle, color: "text-amber-700 bg-amber-50 border-amber-200" },
  { id: "explain", label: "Explain a concept", icon: BookOpen, color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
  { id: "exam", label: "Help me prepare for an exam", icon: Sparkles, color: "text-sky-700 bg-sky-50 border-sky-200" },
  { id: "strategy", label: "Create a study strategy", icon: Compass, color: "text-teal-700 bg-teal-50 border-teal-200" },
  { id: "debug", label: "Help me debug code", icon: Code2, color: "text-rose-700 bg-rose-50 border-rose-200" }
];

export default function TutorPage() {
  const { currentUser, students } = useCampus();
  const { profile } = useLearning();

  const currentStudent =
    (currentUser?.role === "student" ? (currentUser as any) : null) ||
    students.find((s) => s.id === currentUser?.id) ||
    students[0];

  const studentName = currentStudent?.name || currentUser?.name || student.name || "Student";
  const studentId = currentStudent?.id || currentUser?.id || "s1";

  // Initial personalized welcoming message
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: "msg-welcome",
      role: "bot",
      content: `Hello ${studentName}! 👋 I am your **CampusOS AI Copilot**.

I can answer any question about your **academic status**, how many quizzes you have finished, attendance, assignments, and weak topics — or help you understand concepts and debug code.

How can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedFollowUps: [
        "Tell me about my academic status",
        "How many quizzes have I finished?",
        "What are my weak topics?",
        "What is my attendance status?"
      ]
    }
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load chat history from Supabase if configured
  useEffect(() => {
    if (isSupabaseConfigured() && currentUser?.id) {
      fetchTutorMessagesFromDB(currentUser.id).then(dbMessages => {
        if (dbMessages && dbMessages.length > 0) {
          const cleaned = (dbMessages as ChatMessage[]).map(m => ({
            ...m,
            sources: undefined
          }));
          setMessages(cleaned);
        }
      }).catch(console.error);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function sendMessage(content: string) {
    if (!content.trim()) return;

    const userText = content.trim();
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      role: "user",
      content: userText,
      timestamp: now
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    if (isSupabaseConfigured()) {
      saveTutorMessageToDB({
        id: userMsg.id,
        studentId: currentUser?.id || "s1",
        role: "user",
        content: userMsg.content,
        timestamp: new Date().toISOString()
      }).catch(console.error);
    }

    try {
      // Gather live student academic and learning context
      const breakdown = calculateStudentSuccessScoreBreakdown(studentId);
      const risks = getExplainableRiskFlags(studentId);

      const copilotContext: CopilotStudentContext = {
        studentId,
        studentName,
        course: currentStudent?.course || student.course || "B.Tech IT",
        year: currentStudent?.year || student.year || "3rd Year",
        email: currentStudent?.email || "arun.k@student.edu",
        attendancePercent: currentStudent?.attendancePercent ?? student.attendancePercent ?? 65,
        attendanceTrend: student.attendanceTrend ?? -7,
        quizAverage: currentStudent?.quizAverage ?? student.quizAverage ?? 49,
        quizTrend: student.quizTrend ?? -18,
        quizzesCompleted: profile?.quizzesCompleted ?? 24,
        quizAccuracy: profile?.quizAccuracy ?? 86,
        assignmentAverage: currentStudent?.assignmentAverage ?? student.assignmentAverage ?? 72,
        assignmentTrend: student.assignmentTrend ?? -12,
        totalAssignments: currentStudent?.totalAssignments ?? student.totalAssignments ?? 10,
        lateSubmissions: currentStudent?.lateSubmissions ?? student.lateSubmissions ?? 2,
        weakTopics: currentStudent?.weakTopics && currentStudent.weakTopics.length > 0
          ? currentStudent.weakTopics
          : weakTopics.map((w) => w.name),
        learningLevel: profile?.level ?? 12,
        totalXP: profile?.totalXP ?? 1840,
        arenaCoins: profile?.arenaCoins ?? 1250,
        streak: profile?.streak ?? 7,
        longestStreak: profile?.longestStreak ?? 14,
        currentFocus: profile?.currentFocus || "DBMS Normalization",
        successScore: breakdown?.overallScore ?? 64,
        riskFlags: risks.map((r) => `${r.title}: ${r.reason}`),
        recentActivities: recentActivity.map((a) => ({
          title: a.title,
          detail: a.detail,
          time: a.time,
        })),
        recoveryPlan: {
          title: recoveryPlan.title,
          focus: recoveryPlan.focus,
          days: recoveryPlan.days,
          completedTasks: recoveryPlan.completedTasks,
          totalTasks: recoveryPlan.tasks,
          currentDay: recoveryPlan.currentDay,
        },
      };

      // Generate AI Copilot Response with live student context
      const response = await generateCopilotResponse(userText, copilotContext);

      const botResponse: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        role: "bot",
        content: response.replyText,
        timestamp: response.timestamp,
        suggestedFollowUps: response.suggestedFollowUps
      };
      
      setMessages((prev) => [...prev, botResponse]);

      if (isSupabaseConfigured()) {
        saveTutorMessageToDB({
          id: botResponse.id,
          studentId: currentUser?.id || "s1",
          role: "bot",
          content: botResponse.content,
          timestamp: new Date().toISOString()
        }).catch(console.error);
      }
    } catch (err: any) {
      const errorResponse: ChatMessage = {
        id: `msg-${++msgCounter}`,
        role: "bot",
        content: `I'm temporarily having trouble responding. ${err.message || "Please try again."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  }

  function handlePromptClick(label: string) {
    let promptText = label;
    if (label.includes("Academic Status")) promptText = "Tell me about my academic status";
    else if (label.includes("quizzes finished")) promptText = "How many quizzes have I finished?";
    else if (label.includes("weak topics")) promptText = "What are my weak topics and where do I need to improve?";
    else if (label.includes("Explain")) promptText = "Explain database normalization in simple terms.";
    else if (label.includes("prepare")) promptText = "How should I prepare for my upcoming Computer Science semester exams?";
    else if (label.includes("strategy")) promptText = "Create a high-yield study strategy for Data Structures and Algorithms.";
    else if (label.includes("debug")) promptText = "How do I systematically debug recursion and memory leak errors in code?";

    sendMessage(promptText);
  }

  return (
    <>
      <MobileHeader />
      <div className="flex flex-col h-full mobile-content max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-8 pt-5 pb-3 shrink-0">
          <PageHeader
            title="AI Copilot"
            subtitle="Your everyday AI study companion • Real-time academic status, quiz insights & study guidance"
            badge="General AI"
          />

          {/* Suggested prompts carousel / pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {suggestedPrompts.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => handlePromptClick(label)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold ${color} hover:opacity-90 transition min-h-[40px] shrink-0 cursor-pointer border`}
                aria-label={label}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat messages */}
        <div
          className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4"
          role="log"
          aria-label="AI Copilot Messages"
          aria-live="polite"
        >
          {messages.map((msg) =>
            msg.role === "bot" ? (
              <BotMessage key={msg.id} message={msg} onFollowUp={(text) => sendMessage(text)} />
            ) : (
              <UserMessage key={msg.id} message={msg} />
            )
          )}
          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="px-4 sm:px-6 lg:px-8 pb-4 shrink-0">
          <div className="glass-card !rounded-2xl p-2 flex items-center gap-2">
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
              placeholder="Ask about your academic status, how many quizzes you finished, doubts, or study plans..."
              className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none px-3 py-2 min-h-[44px]"
              aria-label="Type your message to AI Copilot"
            />
            
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="btn-primary !rounded-xl !px-4 !py-2.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5"
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
