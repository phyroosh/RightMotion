import React from "react";
import { Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export type CharacterPose =
  // Bust / waist-up cutouts (mid-video explanatory A-Roll)
  | "pointing"
  | "crossed"
  | "open"
  // Full body shots (intro hook & outro finale only)
  | "fullbody_pointing"   // finger up — confident intro hook, calls to action
  | "fullbody_open"       // open palms shrug — empathetic outros, question frames
  | "fullbody_casual";    // touching hair — warm humanizing bookend moments

export interface KeyframePoint {
  timeMs: number; // millisecond in timeline
  pose?: CharacterPose;
  scale?: number;
  x?: number;
  y?: number;
  rotate?: number;
  opacity?: number;
  haloColor?: string;
  haloIntensity?: number;
}

interface CharacterKeyframeAnimatorProps {
  currentMs: number;
  keyframes: KeyframePoint[];
  baseWidth?: number;
  baseHeight?: number;
  className?: string;
}

export const CharacterKeyframeAnimator: React.FC<CharacterKeyframeAnimatorProps> = ({
  currentMs,
  keyframes,
  baseWidth = 900,
  baseHeight = 1080,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // If no keyframes provided, fallback to idle pose
  if (!keyframes || keyframes.length === 0) {
    keyframes = [{ timeMs: 0, pose: "pointing", scale: 1.0, x: 0, y: 0, rotate: 0, opacity: 1 }];
  }

  // Sort keyframes chronologically
  const sorted = [...keyframes].sort((a, b) => a.timeMs - b.timeMs);

  const times = sorted.map((k) => k.timeMs);
  const scales = sorted.map((k) => k.scale ?? 1.0);
  const xs = sorted.map((k) => k.x ?? 0);
  const ys = sorted.map((k) => k.y ?? 0);
  const rotates = sorted.map((k) => k.rotate ?? 0);
  const opacities = sorted.map((k) => k.opacity ?? 1);

  // Smooth bezier easing interpolation across keyframes
  const targetScale = interpolate(currentMs, times, scales, {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const targetX = interpolate(currentMs, times, xs, {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const targetY = interpolate(currentMs, times, ys, {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const targetRotate = interpolate(currentMs, times, rotates, {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const targetOpacity = interpolate(currentMs, times, opacities, {
    easing: Easing.bezier(0.25, 0.1, 0.25, 1.0),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Calculate current pose & cross-fade opacity between poses
  let currentPose: CharacterPose = "pointing";
  let nextPose: CharacterPose = "pointing";
  let poseTransitionProgress = 1;

  for (let i = 0; i < sorted.length; i++) {
    if (currentMs >= sorted[i].timeMs) {
      currentPose = sorted[i].pose || currentPose;
      if (i < sorted.length - 1 && sorted[i + 1].pose && sorted[i + 1].pose !== currentPose) {
        nextPose = sorted[i + 1].pose!;
        // Crossfade over 250ms window before the next keyframe
        const fadeStart = sorted[i + 1].timeMs - 250;
        const fadeEnd = sorted[i + 1].timeMs;
        if (currentMs >= fadeStart && currentMs <= fadeEnd) {
          poseTransitionProgress = interpolate(currentMs, [fadeStart, fadeEnd], [0, 1], {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
        } else if (currentMs < fadeStart) {
          poseTransitionProgress = 0;
        } else {
          poseTransitionProgress = 1;
        }
      } else {
        poseTransitionProgress = 0;
      }
    }
  }

  // Organic multi-layered micro-movements (breathing, eye-level sway, micro-bounce)
  const t = frame / fps;
  const breathY = Math.sin(t * 2.8) * 3.5;
  const breathScale = 1 + Math.sin(t * 2.8) * 0.003;
  const microSway = Math.cos(t * 1.8) * 0.35;
  const subtleXFloat = Math.sin(t * 1.2) * 2;

  if (targetOpacity <= 0.001) return null;

  const getPoseSrc = (pose: CharacterPose) => {
    switch (pose) {
      case "crossed":
        return staticFile("character_crossed.png");
      case "open":
        return staticFile("character_open.png");
      // Full body shots — intro hook & outro finale
      case "fullbody_pointing":
        return staticFile("character_fullbody_pointing.png");
      case "fullbody_open":
        return staticFile("character_fullbody_open.png");
      case "fullbody_casual":
        return staticFile("character_fullbody_casual.png");
      case "pointing":
      default:
        return staticFile("character_pointing.png");
    }
  };

  return (
    <div
      className={`relative pointer-events-none flex items-end justify-center select-none ${className}`}
      style={{
        width: `${baseWidth}px`,
        height: `${baseHeight}px`,
        opacity: targetOpacity,
        transform: `translate(${targetX + subtleXFloat}px, ${targetY + breathY}px) scale(${targetScale * breathScale}) rotate(${targetRotate + microSway}deg)`,
        transformOrigin: "bottom center",
      }}
    >
      {/* 1. Primary Current Pose */}
      <div
        className="absolute inset-0 flex items-end justify-center pointer-events-none"
        style={{
          opacity: 1 - poseTransitionProgress,
          transition: "opacity 0.2s ease-out",
        }}
      >
        <Img
          src={getPoseSrc(currentPose)}
          className="w-full h-full object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.22)]"
          alt="Judy Character"
        />
      </div>

      {/* 2. Secondary Cross-Fading Next Pose (Buttery Smooth Morphing) */}
      {poseTransitionProgress > 0 && poseTransitionProgress < 1 && (
        <div
          className="absolute inset-0 flex items-end justify-center pointer-events-none"
          style={{
            opacity: poseTransitionProgress,
            transition: "opacity 0.2s ease-out",
          }}
        >
          <Img
            src={getPoseSrc(nextPose)}
            className="w-full h-full object-contain object-bottom drop-shadow-[0_30px_60px_rgba(0,0,0,0.22)]"
            alt="Judy Character Morph"
          />
        </div>
      )}
    </div>
  );
};
