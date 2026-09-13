import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface ThresholdBoundaryShiftProps {
  /** Frame at which the micro-concession impulse strikes the boundary */
  triggerFrame: number;
  /** Label for the initial strict standard (defaults to "INTEGRITY STANDARD") */
  initialLabel?: string;
  /** Label for the impulse event (defaults to "JUST THIS ONCE") */
  impulseLabel?: string;
  /** Label for the mutated new baseline (defaults to "NEW BASELINE: OPTIONAL") */
  mutatedLabel?: string;
  /** Vertical displacement in pixels (default: 220px) */
  displacementPx?: number;
  /** Width of the threshold container (default: 820px) */
  width?: number;
  /** Optional custom CSS class */
  className?: string;
}

/**
 * 🎬 RightMotion — ThresholdBoundaryShift
 * ============================================================
 * Embodies the "Physical Boundary Displacement & Baseline Recalibration" mechanism.
 * 
 * Instead of displaying static cards with changing numbers:
 *   1. The viewer watches a solid horizontal integrity line.
 *   2. At triggerFrame, an impulse strikes it.
 *   3. The boundary visibly sags and shifts downward with snappy spring physics.
 *   4. The original boundary position remains as a ghosted/faded dashed memory line.
 *   5. The shifted line solidifies into the new operational baseline.
 */
export const ThresholdBoundaryShift: React.FC<ThresholdBoundaryShiftProps> = ({
  triggerFrame,
  initialLabel = "ORIGINAL STANDARD",
  impulseLabel = "JUST THIS ONCE",
  mutatedLabel = "NEW BASELINE: OPTIONAL",
  displacementPx = 220,
  width = 820,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring physics for displacement
  const shiftSpring = spring({
    frame: frame - triggerFrame,
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.6 },
  });

  // Impulse impact spring (snappy bounce on impact)
  const impulseSpring = spring({
    frame: frame - triggerFrame,
    fps,
    config: { damping: 12, stiffness: 180, mass: 0.5 },
  });

  const isTriggered = frame >= triggerFrame;
  const currentDisplacement = isTriggered
    ? interpolate(shiftSpring, [0, 1], [0, displacementPx])
    : 0;

  const ghostLineOpacity = isTriggered
    ? interpolate(shiftSpring, [0, 1], [0, 0.45])
    : 0;

  const newBaselineGlow = isTriggered
    ? interpolate(shiftSpring, [0, 0.8, 1], [0, 1, 0.2])
    : 0;

  return (
    <div
      className={`relative flex flex-col items-center select-none ${className}`}
      style={{ width, minHeight: displacementPx + 240 }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. GHOST LINE: NARRATIVE MEMORY OF THE ORIGINAL STANDARD      */}
      {/* ------------------------------------------------------------- */}
      {isTriggered && (
        <div
          className="absolute top-0 left-0 right-0 flex flex-col gap-2 pointer-events-none"
          style={{ opacity: ghostLineOpacity }}
        >
          <div className="w-full flex items-center justify-between px-2">
            <span className="text-[36px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              {initialLabel} [ORIGINAL]
            </span>
            <span className="text-[36px] font-mono font-black text-rose-500/80 uppercase">
              ABANDONED
            </span>
          </div>
          {/* Dashed Ghost Memory Line */}
          <div className="w-full h-1 border-b-[3.5px] border-dashed border-slate-400" />
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. THE IMPULSE: CONCESSION STRIKE AT TRIGGER FRAME            */}
      {/* ------------------------------------------------------------- */}
      {isTriggered && frame < triggerFrame + 45 && (
        <div
          className="absolute left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          style={{
            top: interpolate(impulseSpring, [0, 1], [-40, currentDisplacement - 60]),
            opacity: interpolate(frame, [triggerFrame, triggerFrame + 10, triggerFrame + 40], [0, 1, 0]),
            transform: `translateX(-50%) scale(${interpolate(impulseSpring, [0, 1], [0.8, 1.05])})`,
          }}
        >
          <div className="px-6 py-2 rounded-xl bg-rose-600 text-white border-[2.5px] border-slate-950 shadow-2xl flex items-center gap-3">
            <span className="text-[38px] font-black uppercase tracking-tight">
              ⚡ {impulseLabel}
            </span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. THE ACTIVE PHYSICAL THRESHOLD BOUNDARY                     */}
      {/* ------------------------------------------------------------- */}
      <div
        className="absolute left-0 right-0 flex flex-col gap-3 transition-all"
        style={{
          transform: `translateY(${currentDisplacement}px)`,
        }}
      >
        {/* Threshold Status Bar */}
        <div className="w-full flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <span
              className={`text-[40px] font-mono font-black uppercase tracking-tight ${
                isTriggered ? "text-rose-600" : "text-slate-900"
              }`}
            >
              {isTriggered ? mutatedLabel : initialLabel}
            </span>
          </div>
          <span
            className={`text-[36px] font-mono font-bold uppercase ${
              isTriggered ? "text-rose-600" : "text-emerald-600"
            }`}
          >
            {isTriggered ? "−1.0° RECALIBRATED" : "100% STRICT"}
          </span>
        </div>

        {/* Solid Architectural Boundary Line with Crisp Contrast */}
        <div
          className={`w-full rounded-full transition-all ${
            isTriggered
              ? "h-[7px] bg-rose-600 shadow-[0_12px_28px_rgba(225,29,72,0.3)]"
              : "h-[6px] bg-slate-950 shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
          }`}
          style={{
            boxShadow: isTriggered
              ? `0 0 ${newBaselineGlow * 30}px rgba(225,29,72,${newBaselineGlow * 0.8})`
              : undefined,
          }}
        />

        {/* Sub-threshold annotation (Appears after shift settles) */}
        {isTriggered && (
          <div
            className="w-full flex items-center justify-between px-2 pt-1"
            style={{
              opacity: interpolate(shiftSpring, [0.6, 1], [0, 1]),
            }}
          >
            <span className="text-[36px] font-mono font-bold text-slate-500 uppercase">
              STATUS: PRECEDENT SET
            </span>
            <span className="text-[36px] font-mono font-black text-slate-900 uppercase">
              NEW ZERO POINT
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
