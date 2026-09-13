import React from "react";
import { spring, interpolate } from "remotion";

export interface ThresholdBoundaryProps {
  frame: number;
  fps?: number;
  startX?: number;
  endX?: number;
  initialBaselineY?: number;
  settledBaselineY?: number;
  strokeColor?: string;
  thicknessPx?: number;
  triggerFrame?: number;
  impulseDurationFrames?: number;
  showGhostTrace?: boolean;
  ghostOpacity?: number;
  label?: string;
  labelColor?: string;
  subLabel?: string;
  showImpulseMarker?: boolean;
}

/**
 * 🎬 ThresholdBoundary — Physical Standard & Baseline Primitive
 *
 * Demonstrates the physical mutation of a standard:
 *   1. Initial State: Strict taut boundary at initial baseline (y = 620).
 *   2. Downward Impulse: Mechanical strike at triggerFrame (f = 680).
 *   3. Viscoelastic Sag: Dynamic parabolic curve bending under load with spring damping.
 *   4. Stabilized State: Line permanently settles into lower baseline (y = 800).
 *   5. Persistent Ghost Trace: Dashed ghost line remains at original y = 620.
 *
 * Open-Canvas Law: Renders directly on stage SVG. Zero card containers.
 */
export const ThresholdBoundary: React.FC<ThresholdBoundaryProps> = ({
  frame,
  fps = 60,
  startX = 120,
  endX = 960,
  initialBaselineY = 620,
  settledBaselineY = 800,
  strokeColor = "#090d16",
  thicknessPx = 6,
  triggerFrame = 680,
  impulseDurationFrames = 50,
  showGhostTrace = true,
  ghostOpacity = 0.35,
  label = "THE STANDARD",
  labelColor = "#64748b",
  subLabel,
  showImpulseMarker = true,
}) => {
  const isBeforeImpulse = frame < triggerFrame;
  const framesSinceImpulse = Math.max(0, frame - triggerFrame);

  // Remotion spring dynamics for the boundary deflection & transition
  const springProgress = isBeforeImpulse
    ? 0
    : spring({
        frame: framesSinceImpulse,
        fps,
        config: { damping: 13, stiffness: 110, mass: 0.65 },
      });

  // Calculate endpoint and center deflection
  // Baseline shifts from initialBaselineY to settledBaselineY
  const baselineDelta = settledBaselineY - initialBaselineY;
  const currentEndpointY = initialBaselineY + baselineDelta * springProgress;

  // Viscoelastic sag overshoot during dynamic impulse phase (first ~35 frames)
  // Parabolic sag adds extra downward curve at center that relaxes as it settles into the straight baseline
  const dynamicSagProgress = isBeforeImpulse
    ? 0
    : interpolate(
        framesSinceImpulse,
        [0, 12, 35, impulseDurationFrames],
        [0, 85, 12, 0],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );

  const currentCenterY = currentEndpointY + dynamicSagProgress;

  // Construct SVG path:
  // When dynamic sag is active (> 0.5px), draw a smooth cubic Bezier curve.
  // When settled or initial, draw a clean straight horizontal line.
  const midX = (startX + endX) / 2;
  const cp1X = startX + (endX - startX) * 0.28;
  const cp2X = startX + (endX - startX) * 0.72;

  const boundaryPath =
    dynamicSagProgress > 0.5
      ? `M ${startX} ${currentEndpointY} C ${cp1X} ${currentCenterY}, ${cp2X} ${currentCenterY}, ${endX} ${currentEndpointY}`
      : `M ${startX} ${currentEndpointY} L ${endX} ${currentEndpointY}`;

  // Ghost trace opacity: reveals as the baseline pulls away from the original position
  const calculatedGhostOpacity = isBeforeImpulse
    ? 0
    : interpolate(framesSinceImpulse, [0, 15], [0, ghostOpacity], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  // Impulse marker animation (strikes downwards at triggerFrame)
  const impulseMarkerOpacity = isBeforeImpulse
    ? 0
    : interpolate(framesSinceImpulse, [0, 6, 28], [0, 1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  const impulseMarkerY = isBeforeImpulse
    ? initialBaselineY - 40
    : interpolate(
        framesSinceImpulse,
        [0, 10],
        [initialBaselineY - 60, currentCenterY - 14],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      );

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="boundary-shadow" x="-10%" y="-40%" width="120%" height="200%">
            <feDropShadow
              dx="0"
              dy="10"
              stdDeviation="12"
              floodColor="#090d16"
              floodOpacity="0.14"
            />
          </filter>
        </defs>

        {/* 1. Persistent Ghost Trace (Visual Memory of Original Baseline at y = 620) */}
        {showGhostTrace && calculatedGhostOpacity > 0 && (
          <g opacity={calculatedGhostOpacity}>
            <line
              x1={startX}
              y1={initialBaselineY}
              x2={endX}
              y2={initialBaselineY}
              stroke={strokeColor}
              strokeWidth={Math.max(2, thicknessPx / 2)}
              strokeDasharray="14 10"
              strokeLinecap="round"
            />
            {/* Ghost Label */}
            <text
              x={startX + 8}
              y={initialBaselineY - 14}
              fontFamily="JetBrains Mono, monospace"
              fontSize="22"
              fontWeight="bold"
              fill={strokeColor}
              letterSpacing="0.1em"
              opacity="0.7"
            >
              ORIGINAL BASELINE [GHOST MEMORY]
            </text>
          </g>
        )}

        {/* 2. Tension Endpoints (Left and Right Bedrock Anchor Pins) */}
        <g>
          {/* Left Anchor Pin */}
          <circle
            cx={startX}
            cy={currentEndpointY}
            r={thicknessPx + 3}
            fill={strokeColor}
          />
          <circle cx={startX} cy={currentEndpointY} r={thicknessPx - 1} fill="#ffffff" />
          {/* Right Anchor Pin */}
          <circle
            cx={endX}
            cy={currentEndpointY}
            r={thicknessPx + 3}
            fill={strokeColor}
          />
          <circle cx={endX} cy={currentEndpointY} r={thicknessPx - 1} fill="#ffffff" />
        </g>

        {/* 3. The Physical Boundary (Continuous Tension Line with Viscoelastic Sag) */}
        <path
          d={boundaryPath}
          fill="none"
          stroke={strokeColor}
          strokeWidth={thicknessPx}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: "drop-shadow(0px 10px 14px rgba(9, 13, 22, 0.18))",
          }}
        />

        {/* 4. Dynamic Impulse Force Strike Marker */}
        {showImpulseMarker && impulseMarkerOpacity > 0 && (
          <g opacity={impulseMarkerOpacity}>
            {/* Downward force vector arrow striking the boundary */}
            <line
              x1={midX}
              y1={impulseMarkerY - 60}
              x2={midX}
              y2={impulseMarkerY}
              stroke="#e11d48"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <polygon
              points={`${midX - 14},${impulseMarkerY - 10} ${midX + 14},${impulseMarkerY - 10} ${midX},${impulseMarkerY + 12}`}
              fill="#e11d48"
            />
            <text
              x={midX}
              y={impulseMarkerY - 72}
              fontFamily="JetBrains Mono, monospace"
              fontSize="22"
              fontWeight="900"
              fill="#e11d48"
              textAnchor="middle"
              letterSpacing="0.14em"
            >
              ▼ CONCESSION IMPULSE
            </text>
          </g>
        )}
      </svg>

      {/* 5. Attached State Typography (Floats cleanly above the boundary line) */}
      <div
        className="absolute transition-transform pointer-events-none"
        style={{
          left: startX,
          top: currentEndpointY - 46,
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="font-mono text-[24px] font-black tracking-wider uppercase"
            style={{ color: labelColor }}
          >
            {label}
          </span>
          {subLabel && (
            <span className="font-mono text-[18px] font-semibold text-slate-400">
              {subLabel}
            </span>
          )}
          {springProgress > 0.95 && dynamicSagProgress < 5 && (
            <span className="font-mono text-[18px] font-extrabold text-rose-600 tracking-wider bg-rose-50/80 px-2 py-0.5 rounded border border-rose-200/80">
              [RECALIBRATED BASELINE: -{Math.round(baselineDelta)}PX]
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
