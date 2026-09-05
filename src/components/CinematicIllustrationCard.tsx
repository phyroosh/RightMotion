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
  | "rose";

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
  /** Hero topic or friction title */
  title: string;
  /** Secondary diagnostic subtitle */
  subtitle?: string;
  /** Telemetry badge text (e.g. "COGNITIVE STATE // 01") */
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
  /** Height in pixels (default: 540) */
  height?: number;
  /** Tilt angles for PhysicalCard */
  tiltX?: number;
  tiltY?: number;
  /** Show top masking tape strip */
  showTape?: boolean;
  /** Enable subtle 2.5D Ken Burns slow drift */
  enableKenBurns?: boolean;
}

export const CinematicIllustrationCard: React.FC<CinematicIllustrationCardProps> = ({
  imageSrc,
  title,
  subtitle,
  badgeLabel = "COGNITIVE DIAGNOSTIC // 01",
  accentColor = "cyan",
  entranceFrame = 0,
  subtitleFrame,
  highlightFrame,
  beats = [],
  width = 900,
  height = 540,
  tiltX = 3,
  tiltY = -3,
  showTape = true,
  enableKenBurns = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const relFrame = Math.max(0, frame - entranceFrame);

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
        {/* Anchored tactile masking tape on top edge */}
        {showTape && (
          <div className="absolute -top-7 right-10 z-40 pointer-events-none drop-shadow-md">
            <TapeStrip position="top-right" width={180} height={46} enableWobble />
          </div>
        )}

        <PhysicalCard
          tiltX={tiltX}
          tiltY={tiltY}
          elevation={42}
          className="w-full bg-[#080b12]/90 backdrop-blur-2xl border border-white/15 rounded-[32px] p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] flex flex-col gap-4 overflow-hidden"
        >
          {/* Card Top Header: Monospace Telemetry & Live Indicator */}
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

            {/* PROGRESSIVE GRAPHICAL OVERLAYS (SPEECH-SYNCHRONIZED BEATS) */}
            {beats.map((beat, bIdx) => {
              if (frame < beat.frame) return null;

              const beatRel = frame - beat.frame;
              const spBeat = spring({
                frame: beatRel,
                fps,
                config: { damping: 11, stiffness: 170, mass: 0.8 },
              });
              const beatTheme = colorMap[beat.color || accentColor] || currentTheme;

              // Position styles
              const posStyle: React.CSSProperties = {};
              const pos = beat.position || "top-right";
              if (pos === "top-left") {
                posStyle.top = "18px";
                posStyle.left = "18px";
              } else if (pos === "top-right") {
                posStyle.top = "18px";
                posStyle.right = "18px";
              } else if (pos === "bottom-left") {
                posStyle.bottom = "58px";
                posStyle.left = "18px";
              } else if (pos === "bottom-right") {
                posStyle.bottom = "58px";
                posStyle.right = "18px";
              } else if (pos === "center") {
                posStyle.top = "50%";
                posStyle.left = "50%";
                posStyle.transform = "translate(-50%, -50%)";
              }

              // 1. CALLOUT PIN with Target Reticle
              if (beat.type === "callout") {
                const targetX = beat.targetX ?? 50;
                const targetY = beat.targetY ?? 40;

                return (
                  <React.Fragment key={`beat-${bIdx}`}>
                    {/* Pulsing Target Reticle over subject */}
                    <div
                      className="absolute pointer-events-none transition-all -translate-x-1/2 -translate-y-1/2"
                      style={{
                        top: `${targetY}%`,
                        left: `${targetX}%`,
                        opacity: Math.min(1, spBeat * 1.5),
                        transform: `translate(-50%, -50%) scale(${interpolate(spBeat, [0, 1], [0.4, 1])})`,
                      }}
                    >
                      <div
                        className={`w-14 h-14 rounded-full border-2 border-dashed ${beatTheme.spotlightBorder} ${beatTheme.spotlightGlow} animate-spin`}
                        style={{ animationDuration: "12s" }}
                      />
                      <div className={`absolute inset-0 m-auto w-3 h-3 rounded-full ${beatTheme.pulseColor} shadow-[0_0_12px_#ffffff]`} />
                    </div>

                    {/* Floating Tactical HUD Micro-Card */}
                    <div
                      className="absolute pointer-events-none z-30 transition-all max-w-[420px]"
                      style={{
                        ...posStyle,
                        opacity: Math.min(1, spBeat * 1.3),
                        transform: `${posStyle.transform || ""} scale(${interpolate(spBeat, [0, 1], [0.75, 1])}) translateY(${interpolate(spBeat, [0, 1], [-20, 0])}px)`,
                      }}
                    >
                      <div className={`p-4 rounded-2xl bg-[#080b12]/92 backdrop-blur-2xl border-2 ${beatTheme.border} shadow-[0_15px_40px_rgba(0,0,0,0.85)] flex flex-col gap-1.5`}>
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2.5 h-2.5 rounded-full ${beatTheme.pulseColor} animate-pulse shrink-0`} />
                          {renderBeatIcon(beat.icon, `w-5 h-5 ${beatTheme.badgeText} shrink-0`)}
                          <span className={`text-xl font-mono font-black tracking-wide uppercase ${beatTheme.badgeText}`}>
                            {beat.text}
                          </span>
                        </div>
                        {beat.subtext && (
                          <div className="text-base font-bold text-white/90 pl-5 leading-snug">
                            {beat.subtext}
                          </div>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              }

              // 2. DIAGNOSTIC WARNING / REFRAME STAMP
              if (beat.type === "stamp") {
                return (
                  <div
                    key={`beat-${bIdx}`}
                    className="absolute pointer-events-none z-30 transition-all max-w-[440px]"
                    style={{
                      ...posStyle,
                      opacity: Math.min(1, spBeat * 1.5),
                      transform: `${posStyle.transform || ""} rotate(${interpolate(spBeat, [0, 1], [-8, -3])}deg) scale(${interpolate(spBeat, [0, 1], [1.4, 1])})`,
                    }}
                  >
                    <div className={`p-4 rounded-2xl ${beatTheme.stampBg} backdrop-blur-2xl border-2 ${beatTheme.stampBorder} shadow-[0_0_40px_rgba(0,0,0,0.85)] flex flex-col gap-1`}>
                      <div className="flex items-center gap-2.5">
                        {renderBeatIcon(beat.icon || "alert", `w-6 h-6 ${beatTheme.badgeText} shrink-0`)}
                        <span className="text-2xl font-black text-white uppercase tracking-wider">
                          {beat.text}
                        </span>
                      </div>
                      {beat.subtext && (
                        <div className={`text-sm font-mono font-bold ${beatTheme.accentText} uppercase tracking-wider pl-8`}>
                          {beat.subtext}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // 3. SLEEK TELEMETRY BADGE
              if (beat.type === "badge") {
                return (
                  <div
                    key={`beat-${bIdx}`}
                    className="absolute pointer-events-none z-30 transition-all"
                    style={{
                      ...posStyle,
                      opacity: Math.min(1, spBeat * 1.3),
                      transform: `${posStyle.transform || ""} scale(${interpolate(spBeat, [0, 1], [0.8, 1])})`,
                    }}
                  >
                    <div className={`px-4 py-2 rounded-xl bg-black/85 backdrop-blur-xl border ${beatTheme.badgeBg} flex items-center gap-2 text-lg font-mono font-black ${beatTheme.badgeText} shadow-xl`}>
                      {renderBeatIcon(beat.icon, "w-4 h-4")}
                      <span>{beat.text}</span>
                    </div>
                  </div>
                );
              }

              return null;
            })}

            {/* Subtle Vignette gradient along bottom edge of artwork */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* In-Artwork Bottom Overlay Bar */}
            <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between pointer-events-none">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/15">
                <Compass className={`w-4 h-4 ${currentTheme.badgeText}`} />
                <span className="text-sm font-mono font-bold text-white/90 tracking-wider uppercase">
                  ATMOSPHERIC CHANCE // HIGH
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-mono text-white/70">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>2.5D KINETIC</span>
              </div>
            </div>
          </div>

          {/* Card Bottom: Bold Hero Title & Progressive Diagnostic Subtitle */}
          <div className="px-2 pb-1 text-center">
            <h2 className="text-5xl font-black text-white tracking-tight leading-tight">
              {title}
            </h2>
            {subtitle && isSubtitleActive && (
              <div
                style={{
                  opacity: Math.min(1, spSubtitle * 1.3),
                  transform: `scale(${interpolate(spSubtitle, [0, 1], [0.85, 1])}) translateY(${interpolate(spSubtitle, [0, 1], [15, 0])}px)`,
                }}
              >
                <p className={`text-3xl font-bold ${currentTheme.accentText} mt-2 tracking-wide`}>
                  {subtitle}
                </p>
              </div>
            )}
          </div>
        </PhysicalCard>
      </div>
    </div>
  );
};
