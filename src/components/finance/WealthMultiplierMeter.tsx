import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Flame, ShieldAlert, Sparkles, TrendingUp } from "lucide-react";

export interface WealthMultiplierMeterProps {
  startMs?: number;
  className?: string;
}

/**
 * ⚡ WealthMultiplierMeter
 * High-impact dark metric comparing cash erosion against productive capital multiplier.
 */
export const WealthMultiplierMeter: React.FC<WealthMultiplierMeterProps> = ({
  startMs = 0,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.floor((startMs / 1000) * fps);
  const relFrame = Math.max(0, frame - startFrame);

  const sp = spring({
    frame: relFrame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 130 },
  });

  const inflationLoss = (sp * 52).toFixed(0);
  const assetGain = (sp * 840).toFixed(0);

  return (
    <div className={`w-full flex gap-5 select-none ${className}`}>
      {/* 1. Cash In Bank (The Loss Trap) */}
      <div className="flex-1 rounded-[40px] p-8 bg-slate-900/90 border-[3px] border-rose-500/30 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
          </div>
          <span className="text-rose-400 font-mono font-black text-xl tracking-wider">CASH SAVINGS</span>
        </div>

        <div className="my-4">
          <div className="text-rose-500 font-mono font-black text-5xl tracking-tight">
            -{inflationLoss}%
          </div>
          <div className="text-slate-400 font-bold text-2xl mt-1">Purchasing Power</div>
        </div>

        <div className="px-4 py-2 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 font-mono text-lg font-bold text-center">
          SLOW EVAPORATION
        </div>
      </div>

      {/* 2. Productive Capital (The Growth Engine) */}
      <div className="flex-1 rounded-[40px] p-8 bg-slate-900/90 border-[3px] border-emerald-500/50 backdrop-blur-xl shadow-[0_20px_50px_rgba(16,185,129,0.2)] flex flex-col justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="text-emerald-400 font-mono font-black text-xl tracking-wider">REAL ASSETS</span>
        </div>

        <div className="my-4">
          <div className="text-emerald-400 font-mono font-black text-5xl tracking-tight">
            +{assetGain}%
          </div>
          <div className="text-slate-200 font-bold text-2xl mt-1">Compounding Return</div>
        </div>

        <div className="px-4 py-2 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-mono text-lg font-black text-center">
          EXPONENTIAL FREEDOM
        </div>
      </div>
    </div>
  );
};
