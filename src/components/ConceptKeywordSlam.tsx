import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { PhysicalCard } from "./physics/PhysicalCard";
import { TapeStrip } from "./collage/TapeStrip";
import { Brain, Zap, Target, Activity, Lock, Eye, Sparkles, ShieldAlert } from "lucide-react";

export type ConceptSlamTheme = "apple_studio" | "obsidian" | "biotech_cyan" | "rose" | "gold";

export interface ConceptKeywordSlamProps {
  /** The core psychological or behavioral term to slam on screen (e.g., "IDENTITY BORROWING") */
  term: string;
  /** Short 1-sentence definition or mechanism subtitle */
  definition?: string;
  /** Monospace HUD badge text (default: "PSYCHOLOGICAL MECHANISM // 01") */
  categoryBadge?: string;
  /** Spoken cue frame when this component pops into view */
  entranceFrame: number;
  /** Duration in frames this card remains visible (default: 80 frames ~2.6s) */
  durationFrames?: number;
  /** Design theme */
  theme?: ConceptSlamTheme;
  /** Icon displayed in the telemetry header */
  icon?: "brain" | "zap" | "target" | "activity" | "lock" | "eye" | "sparkles" | "alert";
  /** 3D tactile card tilt */
  tiltX?: number;
  tiltY?: number;
  /** Maximum card width in pixels (default: 900) */
  width?: number;
  /** Custom current frame override */
  customFrame?: number;
}

