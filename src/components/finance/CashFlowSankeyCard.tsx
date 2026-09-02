import React from "react";
import { ArrowRight, Lock, CheckCircle2, XCircle } from "lucide-react";

export interface CashFlowSankeyCardProps {
  className?: string;
}

/**
 * 💸 CashFlowSankeyCard
 * Visual split demonstrating the difference between the Consumer Trap and the Investor Engine.
 */
export const CashFlowSankeyCard: React.FC<CashFlowSankeyCardProps> = ({ className = "" }) => {
  return (
    <div
      className={`w-full rounded-[48px] p-9 bg-slate-900/90 border-[3px] border-amber-500/30 backdrop-blur-2xl shadow-2xl flex flex-col gap-6 select-none ${className}`}
    >
      <div className="text-center">
        <span className="px-6 py-2 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 font-mono text-xl font-black uppercase tracking-widest">
          CAPITAL ALLOCATION
        </span>
        <h3 className="text-white font-black text-4xl mt-3">Where Does Your Money Go?</h3>
      </div>

      <div className="flex flex-col gap-4">
        {/* Trap Path */}
        <div className="p-6 rounded-3xl bg-rose-950/40 border-2 border-rose-500/30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <XCircle className="w-9 h-9 text-rose-500 shrink-0" />
            <div>
              <div className="text-rose-400 font-mono text-xl font-black">THE CONSUMER TRAP</div>
              <div className="text-white font-black text-3xl">Income → Cash In Bank → Value Evaporates</div>
            </div>
          </div>
        </div>

        {/* Wealth Path */}
        <div className="p-6 rounded-3xl bg-emerald-950/50 border-2 border-emerald-500/50 flex items-center justify-between shadow-[0_10px_30px_rgba(16,185,129,0.15)]">
          <div className="flex items-center gap-4">
            <CheckCircle2 className="w-9 h-9 text-emerald-400 shrink-0" />
            <div>
              <div className="text-emerald-400 font-mono text-xl font-black">THE WEALTH ENGINE</div>
              <div className="text-white font-black text-3xl">Income → Productive Assets → Freedom</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
