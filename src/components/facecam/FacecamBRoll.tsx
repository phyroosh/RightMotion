import React from "react";
import { Img, Video, spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { Sparkles } from "lucide-react";

export interface FacecamBRollProps {
  mediaSrc: string;
  type?: "image" | "video";
  mediaFit?: "cover" | "contain";
  startFrame: number;
  endFrame: number;
  title?: string;
  badgeIcon?: React.ReactNode;
  calloutTag?: string;
  variant?: "card" | "split";
  spotlightCircle?: boolean;
  spotlightCenter?: { x: number; y: number }; // percentage e.g. { x: 50, y: 40 }
  spotlightRadius?: number; // default 120px
  kenBurns?: "zoom-in" | "zoom-out" | "none";
  className?: string;
}

export const FacecamBRoll: React.FC<FacecamBRollProps> = ({
  mediaSrc,
  type = "image",
  mediaFit = "cover",
  startFrame,
  endFrame,
  title,
  badgeIcon,
  calloutTag,
  variant = "card",
  spotlightCircle = false,
  spotlightCenter = { x: 50, y: 38 },
  spotlightRadius = 130,
  kenBurns = "zoom-in",
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < startFrame || frame >= endFrame) {
    return null;
  }

  // Entrance physics
  const spEnter = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 15, stiffness: 130 },
  });

  // Exit physics
  const framesRemaining = endFrame - frame;
  const exitOpacity = framesRemaining < 10 ? framesRemaining / 10 : 1;

  // Ken Burns subtle motion
  const totalDuration = endFrame - startFrame;
  const currentProgress = (frame - startFrame) / Math.max(1, totalDuration);
  const kbScale =
    kenBurns === "zoom-in"
      ? interpolate(currentProgress, [0, 1], [1.0, 1.08])
      : kenBurns === "zoom-out"
      ? interpolate(currentProgress, [0, 1], [1.08, 1.0])
      : 1.0;

  // Dashed spotlight circle rotation
  const circleRotation = interpolate(frame, [startFrame, endFrame], [0, 45]);

  const isCard = variant === "card";

  return (
    <div
      className={`absolute z-25 overflow-hidden transition-all select-none ${
        isCard
          ? "top-[6%] inset-x-8 h-[45%] rounded-[32px] border-4 border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-black"
          : "top-0 inset-x-0 h-[48%] border-b-4 border-amber-400/90 shadow-[0_20px_40px_rgba(0,0,0,0.9)] bg-black"
      } ${className}`}
      style={{
        opacity: Math.min(1, spEnter * 1.5) * exitOpacity,
        transform: `translateY(${interpolate(spEnter, [0, 1], [-40, 0])}px) scale(${interpolate(
          spEnter,
          [0, 1],
          [0.92, 1]
        )})`,
      }}
    >
      {/* 1. Media Layer (Image or Video) */}
      <div
        className="w-full h-full will-change-transform flex items-center justify-center"
        style={{
          transform: `scale(${mediaFit === "contain" ? 1.0 : kbScale})`,
          transformOrigin: "center center",
        }}
      >
        {type === "image" ? (
          <Img
            src={mediaSrc}
            className={`w-full h-full ${
              mediaFit === "contain" ? "object-contain bg-white" : "object-cover"
            }`}
          />
        ) : (
          <Video
            src={mediaSrc}
            className={`w-full h-full ${
              mediaFit === "contain" ? "object-contain bg-white" : "object-cover"
            }`}
          />
        )}
      </div>

      {/* Subtle Bottom Vignette for text contrast (only on photo/video) */}
      {mediaFit !== "contain" && (
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
      )}

      {/* 2. Spotlight Circle (e.g. Founder profile highlight) */}
      {spotlightCircle && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: `${spotlightCenter.x}%`,
            top: `${spotlightCenter.y}%`,
            transform: `translate(-50%, -50%) rotate(${circleRotation}deg)`,
          }}
        >
          <svg
            width={spotlightRadius * 2 + 20}
            height={spotlightRadius * 2 + 20}
            viewBox={`0 0 ${spotlightRadius * 2 + 20} ${spotlightRadius * 2 + 20}`}
          >
            <circle
              cx={spotlightRadius + 10}
              cy={spotlightRadius + 10}
              r={spotlightRadius}
              fill="none"
              stroke="#ef4444"
              strokeWidth="6"
              strokeDasharray="16 10"
              className="drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]"
            />
          </svg>
        </div>
      )}

      {/* 3. Top Floating Badge */}
      {title && (
        <div className="absolute top-5 left-5 z-30 flex items-center gap-2.5 px-5 py-2 rounded-full bg-black/85 border border-amber-400/80 backdrop-blur-md shadow-xl">
          {badgeIcon ?? <Sparkles className="w-5 h-5 text-amber-400" />}
          <span className="text-xl font-mono font-black text-amber-300 uppercase tracking-wider">
            {title}
          </span>
        </div>
      )}

      {/* 4. Optional Callout Accent Tag */}
      {calloutTag && (
        <div className="absolute bottom-5 right-5 z-30 px-5 py-2 rounded-xl bg-emerald-500/90 border border-emerald-300 backdrop-blur-md shadow-2xl">
          <span className="text-2xl font-black text-white uppercase tracking-tight">
            {calloutTag}
          </span>
        </div>
      )}
    </div>
  );
};
