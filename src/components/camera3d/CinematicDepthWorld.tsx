import React, { createContext, useContext } from "react";
import {
  InfiniteWorldCanvas,
  WorldEntity,
  useWorldCamera,
  WorldCameraBreathHold,
  WorldCameraImpact,
  WorldWaypoint,
} from "./InfiniteWorldCanvas";
import { ENABLE_CINEMATIC_CAMERA_V3 } from "../../config/features";

export type DepthPlaneType = "foreground" | "midground" | "background";

export interface DepthWorldContextValue {
  cameraX: number;
  cameraY: number;
  zoom: number;
  frame: number;
  /** Active focal depth plane for rack-focus interactions */
  activeFocalPlane?: DepthPlaneType;
}

const DepthWorldContext = createContext<DepthWorldContextValue>({
  cameraX: 0,
  cameraY: 0,
  zoom: 1.0,
  frame: 0,
  activeFocalPlane: "midground",
});

export const useDepthWorld = () => useContext(DepthWorldContext);

export interface CinematicDepthWorldProps {
  children: React.ReactNode;
  /** Flight waypoints */
  waypoints: WorldWaypoint[];
  /** Optional deep atmospheric or environmental background */
  background?: React.ReactNode;
  /** Optional near-lens foreground elements */
  foreground?: React.ReactNode;
  /** Windows where camera freezes drift */
  breathHolds?: WorldCameraBreathHold[];
  /** Impact shakes */
  impacts?: WorldCameraImpact[];
  /** Coordinate grid floor */
  showGrid?: boolean;
  /** Active focal plane: 'foreground' | 'midground' | 'background' */
  activeFocalPlane?: DepthPlaneType;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * 🎥 CinematicDepthWorld
 * Multi-plane spatial world renderer extending InfiniteWorldCanvas.
 * 
 * Provides true depth stratification:
 * - Foreground Plane (Z > 0): Near the virtual lens, 1.55x parallax speed, natural fly-by occlusion.
 * - Midground Plane (Z = 0): Focal narrative plane, 1.0x speed.
 * - Background Plane (Z < 0): Colossal deep environment, 0.5x parallax speed.
 */
export const CinematicDepthWorld: React.FC<CinematicDepthWorldProps> = ({
  children,
  waypoints,
  background,
  foreground,
  breathHolds = [],
  impacts = [],
  showGrid = true,
  activeFocalPlane = "midground",
  className = "",
  style = {},
}) => {
  if (!ENABLE_CINEMATIC_CAMERA_V3) {
    // Frontier #3 Dormant: Delegate directly to authoritative Frontier #1 InfiniteWorldCanvas
    return (
      <InfiniteWorldCanvas
        waypoints={waypoints}
        breathHolds={breathHolds}
        impacts={impacts}
        showGrid={showGrid}
        className={className}
        style={style}
      >
        {children}
      </InfiniteWorldCanvas>
    );
  }

  return (
    <InfiniteWorldCanvas
      waypoints={waypoints}
      breathHolds={breathHolds}
      impacts={impacts}
      showGrid={showGrid}
      className={className}
      style={style}
    >
      <DepthWorldInner
        background={background}
        foreground={foreground}
        activeFocalPlane={activeFocalPlane}
      >
        {children}
      </DepthWorldInner>
    </InfiniteWorldCanvas>
  );
};

interface DepthWorldInnerProps {
  children: React.ReactNode;
  background?: React.ReactNode;
  foreground?: React.ReactNode;
  activeFocalPlane: DepthPlaneType;
}

const DepthWorldInner: React.FC<DepthWorldInnerProps> = ({
  children,
  background,
  foreground,
  activeFocalPlane,
}) => {
  const { cameraX, cameraY, zoom, frame } = useWorldCamera();

  // Foreground parallax factor (objects near the lens move 1.55x faster than midground)
  const fgParallaxFactor = 1.55;
  // Background parallax factor (distant environmental geometry moves at 0.5x speed)
  const bgParallaxFactor = 0.5;

  // Parallax delta offsets relative to midground camera origin
  const fgOffsetX = -(cameraX * (fgParallaxFactor - 1.0));
  const fgOffsetY = -(cameraY * (fgParallaxFactor - 1.0));

  const bgOffsetX = -(cameraX * (bgParallaxFactor - 1.0));
  const bgOffsetY = -(cameraY * (bgParallaxFactor - 1.0));

  return (
    <DepthWorldContext.Provider
      value={{
        cameraX,
        cameraY,
        zoom,
        frame,
        activeFocalPlane,
      }}
    >
      {/* 1. Deep Environmental Background Layer (Z < 0) */}
      {background && (
        <div
          className="absolute pointer-events-none z-0"
          style={{
            transform: `translate3d(${bgOffsetX.toFixed(2)}px, ${bgOffsetY.toFixed(2)}px, 0px)`,
            willChange: "transform",
          }}
        >
          {background}
        </div>
      )}

      {/* 2. Midground Focal World Layer (Z = 0) */}
      <div className="relative z-10">
        {children}
      </div>

      {/* 3. Near-Lens Foreground Layer (Z > 0) */}
      {foreground && (
        <div
          className="absolute inset-0 pointer-events-none z-30"
          style={{
            transform: `translate3d(${fgOffsetX.toFixed(2)}px, ${fgOffsetY.toFixed(2)}px, 0px)`,
            willChange: "transform",
          }}
        >
          {foreground}
        </div>
      )}
    </DepthWorldContext.Provider>
  );
};

export interface WorldDepthEntityProps {
  worldX: number;
  worldY: number;
  width: number;
  height: number;
  /** Depth plane: 'foreground' (Z > 0) | 'midground' (Z = 0) | 'background' (Z < 0) */
  depth?: DepthPlaneType;
  /** Optional custom parallax factor (overrides default depth factor) */
  parallaxFactor?: number;
  margin?: number;
  startFrame?: number;
  endFrame?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 📦 WorldDepthEntity
 * Positions an element in global spatial coordinates (worldX, worldY)
 * with depth-aware parallax kinematics and frustum unmounting.
 */
export const WorldDepthEntity: React.FC<WorldDepthEntityProps> = ({
  worldX,
  worldY,
  width,
  height,
  depth = "midground",
  parallaxFactor,
  margin = 700,
  startFrame,
  endFrame,
  children,
  className = "",
  style = {},
}) => {
  // If Frontier #3 is dormant:
  // - Bypass all foreground depth entities (occluders, near-lens panels)
  // - Delegate midground/background directly to authoritative Frontier #1 WorldEntity
  if (!ENABLE_CINEMATIC_CAMERA_V3) {
    if (depth === "foreground") {
      return null;
    }
    return (
      <WorldEntity
        worldX={worldX}
        worldY={worldY}
        width={width}
        height={height}
        margin={margin}
        startFrame={startFrame}
        endFrame={endFrame}
        className={className}
        style={style}
      >
        {children}
      </WorldEntity>
    );
  }

  const { cameraX, cameraY, zoom, frame } = useWorldCamera();

  // 1. Temporal lifecycle check
  if (startFrame !== undefined && frame < startFrame) {
    return null;
  }
  if (endFrame !== undefined && frame > endFrame) {
    return null;
  }

  // 2. Determine effective parallax multiplier
  let factor = 1.0;
  if (parallaxFactor !== undefined) {
    factor = parallaxFactor;
  } else if (depth === "foreground") {
    factor = 1.55;
  } else if (depth === "background") {
    factor = 0.5;
  }

  // Position relative to midground:
  // Base world position plus parallax offset
  const parallaxDeltaX = (worldX - cameraX) * (factor - 1.0);
  const parallaxDeltaY = (worldY - cameraY) * (factor - 1.0);

  const effectiveX = worldX + parallaxDeltaX;
  const effectiveY = worldY + parallaxDeltaY;

  // 3. Frustum culling check in world coordinates
  const halfVw = 540 / zoom;
  const halfVh = 960 / zoom;

  const dx = Math.abs(effectiveX - cameraX);
  const dy = Math.abs(effectiveY - cameraY);

  if (dx > halfVw + width / 2 + margin || dy > halfVh + height / 2 + margin) {
    return null;
  }

  const zIndex = depth === "foreground" ? 30 : depth === "background" ? 5 : 20;

  return (
    <div
      className={`absolute ${className}`}
      style={{
        left: `${(effectiveX - width / 2).toFixed(2)}px`,
        top: `${(effectiveY - height / 2).toFixed(2)}px`,
        width: `${width}px`,
        height: `${height}px`,
        zIndex,
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
