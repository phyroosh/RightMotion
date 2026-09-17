import React from "react";
import { interpolate, spring } from "remotion";

export interface CausalActionCouplingProps {
  frame: number;
  fps?: number;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  triggerFrame: number;
  propagationDurationFrames?: number;
  impactDurationFrames?: number;
  color?: string;
  sourceLabel?: string;
  targetLabel?: string;
  physicalLawLabel?: string;
  thicknessPx?: number;
  showConduit?: boolean;
}

/**
 * 🎬 CausalActionCoupling — Action-Reaction Propagation Primitive
 *
 * Demonstrates visible physical causality:
 *   1. Resting state: Quiescent, waiting for triggerFrame.
 *   2. Action event at (startX, startY) sends an kinetic impulse along the conduit vector.
 *   3. Propagation phase: Animated energy projectile travels from start to end.
 *   4. Impact at (endX, endY): Kinetic arrival triggers shockwave rings and force transfer.
 *
 * Anti-Cardification Law: Zero UI cards. Renders directly on stage SVG.
 */
export const CausalActionCoupling: React.FC<CausalActionCouplingProps> = ({
  frame,
  fps = 60,
  startX,
  startY,
  endX,
  endY,
  triggerFrame,
  propagationDurationFrames = 18,
  impactDurationFrames = 24,
  color = "#f43f5e",
  sourceLabel,
  targetLabel,
  physicalLawLabel,
  thicknessPx = 4,
  showConduit = true,
}) => {
  const isBeforeTrigger = frame < triggerFrame;
  const framesSinceTrigger = Math.max(0, frame - triggerFrame);
  const arrivalFrame = triggerFrame + propagationDurationFrames;
  const isDuringPropagation = frame >= triggerFrame && frame < arrivalFrame;
  const isAfterArrival = frame >= arrivalFrame;
  const framesSinceArrival = Math.max(0, frame - arrivalFrame);

  // Propagation progress (0.0 to 1.0)
  const propProgress = isBeforeTrigger
    ? 0
    : isDuringPropagation
    ? interpolate(framesSinceTrigger, [0, propagationDurationFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1.0;

  const currentX = startX + (endX - startX) * propProgress;
  const currentY = startY + (endY - startY) * propProgress;

  // Impact expansion at target
  const impactProgress = isAfterArrival
    ? spring({
        frame: framesSinceArrival,
        fps,
        config: { damping: 14, stiffness: 140, mass: 0.5 },
      })
    : 0;

  const impactRadius = interpolate(impactProgress, [0, 1], [4, 48]);
  const impactOpacity = isAfterArrival
    ? interpolate(framesSinceArrival, [0, impactDurationFrames], [0.9, 0], {
        extrapolateRight: "clamp",
      })
    : 0;

  // Conduit line opacity
  const conduitOpacity = isBeforeTrigger
    ? 0.2
    : interpolate(propProgress, [0, 1], [0.8, 0.4]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="causal-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={color} floodOpacity="0.6" />
          </filter>
        </defs>

        {/* 1. Underlying Conduit Vector */}
        {showConduit && (
          <line
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke={color}
            strokeWidth={thicknessPx}
            strokeDasharray="6 6"
            strokeOpacity={conduitOpacity}
            strokeLinecap="round"
          />
        )}

        {/* 2. Traveling Kinetic Energy Projectile */}
        {isDuringPropagation && (
          <g>
            <circle
              cx={currentX}
              cy={currentY}
              r={thicknessPx * 2.2}
              fill={color}
              filter="url(#causal-glow)"
            />
            {/* Trailing streak */}
            <line
              x1={startX + (endX - startX) * Math.max(0, propProgress - 0.15)}
              y1={startY + (endY - startY) * Math.max(0, propProgress - 0.15)}
              x2={currentX}
              y2={currentY}
              stroke={color}
              strokeWidth={thicknessPx * 2}
              strokeLinecap="round"
              strokeOpacity={0.8}
            />
          </g>
        )}

        {/* 3. Impact Shockwave Rings upon Arrival */}
        {isAfterArrival && impactOpacity > 0.01 && (
          <g>
            <circle
              cx={endX}
              cy={endY}
              r={impactRadius}
              fill="none"
              stroke={color}
              strokeWidth={Math.max(1, thicknessPx * (1 - impactProgress))}
              strokeOpacity={impactOpacity}
            />
            <circle
              cx={endX}
              cy={endY}
              r={impactRadius * 0.55}
              fill="none"
              stroke={color}
              strokeWidth={Math.max(1, thicknessPx * 1.5 * (1 - impactProgress))}
              strokeOpacity={impactOpacity * 1.2}
            />
          </g>
        )}

        {/* 4. Semantic Origin & Target Markers */}
        <circle cx={startX} cy={startY} r={5} fill={color} opacity={isBeforeTrigger ? 0.4 : 0.9} />
        <circle cx={endX} cy={endY} r={5} fill={color} opacity={isAfterArrival ? 0.9 : 0.4} />

        {/* Labels */}
        {sourceLabel && (
          <text
            x={startX}
            y={startY - 14}
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize="18"
            fontWeight="bold"
            fill="#64748b"
            letterSpacing="0.08em"
          >
            {sourceLabel.toUpperCase()}
          </text>
        )}

        {targetLabel && (
          <text
            x={endX}
            y={endY + 28}
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize="18"
            fontWeight="bold"
            fill={isAfterArrival ? color : "#64748b"}
            letterSpacing="0.08em"
          >
            {targetLabel.toUpperCase()}
          </text>
        )}

        {physicalLawLabel && (
          <text
            x={(startX + endX) / 2}
            y={(startY + endY) / 2 - 14}
            textAnchor="middle"
            fontFamily="JetBrains Mono, monospace"
            fontSize="16"
            fontWeight="bold"
            fill="#090d16"
            letterSpacing="0.06em"
            opacity={propProgress > 0.1 ? 0.85 : 0.3}
          >
            {physicalLawLabel.toUpperCase()}
          </text>
        )}
      </svg>
    </div>
  );
};
