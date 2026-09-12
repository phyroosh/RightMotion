import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface StressFractureEngineProps {
  /** Stress accumulation ratio: 0.0 (pristine) -> 1.0 (rupture limit) */
  stress: number;
  /** Frame when structural rupture/shatter triggers */
  shatterFrame: number;
  width: number;
  height: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const SHARD_POLYGONS = [
  // Shard 1: Top-Left
  { clip: "polygon(0% 0%, 42% 0%, 50% 52%, 0% 25%)", vecX: -1.2, vecY: -1.4, rot: -3.5 },
  // Shard 2: Top-Right
  { clip: "polygon(42% 0%, 100% 0%, 100% 35%, 50% 52%)", vecX: 1.3, vecY: -1.1, rot: 2.8 },
  // Shard 3: Mid-Right
  { clip: "polygon(100% 35%, 100% 75%, 50% 52%)", vecX: 1.8, vecY: 0.2, rot: 4.2 },
  // Shard 4: Bottom-Right
  { clip: "polygon(50% 52%, 100% 75%, 100% 100%, 58% 100%)", vecX: 1.4, vecY: 1.5, rot: 2.5 },
  // Shard 5: Bottom-Left
  { clip: "polygon(0% 65%, 50% 52%, 58% 100%, 0% 100%)", vecX: -1.3, vecY: 1.4, rot: -3.0 },
  // Shard 6: Mid-Left
  { clip: "polygon(0% 25%, 50% 52%, 0% 65%)", vecX: -1.7, vecY: 0.1, rot: -4.5 },
];

/**
 * 💎 StressFractureEngine
 * Low-level materiality capability modeling brittle tension, crack propagation,
 * and structural cleavage under mechanical load.
 */
export const StressFractureEngine: React.FC<StressFractureEngineProps> = ({
  stress,
  shatterFrame,
  width,
  height,
  children,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isShattered = frame >= shatterFrame || stress >= 1.0;
  const relShatter = Math.max(0, frame - shatterFrame);

  // Explosive recoil spring upon cleavage
  const shatterSpring = spring({
    frame: relShatter,
    fps,
    config: { damping: 12, mass: 0.65, stiffness: 140 },
  });

  // Micro-crack propagation (visible when stress > 0.3)
  const crackProgress = interpolate(stress, [0.3, 0.95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pre-cleavage trembling vibration when approaching shear limit (FPS-normalized)
  const isStrained = stress >= 0.7 && !isShattered;
  const strainJitter = isStrained
    ? Math.sin((frame / fps) * (1.8 * 30)) * 1.8 * (stress - 0.7) * 3.3
    : 0;

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: `translateX(${strainJitter.toFixed(2)}px)`,
        ...style,
      }}
    >
      {/* 1. INTAC / PRE-SHATTER STATE */}
      {!isShattered && (
        <div className="relative w-full h-full">
          {children}

          {/* Micro-Crack Network Overlay (Hairline Crystalline Fissures) */}
          {crackProgress > 0 && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible"
              viewBox={`0 0 ${width} ${height}`}
            >
              <g
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity={0.85}
              >
                {/* Branch 1: Center -> Top */}
                <path
                  d={`M ${width * 0.5} ${height * 0.52} L ${width * 0.46} ${height * 0.32} L ${width * 0.42} 0`}
                  strokeDasharray="600"
                  strokeDashoffset={interpolate(crackProgress, [0, 1], [600, 0])}
                />
                {/* Branch 2: Center -> Top-Right */}
                <path
                  d={`M ${width * 0.5} ${height * 0.52} L ${width * 0.72} ${height * 0.42} L ${width} ${height * 0.35}`}
                  strokeDasharray="600"
                  strokeDashoffset={interpolate(crackProgress, [0, 1], [600, 0])}
                />
                {/* Branch 3: Center -> Mid-Right */}
                <path
                  d={`M ${width * 0.5} ${height * 0.52} L ${width * 0.78} ${height * 0.65} L ${width} ${height * 0.75}`}
                  strokeDasharray="600"
                  strokeDashoffset={interpolate(crackProgress, [0, 1], [600, 0])}
                />
                {/* Branch 4: Center -> Bottom */}
                <path
                  d={`M ${width * 0.5} ${height * 0.52} L ${width * 0.54} ${height * 0.76} L ${width * 0.58} ${height}`}
                  strokeDasharray="600"
                  strokeDashoffset={interpolate(crackProgress, [0, 1], [600, 0])}
                />
                {/* Branch 5: Center -> Bottom-Left */}
                <path
                  d={`M ${width * 0.5} ${height * 0.52} L ${width * 0.28} ${height * 0.58} L 0 ${height * 0.65}`}
                  strokeDasharray="600"
                  strokeDashoffset={interpolate(crackProgress, [0, 1], [600, 0])}
                />
                {/* Branch 6: Center -> Mid-Left */}
                <path
                  d={`M ${width * 0.5} ${height * 0.52} L ${width * 0.22} ${height * 0.38} L 0 ${height * 0.25}`}
                  strokeDasharray="600"
                  strokeDashoffset={interpolate(crackProgress, [0, 1], [600, 0])}
                />
              </g>
            </svg>
          )}
        </div>
      )}

      {/* 2. POST-SHATTER CLEAVED STATE (Physical Polygon Shards Displacing) */}
      {isShattered && (
        <div className="relative w-full h-full">
          {/* Light-Burst Bleed radiating through fissure gaps */}
          <div
            className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center"
            style={{
              opacity: interpolate(relShatter, [0, 6, 25], [0, 1, 0.4]),
            }}
          >
            <div
              className="w-32 h-32 rounded-full bg-sky-400 blur-2xl"
              style={{
                transform: `scale(${interpolate(shatterSpring, [0, 1], [0.5, 2.5])})`,
              }}
            />
          </div>

          {/* 6 Physically Cleaved Shards */}
          {SHARD_POLYGONS.map((p, idx) => {
            const dispX = p.vecX * shatterSpring * 26;
            const dispY = p.vecY * shatterSpring * 26;
            const rotDeg = p.rot * shatterSpring;
            const shardOpacity = interpolate(relShatter, [0, 60], [1, 0.75], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={idx}
                className="absolute inset-0 w-full h-full pointer-events-none z-20"
                style={{
                  clipPath: p.clip,
                  transform: `translate3d(${dispX.toFixed(2)}px, ${dispY.toFixed(2)}px, 0px) rotate(${rotDeg.toFixed(2)}deg)`,
                  transformOrigin: "50% 52%",
                  opacity: shardOpacity,
                  filter: "drop-shadow(0 8px 16px rgba(14, 165, 233, 0.25))",
                }}
              >
                {children}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
