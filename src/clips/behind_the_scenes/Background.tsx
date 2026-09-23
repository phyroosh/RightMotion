import React from "react";

/**
 * 🎨 BehindTheScenesBackground
 * Pristine, luminous studio background for Judy Insights (#f8fafc / #ffffff).
 * Pure razor-sharp clarity without dirty grain or murky dark tones.
 */
export const BehindTheScenesBackground: React.FC = () => {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 50% 30%, #ffffff 0%, #f8fafc 55%, #f1f5f9 100%)",
      }}
    >
      {/* Subtle architectural studio grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(203, 213, 225, 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(203, 213, 225, 0.35) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at 50% 40%, black 40%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 40%, transparent 85%)",
          opacity: 0.7,
        }}
      />

      {/* Subtle warm sunlight wash from top right */}
      <div
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(254, 243, 199, 0.45) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
    </div>
  );
};
