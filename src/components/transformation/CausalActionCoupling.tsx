import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface CausalActionCouplingProps {
  /** Trigger frame when the cause initiates the effect */
  triggerFrame: number;
  /** Content of the Cause Element */
  causeElement: React.ReactNode;
  /** Content of the Effect Element */
  effectElement: React.ReactNode;
  /** Label for the causal link (e.g. "DIRECT TRIGGER", "RECALIBRATES") */
  couplingLabel?: string;
  /** Width of container (default: 820px) */
  width?: number;
  /** Optional custom CSS class */
  className?: string;
}

/**
 * 🎬 RightMotion — CausalActionCoupling
 * ============================================================
 * Embodies the "Visible Causality" Law (§Rule 8):
 * "A causes B -> A physically triggers / alters / moves / changes B,
 * rather than A appears then later B appears."
 * 
 * Provides an active kinematic bridge transferring energy from Cause to Effect.
 */
export const CausalActionCoupling: React.FC<CausalActionCouplingProps> = ({
  triggerFrame,
  causeElement,
  effectElement,
  couplingLabel = "PHYSICALLY TRIGGERS",
  width = 820,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Snappy pulse spring along the causal connector
  const linkSpring = spring({
    frame: frame - triggerFrame,
    fps,
    config: { damping: 14, stiffness: 140, mass: 0.5 },
  });

  const isCoupled = frame >= triggerFrame;

  return (
    <div
      className={`relative flex flex-col items-center gap-4 select-none ${className}`}
      style={{ width }}
    >
      {/* 1. CAUSE ELEMENT */}
      <div className="w-full">{causeElement}</div>

      {/* 2. ACTIVE KINEMATIC CAUSAL BRIDGE */}
      <div className="w-full flex items-center justify-center py-2 relative">
        <div className="relative flex items-center gap-3 px-6 py-2 rounded-xl bg-slate-900 border-[2px] border-slate-950 text-white shadow-lg z-10">
          <span className="text-[36px] font-mono font-black text-amber-400 uppercase tracking-wider">
            ▼ {couplingLabel}
          </span>
        </div>
        {/* Kinetic Causal Pulse Line */}
        <div
          className={`absolute inset-x-12 h-[4px] rounded-full transition-all ${
            isCoupled ? "bg-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.6)]" : "bg-slate-300"
          }`}
          style={{
            transform: `scaleX(${isCoupled ? interpolate(linkSpring, [0, 1], [0.3, 1]) : 0.3})`,
          }}
        />
      </div>

      {/* 3. EFFECT ELEMENT */}
      <div
        className="w-full transition-all"
        style={{
          opacity: isCoupled ? interpolate(linkSpring, [0, 1], [0.3, 1]) : 0.4,
          transform: `translateY(${isCoupled ? interpolate(linkSpring, [0, 1], [15, 0]) : 15}px)`,
        }}
      >
        {effectElement}
      </div>
    </div>
  );
};
