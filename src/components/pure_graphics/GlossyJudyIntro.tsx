import React from "react";
import {
  Easing,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export interface GlossyJudyIntroProps {
  /** Frame at which Judy enters (default: 0) */
  startFrame?: number;
  /** Frame at which Judy starts exiting (default: 110, ~3.6s at 30fps) */
  exitFrame?: number;
  /** Primary focus title glowing above (e.g. "CORTISOL INVERSION") */
  title?: string;
  /** Title glow color (default: "#ffffff") */
  titleColor?: string;
  /** Radial backlight glow color (default: "rgba(244, 63, 94, 0.22)") */
  glowColor?: string;
  /** Pose filename in public/ (default: "character_pointing.png") */
  pose?: string;
  /** Downward floor mirror reflection opacity (default: 0.36) */
  reflectionOpacity?: number;
  /** Base character height in px (default: 1180) */
  baseHeight?: number;
}

/**
 * 🎬 GlossyJudyIntro
 * Displays Judy waist-up during the opening problem hook (0.0s - ~3.8s).
 * Seamlessly integrates with the 10/10 dark glossy reflection aesthetic:
 * - Atmospheric radial color aura behind her silhouette.
 * - Downward glossy wet-floor mirror reflection.
 * - Fast-paced initial spring punch-in, gentle speaking hover, and cushioned non-linear slide-down exit.
 */
export const GlossyJudyIntro: React.FC<GlossyJudyIntroProps> = ({
  startFrame = 0,
  exitFrame = 110,
  title = "",
  titleColor = "#ffffff",
  glowColor = "rgba(244, 63, 94, 0.22)",
  pose = "character_pointing.png",
  reflectionOpacity = 0.36,
  baseHeight = 1180,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // If frame is past exitFrame + 15, unmount completely
  if (frame > exitFrame + 15) {
    return null;
  }

  // 1. Entrance Spring (Snappy, fast-paced yet damped)
  const enterSpring = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 170 },
  });

  // 2. Cushioned Non-Linear Exit
  const exitProgress = interpolate(frame, [exitFrame, exitFrame + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  });

  // 3. Gentle Speaking / Life Micro-Motion
  const lifeHover = Math.sin((frame / fps) * 2.8) * 3.5;

  // Composite scale and Y-translation
  const currentScale =
    interpolate(enterSpring, [0, 1], [1.08, 1.0]) * (1 - exitProgress * 0.08);
  const currentY =
    interpolate(enterSpring, [0, 1], [120, 0]) +
    exitProgress * 280 +
    lifeHover;
  const currentOpacity =
    interpolate(enterSpring, [0, 0.4, 1], [0, 0.9, 1]) * (1 - exitProgress);

  // Title entrance
  const titleSpring = spring({
    frame: frame - startFrame - 6,
    fps,
    config: { damping: 15, stiffness: 150 },
  });

  return (
    <div
      className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden"
      style={{
        opacity: currentOpacity,
      }}
    >
      {/* 1. Atmospheric Radial Back-Glow behind Judy */}
      <div
        className="absolute left-1/2 bottom-[18%] -translate-x-1/2 pointer-events-none rounded-full blur-[110px]"
        style={{
          width: "820px",
          height: "820px",
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          opacity: Math.min(1, enterSpring * 1.2),
        }}
      />

      {/* 2. Floating Minimalist Glowing Focus Title (Top) */}
      {title && (
        <div
          className="absolute top-[16%] flex flex-col items-center z-40"
          style={{
            opacity: interpolate(titleSpring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(titleSpring, [0, 1], [25, 0])}px) scale(${interpolate(titleSpring, [0, 1], [0.94, 1])})`,
          }}
        >
          <span
            className="text-4xl font-black tracking-widest uppercase font-sans"
            style={{
              color: titleColor,
              textShadow: `0 0 25px rgba(255, 255, 255, 0.4), 0 0 50px ${glowColor}`,
            }}
          >
            {title}
          </span>
        </div>
      )}

      {/* 3. Judy Cutout & Reflection Staging */}
      <div
        className="absolute bottom-[320px] left-1/2 -translate-x-1/2 flex flex-col items-center"
        style={{
          transform: `translateX(-50%) translateY(${currentY}px) scale(${currentScale})`,
        }}
      >
        {/* Real Character Cutout */}
        <div className="relative z-20">
          <img
            src={staticFile(pose)}
            alt="Judy Presenter"
            style={{
              height: `${baseHeight}px`,
              width: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 20px 45px rgba(0, 0, 0, 0.85))",
            }}
          />
        </div>

        {/* Downward Wet-Floor Mirror Reflection */}
        <div
          className="absolute top-full left-0 right-0 pointer-events-none select-none flex justify-center origin-top -mt-2 z-10"
          style={{
            transform: "scaleY(-1)",
            opacity: reflectionOpacity * (1 - exitProgress),
            filter: "blur(2.5px)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0) 65%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0) 65%)",
          }}
        >
          <img
            src={staticFile(pose)}
            alt=""
            aria-hidden="true"
            style={{
              height: `${baseHeight}px`,
              width: "auto",
              objectFit: "contain",
            }}
          />
        </div>
      </div>
    </div>
  );
};
