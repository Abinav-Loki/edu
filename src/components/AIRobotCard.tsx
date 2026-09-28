import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

// Friendly AI robot SVG illustration
function RobotIllustration() {
  return (
    <svg
      width="90"
      height="110"
      viewBox="0 0 90 110"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Antenna */}
      <line x1="45" y1="8" x2="45" y2="18" stroke="#A78BFA" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="45" cy="6" r="4" fill="#8B5CF6" />

      {/* Head */}
      <rect x="22" y="18" width="46" height="34" rx="12" fill="white" stroke="rgba(99,102,241,0.2)" strokeWidth="1.5" />

      {/* Eyes */}
      <rect x="30" y="27" width="12" height="10" rx="4" fill="#6366F1" />
      <rect x="48" y="27" width="12" height="10" rx="4" fill="#6366F1" />
      <circle cx="36" cy="32" r="3" fill="white" />
      <circle cx="54" cy="32" r="3" fill="white" />
      <circle cx="37" cy="31" r="1.5" fill="#1e1b4b" />
      <circle cx="55" cy="31" r="1.5" fill="#1e1b4b" />

      {/* Mouth */}
      <path d="M34 44 Q45 50 56 44" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Neck */}
      <rect x="40" y="52" width="10" height="8" rx="2" fill="#C4B5FD" />

      {/* Body */}
      <rect x="18" y="60" width="54" height="36" rx="12" fill="white" stroke="rgba(99,102,241,0.2)" strokeWidth="1.5" />

      {/* Chest panel */}
      <rect x="28" y="68" width="34" height="20" rx="6" fill="rgba(99,102,241,0.08)" />
      <circle cx="37" cy="78" r="5" fill="rgba(99,102,241,0.15)" />
      <circle cx="37" cy="78" r="3" fill="#6366F1" opacity="0.7" />
      <rect x="46" y="73" width="10" height="3" rx="1.5" fill="rgba(99,102,241,0.25)" />
      <rect x="46" y="78" width="7" height="3" rx="1.5" fill="rgba(99,102,241,0.2)" />

      {/* Left arm */}
      <rect x="4" y="62" width="14" height="28" rx="7" fill="white" stroke="rgba(99,102,241,0.15)" strokeWidth="1.5" />
      {/* Right arm holding tablet */}
      <rect x="72" y="62" width="14" height="28" rx="7" fill="white" stroke="rgba(99,102,241,0.15)" strokeWidth="1.5" />

      {/* Tablet */}
      <rect x="68" y="56" width="20" height="28" rx="4" fill="#EEF2FF" stroke="#A78BFA" strokeWidth="1.5" />
      <rect x="70" y="59" width="16" height="20" rx="2" fill="white" />
      <line x1="72" y1="63" x2="84" y2="63" stroke="#6366F1" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="72" y1="67" x2="82" y2="67" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="72" y1="71" x2="80" y2="71" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" />

      {/* Feet */}
      <rect x="28" y="96" width="14" height="10" rx="5" fill="#C4B5FD" />
      <rect x="48" y="96" width="14" height="10" rx="5" fill="#C4B5FD" />
    </svg>
  );
}

export default function AIRobotCard() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)",
        border: "1px solid rgba(99,102,241,0.12)",
      }}
      role="complementary"
      aria-label="AI Tutor promotion"
    >
      {/* Decorative blob */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, #A78BFA 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="flex items-end justify-between p-5 relative z-10">
        <div className="flex-1 pr-2">
          {/* Speech bubble */}
          <div className="relative inline-block mb-4">
            <div
              className="bg-white rounded-2xl rounded-bl-sm px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm border border-indigo-100"
              role="img"
              aria-label="AI says: Let's improve together!"
            >
              "Let's improve together! ✨"
            </div>
            {/* Bubble tail */}
            <div
              className="absolute -bottom-2 left-4 w-4 h-4 bg-white border-b border-l border-indigo-100"
              style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
              aria-hidden="true"
            />
          </div>

          <h3 className="text-sm font-bold text-slate-800">
            Ask me anything
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Socratic learning — I guide, not just answer
          </p>

          <Link
            to="/tutor"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
            aria-label="Open AI Tutor"
          >
            Chat with AI Tutor
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        <RobotIllustration />
      </div>
    </div>
  );
}
