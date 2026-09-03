import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  calcDecayingWobble,
  calcHarmonicDrift,
  calcSquashStretchFactors,
  PhysicsSprings,
} from "./PhysicsSprings";

export interface SecondaryMotionProps {
  startMs?: number;
  delayMs?: number;
  durationMs?: number;
  springPreset?: keyof typeof PhysicsSprings;
  
  // Secondary motion toggles & configurations
  enableWobble?: boolean;
  wobbleIntensityDeg?: number;
  wobbleDecayRate?: number;
  
  enableSquashStretch?: boolean;
  squashIntensity?: number;
  
  enableDrift?: boolean;
  driftAmplitudePx?: number;
  
  // Direction of primary momentum to calculate drag tilt
  momentumDirection?: "up" | "down" | "left" | "right" | "pop" | "none";
  dragTiltDeg?: number;

  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * ⚛️ SecondaryMotion
 * Wraps any visual component and injects realistic physical inertia,
 * follow-through momentum, elastic settle wobble, and volumetric squash & stretch.
 */
export const SecondaryMotion: React.FC<SecondaryMotionProps> = ({
  startMs = 0,
  delayMs = 0,
  durationMs = 450,
  springPreset = "elasticSettle",
  enableWobble = true,
  wobbleIntensityDeg = 6.0,
  wobbleDecayRate = 6.0,
  enableSquashStretch = false,
  squashIntensity = 0.14,
  enableDrift = false,
  driftAmplitudePx = 3.0,
  momentumDirection = "up",
  dragTiltDeg = 3.5,
  className = "",
  style = {},
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const effectiveStartMs = startMs + delayMs;
  const startFrame = Math.floor((effectiveStartMs / 1000) * fps);
  const relFrame = frame - startFrame;

  // Primary spring progress
  const config = PhysicsSprings[springPreset];
  const sp = spring({
    frame: Math.max(0, relFrame),
    fps,
    config,
  });

  // 1. Inertial Drag Tilt (angles backwards during travel, snaps forward on arrival)
  let dynamicTilt = 0;
  if (momentumDirection !== "none" && relFrame >= 0) {
    // High velocity during sp 0.1 to 0.8 creates tilt
    const velocityFactor = Math.sin(Math.min(Math.PI, sp * Math.PI));
    const sign = momentumDirection === "up" || momentumDirection === "right" ? -1 : 1;
    dynamicTilt = sign * dragTiltDeg * velocityFactor;
  }

  // 2. Harmonic Decaying Wobble upon arrival (starts when sp > 0.85)
  let wobbleDeg = 0;
  if (enableWobble && sp > 0.8) {
    const settleRelFrame = Math.max(0, relFrame - Math.floor((durationMs / 1000) * fps * 0.6));
    wobbleDeg = calcDecayingWobble(settleRelFrame, fps, wobbleIntensityDeg, 5.0, wobbleDecayRate);
  }

  // 3. Volumetric Squash & Stretch
  let scaleX = 1.0;
  let scaleY = 1.0;
  if (enableSquashStretch && sp > 0.75) {
    const impactRelFrame = Math.max(0, relFrame - Math.floor((durationMs / 1000) * fps * 0.7));
    const factors = calcSquashStretchFactors(impactRelFrame, fps, squashIntensity, 6.5);
    scaleX = factors.scaleX;
    scaleY = factors.scaleY;
  }

  // 4. Harmonic Micro-Drift (buoyancy when settled)
  let driftY = 0;
  let driftRotate = 0;
  if (enableDrift && sp >= 0.98) {
    const drift = calcHarmonicDrift(frame, fps, driftAmplitudePx, 0.5, effectiveStartMs);
    driftY = drift.translateY;
    driftRotate = drift.rotateDeg;
  }

  const combinedRotate = dynamicTilt + wobbleDeg + driftRotate;
  const combinedScale = sp;

  return (
    <div
      className={`relative inline-block ${className}`}
      style={{
        transform: `translateY(${driftY}px) rotate(${combinedRotate}deg) scale(${combinedScale * scaleX}, ${combinedScale * scaleY})`,
        opacity: Math.min(1, sp * 2.0),
        transformOrigin: "center center",
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
