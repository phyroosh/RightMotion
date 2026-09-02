import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { MotionCurves } from "../MotionGraph";

export type Camera3DPreset =
  | "dramatic_swoop"    // Dynamic swoop-in from top-right with Dutch angle, settling flat
  | "isometric_shelf"   // Subtle tilted perspective for cards & comparisons
  | "subtle_breathing"  // Gentle organic floating drift during hold
  | "impact_shake"      // 3D rotational trauma shake
  | "none";

export interface VirtualCamera3DProps {
  children: React.ReactNode;
  preset?: Camera3DPreset;
  startMs?: number;
  durationMs?: number;
  currentMs?: number;
  readabilityLock?: boolean; // Smoothly flattens angle during reading window
  customPitch?: number;      // rotateX in degrees
  customYaw?: number;        // rotateY in degrees
  customRoll?: number;       // rotateZ in degrees
  customZoom?: number;       // translateZ / scale
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 🎥 VirtualCamera3D
 * Hardware-accelerated CSS 3D Virtual Camera for Remotion.
 * Provides cinematic swoops, isometric depth, and perspective shifts with zero WebGL overhead.
 */
export const VirtualCamera3D: React.FC<VirtualCamera3DProps> = ({
  children,
  preset = "dramatic_swoop",
  startMs = 0,
  durationMs = 2500,
  currentMs,
  readabilityLock = true,
  customPitch,
  customYaw,
  customRoll,
  customZoom,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const activeMs = currentMs !== undefined ? currentMs : (frame / fps) * 1000;

  const startFrame = Math.floor((startMs / 1000) * fps);
  const relFrame = Math.max(0, frame - startFrame);

  // Default camera motion parameters
  let rotateX = 0;
  let rotateY = 0;
  let rotateZ = 0;
  let translateZ = 0;
  let scale = 1.0;

  if (preset === "dramatic_swoop") {
    // 1. Entrance spring using MotionCurves.snapSettle
    const sp = spring({
      frame: relFrame,
      fps,
      config: { damping: 18, mass: 0.85, stiffness: 105 },
    });

    // Swoop from top-right with Dutch tilt:
    // Initial: rotateX: 18deg, rotateY: -14deg, rotateZ: 3deg, translateZ: -180px
    // Settles toward subtle readable angle: rotateX: 2deg, rotateY: -1.5deg
    const initialPitch = 16;
    const initialYaw = -14;
    const initialRoll = 3.5;
    const initialZ = -160;

    const settledPitch = readabilityLock ? 1.5 : 6;
    const settledYaw = readabilityLock ? -1.0 : -5;
    const settledRoll = readabilityLock ? 0.3 : 1.2;

    rotateX = interpolate(sp, [0, 1], [initialPitch, settledPitch]);
    rotateY = interpolate(sp, [0, 1], [initialYaw, settledYaw]);
    rotateZ = interpolate(sp, [0, 1], [initialRoll, settledRoll]);
    translateZ = interpolate(sp, [0, 1], [initialZ, 0]);

    // Micro breathing drift after settling
    if (relFrame > 20) {
      const drift = Math.sin((relFrame - 20) * 0.08);
      rotateX += drift * 0.4;
      rotateY += Math.cos((relFrame - 20) * 0.06) * 0.3;
    }
  } else if (preset === "isometric_shelf") {
    // Elegant isometric shelf angle (ideal for side-by-side or comparison cards)
    const sp = spring({
      frame: relFrame,
      fps,
      config: { damping: 20, mass: 0.9, stiffness: 95 },
    });
    rotateX = interpolate(sp, [0, 1], [0, 8]);
    rotateY = interpolate(sp, [0, 1], [0, -6]);
    rotateZ = interpolate(sp, [0, 1], [0, 1.5]);
    translateZ = interpolate(sp, [0, 1], [-80, 0]);
  } else if (preset === "subtle_breathing") {
    // Living camera breath
    rotateX = Math.sin(frame * 0.04) * 1.8;
    rotateY = Math.cos(frame * 0.03) * 1.4;
    rotateZ = Math.sin(frame * 0.02) * 0.5;
    scale = 1.0 + Math.sin(frame * 0.03) * 0.012;
  } else if (preset === "impact_shake") {
    // 3D rotational trauma shake
    const decay = Math.exp(-relFrame * 0.25);
    rotateX = Math.sin(relFrame * 1.8) * 4.5 * decay;
    rotateY = Math.cos(relFrame * 1.6) * 4.0 * decay;
    rotateZ = Math.sin(relFrame * 2.1) * 2.5 * decay;
    translateZ = -Math.sin(relFrame * 1.5) * 35 * decay;
  }

  // Override with custom values if supplied
  if (customPitch !== undefined) rotateX = customPitch;
  if (customYaw !== undefined) rotateY = customYaw;
  if (customRoll !== undefined) rotateZ = customRoll;
  if (customZoom !== undefined) translateZ = customZoom;

  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
      style={{
        perspective: "1200px",
        perspectiveOrigin: "50% 50%",
        ...style,
      }}
    >
      <div
        className="w-full h-full flex items-center justify-center transition-transform"
        style={{
          transformStyle: "preserve-3d",
          transform: `
            translateZ(${translateZ}px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            rotateZ(${rotateZ}deg)
            scale(${scale})
          `,
        }}
      >
        {children}
      </div>
    </div>
  );
};
