import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface GraphCurve {
  id: string;
  label?: string;
  color: string; // e.g. "#10b981" or "#f43f5e"
  glowColor?: string;
  pathD: string; // SVG path data (assumes viewBox 0 0 700 400)
  areaD?: string; // SVG closed path for gradient fill
  startFrame: number;
  durationFrames?: number;
  tipX?: number; // final tip coordinates for beacon dot
  tipY?: number;
  showArrow?: boolean;
}

export interface GlossyGlowGraphProps {
  title?: string;
  titleColor?: string;
  curves: GraphCurve[];
  xLabels?: string[]; // e.g. ["8 AM", "12 PM", "6 PM", "12 AM"]
  yLabel?: string; // e.g. "CORTISOL LEVEL"
  width?: number; // default: 780
  height?: number; // default: 440
  entranceFrame?: number;
  showFloorReflection?: boolean;
  reflectionOpacity?: number;
  theme?: "dark" | "light";
  className?: string;
}

/**
 * ⚡ GlossyGlowGraph
 * High-precision 3D glowing vector graph matching the "Motivation vs Discipline" reference.
 * Renders glowing SVG Bezier curves, area gradients, pulsing beacon heads, and clean coordinate axes.
 * Built-in glossy floor reflection mirrors only the coordinate frame and curves downward!
 */
