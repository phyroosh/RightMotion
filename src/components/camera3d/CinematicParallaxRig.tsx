import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface CameraPunchIn {
  /** Spoken cue frame when the camera punches in */
  frame: number;
  /** Duration of the push-in transition in frames (default: 14) */
  durationFrames?: number;
  /** Target zoom scale (e.g. 1.08 for subtle focus, 1.18 for dramatic epiphany) */
  zoom?: number;
  /** Target focal vertical offset in pixels (e.g. -60px to focus on headline) */
  targetY?: number;
  /** Dutch camera tilt in degrees during tension (e.g. -1.2deg) */
  dutchTilt?: number;
  /** Hold duration before returning to baseline (optional, if omitted holds until next trigger or scene end) */
  holdDurationFrames?: number;
}

export interface CameraBreathHold {
  /** Frame when the dramatic breath freeze begins */
  startFrame: number;
  /** Duration of the freeze in frames (typically 12–20 frames) */
  durationFrames: number;
}

export interface CameraTraumaImpact {
  /** Frame of impact hit */
  frame: number;
  /** Impact intensity in pixels (default: 14) */
  intensity?: number;
  /** Duration in frames (default: 8) */
  durationFrames?: number;
}

export interface CinematicParallaxRigProps {
  children: React.ReactNode;
  /** Optional background layer content (moves at 0.25x parallax factor) */
  background?: React.ReactNode;
  /** Optional foreground layer content (moves at 1.45x parallax factor) */
  foreground?: React.ReactNode;
  /** Dynamic camera punch-in triggers throughout the timeline */
  punchIns?: CameraPunchIn[];
  /** Dramatic breath hold windows (slows drift to zero for tension build) */
  breathHolds?: CameraBreathHold[];
  /** Trauma impact shake triggers */
  impacts?: CameraTraumaImpact[];
  /** Enable continuous organic camera micro-drift (default: true) */
  enableDrift?: boolean;
  /** Base camera perspective in pixels (default: 1200) */
  perspective?: number;
  /** Custom root className */
  className?: string;
  /** Custom root style */
  style?: React.CSSProperties;
}

/**
 * 🎥 CinematicParallaxRig
 * Industry-grade 2.5D Camera & Parallax Depth Engine for RightMotion.
 * Orchestrates multi-layer depth, continuous subtle camera kinematics,
 * punch-ins on central epiphanies, and dramatic breath-hold freezes.
 */
export const CinematicParallaxRig: React.FC<CinematicParallaxRigProps> = ({
  children,
  background,
  foreground,
  punchIns = [],
  breathHolds = [],
  impacts = [],
  enableDrift = true,
  perspective = 1200,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Check for active Breath Hold (Dramatic Freeze)
  let isBreathHoldActive = false;
  let breathHoldDamping = 1.0;
  for (const bh of breathHolds) {
    if (frame >= bh.startFrame && frame < bh.startFrame + bh.durationFrames) {
      isBreathHoldActive = true;
      breathHoldDamping = 0.08; // 92% reduction in motion
      break;
    }
  }
  void isBreathHoldActive;

  // 2. Continuous Organic Camera Micro-Drift (Breathing Motion)
  let driftX = 0;
  let driftY = 0;
  let driftAngle = 0;
  if (enableDrift) {
    const driftSpeed = 0.024;
    driftX = Math.sin(frame * driftSpeed) * 8 * breathHoldDamping;
    driftY = Math.cos(frame * (driftSpeed * 0.75)) * 6 * breathHoldDamping;
    driftAngle = Math.sin(frame * (driftSpeed * 0.5)) * 0.35 * breathHoldDamping;
  }

  // 3. Dynamic Punch-In Calculation
  let activeZoom = 1.0;
  let activeTargetY = 0;
  let activeDutch = 0;

  // Find most recent applicable punch-in trigger
  const sortedPunchIns = [...punchIns].sort((a, b) => a.frame - b.frame);
  for (const pi of sortedPunchIns) {
    if (frame >= pi.frame) {
      const targetZoom = pi.zoom ?? 1.08;
      const targetY = pi.targetY ?? 0;
      const targetDutch = pi.dutchTilt ?? 0;

      const sp = spring({
        frame: frame - pi.frame,
        fps,
        config: { damping: 14, stiffness: 110, mass: 0.8 },
      });

      // Check if holdDuration is specified and expired
      if (pi.holdDurationFrames && frame >= pi.frame + pi.holdDurationFrames) {
        const exitSp = spring({
          frame: frame - (pi.frame + pi.holdDurationFrames),
          fps,
          config: { damping: 15, stiffness: 100 },
        });
        activeZoom = interpolate(exitSp, [0, 1], [targetZoom, 1.0]);
        activeTargetY = interpolate(exitSp, [0, 1], [targetY, 0]);
        activeDutch = interpolate(exitSp, [0, 1], [targetDutch, 0]);
      } else {
        activeZoom = interpolate(sp, [0, 1], [1.0, targetZoom]);
        activeTargetY = interpolate(sp, [0, 1], [0, targetY]);
        activeDutch = interpolate(sp, [0, 1], [0, targetDutch]);
      }
    }
  }

  // 4. Trauma Impact Calculation
  let impactShakeX = 0;
  let impactShakeY = 0;
  for (const imp of impacts) {
    const rel = frame - imp.frame;
    const dur = imp.durationFrames ?? 8;
    const intensity = imp.intensity ?? 14;
    if (rel >= 0 && rel < dur) {
      const decay = 1 - rel / dur;
      impactShakeX += (Math.random() - 0.5) * 2 * intensity * decay;
      impactShakeY += (Math.random() - 0.5) * 2 * intensity * decay;
    }
  }

  // Combined Camera Transformation
  const totalX = driftX + impactShakeX;
  const totalY = driftY + activeTargetY + impactShakeY;
  const totalAngle = driftAngle + activeDutch;

  // Parallax Layer Factors
  const bgX = totalX * 0.25;
  const bgY = totalY * 0.25;
  const fgX = totalX * 1.45;
  const fgY = totalY * 1.45;

  return (
    <div
      className={`absolute inset-0 overflow-hidden select-none ${className}`}
      style={{
        perspective: `${perspective}px`,
        ...style,
      }}
    >
      {/* 1. Background Parallax Layer (-200px depth, moves at 0.25x speed) */}
      {background && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate3d(${bgX}px, ${bgY}px, -200px) scale(${1.0 + (activeZoom - 1.0) * 0.3})`,
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          {background}
        </div>
      )}

      {/* 2. Midground Focus Layer (0px depth, primary focus 1.0x) */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate3d(${totalX}px, ${totalY}px, 0px) scale(${activeZoom}) rotate(${totalAngle}deg)`,
          transformOrigin: "center center",
          willChange: "transform",
        }}
      >
        {children}
      </div>

      {/* 3. Foreground Atmospheric Layer (+150px depth, moves at 1.45x speed) */}
      {foreground && (
        <div
          className="absolute inset-0 pointer-events-none z-40"
          style={{
            transform: `translate3d(${fgX}px, ${fgY}px, 150px) scale(${1.0 + (activeZoom - 1.0) * 1.5})`,
            transformOrigin: "center center",
            willChange: "transform",
          }}
        >
          {foreground}
        </div>
      )}
    </div>
  );
};
