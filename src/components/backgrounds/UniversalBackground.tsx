/**
 * 🎬 RightMotion — UniversalBackground Runtime Primitive
 * Location: src/components/backgrounds/UniversalBackground.tsx
 *
 * Lightweight, GPU-accelerated Remotion component for rendering and choreographing
 * universal background materials and environments.
 *
 * Capabilities:
 * - Intelligent 9:16 focal crop alignment
 * - Restrained, non-distracting kinetic motion (zoom, drift, parallax)
 * - Seamless in/out transitions (dissolve, luma fade, scale)
 * - Optional non-destructive dimming/tinting for typography contrast
 */

import React from "react";
import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import {
  getUniversalBackgroundMeta,
  getUniversalBackgroundPath,
  UniversalBackgroundId,
} from "./UniversalBackgroundLibrary";

export interface UniversalBackgroundProps {
  assetId?: UniversalBackgroundId;
  src?: string;
  semanticRole?: string;
  cropStrategy?:
    | "center_focal"
    | "preserve_light_falloff"
    | "top_weighted"
    | "bottom_weighted"
    | "custom"
    | string;
  cropFocalPoint?: [number, number]; // [x, y] normalized (0.0 to 1.0)
  motion?:
    | "static"
    | "subtle_drift"
    | "slow_zoom_in"
    | "slow_zoom_out"
    | "ambient_parallax"
    | string;
  motionScaleDelta?: number; // e.g. 1.04
  opacity?: number; // 0.0 - 1.0
  dimmingOverlay?: {
    color: string; // e.g. "rgba(3,7,18,0.45)"
    blurPx?: number;
  };
  transitionIn?: {
    type: "cut" | "dissolve" | "luma_fade" | "fade" | "scale_in" | string;
    durationFrames: number;
  };
  transitionOut?: {
    type: "cut" | "dissolve" | "luma_fade" | "scale_out" | string;
    durationFrames: number;
  };
  sceneStartFrame?: number;
  sceneDurationFrames?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const UniversalBackground: React.FC<UniversalBackgroundProps> = ({
  assetId,
  src,
  semanticRole = "cinematic_surface",
  cropStrategy = "center_focal",
  cropFocalPoint,
  motion = "static",
  motionScaleDelta = 1.04,
  opacity = 1.0,
  dimmingOverlay,
  transitionIn,
  transitionOut,
  sceneStartFrame = 0,
  sceneDurationFrames,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();

  // Resolve asset path & metadata
  const meta = assetId ? getUniversalBackgroundMeta(assetId) : undefined;
  const resolvedPath = src || (assetId ? getUniversalBackgroundPath(assetId) : "");

  if (!resolvedPath) {
    return null;
  }

  // Local frame within scene
  const localFrame = Math.max(0, frame - sceneStartFrame);

  // Transition In Alpha
  let inAlpha = 1.0;
  if (transitionIn && transitionIn.durationFrames > 0) {
    if (transitionIn.type === "cut") {
      inAlpha = localFrame >= 0 ? 1.0 : 0.0;
    } else {
      inAlpha = interpolate(
        localFrame,
        [0, transitionIn.durationFrames],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    }
  }

  // Transition Out Alpha
  let outAlpha = 1.0;
  if (
    transitionOut &&
    transitionOut.durationFrames > 0 &&
    sceneDurationFrames &&
    sceneDurationFrames > transitionOut.durationFrames
  ) {
    const outStart = sceneDurationFrames - transitionOut.durationFrames;
    if (transitionOut.type === "cut") {
      outAlpha = localFrame >= sceneDurationFrames ? 0.0 : 1.0;
    } else {
      outAlpha = interpolate(
        localFrame,
        [outStart, sceneDurationFrames],
        [1, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );
    }
  }

  const effectiveOpacity = Math.max(0, Math.min(1, opacity * inAlpha * outAlpha));

  // Focal crop positioning
  const focal = cropFocalPoint || (meta ? meta.focalCenter : [0.5, 0.5]);
  let objectPosition = `${focal[0] * 100}% ${focal[1] * 100}%`;
  if (cropStrategy === "top_weighted") {
    objectPosition = "50% 25%";
  } else if (cropStrategy === "bottom_weighted") {
    objectPosition = "50% 75%";
  } else if (cropStrategy === "center_focal") {
    objectPosition = `${focal[0] * 100}% ${focal[1] * 100}%`;
  }

  // Kinetic Motion calculations
  let scale = 1.0;
  let translateX = 0;
  let translateY = 0;

  const progress = sceneDurationFrames
    ? Math.min(1.0, localFrame / Math.max(1, sceneDurationFrames))
    : Math.min(1.0, localFrame / 150);

  if (motion === "slow_zoom_in") {
    scale = interpolate(progress, [0, 1], [1.0, motionScaleDelta], {
      extrapolateRight: "clamp",
    });
  } else if (motion === "slow_zoom_out") {
    scale = interpolate(progress, [0, 1], [motionScaleDelta, 1.0], {
      extrapolateRight: "clamp",
    });
  } else if (motion === "subtle_drift") {
    scale = 1.03;
    translateX = Math.sin(localFrame * 0.02) * 12;
    translateY = Math.cos(localFrame * 0.015) * 8;
  } else if (motion === "ambient_parallax") {
    scale = 1.02;
    translateY = Math.sin(localFrame * 0.025) * 14;
  }

  return (
    <div
      data-semantic-role={semanticRole}
      data-asset-id={assetId || "custom"}
      className={`absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0 ${className}`}
      style={{
        opacity: effectiveOpacity,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {/* 1. Underlying Material Image */}
      <Img
        src={staticFile(resolvedPath)}
        className="w-full h-full object-cover"
        style={{
          objectPosition,
          transform: `scale(${scale}) translate3d(${translateX}px, ${translateY}px, 0)`,
          transformOrigin: objectPosition,
          willChange: "transform",
        }}
      />

      {/* 2. Optional Contrast Dimming / Tint Overlay */}
      {dimmingOverlay && (
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            backgroundColor: dimmingOverlay.color,
            backdropFilter: dimmingOverlay.blurPx
              ? `blur(${dimmingOverlay.blurPx}px)`
              : undefined,
          }}
        />
      )}
    </div>
  );
};
