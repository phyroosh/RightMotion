import React from "react";
import { AlertOctagon, GitFork, XCircle } from "lucide-react";

export interface SimulationTreeProps {
  startMs: number;
}

export const SimulationTree: React.FC<SimulationTreeProps> = () => {
  return (
    <div className="w-full max-w-[980px] rounded-[48px] p-9 bg-white/95 backdrop-blur-2xl shadow-[0_25px_60px_rgba(15,23,42,0.10)] border-[3px] border-amber-300/80 flex flex-col gap-6">
      {/* Top Header Badge */}
      <div className="flex items-center justify-between w-full">
        <div className="px-6 py-2.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-mono font-black text-lg uppercase tracking-widest flex items-center gap-2.5">
          <GitFork className="w-6 h-6 text-amber-600" />
          SIMULATION ENGINE • WHAT-IF TRAP
        </div>
        <div className="px-5 py-2 rounded-full bg-rose-50 text-rose-600 font-mono font-black text-base flex items-center gap-2 border border-rose-200">
          <XCircle className="w-4 h-4" />
          ZERO NEW OUTCOMES
        </div>
      </div>

      {/* Root Node: Core Question */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-center font-black text-2xl tracking-wide shadow-md">
        "HOW COULD I HAVE PREVENTED THIS?"
      </div>

      {/* Forked Branches */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {/* Branch 1 */}
        <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200/80 flex flex-col gap-3">
          <span className="font-mono text-sm font-bold text-slate-400 uppercase tracking-widest">
            SIMULATION A
          </span>
          <span className="font-black text-xl text-slate-800">
            "If I had reacted differently..."
          </span>
          <div className="mt-auto px-4 py-2 rounded-xl bg-rose-100 text-rose-700 font-bold text-sm flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0" />
            Outcome: Memory Unchanged
          </div>
        </div>

        {/* Branch 2 */}
        <div className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200/80 flex flex-col gap-3">
          <span className="font-mono text-sm font-bold text-slate-400 uppercase tracking-widest">
            SIMULATION B
          </span>
          <span className="font-black text-xl text-slate-800">
            "If I saw the warning signs..."
          </span>
          <div className="mt-auto px-4 py-2 rounded-xl bg-rose-100 text-rose-700 font-bold text-sm flex items-center gap-2">
            <XCircle className="w-4 h-4 shrink-0" />
            Outcome: Energy Wasted
          </div>
        </div>
      </div>

      {/* Warning Footer */}
      <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-400/40 flex items-center gap-3 text-amber-900 font-black text-xl">
        <AlertOctagon className="w-6 h-6 text-amber-600 shrink-0" />
        <span>Cognitive Reality: No amount of replaying rewrites the past.</span>
      </div>
    </div>
  );
};
