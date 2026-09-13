import React from "react";
import { PersistentTrace } from "../../compiler/ast.types";

export interface PersistentMemoryStageProps {
  frame: number;
  traces: PersistentTrace[];
  className?: string;
  showLabels?: boolean;
}

/**
 * 🎬 PersistentMemoryStage — Narrative Memory & Persistent Trace Primitive
 *
 * Mounts historical artifacts and traces across scene boundaries:
 *   - dashed_ghost_line: Historical standard line that remains after displacement.
 *   - worn_furrow: Deepened groove that remains etched into the ground plane.
 *   - fracture_chasm: Jagged stress crack showing structural failure.
 *   - stamped_bedrock: Permanent compression footprint in bedrock.
 *
 * Open-Canvas Law: Renders directly into stage SVG. Zero card containers.
 */
export const PersistentMemoryStage: React.FC<PersistentMemoryStageProps> = ({
  frame: _frame,
  traces,
  className = "",
  showLabels = true,
}) => {
  if (!traces || traces.length === 0) {
    return null;
  }

  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}>
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="memory-trench-shadow" x="-10%" y="-100%" width="120%" height="300%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#090d16" floodOpacity="0.18" />
          </filter>
        </defs>

        {traces.map((trace) => {
          const { traceId, appearance, coordinates, opacity = 0.35, semanticMeaning } = trace;
          const coords = coordinates || {};

          if (appearance === "dashed_ghost_line") {
            const y = coords.y ?? 620;
            const startX = coords.startX ?? coords.x1 ?? 120;
            const endX = coords.endX ?? coords.x2 ?? 960;

            return (
              <g key={traceId} opacity={opacity}>
                <line
                  x1={startX}
                  y1={y}
                  x2={endX}
                  y2={y}
                  stroke="#090d16"
                  strokeWidth="3"
                  strokeDasharray="12 10"
                  strokeLinecap="round"
                />
                {showLabels && (
                  <text
                    x={startX + 6}
                    y={y - 12}
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="18"
                    fontWeight="bold"
                    fill="#090d16"
                    letterSpacing="0.08em"
                    opacity="0.8"
                  >
                    {semanticMeaning ? `[MEMORY: ${semanticMeaning.toUpperCase()}]` : "[GHOST TRACE]"}
                  </text>
                )}
              </g>
            );
          }

          if (appearance === "worn_furrow") {
            const y = coords.y ?? 800;
            const startX = coords.startX ?? 140;
            const endX = coords.endX ?? 940;
            const widthPx = coords.widthPx ?? 12;

            return (
              <g key={traceId} opacity={opacity}>
                <line
                  x1={startX}
                  y1={y}
                  x2={endX}
                  y2={y}
                  stroke="#090d16"
                  strokeWidth={widthPx}
                  strokeLinecap="round"
                  style={{
                    filter: "drop-shadow(0px 2px 4px rgba(9, 13, 22, 0.20))",
                  }}
                />
                <line
                  x1={startX}
                  y1={y}
                  x2={endX}
                  y2={y}
                  stroke="#ffffff"
                  strokeWidth={Math.max(2, widthPx * 0.25)}
                  strokeLinecap="round"
                  opacity="0.75"
                />
                {showLabels && (
                  <text
                    x={startX}
                    y={y + 24}
                    fontFamily="JetBrains Mono, monospace"
                    fontSize="18"
                    fontWeight="bold"
                    fill="#090d16"
                    letterSpacing="0.08em"
                  >
                    [PERSISTENT FURROW: REDUCED FRICTION CORE]
                  </text>
                )}
              </g>
            );
          }

          if (appearance === "fracture_chasm") {
            const startX = coords.startX ?? 200;
            const startY = coords.startY ?? 700;
            const endX = coords.endX ?? 880;
            const endY = coords.endY ?? 700;
            const midX = (startX + endX) / 2;
            const pathData = `M ${startX} ${startY} L ${midX - 40} ${startY + 15} L ${midX} ${startY - 12} L ${midX + 50} ${startY + 18} L ${endX} ${endY}`;

            return (
              <g key={traceId} opacity={opacity}>
                <path
                  d={pathData}
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            );
          }

          // Fallback / custom trace
          return null;
        })}
      </svg>
    </div>
  );
};
