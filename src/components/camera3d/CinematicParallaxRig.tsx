import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface CameraPushInTrajectory {
  startFrame?: number;
  endFrame?: number;
  startZoom?: number;
  endZoom?: number;
}

export interface CameraPunchIn {
  /** Spoken cue frame when the camera punches in */
  frame: number;
  /** Duration of the push-in transition in frames (default: 14) */
  durationFrames?: number;
  /** Target zoom scale (e.g. 1.08 for subtle focus, 1.18 for dramatic epiphany) */
  zoom?: number;
  /** Target focal vertical offset in pixels (e.g. -60px to focus on headline) */
  targetY?: number;
  /** Target focal horizontal offset in pixels */
  targetX?: number;
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
  /** Duration in frames (default: 10) */
  durationFrames?: number;
}

export interface CinematicParallaxRigProps {
  children: React.ReactNode;
  /** Optional background layer content (moves at 0.25x parallax factor) */
  background?: React.ReactNode;
  /** Optional foreground layer content (moves at 1.45x parallax factor) */
  foreground?: React.ReactNode;
  /** Global subtle continuous push-in trajectory across the timeline (Single-Authority Camera) */
  basePushIn?: CameraPushInTrajectory;
  /** Dynamic camera punch-in triggers throughout the timeline */
  punchIns?: CameraPunchIn[];
  /** Dramatic breath hold windows (slows drift to stationary hold for tension build) */
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

interface KinematicState {
  zoom: number;
  targetX: number;
  targetY: number;
  dutch: number;
}

/**
 * Evaluates camera kinematics at a specific frame with strict C0 continuity.
 * Successive punch-in triggers transition from the active evaluated state of previous triggers
 * rather than resetting to 1.0, eliminating single-frame velocity and zoom drops.
 */
function evaluateCameraTrajectory(
  targetFrame: number,
  sortedPunchIns: CameraPunchIn[],
  fps: number,
  baseZoomFn: (f: number) => number
): KinematicState {
  let currentState: KinematicState = {
    zoom: baseZoomFn(targetFrame),
    targetX: 0,
    targetY: 0,
    dutch: 0,
  };

  if (sortedPunchIns.length === 0) {
    return currentState;
  }

  // Sequentially evaluate each punch-in trigger up to targetFrame
  for (let i = 0; i < sortedPunchIns.length; i++) {
    const pi = sortedPunchIns[i];
    if (targetFrame < pi.frame) {
      break;
    }

    const startState: KinematicState = { ...currentState };
    const targetZoom = pi.zoom ?? (startState.zoom * 1.06);
    const targetX = pi.targetX ?? 0;
    const targetY = pi.targetY ?? 0;
    const targetDutch = pi.dutchTilt ?? 0;

    const rel = targetFrame - pi.frame;
    const sp = spring({
      frame: rel,
      fps,
      config: { damping: 16, stiffness: 120, mass: 0.75 },
    });

    if (pi.holdDurationFrames && rel >= pi.holdDurationFrames) {
      const exitRel = rel - pi.holdDurationFrames;
      const exitSp = spring({
        frame: exitRel,
        fps,
        config: { damping: 16, stiffness: 100 },
      });
      currentState = {
        zoom: interpolate(exitSp, [0, 1], [targetZoom, baseZoomFn(targetFrame)]),
        targetX: interpolate(exitSp, [0, 1], [targetX, 0]),
        targetY: interpolate(exitSp, [0, 1], [targetY, 0]),
        dutch: interpolate(exitSp, [0, 1], [targetDutch, 0]),
      };
    } else {
      currentState = {
        zoom: interpolate(sp, [0, 1], [startState.zoom, targetZoom]),
        targetX: interpolate(sp, [0, 1], [startState.targetX, targetX]),
        targetY: interpolate(sp, [0, 1], [startState.targetY, targetY]),
        dutch: interpolate(sp, [0, 1], [startState.dutch, targetDutch]),
      };
    }
  }

  return currentState;
}

/**
 * 🎥 CinematicParallaxRig
 * Industry-grade 2.5D Continuous Kinematic Camera & Parallax Engine.
 * 
 * Guarantees:
 * - Seamless piece-wise continuous zoom trajectory (zero jump on secondary punch-ins)
 * - Position-anchored smooth breath-hold transitions (zero 4px teleport)
 * - Pure translation during micro-drifts to eliminate CPU sub-pixel rasterization shimmer
 * - Physically damped harmonic impact trauma shakes (deterministic impulse response)
 */
export const CinematicParallaxRig: React.FC<CinematicParallaxRigProps> = ({
  children,
  background,
  foreground,
  basePushIn,
  punchIns = [],
  breathHolds = [],
  impacts = [],
  enableDrift = true,
  perspective = 1200,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // 1. Base Push-In Function (Single-Authority Camera across scenes)
  const baseZoomFn = (f: number) => {
    if (!basePushIn) return 1.0;
    const startF = basePushIn.startFrame ?? 0;
    const endF = basePushIn.endFrame ?? durationInFrames;
    const startZ = basePushIn.startZoom ?? 1.0;
    const endZ = basePushIn.endZoom ?? 1.045;
    return interpolate(f, [startF, endF], [startZ, endZ], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  };

  // 2. Smooth, Position-Anchored Breath-Hold Freezes (Zero Teleport)
  let driftX = 0;
  let driftY = 0;
  if (enableDrift) {
    const driftSpeed = 0.024;
    const rawDriftX = Math.sin(frame * driftSpeed) * 6.5;
    const rawDriftY = Math.cos(frame * (driftSpeed * 0.75)) * 5.0;

    // Check if any breath hold is active or near
    let activeHold: CameraBreathHold | null = null;
    for (const bh of breathHolds) {
      if (
        frame >= bh.startFrame - 8 &&
        frame <= bh.startFrame + bh.durationFrames + 12
      ) {
        activeHold = bh;
        break;
      }
    }

    if (activeHold) {
      const holdStart = activeHold.startFrame;
      const holdEnd = activeHold.startFrame + activeHold.durationFrames;
      const freezeX = Math.sin(holdStart * driftSpeed) * 6.5;
      const freezeY = Math.cos(holdStart * (driftSpeed * 0.75)) * 5.0;

      if (frame < holdStart) {
        // Smooth 8-frame deceleration into freeze point
        const easeIn = interpolate(frame, [holdStart - 8, holdStart], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        driftX = interpolate(easeIn, [0, 1], [rawDriftX, freezeX]);
        driftY = interpolate(easeIn, [0, 1], [rawDriftY, freezeY]);
      } else if (frame <= holdEnd) {
        // Rock-solid hold at freeze coordinates (zero drift movement)
        driftX = freezeX;
        driftY = freezeY;
      } else {
        // Smooth 12-frame acceleration out of freeze point back to organic drift
        const easeOut = interpolate(frame, [holdEnd, holdEnd + 12], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        driftX = interpolate(easeOut, [0, 1], [rawDriftX, freezeX]);
        driftY = interpolate(easeOut, [0, 1], [rawDriftY, freezeY]);
      }
    } else {
      driftX = rawDriftX;
      driftY = rawDriftY;
    }
  }

  // 3. Piece-wise Continuous Dynamic Punch-In Trajectory
  const sortedPunchIns = [...punchIns].sort((a, b) => a.frame - b.frame);
  const kinematicState = evaluateCameraTrajectory(frame, sortedPunchIns, fps, baseZoomFn);
  const { zoom: activeZoom, targetX: activeTargetX, targetY: activeTargetY, dutch: activeDutch } = kinematicState;

  // 4. Physically Damped Harmonic Impact Trauma (Impulse Response Function)
  let impactShakeX = 0;
  let impactShakeY = 0;
  for (const imp of impacts) {
    const rel = frame - imp.frame;
    const dur = imp.durationFrames ?? 10;
    const intensity = imp.intensity ?? 14;
    if (rel >= 0 && rel < dur) {
      const decay = Math.exp(-rel / (dur * 0.42));
      impactShakeX += Math.sin(rel * 1.8) * intensity * decay;
      impactShakeY += Math.cos(rel * 2.2) * (intensity * 0.65) * decay;
    }
  }

  // Combined Camera Translation & Orientation
  // Pure translation in X/Y avoids continuous diagonal sub-pixel resampling on CPU SwiftShader
  const totalX = driftX + activeTargetX + impactShakeX;
  const totalY = driftY + activeTargetY + impactShakeY;

  // Parallax Layer Factors
  const bgX = totalX * 0.25;
  const bgY = totalY * 0.25;
  const fgX = totalX * 1.45;
  const fgY = totalY * 1.45;

  const bgScale = 1.0 + (activeZoom - 1.0) * 0.3;
  const fgScale = 1.0 + (activeZoom - 1.0) * 1.5;

  const rotString = Math.abs(activeDutch) > 0.001 ? ` rotate(${activeDutch.toFixed(3)}deg)` : "";

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
            transform: `translate3d(${bgX.toFixed(2)}px, ${bgY.toFixed(2)}px, -200px) scale(${bgScale.toFixed(4)})${rotString}`,
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
          transform: `translate3d(${totalX.toFixed(2)}px, ${totalY.toFixed(2)}px, 0px) scale(${activeZoom.toFixed(4)})${rotString}`,
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
            transform: `translate3d(${fgX.toFixed(2)}px, ${fgY.toFixed(2)}px, 150px) scale(${fgScale.toFixed(4)})${rotString}`,
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

