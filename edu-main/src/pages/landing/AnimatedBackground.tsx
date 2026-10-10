import React from "react";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden bg-slate-50">
      
      {/* Base Vibrant Image - highly blurred and slightly desaturated to keep text readable */}
      <div 
        className="absolute inset-0 w-full h-full opacity-30"
        style={{
          backgroundImage: 'url(/assets/vibrant-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(10px)',
          transform: 'scale(1.1)'
        }}
      />
      
      {/* Animated Glowing Orbs for extra depth */}
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 blur-[120px] animate-[pulse_10s_infinite_ease-in-out]" />
      <div className="absolute top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-teal-400/20 blur-[140px] animate-[pulse_14s_infinite_ease-in-out_2s]" />
      <div className="absolute -bottom-[20%] left-[10%] w-[60%] h-[60%] rounded-full bg-sky-500/20 blur-[130px] animate-[pulse_12s_infinite_ease-in-out_4s]" />
      
      {/* Animated Panning Vibrant Texture Layer */}
      <div 
        className="absolute inset-0 opacity-20 mix-blend-color-burn animate-[bgPan_40s_infinite_alternate_ease-in-out]"
        style={{
          backgroundImage: 'url(/assets/vibrant-bg.jpg)',
          backgroundSize: '150% 150%',
        }}
      />
      
      {/* Subtle Grid Overlay for Academic Feel */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70" />
    </div>
  );
}
