import React, { createContext, useContext } from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface WorldWaypoint {
  /** Frame when camera arrives at or begins this waypoint */
  frame: number;
  /** World X coordinate centered on camera */
  x: number;
  /** World Y coordinate centered on camera */
  y: number;
  /** Camera zoom scale (default: 1.0, pull back e.g. 0.35, push in e.g. 1.15) */
  zoom?: number;
  /** Dutch tilt angle in degrees (default: 0) */
  angle?: number;
  /** Duration of transition into this waypoint in frames */
  durationFrames?: number;
  /** Motion style: "smooth" (cubic bezier) | "snappy" (spring) | "linear" */
  transitionType?: "smooth" | "snappy" | "linear";
}

export interface WorldCameraBreathHold {
  startFrame: number;
  durationFrames: number;
}

export interface WorldCameraImpact {
  frame: number;
  intensity?: number;
  durationFrames?: number;
}

export interface InfiniteWorldCanvasProps {
  children: React.ReactNode;
  /** Array of chronological camera waypoints defining the continuous flight path */
  waypoints: WorldWaypoint[];
  /** Optional background content rendered on a parallax plane behind the world */
  background?: React.ReactNode;
  /** Optional foreground content rendered in front of the world */
  foreground?: React.ReactNode;
  /** Windows where camera freezes drift for dramatic tension */
  breathHolds?: WorldCameraBreathHold[];
  /** Trauma impact shakes */
  impacts?: WorldCameraImpact[];
  /** Enable organic micro-drift (default: true) */
  enableDrift?: boolean;
  /** World coordinate grid/floor visibility (default: true) */
  showGrid?: boolean;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

export interface WorldCameraContextValue {
  cameraX: number;
  cameraY: number;
  zoom: number;
  frame: number;
}

const WorldCameraContext = createContext<WorldCameraContextValue>({
  cameraX: 0,
  cameraY: 0,
  zoom: 1.0,
  frame: 0,
});

export const useWorldCamera = () => useContext(WorldCameraContext);

/**
 * 🌍 InfiniteWorldCanvas
 * Persistent Spatial Coordinate World Engine for RightMotion.
 * 
 * Replaces temporal slide resets with a continuous spatial coordinate universe.
 * The camera navigates through space, discovering interconnected narrative chambers.
 */
export const InfiniteWorldCanvas: React.FC<InfiniteWorldCanvasProps> = ({
  children,
  waypoints,
  background,
  foreground,
  breathHolds = [],
  impacts = [],
  enableDrift = true,
  showGrid = true,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Solve Camera Position (cx, cy, zoom, angle) along waypoint path
  const sortedWps = [...waypoints].sort((a, b) => a.frame - b.frame);
  let baseCx = 0;
  let baseCy = 0;
  let baseZoom = 1.0;
  let baseAngle = 0;

  if (sortedWps.length > 0) {
    if (frame <= sortedWps[0].frame) {
      baseCx = sortedWps[0].x;
      baseCy = sortedWps[0].y;
      baseZoom = sortedWps[0].zoom ?? 1.0;
      baseAngle = sortedWps[0].angle ?? 0;
    } else if (frame >= sortedWps[sortedWps.length - 1].frame) {
      const last = sortedWps[sortedWps.length - 1];
      baseCx = last.x;
      baseCy = last.y;
      baseZoom = last.zoom ?? 1.0;
      baseAngle = last.angle ?? 0;
    } else {
      // Find active segment between wpA and wpB
      for (let i = 0; i < sortedWps.length - 1; i++) {
        const wpA = sortedWps[i];
        const wpB = sortedWps[i + 1];
        if (frame >= wpA.frame && frame < wpB.frame) {
          const transDur = Math.max(1, wpB.durationFrames ?? (wpB.frame - wpA.frame));
          const transStart = wpB.frame - transDur;

          if (frame < transStart) {
            // Holding at wpA
            baseCx = wpA.x;
            baseCy = wpA.y;
            baseZoom = wpA.zoom ?? 1.0;
            baseAngle = wpA.angle ?? 0;
          } else {
            // Travelling from wpA to wpB
            const relTrans = frame - transStart;
            let progress = 0;

            if (wpB.transitionType === "snappy") {
              progress = spring({
                frame: relTrans,
                fps,
                config: { damping: 16, stiffness: 110, mass: 0.8 },
              });
            } else if (wpB.transitionType === "linear") {
              progress = interpolate(relTrans, [0, transDur], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
            } else {
              // Smooth cubic bezier (default)
              progress = interpolate(relTrans, [0, transDur], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.22, 1, 0.36, 1),
              });
            }

            const startZ = wpA.zoom ?? 1.0;
            const targetZ = wpB.zoom ?? 1.0;
            const startAng = wpA.angle ?? 0;
            const targetAng = wpB.angle ?? 0;

            baseCx = interpolate(progress, [0, 1], [wpA.x, wpB.x]);
            baseCy = interpolate(progress, [0, 1], [wpA.y, wpB.y]);
            baseZoom = interpolate(progress, [0, 1], [startZ, targetZ]);
            baseAngle = interpolate(progress, [0, 1], [startAng, targetAng]);
          }
          break;
        }
      }
    }
  }

  // 2. Organic Camera Micro-Drift with Position-Anchored Breath-Hold Freezes
  let driftX = 0;
  let driftY = 0;
  if (enableDrift) {
    const driftSpeed = 0.024;
    const rawDriftX = Math.sin(frame * driftSpeed) * 6.0;
    const rawDriftY = Math.cos(frame * (driftSpeed * 0.75)) * 4.5;

    let activeHold: WorldCameraBreathHold | null = null;
    for (const bh of breathHolds) {
      if (frame >= bh.startFrame - 8 && frame <= bh.startFrame + bh.durationFrames + 12) {
        activeHold = bh;
        break;
      }
    }

    if (activeHold) {
      const holdStart = activeHold.startFrame;
      const holdEnd = activeHold.startFrame + activeHold.durationFrames;
      const freezeX = Math.sin(holdStart * driftSpeed) * 6.0;
      const freezeY = Math.cos(holdStart * (driftSpeed * 0.75)) * 4.5;

      if (frame < holdStart) {
        const easeIn = interpolate(frame, [holdStart - 8, holdStart], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
        driftX = interpolate(easeIn, [0, 1], [rawDriftX, freezeX]);
        driftY = interpolate(easeIn, [0, 1], [rawDriftY, freezeY]);
      } else if (frame <= holdEnd) {
        driftX = freezeX;
        driftY = freezeY;
      } else {
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

  // 3. Damped Harmonic Impact Shakes
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

  // Final Unified World Camera Coordinates
  const finalCx = baseCx + driftX + impactShakeX;
  const finalCy = baseCy + driftY + impactShakeY;
  const finalZoom = baseZoom;
  const finalAngle = baseAngle;

  // Viewport projection: Center world point (finalCx, finalCy) exactly at screen center (540, 960)
  const screenTranslateX = 540 - finalCx * finalZoom;
  const screenTranslateY = 960 - finalCy * finalZoom;
  const rotStr = Math.abs(finalAngle) > 0.001 ? ` rotate(${finalAngle.toFixed(3)}deg)` : "";

  // Parallax background coordinates (moves at 0.35x speed)
  const bgTranslateX = 540 - finalCx * 0.35 * finalZoom;
  const bgTranslateY = 960 - finalCy * 0.35 * finalZoom;

  return (
    <WorldCameraContext.Provider
      value={{
        cameraX: finalCx,
        cameraY: finalCy,
        zoom: finalZoom,
        frame,
      }}
    >
      <div
        className={`absolute inset-0 overflow-hidden select-none bg-[#f8fafc] text-slate-950 ${className}`}
        style={{
          width: "1080px",
          height: "1920px",
          ...style,
        }}
      >
        {/* Parallax Background Plane */}
        {background && (
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              transform: `translate3d(${bgTranslateX.toFixed(2)}px, ${bgTranslateY.toFixed(2)}px, 0px) scale(${finalZoom.toFixed(4)})`,
              transformOrigin: "0 0",
              willChange: "transform",
            }}
          >
            {background}
          </div>
        )}

        {/* Global Blueprint Floor (Coordinate Grid) */}
        {showGrid && (
          <div
            className="absolute pointer-events-none opacity-40 z-1"
            style={{
              left: "-3000px",
              top: "-3000px",
              width: "10000px",
              height: "10000px",
              transform: `translate3d(${screenTranslateX.toFixed(2)}px, ${screenTranslateY.toFixed(2)}px, 0px) scale(${finalZoom.toFixed(4)})`,
              transformOrigin: "0 0",
              backgroundImage: `
                linear-gradient(to right, rgba(15, 23, 42, 0.08) 1.5px, transparent 1.5px),
                linear-gradient(to bottom, rgba(15, 23, 42, 0.08) 1.5px, transparent 1.5px)
              `,
              backgroundSize: "120px 120px",
            }}
          />
        )}

        {/* Main Spatial World Container */}
        <div
          className="absolute z-10"
          style={{
            transform: `translate3d(${screenTranslateX.toFixed(2)}px, ${screenTranslateY.toFixed(2)}px, 0px) scale(${finalZoom.toFixed(4)})${rotStr}`,
            transformOrigin: "0 0",
            willChange: "transform",
          }}
        >
          {children}
        </div>

        {/* Foreground Overlay Layer (e.g. static UI, captions, letterbox) */}
        {foreground && (
          <div className="absolute inset-0 pointer-events-none z-50">
            {foreground}
          </div>
        )}
      </div>
    </WorldCameraContext.Provider>
  );
};

export interface WorldEntityProps {
  /** Global X coordinate of the entity center */
  worldX: number;
  /** Global Y coordinate of the entity center */
  worldY: number;
  /** Bounding box width in pixels */
  width: number;
  /** Bounding box height in pixels */
  height: number;
  /** Margin buffer for frustum culling (default: 600px) */
  margin?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 📦 WorldEntity
 * Positions an element in global spatial coordinates $(worldX, worldY)$
 * with built-in frustum visibility culling to preserve CPU rendering performance.
 */
export const WorldEntity: React.FC<WorldEntityProps> = ({
  worldX,
  worldY,
  width,
  height,
  margin = 600,
  children,
  className = "",
  style = {},
}) => {
  const { cameraX, cameraY, zoom } = useWorldCamera();

  // Frustum culling check: half-viewport in world units
  const halfVw = 540 / zoom;
  const halfVh = 960 / zoom;

  const dx = Math.abs(worldX - cameraX);
  const dy = Math.abs(worldY - cameraY);

  const isVisible = dx <= halfVw + width / 2 + margin && dy <= halfVh + height / 2 + margin;

  if (!isVisible) {
    // Hidden from CPU rasterizer when outside camera view
    return <div style={{ display: "none" }} />;
  }

  return (
    <div
      className={`absolute ${className}`}
      style={{
        left: `${worldX - width / 2}px`,
        top: `${worldY - height / 2}px`,
        width: `${width}px`,
        height: `${height}px`,
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