export const GlossyGlowGraph: React.FC<GlossyGlowGraphProps> = ({
  title,
  titleColor = "#ffffff",
  curves,
  xLabels = ["8 AM", "12 PM", "6 PM", "12 AM"],
  yLabel,
  width = 780,
  height = 440,
  entranceFrame = 0,
  showFloorReflection = true,
  reflectionOpacity = 0.35,
  theme = "dark",
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for the entire graph frame
  const relFrame = Math.max(0, frame - entranceFrame);
  const enterSpring = spring({
    frame: relFrame,
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 110 },
  });

  const scale = interpolate(enterSpring, [0, 1], [0.92, 1.0]);
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]);

  // Render SVG Graph function so it can be reused for mirror reflection
  const renderSvgContent = (isReflection: boolean = false) => (
    <div
      className="relative"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <svg
        viewBox="0 0 700 400"
        className="w-full h-full overflow-visible"
        fill="none"
      >
        <defs>
          {/* Gradients for area fills */}
          {curves.map((c) => (
            <linearGradient
              key={`grad-${c.id}-${isReflection ? "ref" : "main"}`}
              id={`grad-${c.id}-${isReflection ? "ref" : "main"}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={c.color} stopOpacity={0.35} />
              <stop offset="70%" stopColor={c.color} stopOpacity={0.08} />
              <stop offset="100%" stopColor={c.color} stopOpacity={0.0} />
            </linearGradient>
          ))}

          {/* Marker for arrow heads */}
          {!isReflection &&
            curves.map((c) => (
              <marker
                key={`arrow-${c.id}`}
                id={`arrow-${c.id}`}
                viewBox="0 0 10 10"
                refX="7"
                refY="5"
                markerWidth="8"
                markerHeight="8"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 9 5 L 0 9 z" fill={c.color} />
              </marker>
            ))}
        </defs>

        {/* Coordinate Frame Grid Lines */}
        {[100, 250, 400, 550].map((x, i) => (
          <line
            key={`grid-v-${i}`}
            x1={x}
            y1={40}
            x2={x}
            y2={340}
            stroke={theme === "light" ? "rgba(15, 23, 42, 0.12)" : "rgba(255, 255, 255, 0.08)"}
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
        ))}

        {[120, 200, 280].map((y, i) => (
          <line
            key={`grid-h-${i}`}
            x1={80}
            y1={y}
            x2={660}
            y2={y}
            stroke={theme === "light" ? "rgba(15, 23, 42, 0.08)" : "rgba(255, 255, 255, 0.05)"}
            strokeWidth="1"
          />
        ))}

        {/* X and Y Main Axes */}
        <line
          x1="80"
          y1="40"
          x2="80"
          y2="340"
          stroke={theme === "light" ? "rgba(15, 23, 42, 0.75)" : "rgba(255, 255, 255, 0.6)"}
          strokeWidth="5"
          strokeLinecap="round"
        />
        <line
          x1="78"
          y1="340"
          x2="660"
          y2="340"
          stroke={theme === "light" ? "rgba(15, 23, 42, 0.75)" : "rgba(255, 255, 255, 0.6)"}
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Render Curves & Area Fills */}
        {curves.map((curve) => {
          const curveRel = Math.max(0, frame - curve.startFrame);
          const duration = curve.durationFrames || 35;
          // Non-linear variable speed path trimming: fast initial rise, gentle landing
          const drawProgress = interpolate(curveRel, [0, duration], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.22, 1, 0.36, 1),
          });

          const pathLength = 1200;
          const dashOffset = (1 - drawProgress) * pathLength;
          const glow = curve.glowColor || curve.color;

          // Gentle living wave micro-motion
          const waveHover = drawProgress > 0.85 ? Math.sin((frame / fps) * 3 + curve.startFrame) * 2.5 : 0;
          const rippleRadius = 12 + ((frame * 1.5) % 24);
          const rippleOpacity = Math.max(0, 1 - ((frame * 1.5) % 24) / 24);

          return (
            <g key={curve.id}>
              {/* 1. Translucent Gradient Area Under Curve */}
              {curve.areaD && drawProgress > 0.05 && (
                <path
                  d={curve.areaD}
                  fill={`url(#grad-${curve.id}-${isReflection ? "ref" : "main"})`}
                  style={{
                    opacity: drawProgress,
                  }}
                />
              )}

              {/* 2. Outer Ambient Glow Pass */}
              <path
                d={curve.pathD}
                stroke={glow}
                strokeWidth="18"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={pathLength}
                strokeDashoffset={dashOffset}
                fill="none"
                style={{
                  opacity: 0.55,
                  filter: `blur(10px)`,
                }}
              />

              {/* 3. Core Vibrant Neon Curve - Bold 8px stroke for 480p mobile clarity */}
              <path
                d={curve.pathD}
                stroke={curve.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={pathLength}
                strokeDashoffset={dashOffset}
                fill="none"
                markerEnd={!isReflection && curve.showArrow && drawProgress >= 0.95 ? `url(#arrow-${curve.id})` : undefined}
                style={{
                  filter: `drop-shadow(0 0 12px ${glow}) drop-shadow(0 0 28px ${glow}aa)`,
                }}
              />

              {/* 4. Pulsing Beacon Head & Expanding Ripple Rings at Peak/Tip */}
              {curve.tipX !== undefined && curve.tipY !== undefined && drawProgress > 0.85 && (
                <g>
                  {/* Outer Radiating Ripple Ring */}
                  {!isReflection && (
                    <circle
                      cx={curve.tipX}
                      cy={curve.tipY + waveHover}
                      r={rippleRadius}
                      fill="none"
                      stroke={curve.color}
                      strokeWidth="2.5"
                      opacity={rippleOpacity * 0.8}
                    />
                  )}
                  {/* Ambient Beacon Glow */}
                  <circle
                    cx={curve.tipX}
                    cy={curve.tipY + waveHover}
                    r={18 + Math.sin(frame * 0.2) * 4}
                    fill={glow}
                    opacity={0.5}
                  />
                  {/* Core White Hot Center */}
                  <circle
                    cx={curve.tipX}
                    cy={curve.tipY + waveHover}
                    r="8.5"
                    fill="#ffffff"
                    style={{
                      filter: `drop-shadow(0 0 10px #ffffff) drop-shadow(0 0 18px ${curve.color})`,
                    }}
                  />
                </g>
              )}
            </g>
          );
        })}

        {/* Y Axis Optional Label - Mobile-optimized 22px JetBrains Mono */}
        {yLabel && (
          <text
            x="-180"
            y="36"
            transform="rotate(-90)"
            fill={theme === "light" ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.75)"}
            fontSize="22"
            fontWeight="800"
            letterSpacing="4"
            fontFamily="'JetBrains Mono', monospace"
          >
            {yLabel}
          </text>
        )}

        {/* X Axis Time Labels - Mobile-optimized 24px JetBrains Mono */}
        {xLabels.map((lbl, idx) => {
          const xPositions = [100, 250, 400, 550];
          const xPos = xPositions[idx] ?? 100 + idx * 140;
          return (
            <text
              key={`lbl-${idx}`}
              x={xPos}
              y="380"
              textAnchor="middle"
              fill={theme === "light" ? "rgba(15, 23, 42, 0.95)" : "rgba(255, 255, 255, 0.92)"}
              fontSize="24"
              fontWeight="800"
              letterSpacing="2"
              fontFamily="'JetBrains Mono', monospace"
            >
              {lbl}
            </text>
          );
        })}
      </svg>

      {/* Legend for Dual Curves - Upgraded to bold 18px */}
      {!isReflection && curves.length > 1 && (
        <div className="absolute top-2 right-4 flex items-center gap-8">
          {curves.map((c) => (
            <div key={`legend-${c.id}`} className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full"
                style={{
                  backgroundColor: c.color,
                  boxShadow: `0 0 12px ${c.color}`,
                }}
              />
              <span
                className="text-lg font-mono font-black tracking-wider uppercase"
                style={{ color: c.color }}
              >
                {c.label || c.id}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`flex flex-col items-center select-none ${className}`}
      style={{
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      {/* 1. Punchy Minimalist Glowing Title (Floats above, does NOT mirror onto floor) */}
      {title && (
        <div className="mb-6 flex flex-col items-center">
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

      {/* 2. Upright Coordinate Frame & SVG Graph */}
      <div className="relative flex flex-col items-center">
        {/* Main Upright Graph */}
        <div className="relative z-10">{renderSvgContent(false)}</div>

        {/* 3. Glossy Wet Floor Mirror Reflection (Mirrors ONLY the graph and floor axes) */}
        {showFloorReflection && (
          <div
            className="pointer-events-none select-none origin-top"
            style={{
              marginTop: "2px",
              transform: "scaleY(-1)",
              opacity: reflectionOpacity,
              filter: "blur(2px)",
              maskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 30%, transparent 60%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 30%, transparent 60%)",
            }}
          >
            {renderSvgContent(true)}
          </div>
        )}
      </div>
    </div>
  );
};
