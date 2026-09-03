import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { calcDecayingWobble, calcHarmonicDrift, PhysicsSprings } from "./PhysicsSprings";

export interface PhysicalCardProps {
  tiltX?: number; // Base isometric pitch (degrees)
  tiltY?: number; // Base isometric roll (degrees)
  tiltZ?: number; // Base isometric yaw (degrees)
  elevation?: number; // Visual shadow elevation (px)
  impactMs?: number; // Optional timestamp when a heavy child lands on this card
  enableLivingFloat?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

/**
 * 📦 PhysicalCard
 * Next-generation 3D tactile card that dynamically reacts to physical weight,
 * momentum overshoot, and impact dips with realistic surface glare.
 */
export const PhysicalCard: React.FC<PhysicalCardProps> = ({
  tiltX = 6,
  tiltY = -5,
  tiltZ = 0,
  elevation = 24,
  impactMs,
  enableLivingFloat = true,
  className = "",
  style = {},
  children,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Entrance physics spring
  const spEntrance = spring({
    frame,
    fps,
    config: PhysicsSprings.heavyImpact,
  });

  // Dynamic entrance tilt & dip
  const entranceDipY = (1 - spEntrance) * 40;
  const entranceTiltX = (1 - spEntrance) * 12;

  // 2. Secondary impact reaction (when a heavy prop or coin slams on the card)
  let impactDipY = 0;
  let impactWobbleDeg = 0;
  if (impactMs !== undefined) {
    const impactStartFrame = Math.floor((impactMs / 1000) * fps);
    const relImpactFrame = frame - impactStartFrame;
    if (relImpactFrame >= 0) {
      const spImpact = spring({
        frame: relImpactFrame,
        fps,
        config: PhysicsSprings.elasticSettle,
      });
      impactDipY = (1 - spImpact) * 10;
      impactWobbleDeg = calcDecayingWobble(relImpactFrame, fps, 3.5, 5.0, 7.0);
    }
  }

  // 3. Subtle ambient physical drift
  let driftY = 0;
  let driftTiltX = 0;
  let driftTiltY = 0;
  if (enableLivingFloat && spEntrance > 0.95) {
    const drift = calcHarmonicDrift(frame, fps, 3.0, 0.4);
    driftY = drift.translateY;
    driftTiltX = drift.rotateDeg * 0.4;
    driftTiltY = drift.rotateDeg * -0.5;
  }

  const effectiveTiltX = tiltX + entranceTiltX + driftTiltX;
  const effectiveTiltY = tiltY + impactWobbleDeg + driftTiltY;
  const effectiveTiltZ = tiltZ;
  const effectiveTranslateY = entranceDipY + impactDipY + driftY;

  // Dynamic light reflection that moves with tilt
  const glareX = interpolate(effectiveTiltY, [-15, 15], [20, 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glareY = interpolate(effectiveTiltX, [-15, 15], [20, 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        perspective: 1200,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      <div
        className="relative w-full h-full transition-transform duration-75"
        style={{
          transform: `translateY(${effectiveTranslateY}px) rotateX(${effectiveTiltX}deg) rotateY(${effectiveTiltY}deg) rotateZ(${effectiveTiltZ}deg)`,
          filter: `drop-shadow(0 ${elevation * 1.2}px ${elevation * 2.2}px rgba(0, 0, 0, 0.35))`,
          willChange: "transform",
        }}
      >
        {/* Specular Glare Overlay */}
        <div
          className="absolute inset-0 rounded-[inherit] pointer-events-none z-30 opacity-20"
          style={{
            background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.7) 0%, transparent 65%)`,
            mixBlendMode: "overlay",
          }}
        />
        {children}
      </div>
    </div>
  );
};
