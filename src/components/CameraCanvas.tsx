import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export interface CameraKeyframe {
  timeMs: number;
  x?: number; // Camera focus target X in world coordinates (default 960 for 1920x1080)
  y?: number; // Camera focus target Y in world coordinates (default 540 for 1920x1080)
  zoom?: number; // Camera zoom factor (1.0 = standard, 1.25 = close up, 0.8 = wide)
  rotate?: number; // Camera roll in degrees (e.g. -1.5 to 1.5 for dynamic feel)
  easing?: (t: number) => number;
}

export interface CameraCanvasProps {
  currentMs: number;
  keyframes: CameraKeyframe[];
  children: React.ReactNode;
  width?: number;
  height?: number;
  enableDrift?: boolean;
  driftIntensity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * After Effects Standard Cubic Bezier (Easy Ease / Smooth Ease)
 */
export const AE_EASY_EASE = Easing.bezier(0.25, 0.1, 0.25, 1.0);
export const AE_PUNCHY_EASE = Easing.bezier(0.16, 1.0, 0.3, 1.0);
export const AE_CINEMATIC_EASE = Easing.bezier(0.33, 0.0, 0.0, 1.0);

/**
 * Evaluates smooth camera track parameters at currentMs
 */
export function evaluateCameraTrack(
  currentMs: number,
  keyframes: CameraKeyframe[],
  defaultWidth = 1920,
  defaultHeight = 1080
): { x: number; y: number; zoom: number; rotate: number } {
  const defaultX = defaultWidth / 2;
  const defaultY = defaultHeight / 2;

  if (!keyframes || keyframes.length === 0) {
    return { x: defaultX, y: defaultY, zoom: 1.0, rotate: 0 };
  }

  const sorted = [...keyframes].sort((a, b) => a.timeMs - b.timeMs);

  // Ensure strictly monotonic timestamps for Remotion interpolate
  const times: number[] = [];
  for (let i = 0; i < sorted.length; i++) {
    let t = sorted[i].timeMs;
    if (i > 0 && t <= times[i - 1]) {
      t = times[i - 1] + 1;
    }
    times.push(t);
  }

  const xs = sorted.map((k) => (k.x !== undefined ? k.x : defaultX));
  const ys = sorted.map((k) => (k.y !== undefined ? k.y : defaultY));
  const zooms = sorted.map((k) => (k.zoom !== undefined ? k.zoom : 1.0));
  const rotates = sorted.map((k) => (k.rotate !== undefined ? k.rotate : 0));

  const x = interpolate(currentMs, times, xs, {
    easing: AE_EASY_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const y = interpolate(currentMs, times, ys, {
    easing: AE_EASY_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const zoom = interpolate(currentMs, times, zooms, {
    easing: AE_EASY_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rotate = interpolate(currentMs, times, rotates, {
    easing: AE_EASY_EASE,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return { x, y, zoom, rotate };
}

/**
 * CameraCanvas:
 * Professional After Effects 2.5D Camera Rig for Remotion.
 * Simulates real AE camera panning, zooming, tracking shots, rotational tilts,
 * and natural handheld organic drift across a wide 16:9 canvas.
 */
export const CameraCanvas: React.FC<CameraCanvasProps> = ({
  currentMs,
  keyframes,
  children,
  width = 1920,
  height = 1080,
  enableDrift = true,
  driftIntensity = 1.0,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cam = evaluateCameraTrack(currentMs, keyframes, width, height);

  // Subtle organic camera breathing/drift (After Effects Wiggle / Handheld feel)
  const timeSec = frame / fps;
  const driftX = enableDrift
    ? (Math.sin(timeSec * 0.75) * 3.5 + Math.cos(timeSec * 1.3) * 1.5) * driftIntensity
    : 0;
  const driftY = enableDrift
    ? (Math.cos(timeSec * 0.65) * 2.8 + Math.sin(timeSec * 1.1) * 1.2) * driftIntensity
    : 0;
  const driftRotate = enableDrift
    ? Math.sin(timeSec * 0.45) * 0.12 * driftIntensity
    : 0;

  const targetX = cam.x + driftX;
  const targetY = cam.y + driftY;
  const targetZoom = cam.zoom;
  const targetRotate = cam.rotate + driftRotate;

  const viewportCenterX = width / 2;
  const viewportCenterY = height / 2;

  // After Effects Camera Matrix Transformation:
  // 1. Move to viewport center
  // 2. Scale by zoom
  // 3. Rotate by roll
  // 4. Translate by camera offset relative to viewport center
  const cameraTransform = `translate(${viewportCenterX}px, ${viewportCenterY}px) scale(${targetZoom}) rotate(${-targetRotate}deg) translate(${-targetX}px, ${-targetY}px)`;

  return (
    <div
      className={`relative w-full h-full overflow-hidden select-none ${className}`}
      style={{
        width,
        height,
        ...style,
      }}
    >
      {/* 2.5D World Container transformed by AE Camera */}
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          transform: cameraTransform,
          transformOrigin: "0px 0px",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
};
