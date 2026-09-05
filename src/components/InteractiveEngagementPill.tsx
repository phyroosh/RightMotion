import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Brain, Pin, Heart, MessageCircle, Sparkles, Share2, CornerDownRight } from "lucide-react";

export type EngagementTheme = "apple_studio" | "obsidian" | "biotech_cyan" | "gold" | "rose";

export interface InteractiveEngagementPillProps {
  entranceFrame: number;
  durationFrames?: number;
  prompt?: string;
  tag?: string;
  icon?: "brain" | "pin" | "heart" | "chat" | "sparkles" | "share";
  theme?: EngagementTheme;
  customFrame?: number;
}

export const InteractiveEngagementPill: React.FC<InteractiveEngagementPillProps> = ({
  entranceFrame,
  durationFrames = 105, // 3.5s at 30fps
  prompt = "Have you felt this? Drop your thoughts 👇",
  tag = "DISCUSSION",
  icon = "brain",
  theme = "apple_studio",
  customFrame,
}) => {
  const currentFrame = useCurrentFrame();
  const frame = customFrame !== undefined ? customFrame : currentFrame;
  const { fps } = useVideoConfig();

  const exitFrame = entranceFrame + durationFrames;
  if (frame < entranceFrame || frame > exitFrame + 15) {
    return null;
  }

  // Entrance spring (stiff, bouncy Apple-style pop)
  const spIn = spring({
    frame: frame - entranceFrame,
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.8 },
  });

  // Exit interpolation (smooth drop away)
  const isExiting = frame >= exitFrame;
  const exitProgress = isExiting
    ? interpolate(frame - exitFrame, [0, 15], [0, 1], { extrapolateRight: "clamp" })
    : 0;

  const scale = interpolate(spIn, [0, 1], [0.75, 1]) * (1 - exitProgress * 0.2);
  const opacity = Math.min(1, spIn * 1.5) * (1 - exitProgress);
  const translateY = interpolate(spIn, [0, 1], [30, 0]) + exitProgress * 25;

  // Theme styles
  const themes: Record<
    EngagementTheme,
    {
      bg: string;
      border: string;
      tagBg: string;
      tagText: string;
      textColor: string;
      iconColor: string;
      glow: string;
    }
  > = {
    apple_studio: {
      bg: "bg-[#09090b]/92 backdrop-blur-2xl",
      border: "border-cyan-400/40",
      tagBg: "bg-cyan-500/20",
      tagText: "text-cyan-300",
      textColor: "text-white",
      iconColor: "text-cyan-400",
      glow: "shadow-[0_12px_35px_rgba(0,0,0,0.6)]",
    },
    obsidian: {
      bg: "bg-[#080b12]/95 backdrop-blur-2xl",
      border: "border-amber-400/40",
      tagBg: "bg-amber-500/20",
      tagText: "text-amber-300",
      textColor: "text-white",
      iconColor: "text-amber-400",
      glow: "shadow-[0_12px_35px_rgba(0,0,0,0.7)]",
    },
    biotech_cyan: {
      bg: "bg-[#07131e]/95 backdrop-blur-2xl",
      border: "border-cyan-400/50",
      tagBg: "bg-cyan-500/25",
      tagText: "text-cyan-300",
      textColor: "text-white",
      iconColor: "text-cyan-400",
      glow: "shadow-[0_12px_35px_rgba(6,182,212,0.25)]",
    },
    gold: {
      bg: "bg-[#0f0e08]/95 backdrop-blur-2xl",
      border: "border-yellow-400/40",
      tagBg: "bg-yellow-500/20",
      tagText: "text-yellow-300",
      textColor: "text-white",
      iconColor: "text-yellow-400",
      glow: "shadow-[0_12px_35px_rgba(234,179,8,0.25)]",
    },
    rose: {
      bg: "bg-[#14080c]/95 backdrop-blur-2xl",
      border: "border-rose-400/40",
      tagBg: "bg-rose-500/20",
      tagText: "text-rose-300",
      textColor: "text-white",
      iconColor: "text-rose-400",
      glow: "shadow-[0_12px_35px_rgba(244,63,94,0.25)]",
    },
  };

  const t = themes[theme] || themes.apple_studio;

  const renderIcon = () => {
    const cls = `w-5 h-5 ${t.iconColor} shrink-0`;
    switch (icon) {
      case "pin":
        return <Pin className={cls} />;
      case "heart":
        return <Heart className={cls} />;
      case "chat":
        return <MessageCircle className={cls} />;
      case "sparkles":
        return <Sparkles className={cls} />;
      case "share":
        return <Share2 className={cls} />;
      case "brain":
      default:
        return <Brain className={cls} />;
    }
  };

  return (
    <div
      className="absolute bottom-[28%] left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none max-w-[860px] w-[90%]"
      style={{
        opacity,
        transform: `translate(-50%, ${translateY}px) scale(${scale})`,
      }}
    >
      <div
        className={`px-5 py-3 rounded-full ${t.bg} border-2 ${t.border} ${t.glow} flex items-center justify-between gap-4`}
      >
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center">
            {renderIcon()}
            <div
              className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${t.iconColor.replace(
                "text-",
                "bg-"
              )} animate-ping`}
            />
          </div>
          <span
            className={`text-xs font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${t.tagBg} ${t.tagText}`}
          >
            {tag}
          </span>
        </div>

        <div className={`text-xl font-bold tracking-tight ${t.textColor} truncate text-center flex-1`}>
          {prompt}
        </div>

        <div className="flex items-center gap-1 shrink-0 opacity-70">
          <CornerDownRight className={`w-4 h-4 ${t.iconColor}`} />
        </div>
      </div>
    </div>
  );
};
