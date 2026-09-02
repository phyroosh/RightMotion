import React from "react";
import { AlertTriangle, Lock, ShieldX } from "lucide-react";

export interface SimulationTreeProps {
  startMs: number;
}

export const SimulationTree: React.FC<SimulationTreeProps> = () => {
  return (
    <div className="w-full max-w-[1000px] rounded-[52px] p-12 bg-white/95 backdrop-blur-2xl shadow-[0_30px_70px_rgba(15,23,42,0.12)] border-[4px] border-amber-300/90 flex flex-col items-center gap-8 text-center">
      {/* Top Header Badge */}
      <div className="px-8 py-3 rounded-full bg-amber-50 border-2 border-amber-300 text-amber-800 font-mono font-black text-2xl uppercase tracking-widest flex items-center gap-3 shadow-sm">
        <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0" />
        THE "WHAT-IF" TRAP
      </div>

      {/* Hero Question in Giant Obsidian Typography */}
      <div className="text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-tight max-w-[880px]">
        "How Could I Have Prevented This?"
      </div>

      {/* Massive Visual Warning Banner */}
      <div className="w-full p-6 rounded-3xl bg-rose-500/10 border-2 border-rose-400/40 flex items-center justify-center gap-4 text-rose-950 font-black text-3xl shadow-sm">
        <Lock className="w-8 h-8 text-rose-600 shrink-0" />
        <span>CANNOT REWRITE THE PAST</span>
      </div>

      {/* Punchy Core Truth */}
      <div className="text-2xl md:text-3xl font-bold text-slate-600 max-w-[820px] leading-snug">
        Replaying the past is your brain trying to solve what is already unchangeable.
      </div>
    </div>
  );
};
