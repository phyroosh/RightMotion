import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface GlossyRadialDialProps {
  title?: string;
  titleColor?: string;
  /** Percentage progress to fill (0 - 100) */
  targetPercent?: number;
  /** Center headline value (e.g. "60 MIN", "16 HRS", "85%") */
  valueText?: string;
  /** Center subtitle label (e.g. "SUNLIGHT WINDOW", "MELATONIN TIMER") */
  labelText?: string;
  /** Accent color for active arc (default: "#38bdf8") */
  accentColor?: string;
  /** Ambient aura glow color (default: "rgba(56, 189, 248, 0.22)") */
  glowColor?: string;
  startFrame?: number;
  size?: number;
  showFloorReflection?: boolean;
  reflectionOpacity?: number;
  isReflection?: boolean;
  theme?: "dark" | "light";
}

/**
 * 🎬 GlossyRadialDial
 * Circular 360-degree glowing telemetry meter / chronograph.
 * Ideal for time thresholds (60-minute window, 16-hour sleep countdown), biological timers, and percentages.
 * Complete with non-linear ease-out arc filling and downward wet-floor mirror reflections.
 */
export const GlossyRadialDial: React.FC<GlossyRadialDialProps> = ({
  title,
  titleColor = "#ffffff",
  targetPercent = 75,
  valueText = "60 MIN",
  labelText = "WINDOW",
  accentColor = "#38bdf8",
  glowColor = "rgba(56, 189, 248, 0.22)",
  startFrame = 0,
  size = 460,
  showFloorReflection = true,
  reflectionOpacity = 0.38,
  isReflection = false,
  theme = "dark",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring
  const enterSpring = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 130 },
  });

  // Non-linear variable-speed arc filling (fast initial sweep, gentle landing)
  const sweepProgress = interpolate(
    frame,
    [startFrame + 6, startFrame + 40],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    }
  );

  const radius = (size - 70) / 2;
  const circumference = 2 * Math.PI * radius;
  const currentPercent = targetPercent * sweepProgress;
  const strokeDashoffset =
    circumference - (currentPercent / 100) * circumference;

  // Beacon dot angle
  const angleDeg = (currentPercent / 100) * 360 - 90;
  const angleRad = (angleDeg * Math.PI) / 180;
  const beaconX = size / 2 + radius * Math.cos(angleRad);
  const beaconY = size / 2 + radius * Math.sin(angleRad);

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* 1. Floating Glowing Title */}
      {!isReflection && title && (
        <div
          className="mb-8 flex flex-col items-center"
          style={{
            opacity: interpolate(enterSpring, [0, 0.6], [0, 1]),
            transform: `translateY(${interpolate(enterSpring, [0, 1], [20, 0])}px)`,
          }}
        >
          <span
            className="text-4xl font-black tracking-widest uppercase font-sans"
            style={{
              color: titleColor,
              textShadow: `0 0 20px rgba(255, 255, 255, 0.4), 0 0 45px ${glowColor}`,
            }}
          >
            {title}
          </span>
        </div>
      )}

      {/* 2. Standing Chrono Dial Container */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transform: `scale(${interpolate(enterSpring, [0, 1], [0.88, 1])})`,
          opacity: interpolate(enterSpring, [0, 0.3], [0, 1]),
        }}
      >
        {/* Soft Radial Center Core Glow */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none blur-3xl"
          style={{
            background: `radial-gradient(circle, ${accentColor}22 0%, transparent 65%)`,
          }}
        />

        {/* SVG Circular Gauge */}
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          {/* Subtle Outer Track Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={theme === "light" ? "rgba(15, 23, 42, 0.12)" : "rgba(255, 255, 255, 0.12)"}
            strokeWidth="14"
          />

          {/* Tick Marks (Every 30 degrees) */}
          {Array.from({ length: 12 }).map((_, i) => {
            const tickAngle = (i * 30 * Math.PI) / 180;
            const x1 = size / 2 + (radius - 18) * Math.cos(tickAngle);
            const y1 = size / 2 + (radius - 18) * Math.sin(tickAngle);
            const x2 = size / 2 + (radius - 4) * Math.cos(tickAngle);
            const y2 = size / 2 + (radius - 4) * Math.sin(tickAngle);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={theme === "light" ? "rgba(15, 23, 42, 0.25)" : "rgba(255, 255, 255, 0.3)"}
                strokeWidth={i % 3 === 0 ? "3.5" : "2"}
              />
            );
          })}

          {/* Active Glowing Arc Stroke - Bold 18px for mobile screens */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={accentColor}
            strokeWidth="18"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{
              filter: `drop-shadow(0 0 20px ${accentColor}) drop-shadow(0 0 35px ${accentColor}aa)`,
            }}
          />

          {/* Active Glowing Beacon Head at tip */}
          {sweepProgress > 0.03 && (
            <g>
              <circle
                cx={beaconX}
                cy={beaconY}
                r="9.5"
                fill="#ffffff"
                style={{
                  filter: `drop-shadow(0 0 12px #ffffff) drop-shadow(0 0 24px ${accentColor})`,
                }}
              />
              <circle
                cx={beaconX}
                cy={beaconY}
                r="20"
                fill="none"
                stroke={accentColor}
                strokeWidth="2.5"
                opacity={Math.sin((frame / fps) * 4) * 0.4 + 0.6}
              />
            </g>
          )}
        </svg>

        {/* Center Digital Metric Readout - Ultra-bold 2-font system */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span
            className="text-6xl font-black font-mono tracking-tight"
            style={{
              color: theme === "light" ? "#0f172a" : "#ffffff",
              textShadow: theme === "light" ? "none" : `0 0 25px ${accentColor}cc, 0 0 55px rgba(255,255,255,0.4)`,
            }}
          >
            {valueText}
          </span>
          <span
            className="text-xl font-black tracking-widest uppercase font-display mt-2"
            style={{
              color: theme === "light" ? "#475569" : accentColor,
              textShadow: theme === "light" ? "none" : `0 0 16px ${accentColor}`,
            }}
          >
            {labelText}
          </span>
        </div>
      </div>

      {/* 3. Downward Wet-Floor Mirror Reflection */}
      {showFloorReflection && !isReflection && (
        <div
          className="pointer-events-none select-none origin-top -mt-3"
          style={{
            transform: "scaleY(-1)",
            opacity: reflectionOpacity,
            filter: "blur(2.2px)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0) 65%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0) 65%)",
          }}
        >
          <GlossyRadialDial
            targetPercent={targetPercent}
            valueText={valueText}
            labelText={labelText}
            accentColor={accentColor}
            glowColor={glowColor}
            startFrame={startFrame}
            size={size}
            showFloorReflection={false}
            isReflection={true}
          />
        </div>
      )}
    </div>
  );
};
