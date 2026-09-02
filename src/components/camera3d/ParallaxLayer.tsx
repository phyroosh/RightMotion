import React from "react";

export interface ParallaxLayerProps {
  children: React.ReactNode;
  depthZ: number; // e.g. -250 for background, 0 for main canvas, +60 for hero props, +120 for foreground
  enableBlur?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 🌌 ParallaxLayer
 * Places elements on distinct Z-depth planes for true 3D spatial separation.
 */
export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  depthZ,
  enableBlur = false,
  className = "",
  style = {},
}) => {
  // Compute depth of field blur if depth is significantly far from 0
  const blurAmount = enableBlur ? Math.abs(depthZ) * 0.025 : 0;

  return (
    <div
      className={`absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transform: `translateZ(${depthZ}px)`,
        filter: blurAmount > 0.5 ? `blur(${blurAmount}px)` : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
