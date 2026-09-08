import React from "react";
import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface GlossyBalanceScaleProps {
  title?: string;
  titleColor?: string;
  leftLabel?: string;
  leftSub?: string;
  leftColor?: string;
  rightLabel?: string;
  rightSub?: string;
  rightColor?: string;
  /** Winning side: "right" tilts down on right, "left" tilts down on left */
  winner?: "left" | "right";
  startFrame?: number;
  width?: number;
  height?: number;
  glowColor?: string;
  showFloorReflection?: boolean;
  reflectionOpacity?: number;
  isReflection?: boolean;
}

/**
 * 🎬 GlossyBalanceScale
 * 3D glossy balance see-saw comparing two opposing forces (e.g. "THE TRAP" vs "THE PROTOCOL").
 * Tilts dynamically with damped spring torque and weight settling physics.
 * Complete with downward glossy wet-floor mirror reflections.
 */
export const GlossyBalanceScale: React.FC<GlossyBalanceScaleProps> = ({
  title,
  titleColor = "#ffffff",
  leftLabel = "THE TRAP",
  leftSub = "Ego & Comfort",
  leftColor = "#f43f5e",
  rightLabel = "THE PROTOCOL",
  rightSub = "Action & Freedom",
  rightColor = "#10b981",
  winner = "right",
  startFrame = 0,
  width = 660,
  height = 420,
  glowColor = "rgba(16, 185, 129, 0.22)",
  showFloorReflection = true,
  reflectionOpacity = 0.38,
  isReflection = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance spring for fulcrum and stage
  const enterSpring = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, mass: 0.8, stiffness: 130 },
  });

  // Dynamic torque tilt spring (starts balanced, then tips to winner)
  const targetRotation = winner === "right" ? 11 : -11;
  const tiltSpring = spring({
    frame: frame - startFrame - 14,
    fps,
    config: { damping: 12, mass: 1.1, stiffness: 95 },
  });
  const currentRotation = interpolate(tiltSpring, [0, 1], [0, targetRotation]);

  const beamWidth = width - 80;
  const panWidth = 140;

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* 1. Floating Glowing Title */}
      {!isReflection && title && (
        <div
          className="mb-6 flex flex-col items-center"
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

      {/* 2. Balance Apparatus Container */}
      <div
        className="relative flex flex-col items-center justify-end"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${interpolate(enterSpring, [0, 1], [0.92, 1])})`,
          opacity: interpolate(enterSpring, [0, 0.3], [0, 1]),
        }}
      >
        {/* Tilting Beam & Hanging Pans */}
        <div
          className="relative origin-center z-20 flex items-center justify-between"
          style={{
            width: `${beamWidth}px`,
            transform: `translateY(-110px) rotate(${currentRotation}deg)`,
            transition: "transform 0.05s linear",
          }}
        >
          {/* Frosted Glass Beam */}
          <div
            className="absolute left-0 right-0 h-4 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, rgba(244,63,94,0.4) 0%, rgba(255,255,255,0.4) 50%, rgba(16,185,129,0.4) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 0 25px rgba(255, 255, 255, 0.2)",
            }}
          />

          {/* Left Pan (The Trap) */}
          <div
            className="relative flex flex-col items-center"
            style={{
              transform: `rotate(${-currentRotation}deg)`, // Keep pan upright
              transition: "transform 0.05s linear",
            }}
          >
            {/* Hanging Cable */}
            <div className="w-[2px] h-16 bg-white/20" />

            {/* Glowing Pan Card */}
            <div
              className="p-4 rounded-2xl flex flex-col items-center text-center shadow-2xl"
              style={{
                width: `${panWidth}px`,
                background: "rgba(15, 23, 42, 0.85)",
                border: `2px solid ${leftColor}66`,
                boxShadow: `0 0 25px ${leftColor}33`,
              }}
            >
              <span
                className="text-xs font-mono font-black tracking-widest uppercase"
                style={{ color: leftColor }}
              >
                {leftLabel}
              </span>
              <span className="text-sm font-bold text-slate-300 mt-1">
                {leftSub}
              </span>
            </div>
          </div>

          {/* Right Pan (The Protocol / Solution) */}
          <div
            className="relative flex flex-col items-center"
            style={{
              transform: `rotate(${-currentRotation}deg)`, // Keep pan upright
              transition: "transform 0.05s linear",
            }}
          >
            {/* Hanging Cable */}
            <div className="w-[2px] h-16 bg-white/20" />

            {/* Glowing Pan Card */}
            <div
              className="p-4 rounded-2xl flex flex-col items-center text-center shadow-2xl"
              style={{
                width: `${panWidth}px`,
                background: "rgba(15, 23, 42, 0.85)",
                border: `2px solid ${rightColor}88`,
                boxShadow: `0 0 35px ${rightColor}55`,
              }}
            >
              <span
                className="text-xs font-mono font-black tracking-widest uppercase"
                style={{ color: rightColor }}
              >
                {rightLabel}
              </span>
              <span className="text-sm font-bold text-slate-100 mt-1">
                {rightSub}
              </span>
            </div>
          </div>
        </div>

        {/* Central Fulcrum Stand */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Fulcrum Pivot Ball */}
          <div
            className="w-8 h-8 rounded-full z-20"
            style={{
              background: "#ffffff",
              boxShadow: "0 0 20px #ffffff, 0 0 40px rgba(255,255,255,0.6)",
            }}
          />
          {/* Triangular Frosted Glass Pillar */}
          <div
            className="w-16 h-28 -mt-4 rounded-t-lg"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(15,23,42,0.9) 100%)",
              borderTop: "1px solid rgba(255,255,255,0.4)",
              borderLeft: "1px solid rgba(255,255,255,0.15)",
              borderRight: "1px solid rgba(255,255,255,0.15)",
              clipPath: "polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)",
            }}
          />
          {/* Base Plate */}
          <div
            className="w-48 h-3 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              boxShadow: "0 0 20px rgba(255,255,255,0.2)",
            }}
          />
        </div>
      </div>

      {/* 3. Downward Wet-Floor Mirror Reflection */}
      {showFloorReflection && !isReflection && (
        <div
          className="pointer-events-none select-none origin-top -mt-2"
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
          <GlossyBalanceScale
            leftLabel={leftLabel}
            leftSub={leftSub}
            leftColor={leftColor}
            rightLabel={rightLabel}
            rightSub={rightSub}
            rightColor={rightColor}
            winner={winner}
            startFrame={startFrame}
            width={width}
            height={height}
            glowColor={glowColor}
            showFloorReflection={false}
            isReflection={true}
          />
        </div>
      )}
    </div>
  );
};
