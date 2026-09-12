import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface TrussLoad {
  id: string;
  mass: number;
  /** Distance from anchor point (0.0 to 1.0 representing percentage of beam length) */
  distanceRatio: number;
  /** Frame at which this load impacts the truss */
  landFrame: number;
}

export interface StructuralTrussProps {
  width?: number;
  height?: number;
  anchorSide?: "left" | "right";
  /** Maximum deflection angle in degrees before breaking */
  maxDeflectionDeg?: number;
  /** Force threshold at which the beam shears */
  shearForceThreshold?: number;
  loads: TrussLoad[];
  children?: React.ReactNode | ((state: { isSheared: boolean; currentDeflectionDeg: number }) => React.ReactNode);
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 🏗️ StructuralTruss
 * A cantilevered architectural beam extending from a solid anchor.
 * Calculates dynamic bending moment based on loads and distances.
 * If shear force exceeds threshold, the beam permanently breaks and falls.
 */
export const StructuralTruss: React.FC<StructuralTrussProps> = ({
  width = 600,
  height = 24,
  anchorSide = "left",
  maxDeflectionDeg = 8,
  shearForceThreshold = 1000,
  loads = [],
  children,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Calculate Active Bending Moment
  let activeMoment = 0;
  let shearFrame: number | null = null;
  
  // To find if and when it sheared, we must simulate linearly up to current frame
  // since spring impacts cause dynamic force spikes.
  let maxMomentSoFar = 0;
  let frameSheared: number | null = null;

  for (let f = 0; f <= frame; f++) {
    let momentAtF = 0;
    for (const load of loads) {
      if (f >= load.landFrame) {
        // Impact spring dynamics
        const relF = f - load.landFrame;
        const impact = spring({
          frame: relF,
          fps,
          config: { damping: 12, mass: 1.2, stiffness: 150 }, // Heavier impact
        });
        const force = load.mass * impact;
        // Bending moment = Force * Distance
        momentAtF += force * (load.distanceRatio * width);
      }
    }
    
    if (momentAtF > shearForceThreshold && frameSheared === null) {
      frameSheared = f;
    }
    if (f === frame) {
      activeMoment = momentAtF;
    }
  }

  const isSheared = frameSheared !== null && frame >= frameSheared;

  // 2. Resolve Deflection Angle
  let resolvedAngle = 0;
  let brokenYOffset = 0;
  let brokenRot = 0;

  if (isSheared) {
    // The beam sheared. Calculate falling dynamics from the frame it sheared.
    const relShear = frame - frameSheared!;
    // Fall downwards with gravity
    brokenYOffset = Math.pow(relShear, 2) * 0.5; // simple quadratic fall
    brokenRot = relShear * (anchorSide === "left" ? 2 : -2); // tumble
    
    // The stump remains at the max deflection right before break, or bounces back.
    // For simplicity, let's just make the broken part fall and the stump bounce back.
    // But since the whole beam falls in a simple model, we'll slice the beam visually.
  } else {
    // Elastic deflection
    const rawDeflection = (activeMoment / shearForceThreshold) * maxDeflectionDeg;
    resolvedAngle = anchorSide === "left" ? rawDeflection : -rawDeflection;
  }
  
  // If sheared, we can split the beam into an anchor stump and the falling beam.
  const stumpWidth = width * 0.15; // 15% of beam stays anchored
  const brokenWidth = width * 0.85;

  return (
    <div
      className={`relative ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        ...style,
      }}
    >
      {/* Structural Anchor Block */}
      <div 
        className={`absolute top-1/2 -translate-y-1/2 w-8 h-32 bg-slate-900 border-[3px] border-slate-950 z-20 shadow-xl ${anchorSide === "left" ? "left-0 -translate-x-full rounded-l-md" : "right-0 translate-x-full rounded-r-md"}`} 
      >
        {/* Anchor bolts */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-700 border border-slate-950 shadow-inner" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-700 border border-slate-950 shadow-inner" />
      </div>

      {!isSheared ? (
        // INTACT BEAM
        <div
          className="absolute top-0 w-full h-full bg-amber-500 border-[2.5px] border-slate-950 shadow-[0_12px_24px_rgba(0,0,0,0.3)] z-10 flex items-center overflow-hidden"
          style={{
            [anchorSide]: 0,
            transform: `rotate(${resolvedAngle.toFixed(2)}deg)`,
            transformOrigin: anchorSide === "left" ? "0% 50%" : "100% 50%",
            willChange: "transform",
          }}
        >
          {/* Industrial hazard stripes / structural ribbing */}
          <div className="w-full h-full opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)" }} />
        </div>
      ) : (
        // SHEARED BEAM
        <>
          {/* Stump */}
          <div
            className="absolute top-0 h-full bg-amber-600 border-[2.5px] border-slate-950 z-10 overflow-hidden"
            style={{
              [anchorSide]: 0,
              width: `${stumpWidth}px`,
              // Bounce back spring
              transform: `rotate(${interpolate(spring({ frame: frame - frameSheared!, fps, config: { damping: 10, stiffness: 200 } }), [0, 1], [anchorSide === "left" ? maxDeflectionDeg : -maxDeflectionDeg, 0])}deg)`,
              transformOrigin: anchorSide === "left" ? "0% 50%" : "100% 50%",
            }}
          >
             <div className="absolute right-0 top-0 w-2 h-full bg-black/40 jagged-edge" />
          </div>

          {/* Falling Section */}
          <div
            className="absolute top-0 h-full bg-amber-500 border-[2.5px] border-slate-950 z-10 flex items-center overflow-hidden"
            style={{
              [anchorSide]: `${stumpWidth}px`,
              width: `${brokenWidth}px`,
              transform: `translateY(${brokenYOffset}px) rotate(${brokenRot}deg)`,
              transformOrigin: anchorSide === "left" ? "0% 50%" : "100% 50%",
            }}
          >
             <div className="w-full h-full opacity-20" style={{ backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)" }} />
          </div>
        </>
      )}

      {/* Dynamic Children Container */}
      <div 
        className="absolute top-0 left-0 w-full h-full z-30"
        style={{
          transform: !isSheared 
            ? `rotate(${resolvedAngle.toFixed(2)}deg)`
            : `translateY(${brokenYOffset}px) rotate(${brokenRot}deg)`,
          transformOrigin: anchorSide === "left" ? "0% 50%" : "100% 50%",
        }}
      >
        {typeof children === "function" ? children({ isSheared, currentDeflectionDeg: resolvedAngle }) : children}
      </div>
    </div>
  );
};
