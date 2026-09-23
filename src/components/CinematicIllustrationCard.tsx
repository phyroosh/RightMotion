import React from "react";
import {
  spring,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
  Img,
} from "remotion";
import { PhysicalCard } from "./physics/PhysicalCard";
import { TapeStrip } from "./collage/TapeStrip";
import {
  Activity,
  Sparkles,
  Compass,
  AlertTriangle,
  Crosshair,
  Zap,
  Flame,
  Shield,
  Target,
} from "lucide-react";

export type IllustrationBeatType = "callout" | "stamp" | "badge" | "punch";
export type IllustrationColor =
  | "cyan"
  | "magenta"
  | "amber"
  | "emerald"
  | "violet"
  | "blue"
  | "rose"
  | "sky";

export interface IllustrationBeat {
  /** Spoken cue frame when this overlay activates */
  frame: number;
  /** Type of graphical element: "callout" | "stamp" | "badge" | "punch" */
  type: IllustrationBeatType;
  /** Primary label or title */
  text: string;
  /** Secondary subtitle or description */
  subtext?: string;
  /** Position on the illustration: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" */
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  /** Icon name */
  icon?: "alert" | "crosshair" | "zap" | "flame" | "shield" | "sparkles" | "target" | "compass";
  /** Color theme override */
  color?: IllustrationColor;
  /** Camera zoom level on dynamic punch (e.g. 1.15 to zoom in) */
  zoomLevel?: number;
  /** Focal target position in percentages (x: 0-100, y: 0-100) */
  targetX?: number;
  targetY?: number;
}

export interface CinematicIllustrationCardProps {
  /** Relative image path inside public/ or URL */
  imageSrc: string;
  /** Hero topic or friction title (optional, hidden by default to avoid caption duplication) */
  title?: string;
  /** Secondary diagnostic subtitle (optional) */
  subtitle?: string;
  /** Optional caption alias for subtitle */
  caption?: string;
  /** Optional frame alias */
  frame?: number;
  /** Optional startFrame alias for entranceFrame */
  startFrame?: number;
  /** Optional visual variant */
  variant?: string;
  /** Telemetry badge text (optional, strictly opt-in) */
  badgeLabel?: string;
  /** Color theme for neon accents & glow */
  accentColor?: IllustrationColor;
  /** Frame when the card enters (default: 0) */
  entranceFrame?: number;
  /** Frame when the subtitle reveals (default: entranceFrame) */
  subtitleFrame?: number;
  /** Frame when diagnostic spotlight activates (optional legacy) */
  highlightFrame?: number;
  /** Speech-synchronized progressive overlay beats */
  beats?: IllustrationBeat[];
  /** Width in pixels (default: 900) */
  width?: number;
  /** Height in pixels (default: 520) */
  height?: number;
  /** Tilt angles for PhysicalCard */
  tiltX?: number;
  tiltY?: number;
  /** Show top masking tape strip (default: false) */
  showTape?: boolean;
  /** Show telemetry header bar (default: false) */
  showTelemetry?: boolean;
  /** Show title & subtitle on the card (default: false, captions handle spoken text) */
  showTitle?: boolean;
  /** Enable subtle 2.5D Ken Burns slow drift */
  enableKenBurns?: boolean;
}

