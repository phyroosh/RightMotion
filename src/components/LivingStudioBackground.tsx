import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";

export interface LivingStudioBackgroundProps {
  className?: string;
  dotGridOpacity?: number;
  enableBreathing?: boolean;
  orbColor1?: string;
  orbColor2?: string;
}

/**
 * 🎬 LivingStudioBackground
 * Signature Apple Studio Canvas with organic living ambient auras.
 * Matches the Judy Insights channel banner aesthetic:
 * - Pure studio white/slate-50 base
 * - Left Warm Amber Sparkle Aura (gentle sine wave drift)
 * - Right Electric Cognitive Blue Aura (counter-phase cosine drift)
 * - Tactile graphite dot-grid texture
 */
export const LivingStudioBackground: React.FC<LivingStudioBackgroundProps> = ({
  className = "",
  dotGridOpacity = 0.28,
  enableBreathing = true,
  orbColor1 = "rgba(245, 158, 11, 0.24)",
  orbColor2 = "rgba(37, 99, 235, 0.22)",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const timeSec = frame / fps;

  // Gentle, high-end organic ambient physics (never jarring or fast)
  const amberFloatX = enableBreathing ? Math.sin(timeSec * 0.6) * 18 : 0;
  const amberFloatY = enableBreathing ? Math.cos(timeSec * 0.45) * 24 : 0;
  const amberScale = enableBreathing ? 1.0 + Math.sin(timeSec * 0.5) * 0.05 : 1.0;

  const blueFloatX = enableBreathing ? Math.cos(timeSec * 0.5) * -22 : 0;
  const blueFloatY = enableBreathing ? Math.sin(timeSec * 0.55) * -18 : 0;
  const blueScale = enableBreathing ? 1.0 + Math.cos(timeSec * 0.4) * 0.06 : 1.0;

  return (
    <div
      className={`absolute inset-0 w-full h-full bg-[#fbfbfd] overflow-hidden pointer-events-none select-none ${className}`}
      style={{
        background: "radial-gradient(ellipse at 50% 0%, #ffffff 0%, #f8fafc 55%, #f1f5f9 100%)",
      }}
    >
      {/* 1. Left Warm Amber Sparkle Aura (Judy Insights Signature) */}
      <div
        style={{
          position: "absolute",
          top: "8%",
          left: "-18%",
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${orbColor1} 0%, transparent 75%)`,
          filter: "blur(120px)",
          transform: `translate3d(${amberFloatX}px, ${amberFloatY}px, 0px) scale(${amberScale})`,
          willChange: "transform",
        }}
      />

      {/* 2. Right Electric Cognitive Blue Aura (Judy Insights Signature) */}
      <div
        style={{
          position: "absolute",
          top: "22%",
          right: "-18%",
          width: "950px",
          height: "950px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${orbColor2} 0%, transparent 75%)`,
          filter: "blur(130px)",
          transform: `translate3d(${blueFloatX}px, ${blueFloatY}px, 0px) scale(${blueScale})`,
          willChange: "transform",
        }}
      />

      {/* 3. Subtle Studio Floor Reflection Light */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          height: "40%",
          background: "radial-gradient(ellipse at 50% 100%, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.5) 60%, transparent 100%)",
        }}
      />

      {/* 4. Delicate Graphite Dot Grid Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(rgba(100, 116, 139, 0.25) 1.5px, transparent 1.5px)",
          backgroundSize: "36px 36px",
          opacity: dotGridOpacity,
        }}
      />
    </div>
  );
};
