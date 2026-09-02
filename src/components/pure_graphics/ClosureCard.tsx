import React from "react";
import { Sparkles, Shield, KeyRound } from "lucide-react";

export const ClosureCard: React.FC = () => {
  return (
    <div className="w-full max-w-[1000px] rounded-[52px] p-12 bg-white/95 backdrop-blur-2xl shadow-[0_30px_70px_rgba(245,158,11,0.22)] border-[4px] border-amber-400/90 flex flex-col items-center gap-8 text-center">
      {/* Top Header Badge */}
      <div className="px-8 py-3 rounded-full bg-amber-500/15 border-2 border-amber-400 text-amber-900 font-mono font-black text-2xl uppercase tracking-widest flex items-center gap-3">
        <Sparkles className="w-7 h-7 text-amber-600" />
        FINAL RESOLUTION
      </div>

      {/* Massive Bold Headline */}
      <div className="text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-tight max-w-[900px]">
        "I'm Not Giving This Any More Space In Me."
      </div>

      {/* Metric Badge Pill */}
      <div className="flex items-center gap-5 w-full justify-center mt-2">
        <div className="px-8 py-4 rounded-3xl bg-slate-950 text-amber-300 font-mono font-black text-2xl flex items-center gap-3 shadow-xl">
          <KeyRound className="w-7 h-7 text-amber-400" />
          SPACE FREED: 100%
        </div>
        <div className="px-8 py-4 rounded-3xl bg-emerald-50 border-2 border-emerald-300 text-emerald-900 font-mono font-black text-2xl flex items-center gap-3 shadow-sm">
          <Shield className="w-7 h-7 text-emerald-600" />
          PEACE RESTORED
        </div>
      </div>
    </div>
  );
};
