import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface KineticTensionDialProps {
  label: string;
  sublabel?: string;
  startFrame: number;
  /** Frame when dial reaches peak tension */
  peakFrame: number;
  initialValue?: number; // 0 to 100
  targetValue: number;   // 0 to 100
  criticalThreshold?: number; // e.g. 75 (triggers red alert & tremble)
  unit?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ⏱️ KineticTensionDial
 * Precision gauge representing tension, cortisol, resistance, or capacity.
 * Features dynamic needle sweep, critical threshold alarm, and trembling physics.
 */
export const KineticTensionDial: React.FC<KineticTensionDialProps> = ({
  label,
  sublabel,
  startFrame,
  peakFrame,
  initialValue = 15,
  targetValue = 92,
  criticalThreshold = 75,
  unit = "PSI",
  width = 540,
  height = 420,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isStarted = frame >= startFrame;
  const relFrame = Math.max(0, frame - startFrame);
  const dur = Math.max(1, peakFrame - startFrame);

  // Smooth needle sweep with spring acceleration
  const sweepProgress = isStarted
    ? interpolate(relFrame, [0, dur], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const sp = isStarted
    ? spring({
        frame: relFrame,
        fps,
        config: { damping: 14, stiffness: 120 },
      })
    : 0;

  const rawValue = interpolate(
    sp,
    [0, 1],
    [initialValue, targetValue]
  );

  // Tremble vibration if value exceeds critical threshold
  const isCritical = rawValue >= criticalThreshold;
  let trembleOffset = 0;
  if (isCritical && frame >= peakFrame - 10) {
    trembleOffset = Math.sin(frame * 1.6) * 2.8 + (Math.random() - 0.5) * 2.0;
  }

  const displayValue = Math.min(100, Math.max(0, Math.round(rawValue + trembleOffset * 0.4)));

  // Gauge angles: -120deg (0%) to +120deg (100%)
  const needleAngle = interpolate(displayValue, [0, 100], [-120, 120]) + trembleOffset;

  return (
    <div
      className={`relative rounded-3xl bg-white border-[2.5px] border-slate-900 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16)] p-8 flex flex-col items-center justify-between select-none overflow-hidden ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        ...style,
      }}
    >
      {/* Header */}
      <div className="text-center z-10">
        <span className="text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
          DIAGNOSTIC TELEMETRY
        </span>
        <h3 className="text-3xl font-black text-slate-950 uppercase tracking-tight">
          {label}
        </h3>
        {sublabel && (
          <p className="text-sm font-mono text-slate-600 mt-0.5">{sublabel}</p>
        )}
      </div>

      {/* Dial SVG Arc & Needle */}
      <div className="relative w-[280px] h-[170px] flex items-end justify-center my-2">
        <svg
          className="absolute inset-0 w-full h-full overflow-visible"
          viewBox="0 0 280 170"
        >
          {/* Background Arc */}
          <path
            d="M 30 150 A 110 110 0 1 1 250 150"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="20"
            strokeLinecap="round"
          />
          {/* Active Tension Arc */}
          <path
            d="M 30 150 A 110 110 0 1 1 250 150"
            fill="none"
            stroke={isCritical ? "#e11d48" : "#0284c7"}
            strokeWidth="20"
            strokeLinecap="round"
            strokeDasharray="420"
            strokeDashoffset={interpolate(
              displayValue,
              [0, 100],
              [420, 420 - 420 * 0.85]
            )}
          />
        </svg>

        {/* Pivot Center Cap */}
        <div className="absolute bottom-0 w-8 h-8 rounded-full bg-slate-950 border-2 border-white shadow-md z-30 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-white" />
        </div>

        {/* Dynamic Rotating Needle */}
        <div
          className="absolute bottom-4 left-1/2 w-2 h-[120px] -translate-x-1/2 origin-bottom z-20"
          style={{
            transform: `translateX(-50%) rotate(${needleAngle}deg)`,
            transition: "transform 0.05s ease-out",
          }}
        >
          <div
            className={`w-full h-full rounded-t-full shadow-lg ${
              isCritical ? "bg-rose-600 shadow-rose-500/50" : "bg-slate-900"
            }`}
          />
        </div>
      </div>

      {/* Readout Footer */}
      <div className="w-full flex items-center justify-between border-t border-slate-200 pt-3 z-10">
        <div className="flex items-baseline gap-1.5 font-mono">
          <span
            className={`text-4xl font-black ${
              isCritical ? "text-rose-600" : "text-slate-950"
            }`}
          >
            {displayValue}
          </span>
          <span className="text-sm font-bold text-slate-500">{unit}</span>
        </div>

        <div
          className={`px-3 py-1 rounded-xl text-xs font-mono font-black border uppercase tracking-wider ${
            isCritical
              ? "bg-rose-100 text-rose-700 border-rose-300 animate-pulse"
              : "bg-slate-100 text-slate-700 border-slate-300"
          }`}
        >
          {isCritical ? "CRITICAL THRESHOLD" : "NOMINAL LOAD"}
        </div>
      </div>
    </div>
  );
};
