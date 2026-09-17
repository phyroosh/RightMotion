import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export interface PolishStickerFloatProps {
  imageSrc: string; // e.g. "the_cortisol_inversion/assets/scene_illustration.png" or "assets/psychology/glowing_brain.png"
  startFrame: number;
  durationFrames?: number;
  width?: number; // default: 360
  height?: number; // default: 360
  glowColor?: string; // e.g. "rgba(16, 185, 129, 0.4)" or "rgba(244, 63, 94, 0.4)"
  tiltX?: number; // default: 4
  tiltY?: number; // default: -6
  position?: "center" | "top-center" | "bottom-center" | "center-right" | "center-left";
  className?: string;
}

/**
 * 💎 PolishStickerFloat
 * Elevated 3D floating presentation for assets and reaction characters.
 * Replaces tacky border badges and flat sticker slaps with a clean,
 * holographic 3D card tilt, soft rim glow, and subtle floating physics.
 */
export const PolishStickerFloat: React.FC<PolishStickerFloatProps> = ({
  imageSrc,
  startFrame,
  durationFrames = 60,
  width = 380,
  height = 380,
  glowColor = "rgba(16, 185, 129, 0.35)",
  tiltX = 4,
  tiltY = -5,
  position = "center",
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame > startFrame + durationFrames) {
    return null;
  }

  const relFrame = frame - startFrame;
  const enterSpring = spring({
    frame: relFrame,
    fps,
    config: { damping: 14, mass: 0.7, stiffness: 130 },
  });

  // Exit animation in the final 10 frames
  const exitFrames = 10;
  const exitRel = Math.max(0, relFrame - (durationFrames - exitFrames));
  const exitProgress = interpolate(exitRel, [0, exitFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scale = interpolate(enterSpring, [0, 1], [0.8, 1.0]) * (1 - exitProgress * 0.2);
  const opacity = interpolate(enterSpring, [0, 1], [0, 1]) * (1 - exitProgress);

  // Subtle floating motion
  const floatY = Math.sin((relFrame / fps) * 2) * 6;

  // Position styles
  const positionClasses = {
    center: "items-center justify-center",
    "top-center": "items-center justify-start pt-16",
    "bottom-center": "items-center justify-end pb-24",
    "center-right": "items-end justify-center pr-12",
    "center-left": "items-start justify-center pl-12",
  }[position];

  return (
    <div
      className={`absolute inset-0 pointer-events-none flex ${positionClasses} z-30 ${className}`}
      style={{
        perspective: "1000px",
      }}
    >
      <div
        className="relative flex items-center justify-center"
        style={{
          transform: `scale(${scale}) translateY(${floatY}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          opacity,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Atmospheric Backlight Bloom */}
        <div
          className="absolute -inset-10 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            filter: "blur(12px)",
          }}
        />

        {/* Clean Asset Render */}
        <img
          src={staticFile(imageSrc)}
          alt="Visual Asset"
          className="relative z-10 object-contain drop-shadow-2xl"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            filter: `drop-shadow(0 20px 35px rgba(0, 0, 0, 0.8)) drop-shadow(0 0 15px ${glowColor})`,
          }}
        />
      </div>
    </div>
  );
};
