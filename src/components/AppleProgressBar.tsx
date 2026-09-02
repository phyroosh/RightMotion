import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

interface AppleProgressBarProps {
  accentColor?: string; // Custom accent color for channel branding (Finance: #10b981, Health: #06b6d4, Self Improvement: default)
}

export const AppleProgressBar: React.FC<AppleProgressBarProps> = ({ accentColor }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [0, 100],
    { extrapolateRight: "clamp" }
  );

  const gradient = accentColor
    ? `linear-gradient(to right, ${accentColor}cc, ${accentColor})`
    : "linear-gradient(to right, #38bdf8, #6366f1, #f43f5e)";

  return (
    <div className="absolute top-0 left-0 right-0 h-2.5 bg-white/10 backdrop-blur-xl border-b border-black/5 z-50 overflow-hidden">
      {/* Active Liquid Gradient Bar */}
      <div
        className="h-full relative transition-all duration-75"
        style={{ width: `${progress}%`, background: gradient }}
      >
        {/* Specular Glint Head */}
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-white/80 shadow-[0_0_15px_rgba(255,255,255,1)]" />
      </div>
    </div>
  );
};
