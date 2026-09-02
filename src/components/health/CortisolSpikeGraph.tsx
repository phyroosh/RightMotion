import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Zap, ShieldAlert } from "lucide-react";

export interface CortisolSpikeGraphProps {
  startMs?: number;
  className?: string;
}

/**
 * ⚡ CortisolSpikeGraph
 * Graphic demonstrating normal nighttime hormone baseline versus emergency cortisol surge.
 */
export const CortisolSpikeGraph: React.FC<CortisolSpikeGraphProps> = ({
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
    config: { damping: 14, mass: 0.8, stiffness: 120 },
  });

  const spikeDash = interpolate(sp, [0, 1], [500, 0]);

  return (
    <div
      className={`relative w-full rounded-[48px] p-9 bg-slate-900/90 border-[3px] border-cyan-500/40 backdrop-blur-2xl shadow-2xl flex flex-col gap-6 select-none ${className}`}
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Zap className="w-6 h-6 text-cyan-400" />
          </div>
          <span className="text-cyan-300 font-mono font-black text-2xl">HORMONAL TELEMETRY</span>
        </div>

        <div className="px-4 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 font-mono font-black text-xl">
          CORTISOL SURGE
        </div>
      </div>

      {/* SVG Hormone Curve */}
      <div className="relative w-full h-[200px]">
        <svg viewBox="0 0 500 180" fill="none" className="w-full h-full overflow-visible">
          {/* Baseline Normal Sleep Level (Soft Blue/Grey) */}
          <path
            d="M 20 140 C 120 140, 240 140, 480 135"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="4"
            strokeDasharray="8 8"
          />

          {/* Acute Emergency Cortisol Spike (Rose) */}
          <path
            d="M 20 140 C 150 140, 200 135, 250 25 C 290 85, 360 110, 480 115"
            stroke="#f43f5e"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="500"
            strokeDashoffset={spikeDash}
            style={{ filter: "drop-shadow(0 0 12px rgba(244,63,94,0.7))" }}
          />

          {/* Peak Marker */}
          {sp > 0.8 && (
            <>
              <circle cx="250" cy="25" r="8" fill="#f43f5e" />
              <circle cx="250" cy="25" r="15" fill="rgba(244,63,94,0.3)" />
            </>
          )}
        </svg>

        {/* 3 AM Callout */}
        <div className="absolute left-[45%] top-0 -translate-x-1/2 px-4 py-1.5 rounded-xl bg-rose-950 border border-rose-500 text-rose-300 font-mono font-black text-xl shadow-lg">
          3:00 AM SPIKE
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 font-mono text-2xl font-bold text-center">
        NOT ANXIETY • GLUCOSE EMERGENCY SIGNAL
      </div>
    </div>
  );
};
