import React from "react";

export interface MechanismStageProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  top?: number;
  bottom?: number;
  showGuides?: boolean;
}

/**
 * 🎬 MechanismStage — Open-Canvas Physical Staging Ground
 *
 * Provides calibrated platform-safe bounds (y: 280 → 1340px, x: 72 → 1008px)
 * for open-canvas physical mechanisms (ThresholdBoundary, KineticFurrow,
 * CausalActionCoupling, StressFractureEngine, etc.) WITHOUT card container walls.
 *
 * Anti-Cardification Law: Zero rounded card boxes. Pure open staging space.
 */
export const MechanismStage: React.FC<MechanismStageProps> = ({
  children,
  className = "",
  style = {},
  top = 280,
  bottom = 1340,
  showGuides = false,
}) => {
  const height = bottom - top;

  return (
    <div
      data-mechanism-stage="true"
      className={`absolute inset-x-0 flex flex-col items-center select-none pointer-events-none ${className}`}
      style={{
        top,
        height,
        width: 1080,
        left: "50%",
        transform: "translateX(-50%)",
        ...style,
      }}
    >
      {showGuides && (
        <div className="absolute inset-0 border border-dashed border-sky-400/30 pointer-events-none">
          <span className="absolute top-2 left-2 text-xs font-mono text-sky-400/50">
            SAFE STAGE: {1080}x{height}
          </span>
        </div>
      )}
      {children}
    </div>
  );
};
