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

  // Theme styles with guaranteed inline contrast styles (immune to CSS purge)
  const themes: Record<
    EngagementTheme,
    {
      bgStyle: React.CSSProperties;
      tagStyle: React.CSSProperties;
      textColor: string;
      iconColor: string;
    }
  > = {
    apple_studio: {
      bgStyle: {
        backgroundColor: "rgba(9, 9, 11, 0.94)",
        border: "2px solid rgba(56, 189, 248, 0.5)",
        boxShadow: "0 12px 35px rgba(0, 0, 0, 0.65), 0 0 20px rgba(56, 189, 248, 0.2)",
      },
      tagStyle: {
        backgroundColor: "rgba(6, 182, 212, 0.25)",
        color: "#67e8f9",
      },
      textColor: "#ffffff",
      iconColor: "#38bdf8",
    },
    obsidian: {
      bgStyle: {
        backgroundColor: "rgba(8, 11, 18, 0.95)",
        border: "2px solid rgba(251, 191, 36, 0.5)",
        boxShadow: "0 12px 35px rgba(0, 0, 0, 0.7), 0 0 20px rgba(251, 191, 36, 0.2)",
      },
      tagStyle: {
        backgroundColor: "rgba(245, 158, 11, 0.25)",
        color: "#fcd34d",
      },
      textColor: "#ffffff",
      iconColor: "#fbbf24",
    },
    biotech_cyan: {
      bgStyle: {
        backgroundColor: "rgba(7, 19, 30, 0.95)",
        border: "2px solid rgba(34, 211, 238, 0.55)",
        boxShadow: "0 12px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(6, 182, 212, 0.3)",
      },
      tagStyle: {
        backgroundColor: "rgba(6, 182, 212, 0.28)",
        color: "#67e8f9",
      },
      textColor: "#ffffff",
      iconColor: "#22d3ee",
    },
    gold: {
      bgStyle: {
        backgroundColor: "rgba(15, 14, 8, 0.95)",
        border: "2px solid rgba(234, 179, 8, 0.5)",
        boxShadow: "0 12px 35px rgba(0, 0, 0, 0.7), 0 0 20px rgba(234, 179, 8, 0.25)",
      },
      tagStyle: {
        backgroundColor: "rgba(234, 179, 8, 0.25)",
        color: "#fde047",
      },
      textColor: "#ffffff",
      iconColor: "#eab308",
    },
    rose: {
      bgStyle: {
        backgroundColor: "rgba(20, 8, 12, 0.95)",
        border: "2px solid rgba(244, 63, 94, 0.5)",
        boxShadow: "0 12px 35px rgba(0, 0, 0, 0.7), 0 0 20px rgba(244, 63, 94, 0.25)",
      },
      tagStyle: {
        backgroundColor: "rgba(244, 63, 94, 0.25)",
        color: "#fda4af",
      },
      textColor: "#ffffff",
      iconColor: "#f43f5e",
    },
  };

  const t = themes[theme] || themes.apple_studio;

  const renderIcon = () => {
    const cls = "w-5 h-5 shrink-0";
    const st = { color: t.iconColor };
    switch (icon) {
      case "pin":
        return <Pin style={st} className={cls} />;
      case "heart":
        return <Heart style={st} className={cls} />;
      case "chat":
        return <MessageCircle style={st} className={cls} />;
      case "sparkles":
        return <Sparkles style={st} className={cls} />;
      case "share":
        return <Share2 style={st} className={cls} />;
      case "brain":
      default:
        return <Brain style={st} className={cls} />;
    }
  };

  return (
    <div
      className="absolute bottom-[30.5%] left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none max-w-[860px] w-[90%]"
      style={{
        opacity,
        transform: `translate(-50%, ${translateY}px) scale(${scale})`,
      }}
    >
      <div
        style={t.bgStyle}
        className="px-5 py-3 rounded-full flex items-center justify-between gap-4 backdrop-blur-2xl"
      >
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center">
            {renderIcon()}
            <div
              style={{ backgroundColor: t.iconColor }}
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-ping"
            />
          </div>
          <span
            style={t.tagStyle}
            className="text-xs font-mono font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
          >
            {tag}
          </span>
        </div>

        <div
          style={{ color: t.textColor }}
          className="text-xl font-bold tracking-tight truncate text-center flex-1"
        >
          {prompt}
        </div>

        <div className="flex items-center gap-1 shrink-0 opacity-70">
          <CornerDownRight style={{ color: t.iconColor }} className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
