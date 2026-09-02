import React from "react";
import { Sparkles, Shield, KeyRound } from "lucide-react";

export const ClosureCard: React.FC = () => {
  return (
    <div className="w-full max-w-[980px] rounded-[52px] p-10 bg-white/95 backdrop-blur-2xl shadow-[0_30px_70px_rgba(245,158,11,0.18)] border-[4px] border-amber-300/80 flex flex-col items-center gap-7 text-center">
      {/* Top Header Badge */}
      <div className="px-8 py-3 rounded-full bg-amber-500/15 border-2 border-amber-400/50 text-amber-800 font-mono font-black text-xl uppercase tracking-widest flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-amber-600" />
        FINAL RESOLUTION • BOUNDARY SET
      </div>

      {/* Massive Bold Headline */}
      <div className="text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-tight">
        "I'm Not Giving This Any More Space In Me."
      </div>

      {/* Metric Badge Pill */}
      <div className="flex items-center gap-4 w-full justify-center">
        <div className="px-6 py-3.5 rounded-2xl bg-slate-900 text-amber-300 font-mono font-black text-xl flex items-center gap-3 shadow-lg">
          <KeyRound className="w-6 h-6 text-amber-400" />
          MENTAL LEASE EXPIRED
        </div>
        <div className="px-6 py-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-800 font-mono font-black text-xl flex items-center gap-3 shadow-sm">
          <Shield className="w-6 h-6 text-emerald-600" />
          PEACE RESTORED
        </div>
      </div>
    </div>
  );
};
