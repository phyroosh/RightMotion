import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ActiveNodeState, useCausalConsequence, useNodeState } from "./CausalWorld";

export interface CausalNodeProps {
  id: string;
  /** Only render if the node is currently in one of these conditions */
  visibleConditions?: string[];
  /** Apply spring squash & rebound when transitions occur */
  enableImpactPhysics?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode | ((state: ActiveNodeState) => React.ReactNode);
}

/**
 * 🧱 CausalNode
 * Visual bridge container connected to a semantic causal node.
 * Reacts automatically to state changes, impacts, and memory mutations.
 */
export const CausalNode: React.FC<CausalNodeProps> = ({
  id,
  visibleConditions,
  enableImpactPhysics = true,
  className = "",
  style = {},
  children,
}) => {
  const state = useNodeState(id);
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (visibleConditions && !visibleConditions.includes(state.condition)) {
    return null;
  }

  // Impact Physics on transition
  let scaleX = 1.0;
  let scaleY = 1.0;
  let offsetY = 0;

  if (enableImpactPhysics && state.lastTransitionFrame !== undefined) {
    const relTrans = state.framesSinceTransition;
    if (relTrans < 16) {
      const sp = spring({
        frame: relTrans,
        fps,
        config: { damping: 12, mass: 0.6, stiffness: 160 },
      });
      const squashFactor = interpolate(sp, [0, 0.4, 1], [0, 0.08, 0]);
      scaleY = 1.0 - squashFactor;
      scaleX = 1.0 + squashFactor * 0.7;
      offsetY = interpolate(sp, [0, 0.5, 1], [4, -2, 0]);
    }
  }

  return (
    <div
      data-causal-node={id}
      data-causal-condition={state.condition}
      className={`relative ${className}`}
      style={{
        transform: `translate3d(0px, ${offsetY.toFixed(2)}px, 0px) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`,
        transformOrigin: "center center",
        willChange: "transform",
        ...style,
      }}
    >
      {typeof children === "function" ? children(state) : children}
    </div>
  );
};

export interface ThresholdReactorProps {
  nodeId: string;
  property?: string;
  threshold?: number;
  criticalClassName?: string;
  normalClassName?: string;
  children: React.ReactNode;
}

/**
 * ⚡ ThresholdReactor
 * Wraps visual content and applies real-time visual reactions (tension tremor, border shifts)
 * whenever an upstream state enters critical threshold.
 */
export const ThresholdReactor: React.FC<ThresholdReactorProps> = ({
  nodeId,
  property = "load",
  threshold = 0.75,
  criticalClassName = "border-rose-600 shadow-rose-200",
  normalClassName = "border-slate-900",
  children,
}) => {
  const consequence = useCausalConsequence(nodeId, property);
  const frame = useCurrentFrame();

  const isCrossed = consequence.intensity >= threshold || consequence.isCritical;

  let tremorX = 0;
  let tremorY = 0;
  if (isCrossed) {
    tremorX = Math.sin(frame * 1.8) * 1.6;
    tremorY = Math.cos(frame * 1.4) * 1.2;
  }

  return (
    <div
      className={`transition-colors duration-200 ${isCrossed ? criticalClassName : normalClassName}`}
      style={{
        transform: isCrossed ? `translate3d(${tremorX.toFixed(2)}px, ${tremorY.toFixed(2)}px, 0px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

export interface CausalImpulseConduitProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  active?: boolean;
  color?: string;
  thickness?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 〰️ CausalImpulseConduit
 * An energetic structural line transmitting cause-and-effect impulses between two coordinates.
 */
export const CausalImpulseConduit: React.FC<CausalImpulseConduitProps> = ({
  startX,
  startY,
  endX,
  endY,
  active = true,
  color = "#0284c7",
  thickness = 3,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;

  const pulseOffset = (frame * 6) % Math.max(1, length);

  return (
    <div
      className={`absolute pointer-events-none select-none origin-left ${className}`}
      style={{
        left: `${startX}px`,
        top: `${startY}px`,
        width: `${length}px`,
        height: `${thickness}px`,
        transform: `rotate(${angleDeg}deg)`,
        backgroundColor: "rgba(148, 163, 184, 0.3)",
        ...style,
      }}
    >
      {active && (
        <div
          className="absolute h-full rounded-full shadow-sm"
          style={{
            width: "30px",
            backgroundColor: color,
            left: `${pulseOffset}px`,
            boxShadow: `0 0 10px ${color}`,
          }}
        />
      )}
    </div>
  );
};
