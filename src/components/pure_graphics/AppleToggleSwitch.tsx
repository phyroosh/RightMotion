import React from "react";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

export const AppleToggleSwitch: React.FC = () => {
  return (
    <div className="w-full max-w-[980px] rounded-[48px] p-9 bg-white/95 backdrop-blur-2xl shadow-[0_25px_60px_rgba(15,23,42,0.10)] border-[3px] border-emerald-300/80 flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex items-center justify-between w-full">
        <div className="px-6 py-2.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-black text-lg uppercase tracking-widest flex items-center gap-2.5">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          HEALING PROTOCOL • REFRAME
        </div>
        <div className="px-5 py-2 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-base">
          MINDSET SHIFT
        </div>
      </div>

      {/* Main Title */}
      <div className="text-4xl font-black text-slate-900 tracking-tight text-center leading-tight">
        You Don't Have To Forgive
      </div>

      {/* Apple Glass Interactive Toggle Pill */}
      <div className="w-full bg-slate-100/90 rounded-2xl p-2.5 flex items-center gap-3 border border-slate-200/80 shadow-inner">
        {/* Disabled Left Option */}
        <div className="flex-1 py-4 px-3 rounded-xl bg-slate-200/60 text-slate-400 font-black text-xl flex items-center justify-center gap-2 line-through">
          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>FORCE FORGIVENESS</span>
        </div>

        {/* Active Right Option */}
        <div className="flex-1 py-4 px-3 rounded-xl bg-white shadow-md text-emerald-700 font-black text-xl border border-emerald-100 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <span>INNER DETACHMENT</span>
        </div>
      </div>

      {/* Subtitle Card */}
      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-emerald-950 font-bold text-xl text-center">
        Healing is not about approving of their actions. It's about reclaiming your mental peace.
      </div>
    </div>
  );
};
