import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface GridTile {
  id: string;
  label?: string;
  checkedFrame?: number; // frame when checkmark draws/illuminates
  activeColor?: string; // default: "#22c55e"
}

export interface GlossyFeatureGridProps {
  title?: string;
  titleColor?: string;
  stats?: { label: string; value: string | number }[];
  tiles: GridTile[];
  columns?: number; // default: 3
  tileSize?: number; // default: 110
  gap?: number; // default: 16
  entranceFrame?: number;
  className?: string;
}

/**
 * 🟩 GlossyFeatureGrid
 * Direct recreation of Reference 4 (3x3 grid of glass tiles with checkmarks).
 * Renders a matrix of frosted glass square tiles that pop in and illuminate
 * sequentially with vibrant neon checkmarks.
 */
export const GlossyFeatureGrid: React.FC<GlossyFeatureGridProps> = ({
  title,
  titleColor = "#ffffff",
  stats,
  tiles,
  columns = 3,
  tileSize = 115,
  gap = 18,
  entranceFrame = 0,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - entranceFrame);
  const enterSpring = spring({
    frame: relFrame,
    fps,
    config: { damping: 14, mass: 0.8, stiffness: 120 },
  });

  return (
    <div
      className={`flex flex-col items-center select-none ${className}`}
      style={{
        transform: `scale(${interpolate(enterSpring, [0, 1], [0.9, 1.0])})`,
        opacity: enterSpring,
      }}
    >
      {/* Title */}
      {title && (
        <div className="mb-4 flex flex-col items-center">
          <h2
            className="text-4xl md:text-5xl font-black tracking-wider uppercase font-sans text-center"
            style={{
              color: titleColor,
              textShadow: `0 0 20px ${titleColor}88, 0 0 45px ${titleColor}44`,
            }}
          >
            {title}
          </h2>
        </div>
      )}

      {/* Stats row if provided */}
      {stats && stats.length > 0 && (
        <div className="flex items-center gap-10 mb-6">
          {stats.map((st, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-3xl font-black text-white font-sans">{st.value}</span>
              <span className="text-xs font-mono tracking-widest text-white/50 uppercase">{st.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Matrix Grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: `${gap}px`,
        }}
      >
        {tiles.map((tile, idx) => {
          const isChecked = tile.checkedFrame !== undefined && frame >= tile.checkedFrame;
          const color = tile.activeColor || "#22c55e";

          const tileRel = Math.max(0, frame - (entranceFrame + idx * 4));
          const tilePop = spring({
            frame: tileRel,
            fps,
            config: { damping: 12, mass: 0.7, stiffness: 130 },
          });

          return (
            <div
              key={tile.id}
              className="relative flex items-center justify-center rounded-2xl border transition-all duration-300"
              style={{
                width: `${tileSize}px`,
                height: `${tileSize}px`,
                transform: `scale(${tilePop})`,
                opacity: tilePop,
                backgroundColor: isChecked ? `${color}22` : "rgba(255, 255, 255, 0.03)",
                borderColor: isChecked ? `${color}aa` : "rgba(255, 255, 255, 0.15)",
                boxShadow: isChecked
                  ? `0 0 25px ${color}66, inset 0 0 15px ${color}33`
                  : "none",
              }}
            >
              {/* Checkmark SVG */}
              {isChecked && (
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={color}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    filter: `drop-shadow(0 0 8px ${color})`,
                  }}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}

              {/* Optional tile label */}
              {tile.label && (
                <span className="absolute bottom-2 text-[10px] font-mono text-white/60 tracking-wider uppercase">
                  {tile.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
