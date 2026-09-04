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
import { Eye, Activity, Sparkles, Compass } from "lucide-react";

export interface CinematicIllustrationCardProps {
  /** Relative image path inside public/ or URL */
  imageSrc: string;
  /** Hero topic or friction title */
  title: string;
  /** Secondary diagnostic subtitle */
  subtitle?: string;
  /** Telemetry badge text (e.g. "COGNITIVE STATE // 01") */
  badgeLabel?: string;
  /** Color theme for neon accents & glow: "cyan" | "magenta" | "amber" | "emerald" | "violet" */
  accentColor?: "cyan" | "magenta" | "amber" | "emerald" | "violet";
  /** Frame when the card enters */
  entranceFrame?: number;
  /** Frame when diagnostic spotlight activates (optional) */
  highlightFrame?: number;
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
  highlightFrame,
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
    ? interpolate(relFrame, [0, 180], [1.0, 1.07], { extrapolateRight: "clamp" })
    : 1.0;
  const panDriftX = enableKenBurns
    ? interpolate(relFrame, [0, 180], [0, -10], { extrapolateRight: "clamp" })
    : 0;
  const panDriftY = enableKenBurns
    ? interpolate(relFrame, [0, 180], [0, -6], { extrapolateRight: "clamp" })
    : 0;

  // Diagnostic highlight pulse spring (if specified)
  const spHighlight = highlightFrame !== undefined && frame >= highlightFrame
    ? spring({
        frame: frame - highlightFrame,
        fps,
        config: { damping: 12, stiffness: 150 },
      })
    : 0;

  // Accent color mappings
  const colorMap = {
    cyan: {
      border: "border-cyan-500/40",
      glowBg: "from-cyan-500/25 via-blue-600/15 to-transparent",
      badgeText: "text-cyan-400",
      badgeBg: "bg-cyan-500/15 border-cyan-500/40",
      accentText: "text-cyan-300",
      pulseColor: "bg-cyan-400",
      spotlightBorder: "border-cyan-400",
      spotlightGlow: "shadow-[0_0_35px_rgba(6,182,212,0.6)]",
    },
    magenta: {
      border: "border-fuchsia-500/40",
      glowBg: "from-fuchsia-500/25 via-purple-600/15 to-transparent",
      badgeText: "text-fuchsia-400",
      badgeBg: "bg-fuchsia-500/15 border-fuchsia-500/40",
      accentText: "text-fuchsia-300",
      pulseColor: "bg-fuchsia-400",
      spotlightBorder: "border-fuchsia-400",
      spotlightGlow: "shadow-[0_0_35px_rgba(217,70,239,0.6)]",
    },
    amber: {
      border: "border-amber-500/40",
      glowBg: "from-amber-500/25 via-orange-600/15 to-transparent",
      badgeText: "text-amber-400",
      badgeBg: "bg-amber-500/15 border-amber-500/40",
      accentText: "text-amber-300",
      pulseColor: "bg-amber-400",
      spotlightBorder: "border-amber-400",
      spotlightGlow: "shadow-[0_0_35px_rgba(245,158,11,0.6)]",
    },
    emerald: {
      border: "border-emerald-500/40",
      glowBg: "from-emerald-500/25 via-teal-600/15 to-transparent",
      badgeText: "text-emerald-400",
      badgeBg: "bg-emerald-500/15 border-emerald-500/40",
      accentText: "text-emerald-300",
      pulseColor: "bg-emerald-400",
      spotlightBorder: "border-emerald-400",
      spotlightGlow: "shadow-[0_0_35px_rgba(16,185,129,0.6)]",
    },
    violet: {
      border: "border-violet-500/40",
      glowBg: "from-violet-500/25 via-indigo-600/15 to-transparent",
      badgeText: "text-violet-400",
      badgeBg: "bg-violet-500/15 border-violet-500/40",
      accentText: "text-violet-300",
      pulseColor: "bg-violet-400",
      spotlightBorder: "border-violet-400",
      spotlightGlow: "shadow-[0_0_35px_rgba(139,92,246,0.6)]",
    },
  };

  const currentTheme = colorMap[accentColor] || colorMap.cyan;

  // Resolve image source
  const src = imageSrc.startsWith("http") || imageSrc.startsWith("/")
    ? imageSrc
    : staticFile(imageSrc);

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
                <span className={`w-3 h-3 rounded-full ${currentTheme.pulseColor} animate-ping absolute opacity-75`} />
                <span className={`w-2.5 h-2.5 rounded-full ${currentTheme.pulseColor}`} />
              </div>
              <span className={`text-xl font-mono font-black tracking-widest uppercase ${currentTheme.badgeText}`}>
                {badgeLabel}
              </span>
            </div>

            <div className={`px-4 py-1.5 rounded-full border ${currentTheme.badgeBg} flex items-center gap-2 text-lg font-mono font-bold ${currentTheme.badgeText}`}>
              <Activity className="w-4 h-4" />
              <span>LIVE SIGNAL</span>
            </div>
          </div>

          {/* Card Center: Painterly Illustration with Ken Burns Drift & Glare */}
          <div
            className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-black/80 shadow-inner"
            style={{ height: `${height}px` }}
          >
            {/* The Illustration Image */}
            <div
              className="w-full h-full"
              style={{
                transform: `scale(${zoomDrift}) translate(${panDriftX}px, ${panDriftY}px)`,
                transformOrigin: "center center",
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

            {/* Diagnostic Focus Spotlight on Surreal Neon Mental Trails (Revealed on cue frame) */}
            {spHighlight > 0 && (
              <div
                className="absolute pointer-events-none transition-all"
                style={{
                  top: "22%",
                  left: "44%",
                  width: "140px",
                  height: "140px",
                  opacity: Math.min(1, spHighlight * 1.3),
                  transform: `scale(${interpolate(spHighlight, [0, 1], [0.7, 1])})`,
                }}
              >
                <div
                  className={`w-full h-full rounded-full border-2 border-dashed ${currentTheme.spotlightBorder} ${currentTheme.spotlightGlow} animate-spin`}
                  style={{ animationDuration: "14s" }}
                />
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-md bg-black/80 border border-white/20 text-xs font-mono font-bold text-white tracking-widest uppercase">
                  COGNITIVE CORE
                </div>
              </div>
            )}

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

          {/* Card Bottom: Bold Hero Title & Diagnostic Subtitle */}
          <div className="px-2 pb-1 text-center">
            <h2 className="text-4xl font-black text-white tracking-tight leading-snug">
              {title}
            </h2>
            {subtitle && (
              <p className={`text-2xl font-bold ${currentTheme.accentText} mt-1 tracking-wide`}>
                {subtitle}
              </p>
            )}
          </div>
        </PhysicalCard>
      </div>
    </div>
  );
};
