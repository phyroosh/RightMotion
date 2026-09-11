import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface ViscoelasticDeformationProps {
  /** Compressive load intensity: 0.0 (unloaded) -> 1.0 (maximum structural capacity) */
  load: number;
  /** Poisson's ratio: lateral expansion ratio (default: 0.42 for solid matter) */
  poissonRatio?: number;
  /** Maximum vertical squash percentage (default: 0.12 = 12%) */
  maxCompression?: number;
  /** Optional impact frame to trigger viscoelastic recoil shockwave */
  impactFrame?: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 🧱 ViscoelasticDeformation
 * Low-level materiality capability modeling continuous compressive strain
 * and volume-preserving Poisson lateral bulging under mechanical load.
 */
export const ViscoelasticDeformation: React.FC<ViscoelasticDeformationProps> = ({
  load,
  poissonRatio = 0.42,
  maxCompression = 0.12,
  impactFrame,
  children,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Viscoelastic impact ripple oscillation
  let recoilScaleY = 1.0;
  if (impactFrame !== undefined && frame >= impactFrame) {
    const relImpact = frame - impactFrame;
    const sp = spring({
      frame: relImpact,
      fps,
      config: { damping: 11, stiffness: 150, mass: 0.7 },
    });
    // Overshoot dip on impact then settle
    const impactDip = (1 - sp) * 0.08;
    recoilScaleY = 1.0 - impactDip;
  }

  // Vertical compressive strain
  const effectiveLoad = Math.max(0, Math.min(1.0, load));
  const scaleY = (1.0 - effectiveLoad * maxCompression) * recoilScaleY;

  // Horizontal Poisson expansion (volume-preserving)
  const scaleX = 1.0 + (1.0 - scaleY) * poissonRatio * 2.2;

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        transform: `scale(${scaleX.toFixed(4)}, ${scaleY.toFixed(4)})`,
        transformOrigin: "center bottom",
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
