import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [0, 100],
    { extrapolateRight: "clamp" }
  );

  return (
    <div className="absolute top-0 left-0 right-0 h-3 bg-zinc-900/80 backdrop-blur-md z-50 overflow-hidden">
      {/* Background Track */}
      <div className="absolute inset-0 bg-white/5" />

      {/* Active Filled Bar */}
      <div
        className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-emerald-300 relative transition-all duration-75"
        style={{ width: `${progress}%` }}
      >
        {/* Glowing Head Point */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-white shadow-[0_0_20px_#10b981] opacity-90" />
      </div>
    </div>
  );
};
