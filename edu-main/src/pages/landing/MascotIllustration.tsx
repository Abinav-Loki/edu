import React from "react";
import { TrendingDown, ShieldAlert, CheckCircle2, UserCheck, Sparkles } from "lucide-react";

export default function MascotIllustration() {
  return (
    <div className="relative w-full max-w-lg mx-auto flex items-center justify-center py-6">
      {/* Background Soft Glow Radial */}
      <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/20 via-cyan-300/20 to-indigo-400/20 rounded-full blur-3xl scale-95 pointer-events-none" />

      {/* Floating Orbital Rings */}
      <div className="absolute w-80 h-80 rounded-full border border-sky-200/60 dark:border-sky-800/40 animate-[spin_40s_linear_infinite] pointer-events-none" />
      <div className="absolute w-[22rem] h-[22rem] rounded-full border border-dashed border-indigo-200/50 dark:border-indigo-800/30 animate-[spin_60s_linear_infinite_reverse] pointer-events-none" />

      {/* ORIGINAL CAMPUSOS AI MASCOT (SVG) */}
      <div className="relative z-10 animate-[typingBounce_6s_ease-in-out_infinite] drop-shadow-xl">
        <svg
          width="260"
          height="280"
          viewBox="0 0 260 280"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-56 h-60 sm:w-64 sm:h-68"
        >
          {/* Shadow beneath mascot */}
          <ellipse cx="130" cy="265" rx="65" ry="12" fill="#0EA5E9" opacity="0.15" />

          {/* Left Arm holding tablet */}
          <path
            d="M75 160 C55 170 50 195 65 205"
            stroke="#0284C7"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Right Arm waving slightly */}
          <path
            d="M185 160 C205 150 215 130 205 115"
            stroke="#0284C7"
            strokeWidth="14"
            strokeLinecap="round"
            className="animate-[pulse_3s_ease-in-out_infinite]"
          />

          {/* Body Main Capsule */}
          <rect
            x="60"
            y="90"
            width="140"
            height="160"
            rx="70"
            fill="url(#bodyGradient)"
            stroke="#38BDF8"
            strokeWidth="4"
          />

          {/* Inner Belly Patch */}
          <rect
            x="80"
            y="135"
            width="100"
            height="100"
            rx="50"
            fill="#F0F9FF"
            opacity="0.9"
          />

          {/* Face Screen / Eyes & Smile */}
          <rect
            x="75"
            y="105"
            width="110"
            height="65"
            rx="24"
            fill="#0F172A"
          />

          {/* Glowing Eyes */}
          <circle cx="105" cy="132" r="9" fill="#38BDF8">
            <animate attributeName="r" values="9;9;1;9;9" keyTimes="0;0.45;0.5;0.55;1" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="155" cy="132" r="9" fill="#38BDF8">
            <animate attributeName="r" values="9;9;1;9;9" keyTimes="0;0.45;0.5;0.55;1" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="107" cy="129" r="3" fill="#FFFFFF" />
          <circle cx="157" cy="129" r="3" fill="#FFFFFF" />

          {/* Friendly Smile Curve */}
          <path
            d="M120 148 Q130 156 140 148"
            stroke="#38BDF8"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Graduation Cap on Head */}
          <path d="M130 35 L190 55 L130 75 L70 55 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
          <rect x="110" y="45" width="40" height="20" fill="#0369A1" rx="4" />
          <path d="M175 60 L185 85 L180 88" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" fill="none" />
          <circle cx="180" cy="88" r="4" fill="#F59E0B" />

          {/* Interactive Tablet Held by Mascot */}
          <g transform="translate(45, 175) rotate(-8)">
            <rect x="0" y="0" width="70" height="50" rx="8" fill="#1E293B" stroke="#38BDF8" strokeWidth="2" />
            <rect x="5" y="5" width="60" height="40" rx="4" fill="#0F172A" />
            {/* Chart Bars */}
            <rect x="12" y="30" width="7" height="10" rx="2" fill="#38BDF8" />
            <rect x="23" y="22" width="7" height="18" rx="2" fill="#818CF8" />
            <rect x="34" y="16" width="7" height="24" rx="2" fill="#34D399" />
            <rect x="45" y="26" width="7" height="14" rx="2" fill="#FBBF24" />
          </g>

          {/* Gradients */}
          <defs>
            <linearGradient id="bodyGradient" x1="60" y1="90" x2="200" y2="250" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#E0F2FE" />
              <stop offset="50%" stopColor="#BAE6FD" />
              <stop offset="100%" stopColor="#7DD3FC" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* FLOATING INTELLIGENCE CARDS (ORBITING MASCOT) */}

      {/* Card 1: Attendance Drop */}
      <div className="absolute top-2 left-0 sm:-left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-sky-100 shadow-lg shadow-sky-500/10 flex items-center gap-2 text-xs font-bold text-slate-700 animate-[float_4s_ease-in-out_infinite]">
        <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
          <TrendingDown className="w-3.5 h-3.5" />
        </div>
        <div>
          <span className="block text-[10px] text-slate-400 font-semibold uppercase">Signal</span>
          <span className="text-rose-600">Attendance ↓ 8%</span>
        </div>
      </div>

      {/* Card 2: Quiz Warning */}
      <div className="absolute top-8 right-0 sm:-right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-sky-100 shadow-lg shadow-sky-500/10 flex items-center gap-2 text-xs font-bold text-slate-700 animate-[float_5s_ease-in-out_infinite_1s]">
        <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-3.5 h-3.5" />
        </div>
        <div>
          <span className="block text-[10px] text-slate-400 font-semibold uppercase">Pattern</span>
          <span className="text-amber-600">Quiz Trend ↓</span>
        </div>
      </div>

      {/* Card 3: Risk Detected Badge */}
      <div className="absolute bottom-24 right-2 sm:-right-6 bg-slate-900 text-white px-3 py-1.5 rounded-xl border border-slate-700 shadow-xl flex items-center gap-2 text-xs font-bold animate-[float_6s_ease-in-out_infinite_0.5s]">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <span>Risk Detected</span>
      </div>

      {/* Card 4: Recommended Intervention */}
      <div className="absolute bottom-6 left-0 sm:-left-6 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-indigo-100 shadow-xl shadow-indigo-500/10 max-w-[210px] text-xs animate-[float_4.5s_ease-in-out_infinite_1.5s]">
        <div className="flex items-center gap-1.5 text-indigo-600 font-extrabold mb-1">
          <UserCheck className="w-3.5 h-3.5" />
          <span>AI Intervention:</span>
        </div>
        <p className="text-[11px] text-slate-600 font-medium leading-tight">
          Mentor Follow-up + Study Recovery Plan
        </p>
      </div>

      {/* Card 5: Positive Outcome Card */}
      <div className="absolute -bottom-2 right-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-3.5 py-2 rounded-2xl shadow-lg shadow-emerald-500/20 text-xs font-extrabold flex items-center gap-2 animate-[float_5.5s_ease-in-out_infinite_2s]">
        <CheckCircle2 className="w-4 h-4 text-emerald-200" />
        <div>
          <span className="block text-[9px] opacity-90 font-medium uppercase tracking-wider">Outcome (Illustrative)</span>
          <span>Risk ↓ 18%</span>
        </div>
      </div>
    </div>
  );
}
