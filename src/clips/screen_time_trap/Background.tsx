import React from "react";

/**
 * 🎨 ScreenTimeTrapBackground
 * Pristine, luminous studio background for Judy Insights (#f8fafc / #ffffff).
 * Pure razor-sharp contrast without dirty grain or dark muddy surfaces.
 */
export const ScreenTimeTrapBackground: React.FC = () => {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 35%, #ffffff 0%, #f8fafc 60%, #f1f5f9 100%)",
      }}
    >
      {/* Subtle architectural depth grid - pristine studio cue */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(203, 213, 225, 0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(203, 213, 225, 0.45) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at 50% 45%, black 35%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 45%, black 35%, transparent 80%)",
          opacity: 0.6,
        }}
      />
    </div>
  );
};

