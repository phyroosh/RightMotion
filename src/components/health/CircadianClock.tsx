import React from "react";
import { Clock, ShieldAlert, AlertTriangle } from "lucide-react";

export interface CircadianClockProps {
  className?: string;
}

/**
 * ⏰ CircadianClock
 * Visual 24-hour biological cycle highlighting the 03:00 AM metabolic crisis point.
 */
export const CircadianClock: React.FC<CircadianClockProps> = ({ className = "" }) => {
  return (
    <div
      className={`relative w-full rounded-[48px] p-9 bg-slate-900/90 border-[3px] border-rose-500/40 backdrop-blur-2xl shadow-[0_30px_80px_rgba(244,63,94,0.18)] flex flex-col items-center gap-6 select-none ${className}`}
    >
      <div className="px-8 py-2.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-mono text-xl font-black uppercase tracking-widest flex items-center gap-3">
        <Clock className="w-6 h-6 text-rose-400" />
        THE 03:00 AM ANOMALY
      </div>

      <div className="text-center">
        <div className="text-white font-black text-5xl md:text-6xl tracking-tight">
          03:14 <span className="text-rose-500">AM</span>
        </div>
        <div className="text-slate-300 font-mono text-2xl font-bold mt-2">
          Adrenal Emergency Spike
        </div>
      </div>

      <div className="w-full p-5 rounded-3xl bg-rose-950/50 border border-rose-500/40 flex items-center gap-4">
        <AlertTriangle className="w-8 h-8 text-rose-400 shrink-0" />
        <div className="text-rose-200 text-2xl font-bold leading-snug">
          Liver runs out of glycogen → Cortisol & adrenaline surge to prevent hypoglycemia.
        </div>
      </div>
    </div>
  );
};