export const ConceptKeywordSlam: React.FC<ConceptKeywordSlamProps> = ({
  term,
  definition,
  categoryBadge = "PSYCHOLOGICAL MECHANISM // 01",
  entranceFrame,
  durationFrames = 80,
  theme = "apple_studio",
  icon = "brain",
  tiltX = 3,
  tiltY = -3,
  width = 900,
  customFrame,
}) => {
  const currentFrame = useCurrentFrame();
  const frame = customFrame !== undefined ? customFrame : currentFrame;
  const { fps } = useVideoConfig();

  const exitFrame = entranceFrame + durationFrames;
  if (frame < entranceFrame || frame > exitFrame + 15) {
    return null;
  }

  // Entrance spring: snappy, tactile impact slam (overscale slightly on entry)
  const spIn = spring({
    frame: frame - entranceFrame,
    fps,
    config: { damping: 11, stiffness: 170, mass: 0.8 },
  });

  // Exit interpolation: rapid collapse spring
  const isExiting = frame >= exitFrame;
  const exitProgress = isExiting
    ? interpolate(frame - exitFrame, [0, 15], [0, 1], { extrapolateRight: "clamp" })
    : 0;

  const scale = interpolate(spIn, [0, 1], [0.78, 1]) * (1 - exitProgress * 0.15);
  const opacity = Math.min(1, spIn * 1.5) * (1 - exitProgress);
  const translateY = interpolate(spIn, [0, 1], [35, 0]) + exitProgress * 30;

  // Specular holographic glass glare sheen sweep
  const glareProgress = interpolate(frame - entranceFrame, [0, 24], [-100, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Theme styling configurations
  const themeStyles: Record<
    ConceptSlamTheme,
    {
      cardBg: string;
      cardBorder: string;
      shadow: string;
      badgeBg: string;
      badgeText: string;
      badgeBorder: string;
      termColor: string;
      termGlow: string;
      defBg: string;
      defBorder: string;
      defText: string;
      accentColor: string;
      tapeColor: "cream" | "semi_transparent" | "amber";
    }
  > = {
    apple_studio: {
      cardBg: "bg-white/95",
      cardBorder: "border-sky-300/70",
      shadow: "shadow-[0_24px_60px_rgba(0,113,227,0.18),0_12px_24px_rgba(0,0,0,0.08)]",
      badgeBg: "bg-sky-500/10",
      badgeText: "text-[#0071e3]",
      badgeBorder: "border-sky-500/30",
      termColor: "text-slate-950",
      termGlow: "drop-shadow-[0_2px_12px_rgba(0,113,227,0.25)]",
      defBg: "bg-slate-50/90",
      defBorder: "border-sky-200/80",
      defText: "text-slate-700",
      accentColor: "#0071e3",
      tapeColor: "cream",
    },
    obsidian: {
      cardBg: "bg-[#090d16]/95",
      cardBorder: "border-amber-400/50",
      shadow: "shadow-[0_24px_60px_rgba(251,191,36,0.2),0_12px_24px_rgba(0,0,0,0.8)]",
      badgeBg: "bg-amber-400/15",
      badgeText: "text-amber-300",
      badgeBorder: "border-amber-400/40",
      termColor: "text-white",
      termGlow: "drop-shadow-[0_2px_15px_rgba(251,191,36,0.35)]",
      defBg: "bg-amber-950/20",
      defBorder: "border-amber-400/20",
      defText: "text-amber-100/90",
      accentColor: "#fbbf24",
      tapeColor: "amber",
    },
    biotech_cyan: {
      cardBg: "bg-[#06121f]/95",
      cardBorder: "border-cyan-400/50",
      shadow: "shadow-[0_24px_60px_rgba(34,211,238,0.22),0_12px_24px_rgba(0,0,0,0.8)]",
      badgeBg: "bg-cyan-500/15",
      badgeText: "text-cyan-300",
      badgeBorder: "border-cyan-400/40",
      termColor: "text-white",
      termGlow: "drop-shadow-[0_2px_15px_rgba(34,211,238,0.35)]",
      defBg: "bg-cyan-950/25",
      defBorder: "border-cyan-400/25",
      defText: "text-cyan-100/90",
      accentColor: "#22d3ee",
      tapeColor: "semi_transparent",
    },
    rose: {
      cardBg: "bg-white/95",
      cardBorder: "border-rose-400/60",
      shadow: "shadow-[0_24px_60px_rgba(244,63,94,0.2),0_12px_24px_rgba(0,0,0,0.08)]",
      badgeBg: "bg-rose-500/10",
      badgeText: "text-rose-600",
      badgeBorder: "border-rose-500/30",
      termColor: "text-slate-950",
      termGlow: "drop-shadow-[0_2px_12px_rgba(244,63,94,0.25)]",
      defBg: "bg-rose-50/90",
      defBorder: "border-rose-200/80",
      defText: "text-slate-700",
      accentColor: "#f43f5e",
      tapeColor: "cream",
    },
    gold: {
      cardBg: "bg-[#0e1118]/95",
      cardBorder: "border-yellow-400/50",
      shadow: "shadow-[0_24px_60px_rgba(234,179,8,0.22),0_12px_24px_rgba(0,0,0,0.8)]",
      badgeBg: "bg-yellow-400/15",
      badgeText: "text-yellow-300",
      badgeBorder: "border-yellow-400/40",
      termColor: "text-white",
      termGlow: "drop-shadow-[0_2px_15px_rgba(234,179,8,0.35)]",
      defBg: "bg-yellow-950/20",
      defBorder: "border-yellow-400/20",
      defText: "text-yellow-100/90",
      accentColor: "#eab308",
      tapeColor: "amber",
    },
  };

  const currentTheme = themeStyles[theme] || themeStyles.apple_studio;

  // Icon selector
  const renderIcon = () => {
    const iconClass = "w-4 h-4 shrink-0";
    switch (icon) {
      case "zap":
        return <Zap className={iconClass} style={{ color: currentTheme.accentColor }} />;
      case "target":
        return <Target className={iconClass} style={{ color: currentTheme.accentColor }} />;
      case "activity":
        return <Activity className={iconClass} style={{ color: currentTheme.accentColor }} />;
      case "lock":
        return <Lock className={iconClass} style={{ color: currentTheme.accentColor }} />;
      case "eye":
        return <Eye className={iconClass} style={{ color: currentTheme.accentColor }} />;
      case "sparkles":
        return <Sparkles className={iconClass} style={{ color: currentTheme.accentColor }} />;
      case "alert":
        return <ShieldAlert className={iconClass} style={{ color: currentTheme.accentColor }} />;
      case "brain":
      default:
        return <Brain className={iconClass} style={{ color: currentTheme.accentColor }} />;
    }
  };

  return (
    <div
      className="relative z-30 flex flex-col items-center justify-center pointer-events-none select-none"
      style={{
        width: `${width}px`,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        transition: "all 0.05s ease-out",
      }}
    >
      {/* Anchored masking tape strip on top */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-40">
        <TapeStrip
          position="center-top"
          width={180}
          height={46}
          color={currentTheme.tapeColor}
          enableWobble
        />
      </div>

      <PhysicalCard
        tiltX={tiltX}
        tiltY={tiltY}
        elevation={48}
        impactMs={Math.round((entranceFrame / fps) * 1000)}
        className={`w-full p-8 rounded-3xl ${currentTheme.cardBg} border-2 ${currentTheme.cardBorder} ${currentTheme.shadow} backdrop-blur-xl flex flex-col items-center text-center gap-5 relative overflow-hidden`}
      >
        {/* Specular Diagonal Glass Glare Sweep */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(115deg, transparent ${glareProgress - 35}%, rgba(255,255,255,0.38) ${glareProgress}%, transparent ${glareProgress + 35}%)`,
          }}
        />

        {/* Monospace HUD Telemetry Header */}
        <div className="flex items-center justify-between w-full px-2 border-b border-black/5 pb-3">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full ${currentTheme.badgeBg} border ${currentTheme.badgeBorder} ${currentTheme.badgeText} text-xs font-mono font-bold tracking-widest uppercase`}
          >
            {renderIcon()}
            <span>{categoryBadge}</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 font-bold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
            <span>LIVE REWIRE</span>
          </div>
        </div>

        {/* MASSIVE CONCEPT KEYWORD HEADLINE */}
        <div className="py-2 px-4 w-full">
          <h2
            className={`text-6xl font-black tracking-tight uppercase ${currentTheme.termColor} ${currentTheme.termGlow} leading-none`}
            style={{
              letterSpacing: "-0.02em",
              fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
            }}
          >
            {term}
          </h2>
        </div>

        {/* Actionable Mechanism / Subtitle Box */}
        {definition && (
          <div
            className={`w-full p-4 rounded-2xl ${currentTheme.defBg} border ${currentTheme.defBorder} flex items-center justify-center text-center shadow-sm`}
          >
            <p className={`text-2xl font-bold ${currentTheme.defText} leading-snug`}>
              {definition}
            </p>
          </div>
        )}
      </PhysicalCard>
    </div>
  );
};
