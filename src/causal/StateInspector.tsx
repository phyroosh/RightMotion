import React from "react";
import { useCausalWorld } from "./CausalWorld";

export interface StateInspectorProps {
  enabled?: boolean;
  monitoredNodeIds?: string[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 🔍 StateInspector
 * Developer-only HUD for Frontier #7 Visual State Machines & Causal Storytelling.
 * Displays real-time state, transition chain, active events, and persistent memory.
 */
export const StateInspector: React.FC<StateInspectorProps> = ({
  enabled = true,
  monitoredNodeIds,
  className = "",
  style = {},
}) => {
  const { timeline, currentFrame, fps, globalMemory } = useCausalWorld();

  if (!enabled) return null;

  const events = timeline.events.filter((e) => e.frame <= currentFrame);
  const recentEvents = events.slice(-4).reverse();

  // All trace entries up to now
  const recentTrace = timeline.traceLog
    .filter((t) => t.frame <= currentFrame)
    .slice(-3)
    .reverse();

  return (
    <div
      className={`fixed top-4 left-4 z-50 p-4 rounded-2xl bg-slate-950/90 text-white font-mono text-xs shadow-2xl border border-slate-700 backdrop-blur-md max-w-[420px] pointer-events-none select-none ${className}`}
      style={style}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold tracking-wider text-emerald-400 uppercase">
            FRONTIER #7 // STATE ENGINE
          </span>
        </div>
        <span className="text-slate-400">
          f:{currentFrame} ({(currentFrame / fps).toFixed(2)}s)
        </span>
      </div>

      {/* Monitored Nodes */}
      <div className="space-y-2 mb-3">
        <span className="text-[10px] text-slate-400 tracking-wider uppercase font-bold">
          ACTIVE NODES:
        </span>
        {timeline.traceLog
          .map((t) => t.nodeId)
          .filter((id, idx, arr) => arr.indexOf(id) === idx)
          .filter((id) => !monitoredNodeIds || monitoredNodeIds.includes(id))
          .map((nodeId) => {
            const snap = timeline.getStateAtFrame(nodeId, currentFrame);
            const isAlert =
              snap.condition.includes("CRITICAL") ||
              snap.condition.includes("STRAINED") ||
              snap.condition.includes("FAILED");

            return (
              <div
                key={nodeId}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border ${
                  isAlert
                    ? "bg-rose-950/50 border-rose-600 text-rose-200"
                    : "bg-slate-900 border-slate-800 text-slate-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold">{nodeId}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                      isAlert ? "bg-rose-600 text-white" : "bg-slate-800 text-cyan-400"
                    }`}
                  >
                    {snap.condition}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {Object.entries(snap.values)
                    .map(([k, v]) => `${k}:${typeof v === "number" ? v.toFixed(2) : v}`)
                    .join(" ")}
                </span>
              </div>
            );
          })}
      </div>

      {/* Recent Causal Transitions */}
      {recentTrace.length > 0 && (
        <div className="mb-3">
          <span className="text-[10px] text-slate-400 tracking-wider uppercase font-bold">
            RECENT CAUSAL TRACE:
          </span>
          <div className="mt-1 space-y-1">
            {recentTrace.map((tr, idx) => (
              <div key={idx} className="text-[10px] text-slate-300">
                <span className="text-amber-400">f:{tr.frame}</span> [{tr.nodeId}] {tr.event} →{" "}
                <span className="text-cyan-300 font-bold">{tr.condition}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* State Memory */}
      {Object.keys(globalMemory).length > 0 && (
        <div className="border-t border-slate-800 pt-2 text-[10px]">
          <span className="text-purple-400 font-bold tracking-wider uppercase">PERSISTENT MEMORY:</span>
          <div className="mt-1 text-slate-300 truncate">
            {JSON.stringify(globalMemory)}
          </div>
        </div>
      )}
    </div>
  );
};
