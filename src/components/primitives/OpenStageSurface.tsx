import React from "react";

export interface OpenStageSurfaceProps {
  children?: React.ReactNode;
  groundColor?: string;
  lightingTheme?:
    | "clean_studio_radial"
    | "deep_atmospheric_dark"
    | "stark_monochrome"
    | string;
  gridTexture?: boolean;
  showSafeBounds?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 🎬 OpenStageSurface — Physical Stage Environment Primitive
 *
 * Renders the open physical canvas for RightMotion primitives.
 * Enforces the Anti-Cardification Law: Zero UI containers, zero modal boxes,
 * zero rounded card wrappers. Elements render directly onto the stage ground.
 */
export const OpenStageSurface: React.FC<OpenStageSurfaceProps> = ({
  children,
  groundColor = "#f8fafc",
  lightingTheme = "clean_studio_radial",
  gridTexture = true,
  showSafeBounds = false,
  className = "",
  style = {},
}) => {
  // Determine background styling based on lighting theme
  let backgroundStyle: React.CSSProperties = { backgroundColor: groundColor };

  if (lightingTheme === "clean_studio_radial") {
    backgroundStyle = {
      background: `radial-gradient(circle at 50% 38%, #ffffff 0%, ${groundColor} 75%, #e2e8f0 100%)`,
    };
  } else if (lightingTheme === "deep_atmospheric_dark") {
    backgroundStyle = {
      background: `radial-gradient(circle at 50% 42%, #0f172a 0%, ${groundColor || "#030712"} 80%, #020617 100%)`,
    };
  } else if (lightingTheme === "stark_monochrome") {
    backgroundStyle = { backgroundColor: groundColor };
  }

  return (
    <div
      className={`relative w-[1080px] h-[1920px] overflow-hidden select-none ${className}`}
      style={{
        ...backgroundStyle,
        ...style,
      }}
    >
      {/* 1. Vector Grid Texture (Clean architectural grid, zero dirty film grain) */}
      {gridTexture && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="open_stage_grid"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 60"
                fill="none"
                stroke={lightingTheme.includes("dark") ? "#334155" : "#cbd5e1"}
                strokeWidth="1"
                strokeOpacity="0.45"
              />
              <circle
                cx="60"
                cy="0"
                r="1.5"
                fill={lightingTheme.includes("dark") ? "#475569" : "#94a3b8"}
                fillOpacity="0.6"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#open_stage_grid)" />
        </svg>
      )}

      {/* 2. Optional Platform Safe Region Visualizer (Development/Audit only) */}
      {showSafeBounds && (
        <div className="absolute inset-0 pointer-events-none z-50">
          <div
            className="absolute border border-dashed border-emerald-500/40"
            style={{
              top: 280,
              bottom: 580, // 1920 - 1340 = 580
              left: 80,
              right: 80,  // 1080 - 1000 = 80
            }}
          >
            <div className="absolute -top-6 left-2 font-mono text-xs text-emerald-600 font-bold uppercase tracking-wider">
              Platform Safe Zone [80..1000, 280..1340]
            </div>
          </div>
        </div>
      )}

      {/* 3. Open Stage Physical Children */}
      {children}
    </div>
  );
};
