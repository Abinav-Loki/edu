import React from "react";
import { GraduationCap, BookOpen, CheckCircle2, Award } from "lucide-react";

export type StudentMood = "confident" | "challenged" | "supported" | "achieving";

interface StudentCharacterProps {
  mood?: StudentMood;
  name?: string;
  className?: string;
}

export default function StudentCharacter({
  mood = "confident",
  name = "Alex",
  className = ""
}: StudentCharacterProps) {
  const isChallenged = mood === "challenged";
  const isSupported = mood === "supported";
  const isAchieving = mood === "achieving";

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Student Badge */}
      <div className="mb-2 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-950/80 border border-sky-200 text-sky-800 dark:text-sky-300 text-[11px] font-extrabold flex items-center gap-1.5 shadow-2xs">
        <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
        <span>Student: {name}</span>
        {isAchieving && <Award className="w-3.5 h-3.5 text-amber-500" />}
      </div>

      {/* SVG Student Illustration */}
      <div className="relative z-10 transition-transform duration-300 hover:scale-105">
        <svg
          viewBox="0 0 200 240"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-48 h-56 drop-shadow-md"
        >
          {/* Shadow */}
          <ellipse cx="100" cy="225" rx="45" ry="8" fill="#0284C7" opacity="0.15" />

          {/* BACKPACK */}
          <rect x="50" y="105" width="22" height="65" rx="8" fill="#0284C7" />

          {/* STUDENT BODY / HOODIE */}
          <path
            d="M60 110 C60 95 140 95 140 110 L145 200 C145 205 135 210 100 210 C65 210 55 205 55 200 Z"
            fill="#0369A1"
          />
          {/* Hoodie Collar Accent */}
          <path d="M85 110 L100 135 L115 110" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" fill="none" />

          {/* HEAD & HAIR */}
          <circle cx="100" cy="70" r="32" fill="#FDE68A" /> {/* Hair backdrop */}
          <circle cx="100" cy="74" r="28" fill="#FCA5A5" /> {/* Face skin tone */}
          <path d="M72 70 C72 45 128 45 128 70 C128 55 115 50 100 50 C85 50 72 55 72 70 Z" fill="#D97706" /> {/* Stylish Hair */}

          {/* EYES */}
          {isChallenged ? (
            /* Worried Eyes */
            <g stroke="#1E293B" strokeWidth="3" strokeLinecap="round">
              <line x1="88" y1="68" x2="96" y2="72" />
              <line x1="104" y1="72" x2="112" y2="68" />
            </g>
          ) : (
            /* Happy Expressive Eyes */
            <g fill="#1E293B">
              <circle cx="90" cy="70" r="4" />
              <circle cx="110" cy="70" r="4" />
              <circle cx="91" cy="68" r="1.5" fill="#FFFFFF" />
              <circle cx="111" cy="68" r="1.5" fill="#FFFFFF" />
            </g>
          )}

          {/* MOUTH */}
          {isChallenged ? (
            <path d="M92 85 Q100 80 108 85" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
          ) : isAchieving ? (
            <path d="M90 80 C95 92 105 92 110 80 Z" fill="#E11D48" />
          ) : (
            <path d="M92 80 Q100 88 108 80" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
          )}

          {/* HELD ITEM: BOOKS OR TABLET */}
          <g transform="translate(68, 140)">
            <rect x="0" y="0" width="64" height="42" rx="6" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
            <line x1="8" y1="12" x2="56" y2="12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <line x1="8" y1="22" x2="42" y2="22" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <line x1="8" y1="32" x2="50" y2="32" stroke="#FDE68A" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Status Pill */}
      <div className="mt-2 text-center">
        <span
          className={`text-xs font-extrabold px-3 py-1 rounded-full ${
            isChallenged
              ? "bg-amber-100 text-amber-800 border border-amber-200"
              : isAchieving
              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
              : "bg-sky-100 text-sky-800 border border-sky-200"
          }`}
        >
          {isChallenged
            ? "Facing Quiz Challenge"
            : isSupported
            ? "CampusOS AI Supported"
            : isAchieving
            ? "Mastery Achieved! 🏆"
            : "Active Learner"}
        </span>
      </div>
    </div>
  );
}
