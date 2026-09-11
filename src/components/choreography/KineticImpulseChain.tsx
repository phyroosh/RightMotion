import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface ImpulseReactionProps {
  children: React.ReactNode;
  /** Spoken cue frame when this element enters */
  enterFrame: number;
  /** Frame when this element physically impacts its resting position (default: enterFrame + 8) */
  impactFrame?: number;
  /** Optional frame when a PREDECESSOR struck, causing this element to absorb a shockwave before entering */
  predecessorImpactFrame?: number;
  /** Direction of incoming kinetic force */
  direction?: "down" | "up" | "left" | "right";
  /** Mass of the element (higher mass = deeper impact squash, lower bounce) */
  mass?: number;
  /** Impact intensity in pixels (default: 8) */
  intensity?: number;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * ⚡ ImpulseReactionWrapper
 * Choreography primitive for Level 100+ Causal Chain Storytelling.
 * 
 * Elements no longer appear as isolated floating cards.
 * When a predecessor element strikes, adjacent elements absorb the physical shockwave
 * (elastic squash/rebound and micro-displacement) before springing into their own active state.
 */
export const ImpulseReactionWrapper: React.FC<ImpulseReactionProps> = ({
  children,
  enterFrame,
  impactFrame,
  predecessorImpactFrame,
  direction = "down",
  mass = 0.8,
  intensity = 8,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Primary Entrance Spring
  const enterSpring = spring({
    frame: Math.max(0, frame - enterFrame),
    fps,
    config: {
      damping: 14 + mass * 2,
      mass,
      stiffness: 130 - mass * 15,
    },
  });

  // 2. Landing Impact Squash & Rebound
  const resolvedImpactFrame = impactFrame ?? (enterFrame + 8);
  const relImpact = frame - resolvedImpactFrame;
  let squashScaleX = 1.0;
  let squashScaleY = 1.0;

  if (relImpact >= 0 && relImpact < 16) {
    const impactSpring = spring({
      frame: relImpact,
      fps,
      config: { damping: 12, mass: 0.5, stiffness: 160 },
    });
    // Sudden squash on landing, then elastic recovery overshoot
    const squashFactor = interpolate(impactSpring, [0, 0.4, 1], [0, 0.06 * (mass / 0.8), 0]);
    if (direction === "down" || direction === "up") {
      squashScaleY = 1.0 - squashFactor;
      squashScaleX = 1.0 + squashFactor * 0.6;
    } else {
      squashScaleX = 1.0 - squashFactor;
      squashScaleY = 1.0 + squashFactor * 0.6;
    }
  }

  // 3. Predecessor Shockwave Absorption (Sympathetic Vibration)
  let sympatheticOffset = 0;
  if (predecessorImpactFrame !== undefined) {
    const relPre = frame - predecessorImpactFrame;
    if (relPre >= 0 && relPre < 14) {
      const decay = Math.exp(-relPre / 4.5);
      sympatheticOffset = Math.sin(relPre * 1.5) * intensity * decay;
    }
  }

  // 4. Calculate Final Spatial Displacement
  const entranceDistance = 45 * (direction === "up" ? -1 : 1);
  const enterTranslation = interpolate(enterSpring, [0, 1], [entranceDistance, 0]);

  let translateX = 0;
  let translateY = 0;
  if (direction === "down" || direction === "up") {
    translateY = enterTranslation + sympatheticOffset;
  } else {
    translateX = enterTranslation + sympatheticOffset;
  }

  const opacity = Math.min(1, enterSpring * 1.6);

  if (frame < enterFrame && predecessorImpactFrame === undefined) {
    return null;
  }

  return (
    <div
      className={`select-none ${className}`}
      style={{
        transform: `translate3d(${translateX.toFixed(2)}px, ${translateY.toFixed(2)}px, 0px) scale(${squashScaleX.toFixed(3)}, ${squashScaleY.toFixed(3)})`,
        transformOrigin: direction === "down" ? "bottom center" : "center center",
        opacity,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
