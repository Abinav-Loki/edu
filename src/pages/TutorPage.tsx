import { useState, useRef, useEffect } from "react";
import { Send, Lightbulb, BookOpen, Code2, Bot } from "lucide-react";
import { initialChatMessages, type ChatMessage } from "../data/mock";
import MobileHeader from "../components/MobileHeader";
import PageHeader from "../components/PageHeader";

let msgCounter = initialChatMessages.length + 1;

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
        <div className="chat-bubble-user text-sm leading-relaxed">
          {message.content}
        </div>
        <span className="text-[10px] text-slate-400 mr-1">{message.timestamp}</span>
      </div>
    </div>
  );
}

const quickActions = [
  { id: "hint", label: "Hint", icon: Lightbulb, color: "text-amber-600" },
  { id: "explain", label: "Explain", icon: BookOpen, color: "text-indigo-600" },
  { id: "example", label: "Show Example", icon: Code2, color: "text-emerald-600" },
];

const quickResponses: Record<string, string> = {
  hint: "💡 Here's a hint: Think about the direction of the join. In a LEFT JOIN, all rows from the **left** (first) table are always included. The right table's values appear only when there's a matching row. What happens when there's no match?",
  explain: "📚 Let me explain SQL JOINs:\n\n**INNER JOIN** — Only matching rows from both tables.\n**LEFT JOIN** — All left rows + matching right rows (NULL for non-matches).\n**RIGHT JOIN** — All right rows + matching left rows (NULL for non-matches).\n**FULL OUTER JOIN** — All rows from both tables.\n\nDoes this help clarify things?",
  example: "💻 Here's a practical example:\n\n```sql\nSELECT students.name, grades.score\nFROM students\nLEFT JOIN grades ON students.id = grades.student_id;\n```\n\nThis returns ALL students, even those without a grade entry. Non-graded students show NULL for score. Can you see why LEFT JOIN is useful here?",
};

export default function TutorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(content: string) {
    if (!content.trim()) return;

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = {
      id: `msg-${++msgCounter}`,
      role: "user",
      content: content.trim(),
      timestamp: now,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: `msg-${++msgCounter}`,
        role: "bot",
        content:
          "That's a thoughtful response! 🎯 You're on the right track. Let's go deeper — can you tell me what would happen if there are rows in the left table that have NO matching rows in the right table? What values would appear in the result?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botResponse]);
    }, 1800);
  }

  function handleQuickAction(actionId: string) {
    const response = quickResponses[actionId];
    if (!response) return;

    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: `msg-${++msgCounter}`, role: "bot", content: response, timestamp: now },
      ]);
    }, 1000);
  }

  return (
    <>
      <MobileHeader />
      <div className="flex flex-col h-full mobile-content">
        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-8 pt-5 pb-3 shrink-0">
          <PageHeader
            title="AI Tutor"
            subtitle="Socratic Learning • Not just answers"
            badge="AI-Powered"
          />

          {/* Quick actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {quickActions.map(({ id, label, icon: Icon, color }) => (
              <button
                key={id}
                onClick={() => handleQuickAction(id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/70 border border-white/80 text-xs font-semibold ${color} hover:bg-white transition min-h-[44px]`}
                aria-label={label}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {label}
              </button>
            ))}

            {/* Hint shortcut */}
            <button
              onClick={() => handleQuickAction("hint")}
              className="ml-auto flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-50 border border-amber-100 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition min-h-[44px]"
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
              placeholder="Type your response..."
              className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none px-2 py-2 min-h-[44px]"
              aria-label="Type your message to the AI tutor"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="btn-primary !rounded-xl !px-3.5 !py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
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
