import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TrendingUp, TrendingDown, DollarSign } from "lucide-react";

export interface CompoundGrowthChartProps {
  startMs?: number;
  durationMs?: number;
  className?: string;
}

/**
 * 📈 CompoundGrowthChart
 * High-velocity dark financial chart comparing the decaying purchasing power of cash
 * versus the exponential hockey-stick compounding of productive assets.
 */
export const CompoundGrowthChart: React.FC<CompoundGrowthChartProps> = ({
  startMs = 0,
  durationMs = 800,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.floor((startMs / 1000) * fps);
  const relFrame = Math.max(0, frame - startFrame);

  const sp = spring({
    frame: relFrame,
    fps,
    config: { damping: 16, mass: 0.9, stiffness: 120 },
  });

  // Stroke draw animation
  const greenDash = interpolate(sp, [0, 1], [650, 0]);
  const redDash = interpolate(sp, [0, 1], [400, 0]);

  // Asset multiplier number counter: 1.0x -> 10.4x
  const assetMultiplier = (1.0 + sp * 9.4).toFixed(1);

  return (
    <div
      className={`relative w-full rounded-[48px] p-10 bg-slate-900/90 border-[3px] border-emerald-500/30 backdrop-blur-2xl shadow-[0_30px_80px_rgba(16,185,129,0.15)] flex flex-col gap-6 select-none ${className}`}
    >
      {/* Header Metric Bar */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <div className="text-emerald-400 font-mono text-xl font-black uppercase tracking-wider">
              ASSET VELOCITY
            </div>
            <div className="text-white font-black text-3xl">Compounding Assets</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-emerald-400 font-mono font-black text-4xl">
            +{assetMultiplier}x
          </div>
          <div className="text-slate-400 font-mono text-lg font-bold">10-YEAR RETURN</div>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative w-full h-[260px] my-2">
        <svg viewBox="0 0 500 240" fill="none" className="w-full h-full overflow-visible">
          {/* Subtle Grid Lines */}
          <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.06)" strokeDasharray="6 6" />
          <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(255,255,255,0.06)" strokeDasharray="6 6" />
          <line x1="0" y1="180" x2="500" y2="180" stroke="rgba(255,255,255,0.06)" strokeDasharray="6 6" />

          {/* Declining Cash Path (Red/Grey) */}
          <path
            d="M 20 120 C 140 135, 300 170, 480 205"
            stroke="#f43f5e"
            strokeWidth="5"
            strokeDasharray="400"
            strokeDashoffset={redDash}
            strokeLinecap="round"
          />

          {/* Exponential Compounding Path (Liquid Emerald) */}
          <path
            d="M 20 120 C 180 115, 320 85, 480 25"
            stroke="#10b981"
            strokeWidth="7"
            strokeDasharray="650"
            strokeDashoffset={greenDash}
            strokeLinecap="round"
            style={{
              filter: "drop-shadow(0 0 14px rgba(16, 185, 129, 0.6))",
            }}
          />

          {/* Target Milestone Nodes */}
          {sp > 0.85 && (
            <>
              <circle cx="480" cy="25" r="9" fill="#10b981" />
              <circle cx="480" cy="25" r="16" fill="rgba(16, 185, 129, 0.3)" />
              <circle cx="480" cy="205" r="7" fill="#f43f5e" />
            </>
          )}
        </svg>

        {/* Floating Node Labels */}
        <div className="absolute right-4 top-2 px-4 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-400 text-emerald-300 font-mono font-black text-xl">
          ASSETS (+1000%)
        </div>
        <div className="absolute right-4 bottom-2 px-4 py-1.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 font-mono font-black text-xl">
          CASH (-50% INFLATION)
        </div>
      </div>

      {/* Takeaway Footer */}
      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-2xl font-bold text-center">
        FIAT CASH EVAPORATES • PRODUCTIVE ASSETS COMPOUND
      </div>
    </div>
  );
};
