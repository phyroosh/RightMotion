import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const AppleProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(
    frame,
    [0, Math.max(1, durationInFrames - 1)],
    [0, 100],
    { extrapolateRight: "clamp" }
  );

  return (
    <div className="absolute top-0 left-0 right-0 h-2.5 bg-white/60 backdrop-blur-xl border-b border-black/5 z-50 overflow-hidden">
      {/* Active Liquid Gradient Bar */}
      <div
        className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-rose-500 relative transition-all duration-75"
        style={{ width: `${progress}%` }}
      >
        {/* Specular Glint Head */}
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-white/80 shadow-[0_0_15px_rgba(255,255,255,1)]" />
      </div>
    </div>
  );
};
