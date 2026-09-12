import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface WorldStateConduitProps {
  length: number;
  thickness?: number;
  orientation?: "horizontal" | "vertical";
  active?: boolean;
  flowDirection?: 1 | -1;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ⚡ WorldStateConduit
 * A physical pipeline linking environmental chambers.
 * When active, pulses with energy to show state flowing between regions.
 */
export const WorldStateConduit: React.FC<WorldStateConduitProps> = ({
  length,
  thickness = 16,
  orientation = "horizontal",
  active = true,
  flowDirection = 1,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isHoriz = orientation === "horizontal";
  const width = isHoriz ? length : thickness;
  const height = isHoriz ? thickness : length;

  // Pulse animation using sine wave based on frame
  const pulseSpeed = 0.15;
  const pulseOffset = (frame * pulseSpeed * flowDirection) % 20;

  return (
    <div
      className={`relative bg-slate-900 border-2 border-slate-950 overflow-hidden shadow-inner ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        ...style,
      }}
    >
      {/* Conduit Piping */}
      <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,#000_4px,#000_6px)]" />

      {/* Active Energy Pulse */}
      {active && (
        <div
          className="absolute inset-0 bg-cyan-400 opacity-60"
          style={{
            maskImage: `repeating-linear-gradient(${isHoriz ? "90deg" : "180deg"}, transparent, transparent 10px, black 10px, black 20px)`,
            WebkitMaskImage: `repeating-linear-gradient(${isHoriz ? "90deg" : "180deg"}, transparent, transparent 10px, black 10px, black 20px)`,
            transform: isHoriz ? `translateX(${pulseOffset}px)` : `translateY(${pulseOffset}px)`,
          }}
        />
      )}
      
      {/* Glow if active */}
      {active && (
        <div className="absolute inset-0 shadow-[0_0_15px_rgba(34,211,238,0.4)] pointer-events-none" />
      )}
    </div>
  );
};
