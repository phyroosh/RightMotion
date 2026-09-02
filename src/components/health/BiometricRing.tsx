import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Activity, Moon, Heart } from "lucide-react";

export interface BiometricRingProps {
  startMs?: number;
  className?: string;
}

/**
 * 🫀 BiometricRing
 * High-tech triple concentric biometric telemetry rings (Sleep, Recovery, Glycogen Reserve).
 */
export const BiometricRing: React.FC<BiometricRingProps> = ({
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
    config: { damping: 18, mass: 0.85, stiffness: 110 },
  });

  // Circumference for r=85: ~534, r=65: ~408, r=45: ~282
  const circ1 = 534;
  const circ2 = 408;
  const circ3 = 282;

  const stroke1 = circ1 * (1 - sp * 0.88); // 88% Recovery
  const stroke2 = circ2 * (1 - sp * 0.92); // 92% Sleep
  const stroke3 = circ3 * (1 - sp * 0.24); // 24% Glycogen (Depleted!)

  return (
    <div
      className={`relative w-full rounded-[48px] p-9 bg-slate-900/90 border-[3px] border-cyan-500/30 backdrop-blur-2xl shadow-[0_30px_80px_rgba(6,182,212,0.18)] flex items-center gap-8 select-none ${className}`}
    >
      {/* SVG Rings */}
      <div className="relative w-56 h-56 shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90 overflow-visible">
          {/* Background tracks */}
          <circle cx="100" cy="100" r="85" stroke="rgba(255,255,255,0.06)" strokeWidth="12" fill="none" />
          <circle cx="100" cy="100" r="65" stroke="rgba(255,255,255,0.06)" strokeWidth="12" fill="none" />
          <circle cx="100" cy="100" r="45" stroke="rgba(255,255,255,0.06)" strokeWidth="12" fill="none" />

          {/* Outer Ring: Cyan (Recovery) */}
          <circle
            cx="100"
            cy="100"
            r="85"
            stroke="#06b6d4"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circ1}
            strokeDashoffset={stroke1}
            style={{ filter: "drop-shadow(0 0 10px rgba(6,182,212,0.6))" }}
          />

          {/* Middle Ring: Mint (Sleep) */}
          <circle
            cx="100"
            cy="100"
            r="65"
            stroke="#10b981"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circ2}
            strokeDashoffset={stroke2}
            style={{ filter: "drop-shadow(0 0 10px rgba(16,185,129,0.6))" }}
          />

          {/* Inner Ring: Rose / Red (Glycogen Depleted!) */}
          <circle
            cx="100"
            cy="100"
            r="45"
            stroke="#f43f5e"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circ3}
            strokeDashoffset={stroke3}
            style={{ filter: "drop-shadow(0 0 10px rgba(244,63,94,0.6))" }}
          />
        </svg>

        {/* Center Icon */}
        <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-slate-950 flex items-center justify-center border border-cyan-400/40">
          <Activity className="w-6 h-6 text-cyan-400 animate-pulse" />
        </div>
      </div>

      {/* Metrics Legend */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30">
          <span className="text-cyan-300 font-mono font-bold text-xl flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_#06b6d4]" />
            Recovery Score
          </span>
          <span className="text-white font-mono font-black text-2xl">88%</span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30">
          <span className="text-emerald-300 font-mono font-bold text-xl flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_#10b981]" />
            Deep Sleep Index
          </span>
          <span className="text-white font-mono font-black text-2xl">92%</span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-950/60 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
          <span className="text-rose-300 font-mono font-black text-xl flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-500 inline-block animate-ping" />
            Liver Glycogen
          </span>
          <span className="text-rose-400 font-mono font-black text-2xl">24% (CRITICAL)</span>
        </div>
      </div>
    </div>
  );
};