export const CinematicIllustrationCard: React.FC<CinematicIllustrationCardProps> = ({
  imageSrc,
  title,
  subtitle,
  caption,
  frame: propFrame,
  startFrame,
  variant,
  badgeLabel,
  accentColor = "cyan",
  entranceFrame: propEntranceFrame = 0,
  subtitleFrame,
  highlightFrame,
  beats = [],
  width = 900,
  height = 520,
  tiltX = 3,
  tiltY = -3,
  showTape = false,
  showTelemetry = false,
  showTitle = false,
  enableKenBurns = true,
}) => {
  const entranceFrame = startFrame ?? propEntranceFrame;
  const cardSubtitle = subtitle ?? caption;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - entranceFrame);

  // Active speech-synchronized beats rendered STRICTLY OUTSIDE the picture
  const activeBeats = beats.filter((b) => frame >= b.frame);
  const latestActiveBeat = activeBeats.length > 0 ? activeBeats[activeBeats.length - 1] : null;

  // Entrance spring physics
  const spEnter = spring({
    frame: relFrame,
    fps,
    config: { damping: 14, stiffness: 130, mass: 0.9 },
  });

  // Specular holographic glass glare sweep (slides across sheet on landing)
  const glareProgress = interpolate(relFrame, [5, 26], [-120, 220], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 2.5D Ken Burns slow-pan and slow-zoom drift
  const zoomDrift = enableKenBurns
    ? interpolate(relFrame, [0, 240], [1.0, 1.07], { extrapolateRight: "clamp" })
    : 1.0;
  const panDriftX = enableKenBurns
    ? interpolate(relFrame, [0, 240], [0, -12], { extrapolateRight: "clamp" })
    : 0;
  const panDriftY = enableKenBurns
    ? interpolate(relFrame, [0, 240], [0, -8], { extrapolateRight: "clamp" })
    : 0;

  // Dynamic Camera Punch Zoom Calculation from active beats
  let cameraPunchZoom = 0;
  let punchOriginX = 50;
  let punchOriginY = 50;

  for (const b of beats) {
    if ((b.type === "punch" || b.zoomLevel !== undefined) && frame >= b.frame) {
      const spPunch = spring({
        frame: frame - b.frame,
        fps,
        config: { damping: 12, stiffness: 160 },
      });
      const punchTarget = (b.zoomLevel ?? 1.15) - 1.0;
      const punchVal = spPunch * punchTarget;
      if (punchVal > cameraPunchZoom) {
        cameraPunchZoom = punchVal;
        if (b.targetX !== undefined) punchOriginX = b.targetX;
        if (b.targetY !== undefined) punchOriginY = b.targetY;
      }
    }
  }

  // Accent color mappings
  const colorMap: Record<IllustrationColor, {
    border: string;
    glowBg: string;
    badgeText: string;
    badgeBg: string;
    accentText: string;
    pulseColor: string;
    spotlightBorder: string;
    spotlightGlow: string;
    stampBg: string;
    stampBorder: string;
  }> = {
    cyan: {
      border: "border-cyan-500/50",
      glowBg: "from-cyan-500/25 via-blue-600/15 to-transparent",
      badgeText: "text-cyan-400",
      badgeBg: "bg-cyan-500/15 border-cyan-500/40",
      accentText: "text-cyan-300",
      pulseColor: "bg-cyan-400",
      spotlightBorder: "border-cyan-400",
      spotlightGlow: "shadow-[0_0_35px_rgba(6,182,212,0.6)]",
      stampBg: "bg-cyan-950/90",
      stampBorder: "border-cyan-500/80",
    },
    magenta: {
      border: "border-fuchsia-500/50",
      glowBg: "from-fuchsia-500/25 via-purple-600/15 to-transparent",
      badgeText: "text-fuchsia-400",
      badgeBg: "bg-fuchsia-500/15 border-fuchsia-500/40",
      accentText: "text-fuchsia-300",
      pulseColor: "bg-fuchsia-400",
      spotlightBorder: "border-fuchsia-400",
      spotlightGlow: "shadow-[0_0_35px_rgba(217,70,239,0.6)]",
      stampBg: "bg-fuchsia-950/90",
      stampBorder: "border-fuchsia-500/80",
    },
    amber: {
      border: "border-amber-500/50",
      glowBg: "from-amber-500/25 via-orange-600/15 to-transparent",
      badgeText: "text-amber-400",
      badgeBg: "bg-amber-500/15 border-amber-500/40",
      accentText: "text-amber-300",
      pulseColor: "bg-amber-400",
      spotlightBorder: "border-amber-400",
      spotlightGlow: "shadow-[0_0_35px_rgba(245,158,11,0.6)]",
      stampBg: "bg-amber-950/90",
      stampBorder: "border-amber-500/80",
    },
    emerald: {
      border: "border-emerald-500/50",
      glowBg: "from-emerald-500/25 via-teal-600/15 to-transparent",
      badgeText: "text-emerald-400",
      badgeBg: "bg-emerald-500/15 border-emerald-500/40",
      accentText: "text-emerald-300",
      pulseColor: "bg-emerald-400",
      spotlightBorder: "border-emerald-400",
      spotlightGlow: "shadow-[0_0_35px_rgba(16,185,129,0.6)]",
      stampBg: "bg-emerald-950/90",
      stampBorder: "border-emerald-500/80",
    },
    violet: {
      border: "border-violet-500/50",
      glowBg: "from-violet-500/25 via-indigo-600/15 to-transparent",
      badgeText: "text-violet-400",
      badgeBg: "bg-violet-500/15 border-violet-500/40",
      accentText: "text-violet-300",
      pulseColor: "bg-violet-400",
      spotlightBorder: "border-violet-400",
      spotlightGlow: "shadow-[0_0_35px_rgba(139,92,246,0.6)]",
      stampBg: "bg-violet-950/90",
      stampBorder: "border-violet-500/80",
    },
    blue: {
      border: "border-sky-500/50",
      glowBg: "from-sky-500/25 via-blue-600/15 to-transparent",
      badgeText: "text-sky-400",
      badgeBg: "bg-sky-500/15 border-sky-500/40",
      accentText: "text-sky-300",
      pulseColor: "bg-sky-400",
      spotlightBorder: "border-sky-400",
      spotlightGlow: "shadow-[0_0_35px_rgba(14,165,233,0.6)]",
      stampBg: "bg-sky-950/90",
      stampBorder: "border-sky-500/80",
    },
    rose: {
      border: "border-rose-500/50",
      glowBg: "from-rose-500/25 via-red-600/15 to-transparent",
      badgeText: "text-rose-400",
      badgeBg: "bg-rose-500/15 border-rose-500/40",
      accentText: "text-rose-300",
      pulseColor: "bg-rose-400",
      spotlightBorder: "border-rose-400",
      spotlightGlow: "shadow-[0_0_35px_rgba(244,63,94,0.6)]",
      stampBg: "bg-rose-950/90",
      stampBorder: "border-rose-500/80",
    },
    sky: {
      border: "border-sky-500/50",
      glowBg: "from-sky-500/25 via-blue-600/15 to-transparent",
      badgeText: "text-sky-400",
      badgeBg: "bg-sky-500/15 border-sky-500/40",
      accentText: "text-sky-300",
      pulseColor: "bg-sky-400",
      spotlightBorder: "border-sky-400",
      spotlightGlow: "shadow-[0_0_35px_rgba(14,165,233,0.6)]",
      stampBg: "bg-sky-950/90",
      stampBorder: "border-sky-500/80",
    },
  };

  const currentTheme = colorMap[accentColor] || colorMap.cyan;

  // Resolve image source (strip public/ if present)
  const cleanImageSrc = imageSrc.replace(/^public\//, "");
  const src = cleanImageSrc.startsWith("http") || cleanImageSrc.startsWith("/")
    ? cleanImageSrc
    : staticFile(cleanImageSrc);

  // Subtitle Progressive Timing
  const effectiveSubFrame = subtitleFrame !== undefined ? subtitleFrame : entranceFrame;
  const isSubtitleActive = frame >= effectiveSubFrame;
  const spSubtitle = isSubtitleActive
    ? spring({
        frame: frame - effectiveSubFrame,
        fps,
        config: { damping: 14, stiffness: 140 },
      })
    : 0;

  // Helper for rendering beat icons
  const renderBeatIcon = (iconName?: string, className: string = "w-5 h-5") => {
    switch (iconName) {
      case "alert":
        return <AlertTriangle className={className} />;
      case "crosshair":
        return <Crosshair className={className} />;
      case "zap":
        return <Zap className={className} />;
      case "flame":
        return <Flame className={className} />;
      case "shield":
        return <Shield className={className} />;
      case "target":
        return <Target className={className} />;
      case "compass":
        return <Compass className={className} />;
      case "sparkles":
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center transition-all"
      style={{
        width: `${width}px`,
        opacity: Math.min(1, spEnter * 1.2),
        transform: `scale(${interpolate(spEnter, [0, 1], [0.88, 1])}) translateY(${interpolate(spEnter, [0, 1], [40, 0])}px)`,
      }}
    >
      {/* 1. Ambient Dynamic Back-Glow (Pulsating behind the physical card) */}
      <div
        className={`absolute -inset-6 rounded-[36px] bg-gradient-to-b ${currentTheme.glowBg} blur-2xl pointer-events-none opacity-80`}
        style={{
          transform: `scale(${1 + Math.sin(relFrame * 0.08) * 0.03})`,
        }}
      />

      {/* 2. Physical 3D Tactile Card Container */}
      <div className="relative w-full">
        {/* EXTERNAL FLOATING MOTION DESIGN OVERLAYS (STRICTLY OUTSIDE THE PICTURE!) */}
        {latestActiveBeat && (() => {
          const beatRel = frame - latestActiveBeat.frame;
          const spBeat = spring({
            frame: beatRel,
            fps,
            config: { damping: 13, stiffness: 160, mass: 0.8 },
          });
          const beatTheme = colorMap[latestActiveBeat.color || accentColor] || currentTheme;
          const isStamp = latestActiveBeat.type === "stamp";

          return (
            <div
              className="absolute left-1/2 -translate-x-1/2 z-40 pointer-events-none w-full max-w-[820px] px-2 flex justify-center"
              style={{
                bottom: "calc(100% + 24px)",
                opacity: Math.min(1, spBeat * 1.5),
                transform: `translateX(-50%) translateY(${interpolate(spBeat, [0, 1], [-16, 0])}px) scale(${interpolate(spBeat, [0, 1], [0.88, 1])})`,
              }}
            >
              {isStamp ? (
                <div className={`p-4 px-6 rounded-2xl ${beatTheme.stampBg} backdrop-blur-2xl border-2 ${beatTheme.stampBorder} shadow-[0_15px_50px_rgba(0,0,0,0.85)] flex items-center justify-between gap-4 w-full`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${beatTheme.pulseColor} animate-ping shrink-0`} />
                    {renderBeatIcon(latestActiveBeat.icon || "alert", `w-6 h-6 ${beatTheme.badgeText} shrink-0`)}
                    <span className="text-2xl font-black text-white uppercase tracking-wider">
                      {latestActiveBeat.text}
                    </span>
                  </div>
                  {latestActiveBeat.subtext && (
                    <div className={`text-base font-mono font-bold ${beatTheme.accentText} uppercase tracking-wider text-right truncate`}>
                      {latestActiveBeat.subtext}
                    </div>
                  )}
                </div>
              ) : (
                <div className={`p-4 px-6 rounded-2xl bg-[#080b12]/92 backdrop-blur-2xl border-2 ${beatTheme.border} shadow-[0_15px_50px_rgba(0,0,0,0.85)] flex items-center justify-between gap-4 w-full`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${beatTheme.pulseColor} animate-pulse shrink-0`} />
                    {renderBeatIcon(latestActiveBeat.icon, `w-6 h-6 ${beatTheme.badgeText} shrink-0`)}
                    <span className={`text-2xl font-mono font-black tracking-wide uppercase ${beatTheme.badgeText}`}>
                      {latestActiveBeat.text}
                    </span>
                  </div>
                  {latestActiveBeat.subtext && (
                    <div className="text-base font-bold text-white/90 text-right truncate max-w-[460px]">
                      {latestActiveBeat.subtext}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* Anchored tactile masking tape on top edge (strictly opt-in, default false) */}
        {showTape && (
          <div className="absolute -top-7 right-10 z-40 pointer-events-none drop-shadow-md">
            <TapeStrip position="top-right" width={180} height={46} enableWobble />
          </div>
        )}

        <PhysicalCard
          tiltX={tiltX}
          tiltY={tiltY}
          elevation={42}
          className={`w-full bg-[#080b12]/90 backdrop-blur-2xl border border-white/15 rounded-[32px] p-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col ${showTelemetry || (showTitle && title) ? "gap-3" : "gap-0"} overflow-hidden`}
        >
          {/* Card Top Header: Monospace Telemetry & Live Indicator (strictly opt-in, default false) */}
          {showTelemetry && badgeLabel && (
            <div className="flex items-center justify-between px-2 pt-1">
              <div className="flex items-center gap-3">
                <div className="relative flex items-center justify-center">
                  <span className={`w-3.5 h-3.5 rounded-full ${currentTheme.pulseColor} animate-ping absolute opacity-75`} />
                  <span className={`w-3 h-3 rounded-full ${currentTheme.pulseColor}`} />
                </div>
                <span className={`text-2xl font-mono font-black tracking-widest uppercase ${currentTheme.badgeText}`}>
                  {badgeLabel}
                </span>
              </div>

              <div className={`px-4 py-2 rounded-full border ${currentTheme.badgeBg} flex items-center gap-2 text-xl font-mono font-black ${currentTheme.badgeText}`}>
                <Activity className="w-5 h-5" />
                <span>LIVE SIGNAL</span>
              </div>
            </div>
          )}

          {/* Card Center: Painterly Illustration with Ken Burns Drift & Glare */}
          <div
            className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black/80 shadow-inner"
            style={{ height: `${height}px` }}
          >
            {/* The Illustration Image with Dynamic Camera Punch */}
            <div
              className="w-full h-full"
              style={{
                transform: `scale(${zoomDrift + cameraPunchZoom}) translate(${panDriftX}px, ${panDriftY}px)`,
                transformOrigin: `${punchOriginX}% ${punchOriginY}%`,
              }}
            >
              <Img
                src={src}
                className="w-full h-full object-cover"
                alt={title}
              />
            </div>

            {/* Specular Glass Glare Sweep traversing diagonally across */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                transform: `translateX(${glareProgress}%) rotate(25deg)`,
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.03) 75%, transparent 100%)",
                width: "200%",
                height: "200%",
                top: "-50%",
                left: "-50%",
              }}
            />

            {/* Subtle natural glass edge vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Card Bottom: Bold Hero Title & Progressive Diagnostic Subtitle (strictly opt-in, default false) */}
          {showTitle && title && (
            <div className="px-2 pt-2 pb-1 text-center">
              <h2 className="text-5xl font-black text-white tracking-tight leading-tight">
                {title}
              </h2>
              {cardSubtitle && isSubtitleActive && (
                <div
                  style={{
                    opacity: Math.min(1, spSubtitle * 1.3),
                    transform: `scale(${interpolate(spSubtitle, [0, 1], [0.85, 1])}) translateY(${interpolate(spSubtitle, [0, 1], [15, 0])}px)`,
                  }}
                >
                  <p className={`text-3xl font-bold ${currentTheme.accentText} mt-2 tracking-wide`}>
                    {cardSubtitle}
                  </p>
                </div>
              )}
            </div>
          )}
        </PhysicalCard>
      </div>
    </div>
  );
};
