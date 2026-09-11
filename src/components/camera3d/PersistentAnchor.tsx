import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface AnchorState {
  x?: number; // horizontal translation in px
  y?: number; // vertical translation in px
  scale?: number; // scale multiplier
  opacity?: number; // opacity (0 to 1)
  rotation?: number; // rotation in degrees
}

export interface PersistentAnchorProps {
  children: React.ReactNode;
  /** Frame when element enters in its primary state */
  startFrame: number;
  /** Frame when transition to secondary state begins */
  transitionStartFrame: number;
  /** Frame when transition to secondary state completes */
  transitionEndFrame: number;
  /** Initial primary state in Scene A (default: x:0, y:0, scale:1, opacity:1) */
  initialState?: AnchorState;
  /** Target destination state in Scene B (e.g. moved to corner token: scale:0.5, y:-400) */
  targetState: AnchorState;
  /** Optional frame when element finally exits the screen */
  exitFrame?: number;
  /** Custom className */
  className?: string;
  /** Custom style */
  style?: React.CSSProperties;
}

/**
 * ⚓ PersistentAnchor
 * Enables continuous visual storytelling and spatial continuity across scenes.
 * Prevents "PowerPoint slide resets" by gracefully traveling and morphing an element
 * from its hero position in Scene A to a persistent corner badge or anchor in Scene B.
 */
export const PersistentAnchor: React.FC<PersistentAnchorProps> = ({
  children,
  startFrame,
  transitionStartFrame,
  transitionEndFrame,
  initialState = { x: 0, y: 0, scale: 1, opacity: 1, rotation: 0 },
  targetState,
  exitFrame,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || (exitFrame !== undefined && frame >= exitFrame)) {
    return null;
  }

  // Entrance spring into initial state
  const spEntrance = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Cross-scene transition progress (0 to 1)
  const isTransitioning = frame >= transitionStartFrame;
  const relTransition = Math.max(0, frame - transitionStartFrame);
  const transitionDur = Math.max(1, transitionEndFrame - transitionStartFrame);

  const transitionProgress = isTransitioning
    ? interpolate(relTransition, [0, transitionDur], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const spTransition = isTransitioning
    ? spring({
        frame: relTransition,
        fps,
        config: { damping: 15, stiffness: 105, mass: 0.85 },
      })
    : 0;

  // Compute interpolated transform values
  const initX = initialState.x ?? 0;
  const initY = initialState.y ?? 0;
  const initScale = initialState.scale ?? 1.0;
  const initOpacity = initialState.opacity ?? 1.0;
  const initRot = initialState.rotation ?? 0;

  const targetX = targetState.x ?? 0;
  const targetY = targetState.y ?? 0;
  const targetScale = targetState.scale ?? 1.0;
  const targetOpacity = targetState.opacity ?? 1.0;
  const targetRot = targetState.rotation ?? 0;

  const currentX = interpolate(spTransition, [0, 1], [initX, targetX]);
  const currentY = interpolate(spTransition, [0, 1], [initY, targetY]);
  const currentScale =
    interpolate(spEntrance, [0, 1], [0.8, initScale]) *
    interpolate(spTransition, [0, 1], [1.0, targetScale / initScale]);
  const currentOpacity =
    Math.min(1, spEntrance * 1.5) *
    interpolate(transitionProgress, [0, 1], [initOpacity, targetOpacity]);
  const currentRot = interpolate(spTransition, [0, 1], [initRot, targetRot]);

  return (
    <div
      className={`absolute select-none pointer-events-none ${className}`}
      style={{
        transform: `translate3d(${currentX}px, ${currentY}px, 0px) scale(${currentScale}) rotate(${currentRot}deg)`,
        transformOrigin: "center center",
        opacity: currentOpacity,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
