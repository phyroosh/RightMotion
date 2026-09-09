import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export interface ArchitecturalDraftingCanvasProps {
  theme?: "light" | "dark";
  gridSize?: number; // default: 72px
  showCornerFraming?: boolean; // default: true (the iconic top-left & bottom-right framing shapes)
  showCrosshairs?: boolean; // default: true
  accentGlow?: string;
  className?: string;
}

/**
 * 📐 ArchitecturalDraftingCanvas
 * Precision drafting grid & studio backdrop matching Solution Wagon / Jordan Brown references.
 * Features dashed blueprint gridlines, intersection crosshairs, and geometric corner matte framing.
 */
export const ArchitecturalDraftingCanvas: React.FC<ArchitecturalDraftingCanvasProps> = ({
  theme = "light",
  gridSize = 72,
  showCornerFraming = true,
  showCrosshairs = true,
  accentGlow,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const isDark = theme === "dark";

  // Palette definition
  const bgBase = isDark ? "#0c0e14" : "#f8f9fb";
  const gridLineColor = isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.065)";
  const crosshairColor = isDark ? "rgba(255, 255, 255, 0.14)" : "rgba(15, 23, 42, 0.16)";
  const cornerMatteColor = isDark ? "#181b26" : "#1e2433";

  // Gentle breathing motion for the background spotlight
  const breathe = 1 + Math.sin((frame / 30) * 0.8) * 0.04;

  // Grid dimensions
  const cols = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);

  return (
    <div
      className={`absolute inset-0 w-full h-full overflow-hidden select-none pointer-events-none z-0 ${className}`}
      style={{ backgroundColor: bgBase }}
    >
      {/* 1. Center Radial Studio Spotlight */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? `radial-gradient(ellipse at 50% 45%, ${accentGlow ?? "rgba(56, 189, 248, 0.12)"} 0%, rgba(12, 14, 20, 0.95) 72%)`
            : `radial-gradient(ellipse at 50% 45%, #ffffff 0%, #f1f3f7 75%)`,
          transform: `scale(${breathe})`,
          transformOrigin: "center center",
        }}
      />

      {/* 2. Vector Drafting Grid with Dashed Lines & Crosshairs */}
      <svg
        className="absolute inset-0 w-full h-full"
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`drafting-grid-${theme}`}
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            {/* Horizontal dashed line */}
            <line
              x1="0"
              y1="0"
              x2={gridSize}
              y2="0"
              stroke={gridLineColor}
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Vertical dashed line */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2={gridSize}
              stroke={gridLineColor}
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            {/* Intersection Crosshair */}
            {showCrosshairs && (
              <g stroke={crosshairColor} strokeWidth="1.5">
                <line x1="-4" y1="0" x2="4" y2="0" />
                <line x1="0" y1="-4" x2="0" y2="4" />
              </g>
            )}
          </pattern>
        </defs>

        {/* Fill the grid pattern across the canvas */}
        <rect width="100%" height="100%" fill={`url(#drafting-grid-${theme})`} />
      </svg>

      {/* 3. Geometric Matte Corner Framing Shapes (Solution Wagon Trademark) */}
      {showCornerFraming && (
        <>
          {/* Top-Left Geometric Triangle / Star Matte */}
          <div
            className="absolute top-0 left-0"
            style={{
              width: "0",
              height: "0",
              borderTop: `180px solid ${cornerMatteColor}`,
              borderRight: "220px solid transparent",
              opacity: isDark ? 0.6 : 0.88,
              filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
            }}
          />

          {/* Bottom-Right Geometric Triangle / Star Matte */}
          <div
            className="absolute bottom-0 right-0"
            style={{
              width: "0",
              height: "0",
              borderBottom: `240px solid ${cornerMatteColor}`,
              borderLeft: "260px solid transparent",
              opacity: isDark ? 0.6 : 0.88,
              filter: "drop-shadow(0 -4px 16px rgba(0,0,0,0.18))",
            }}
          />
        </>
      )}

      {/* 4. Subtle Lens Edge Falloff Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0, 0, 0, 0.7) 100%)"
            : "radial-gradient(ellipse at 50% 50%, transparent 64%, rgba(15, 23, 42, 0.08) 100%)",
        }}
      />
    </div>
  );
};
