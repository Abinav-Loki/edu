import React, { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, TrendingDown, ShieldAlert, UserCheck, Play } from "lucide-react";

export type MascotPose =
  | "welcome"
  | "idle"
  | "thinking"
  | "analyzing"
  | "focused"
  | "recommending"
  | "celebrating";

interface MascotCharacterProps {
  pose?: MascotPose;
  size?: "sm" | "md" | "lg";
  showSpeechBubble?: boolean;
  speechText?: string;
  className?: string;
  interactive?: boolean;
}

export default function MascotCharacter({
  pose = "idle",
  size = "md",
  showSpeechBubble = false,
  speechText,
  className = "",
  interactive = true
}: MascotCharacterProps) {
  const [currentPose, setCurrentPose] = useState<MascotPose>(pose);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [hasWelcomed, setHasWelcomed] = useState(false);

  // Sync external pose prop
  useEffect(() => {
    setCurrentPose(pose);
  }, [pose]);

  // Initial welcome animation on mount
  useEffect(() => {
    if (pose === "welcome" && !hasWelcomed) {
      const timer = setTimeout(() => {
        setHasWelcomed(true);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [pose, hasWelcomed]);

  // Eye tracking cursor position
  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const offsetX = (e.clientX / innerWidth - 0.5) * 12; // eye tilt X
      const offsetY = (e.clientY / innerHeight - 0.5) * 8;  // eye tilt Y
      setMousePos({ x: offsetX, y: offsetY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [interactive]);

  // Dimensions based on size prop
  const sizeClasses = {
    sm: "w-36 h-40",
    md: "w-56 h-60 sm:w-64 sm:h-68",
    lg: "w-64 h-72 sm:w-80 sm:h-88"
  }[size];

  // Default speech text based on active pose
  const activeSpeech = speechText || {
    welcome: "Hey! Let's make student success smarter. 👋",
    thinking: "Hmm... I'm noticing a pattern! 🤔",
    analyzing: "Connecting attendance & quiz signals... ⚡",
    focused: "Emerging challenge detected! 🎯",
    recommending: "Here's a targeted Recovery Plan! 📋",
    celebrating: "Every step forward matters! 🎉",
    idle: "I'm your CampusOS AI companion! ✨"
  }[currentPose];

  // Derive pose-specific SVG transforms & expressions
  const isCelebrating = currentPose === "celebrating";
  const isThinking = currentPose === "thinking";
  const isAnalyzing = currentPose === "analyzing" || currentPose === "focused";
  const isRecommending = currentPose === "recommending";
  const isWaving = currentPose === "welcome" || isHovered;

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        // Tap interaction trigger
        if (currentPose === "idle") setCurrentPose("thinking");
        else if (currentPose === "thinking") setCurrentPose("celebrating");
        else setCurrentPose("idle");
      }}
    >
      {/* 1. ANIMATED SPEECH & THOUGHT BUBBLES */}
      {(showSpeechBubble || isHovered || currentPose !== "idle") && (
        <div
          className={`absolute -top-14 z-30 px-4 py-2 rounded-2xl bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-white text-xs sm:text-sm font-extrabold shadow-xl border border-sky-200 dark:border-sky-800 animate-[bounce_3s_infinite_ease-in-out] pointer-events-none max-w-xs text-center flex items-center gap-1.5`}
        >
          <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
          <span>{activeSpeech}</span>
          {/* Speech bubble tail */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-800 rotate-45 border-r border-b border-sky-200 dark:border-sky-800" />
        </div>
      )}

      {/* 2. CELEBRATION CONFETTI / STARS (WHEN CELEBRATING) */}
      {isCelebrating && (
        <div className="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
          <div className="absolute -top-10 left-4 text-yellow-400 animate-[ping_1.5s_infinite]">✨</div>
          <div className="absolute -top-6 right-6 text-sky-400 animate-[bounce_1s_infinite]">⭐</div>
          <div className="absolute top-12 -left-8 text-emerald-400 animate-[pulse_1.2s_infinite]">🎉</div>
          <div className="absolute top-16 -right-8 text-indigo-400 animate-[ping_2s_infinite]">🌟</div>
        </div>
      )}

      {/* 3. BACKGROUND ORBITAL RINGS & GLOW */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/20 via-cyan-300/20 to-indigo-400/20 rounded-full blur-3xl scale-95 pointer-events-none" />
      <div
        className={`absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-sky-200/60 dark:border-sky-800/40 pointer-events-none ${
          isCelebrating ? "animate-[spin_10s_linear_infinite]" : "animate-[spin_40s_linear_infinite]"
        }`}
      />

      {/* 4. ORIGINAL CAMPUSOS MASCOT SVG */}
      <div
        className={`relative z-10 transition-transform duration-300 ${
          isCelebrating
            ? "animate-[bounce_0.6s_infinite_ease-in-out]"
            : isHovered
            ? "scale-105"
            : "animate-[typingBounce_6s_ease-in-out_infinite]"
        }`}
      >
        <svg
          viewBox="0 0 260 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${sizeClasses} drop-shadow-xl cursor-pointer`}
        >
          {/* Shadow beneath mascot */}
          <ellipse cx="130" cy="265" rx="65" ry="12" fill="#0EA5E9" opacity="0.2" />

          {/* LEFT ARM */}
          <path
            d={
              isThinking
                ? "M75 160 C55 140 70 115 85 125" // Hand up towards chin for thinking
                : isCelebrating
                ? "M75 160 C50 120 40 90 55 75"    // Arms up celebrating!
                : "M75 160 C55 170 50 195 65 205"  // Normal pose holding tablet
            }
            stroke="#0284C7"
            strokeWidth="14"
            strokeLinecap="round"
            className="transition-all duration-300"
          />

          {/* RIGHT ARM */}
          <path
            d={
              isWaving
                ? "M185 160 C210 130 220 100 205 85"  // High Wave pose
                : isCelebrating
                ? "M185 160 C210 120 220 90 205 75"   // Arms up celebrating!
                : isRecommending
                ? "M185 160 C195 180 160 190 145 180" // Pointing to tablet
                : "M185 160 C205 170 210 195 195 205" // Standard resting pose
            }
            stroke="#0284C7"
            strokeWidth="14"
            strokeLinecap="round"
            className={isWaving ? "animate-[pulse_1.5s_ease-in-out_infinite]" : "transition-all duration-300"}
          />

          {/* BODY CAPSULE */}
          <rect
            x="60"
            y="90"
            width="140"
            height="160"
            rx="70"
            fill="url(#campusMascotBody)"
            stroke="#38BDF8"
            strokeWidth="4"
          />

          {/* INNER BELLY PATCH */}
          <rect
            x="80"
            y="135"
            width="100"
            height="100"
            rx="50"
            fill="#F0F9FF"
            opacity="0.95"
          />

          {/* GLOWING EMBLEM ON CHEST */}
          <circle cx="130" cy="180" r="14" fill="#0284C7" opacity="0.15" />
          <path
            d="M130 171 L133 177 L139 180 L133 183 L130 189 L127 183 L121 180 L127 177 Z"
            fill="#0284C7"
            className="animate-[spin_8s_linear_infinite]"
          />

          {/* FACE SCREEN / EYES & EXPRESSION */}
          <rect
            x="75"
            y="105"
            width="110"
            height="65"
            rx="24"
            fill="#0F172A"
          />

          {/* EYE PUPILS WITH CURSOR TRACKING */}
          <g transform={`translate(${mousePos.x}, ${mousePos.y})`}>
            {/* Left Eye */}
            <circle cx="105" cy="132" r={isCelebrating ? "10" : "9"} fill="#38BDF8">
              <animate attributeName="r" values="9;9;1;9;9" keyTimes="0;0.45;0.5;0.55;1" dur="4s" repeatCount="indefinite" />
            </circle>
            {/* Right Eye */}
            <circle cx="155" cy="132" r={isCelebrating ? "10" : "9"} fill="#38BDF8">
              <animate attributeName="r" values="9;9;1;9;9" keyTimes="0;0.45;0.5;0.55;1" dur="4s" repeatCount="indefinite" />
            </circle>

            {/* Eye Reflection Highlights */}
            <circle cx="107" cy="129" r="3" fill="#FFFFFF" />
            <circle cx="157" cy="129" r="3" fill="#FFFFFF" />

            {/* Star pupil eyes when celebrating */}
            {isCelebrating && (
              <g fill="#FBBF24">
                <path d="M105 125 L106 129 L110 132 L106 135 L105 139 L104 135 L100 132 L104 129 Z" />
                <path d="M155 125 L156 129 L160 132 L156 135 L155 139 L154 135 L150 132 L154 129 Z" />
              </g>
            )}
          </g>

          {/* MOUTH EXPRESSIONS */}
          {isCelebrating ? (
            /* Open Happy Smile */
            <path d="M115 145 C120 158 140 158 145 145 Z" fill="#38BDF8" />
          ) : isThinking ? (
            /* O-shaped Curious Mouth */
            <circle cx="130" cy="148" r="5" fill="#38BDF8" />
          ) : isAnalyzing ? (
            /* Focused Straight Mouth */
            <line x1="120" y1="148" x2="140" y2="148" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
          ) : (
            /* Standard Friendly Smile Curve */
            <path d="M120 146 Q130 154 140 146" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          )}

          {/* GRADUATION CAP ACCESSORY */}
          <path d="M130 35 L190 55 L130 75 L70 55 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
          <rect x="110" y="45" width="40" height="20" fill="#0369A1" rx="4" />
          <path d="M175 60 L185 85 L180 88" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="180" cy="88" r="4" fill="#F59E0B" />

          {/* INTERACTIVE TABLET / DASHBOARD HELD BY MASCOT */}
          <g transform="translate(45, 175) rotate(-6)">
            <rect x="0" y="0" width="75" height="52" rx="8" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
            <rect x="5" y="5" width="65" height="42" rx="4" fill="#0F172A" />
            {/* Live Chart Indicator */}
            <path d="M10 38 L25 28 L40 32 L60 18" stroke="#38BDF8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="60" cy="18" r="3" fill="#34D399" />
          </g>

          {/* GRADIENT DEFINITION */}
          <defs>
            <linearGradient id="campusMascotBody" x1="60" y1="90" x2="200" y2="250" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#F0F9FF" />
              <stop offset="40%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
