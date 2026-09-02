import React from "react";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

export const AppleToggleSwitch: React.FC = () => {
  return (
    <div className="w-full max-w-[1000px] rounded-[52px] p-12 bg-white/95 backdrop-blur-2xl shadow-[0_30px_70px_rgba(15,23,42,0.12)] border-[4px] border-emerald-300/90 flex flex-col gap-8 text-center">
      {/* Top Header Badge */}
      <div className="px-8 py-3 rounded-full bg-emerald-50 border-2 border-emerald-300 text-emerald-800 font-mono font-black text-2xl uppercase tracking-widest flex items-center justify-center gap-3 self-center shadow-sm">
        <ShieldCheck className="w-7 h-7 text-emerald-600" />
        HEALING PROTOCOL
      </div>

      {/* Main Title */}
      <div className="text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-tight">
        You Don't Have To Forgive.
      </div>

      {/* Apple Glass Interactive Toggle Pill */}
      <div className="w-full bg-slate-100/95 rounded-3xl p-3 flex items-center gap-4 border-2 border-slate-200 shadow-inner">
        {/* Disabled Left Option */}
        <div className="flex-1 py-5 px-4 rounded-2xl bg-slate-200/60 text-slate-400 font-black text-2xl md:text-3xl flex items-center justify-center gap-3 line-through">
          <XCircle className="w-7 h-7 text-rose-400 shrink-0" />
          <span>FORCE FORGIVE</span>
        </div>

        {/* Active Right Option */}
        <div className="flex-1 py-5 px-4 rounded-2xl bg-white shadow-xl text-emerald-700 font-black text-2xl md:text-3xl border-2 border-emerald-200 flex items-center justify-center gap-3">
          <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
          <span>INNER PEACE</span>
        </div>
      </div>

      {/* Subtitle Card */}
      <div className="p-6 rounded-3xl bg-emerald-500/10 border-2 border-emerald-400/40 text-emerald-950 font-black text-2xl md:text-3xl leading-snug">
        Healing is not about pardoning them. It's about freeing you.
      </div>
    </div>
  );
};
