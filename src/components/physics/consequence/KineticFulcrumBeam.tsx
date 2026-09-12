import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface BeamLoad {
  id: string;
  arm: "left" | "right";
  mass: number;
  /** Distance from fulcrum along the arm in px (e.g. 100 to 350) */
  distance: number;
  /** Frame at which this load impacts the arm */
  landFrame: number;
  label?: string;
}

export interface FulcrumBeamState {
  currentAngleDeg: number;
  leftTipOffsetY: number;
  rightTipOffsetY: number;
  netTorque: number;
  isConstrained: boolean;
  isSnapped: boolean;
}

export interface KineticFulcrumBeamProps {
  width?: number;
  height?: number;
  fulcrumRatio?: number; // 0.5 = centered fulcrum
  maxAngleDeg?: number;
  baseAngleDeg?: number;
  loads: BeamLoad[];
  /** Optional frame when a constraining tether snaps, releasing full torque */
  constraintSnapFrame?: number;
  /** Render prop or children to place on or around the beam */
  children?: React.ReactNode | ((state: FulcrumBeamState) => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ⚖️ KineticFulcrumBeam
 * Closed-form mechanical balance beam pivoting on a central fulcrum.
 * 
 * Computes torque equilibrium:
 *   Net Torque = Σ(mass_right * dist_right) - Σ(mass_left * dist_left)
 * 
 * When unconstrained, rotates elastically toward equilibrium angle.
 * When constrained by a structural tether, resists rotation until constraintSnapFrame,
 * at which point stored potential energy violently releases into rotational acceleration.
 */
export const KineticFulcrumBeam: React.FC<KineticFulcrumBeamProps> = ({
  width = 820,
  height = 16,
  fulcrumRatio = 0.5,
  maxAngleDeg = 15,
  baseAngleDeg = 0,
  loads = [],
  constraintSnapFrame,
  children,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Calculate Active Net Torque at current frame
  let torqueLeft = 0;
  let torqueRight = 0;
  let totalMassLeft = 0;
  let totalMassRight = 0;

  for (const load of loads) {
    if (frame >= load.landFrame) {
      // Dynamic torque accumulation with impact momentum overshoot
      const relLand = frame - load.landFrame;
      const impactSpring = spring({
        frame: relLand,
        fps,
        config: { damping: 14, mass: Math.max(0.5, load.mass * 0.4), stiffness: 150 },
      });

      const effectiveMass = load.mass * impactSpring;
      const torqueVal = effectiveMass * (load.distance / 100);

      if (load.arm === "left") {
        torqueLeft += torqueVal;
        totalMassLeft += effectiveMass;
      } else {
        torqueRight += torqueVal;
        totalMassRight += effectiveMass;
      }
    }
  }

  const netTorque = torqueRight - torqueLeft;
  const isSnapped = constraintSnapFrame !== undefined && frame >= constraintSnapFrame;
  const isConstrained = constraintSnapFrame !== undefined && !isSnapped;

  // 2. Equilibrium Angle Calculation
  // Unconstrained angle sensitivity
  const rawAngle = (netTorque / 18) * maxAngleDeg;
  const targetAngleDeg = Math.max(-maxAngleDeg, Math.min(maxAngleDeg, rawAngle));

  // If constrained by tether, the beam can only deflect slightly (brace state)
  let resolvedAngle = baseAngleDeg;
  if (isConstrained) {
    // Under constraint: braced deflection (max ~20% of target angle)
    resolvedAngle = baseAngleDeg + targetAngleDeg * 0.22;
  } else if (isSnapped) {
    // Release event! Violent spring release from braced angle to full target angle
    const relSnap = frame - constraintSnapFrame!;
    const snapSpring = spring({
      frame: relSnap,
      fps,
      config: { damping: 12, mass: 0.7, stiffness: 180 },
    });
    const bracedAngle = baseAngleDeg + targetAngleDeg * 0.22;
    resolvedAngle = interpolate(snapSpring, [0, 1], [bracedAngle, targetAngleDeg]);
  } else {
    // Normal unconstrained motion
    resolvedAngle = baseAngleDeg + targetAngleDeg;
  }

  // 3. Tip vertical offsets (trigonometric displacement)
  const angleRad = (resolvedAngle * Math.PI) / 180;
  const leftArmLength = width * fulcrumRatio;
  const rightArmLength = width * (1 - fulcrumRatio);

  const leftTipOffsetY = -leftArmLength * Math.sin(angleRad);
  const rightTipOffsetY = rightArmLength * Math.sin(angleRad);

  const state: FulcrumBeamState = {
    currentAngleDeg: resolvedAngle,
    leftTipOffsetY,
    rightTipOffsetY,
    netTorque,
    isConstrained,
    isSnapped,
  };

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        width: `${width}px`,
        height: "220px", // Accommodates fulcrum base + beam travel
        ...style,
      }}
    >
      {/* ════════════════════════════════════════════════════════════ */}
      {/* 1. CENTRAL FULCRUM STAND (Precision Machined Brass/Steel)   */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div
        className="absolute bottom-0 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10"
        style={{ left: `${fulcrumRatio * 100}%` }}
      >
        {/* Pivot Pin Head */}
        <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-slate-950 shadow-md -mb-2 z-20" />

        {/* Triangular Fulcrum Tower */}
        <svg width="64" height="96" viewBox="0 0 64 96" className="drop-shadow-md">
          <polygon
            points="32,4 6,92 58,92"
            fill="#d97706"
            stroke="#090d16"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          {/* Inner metallic facet */}
          <polygon
            points="32,8 16,88 32,88"
            fill="#f59e0b"
            opacity={0.8}
          />
        </svg>

        {/* Heavy Pedestal Base Plate */}
        <div className="w-32 h-4 rounded-full bg-slate-900 border-2 border-slate-950 shadow-lg -mt-1" />
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* 2. THE RIGID BEAM (Pivoting at Fulcrum Center)              */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div
        className="absolute top-[96px] left-0 w-full"
        style={{
          height: `${height}px`,
          transform: `rotate(${resolvedAngle.toFixed(2)}deg)`,
          transformOrigin: `${fulcrumRatio * 100}% 50%`,
          willChange: "transform",
        }}
      >
        {/* Main Beam Bar */}
        <div className="relative w-full h-full rounded-md bg-slate-900 border-[2.5px] border-slate-950 shadow-[0_8px_20px_rgba(0,0,0,0.18)] flex items-center justify-between px-4">
          {/* Left Weighing Plate Pin */}
          <div className="w-3 h-3 rounded-full bg-amber-400 border border-slate-900 shadow-sm" />

          {/* Central Measurement Graduations */}
          <div className="flex items-center gap-6 opacity-40 font-mono text-[9px] text-slate-200">
            <span>-300</span>
            <span>-150</span>
            <span className="w-2 h-2 rounded-full bg-white opacity-80" />
            <span>+150</span>
            <span>+300</span>
          </div>

          {/* Right Weighing Plate Pin */}
          <div className="w-3 h-3 rounded-full bg-amber-400 border border-slate-900 shadow-sm" />
        </div>

        {/* Left Seat Platform (Tracks left tip) */}
        <div
          className="absolute -top-3 left-0 -translate-x-1/2 w-28 h-3 rounded-full bg-slate-800 border-2 border-slate-950 shadow-md"
        />

        {/* Right Seat Platform (Tracks right tip) */}
        <div
          className="absolute -top-3 right-0 translate-x-1/2 w-28 h-3 rounded-full bg-slate-800 border-2 border-slate-950 shadow-md"
        />

        {/* Inscribed Beam Label */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[11px] font-bold text-slate-500 uppercase tracking-widest pointer-events-none">
          {resolvedAngle > 0.5 ? "LOADED // RIGHT ARM ACTIVE" : resolvedAngle < -0.5 ? "LOADED // LEFT ARM ACTIVE" : "EQUILIBRIUM // ZERO MOMENT"}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════ */}
      {/* 3. CHILDREN / DYNAMIC ATTACHMENTS                           */}
      {/* ════════════════════════════════════════════════════════════ */}
      <div className="relative w-full h-full pointer-events-none">
        {typeof children === "function" ? children(state) : children}
      </div>
    </div>
  );
};
