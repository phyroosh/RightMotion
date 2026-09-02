import React from "react";
import { Sparkles, ShieldCheck, Heart } from "lucide-react";

export interface MetabolicStatusCardProps {
  className?: string;
}

/**
 * 🧪 MetabolicStatusCard
 * Clinical solution card for metabolic stability and deep unbroken sleep.
 */
export const MetabolicStatusCard: React.FC<MetabolicStatusCardProps> = ({ className = "" }) => {
  return (
    <div
      className={`w-full rounded-[48px] p-9 bg-slate-900/90 border-[3px] border-emerald-500/40 backdrop-blur-2xl shadow-[0_30px_80px_rgba(16,185,129,0.18)] flex flex-col items-center gap-6 text-center select-none ${className}`}
    >
      <div className="px-8 py-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xl font-black uppercase tracking-widest flex items-center gap-3">
        <ShieldCheck className="w-7 h-7 text-emerald-400" />
        THE METABOLIC PROTOCOL
      </div>

      <div className="text-white font-black text-4xl md:text-5xl leading-tight">
        1 Spoon Of Healthy Fats Before Bed
      </div>

      <div className="w-full p-5 rounded-3xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-200 text-2xl font-bold leading-snug">
        Keeps your liver glycogen fueled all night so adrenaline never triggers.
      </div>

      <div className="px-8 py-3.5 rounded-2xl bg-slate-950 border border-emerald-500/50 text-emerald-400 font-mono text-2xl font-black">
        UNBROKEN SLEEP • CALM NERVOUS SYSTEM
      </div>
    </div>
  );
};
