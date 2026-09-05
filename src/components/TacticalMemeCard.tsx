import React from "react";
import {
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Video,
} from "remotion";
import { Zap, Flame, Eye, AlertCircle } from "lucide-react";

export interface TacticalMemeCardProps {
  memeId: string;
  startFrame: number;
  durationFrames?: number; // Default 48 frames (~1.6s) - Strict retention limit < 2.5s
  playbackRate?: number; // Default 1.4x fast-forwarded tempo
  hudLabel?: string;
  theme?: "apple_studio" | "dark_obsidian" | "cyber_cyan";
  position?: "top" | "center";
  scale?: number;
  className?: string;
}

// Registry mapping for fast lookup
const MEME_FILE_MAP: Record<string, { filename: string; defaultLabel: string }> = {
  ishowspeed_stare: { filename: "ishowspeed_stare.mp4", defaultLabel: "COGNITIVE FREEZE // SPEECHLESS" },
  doctor_strange_loop: { filename: "doctor_strange_loop.mp4", defaultLabel: "AUTOPILOT LOOP // RECURSION" },
  side_eye_dog: { filename: "side_eye_dog.mp4", defaultLabel: "SKEPTICISM // CAUGHT" },
  angry_grandpa_rage: { filename: "angry_grandpa_rage.mp4", defaultLabel: "BREAKING POINT // EXPLOSION" },
  awkward_smile_dog: { filename: "awkward_smile_dog.mp4", defaultLabel: "SOCIAL MASK // THIS IS FINE" },
  confused_kid: { filename: "confused_kid.mp4", defaultLabel: "PARADOX // COGNITIVE DISSONANCE" },
  walter_white_despair: { filename: "walter_white_despair.mp4", defaultLabel: "ROCK BOTTOM // SYSTEM FAILURE" },
  office_rage_smash: { filename: "office_rage_smash.mp4", defaultLabel: "BURNOUT OVERLOAD // CRASH" },
  michael_jackson_popcorn: { filename: "michael_jackson_popcorn.mp4", defaultLabel: "SPECTATOR MODE // DRAMA" },
  rowley_innocent_wave: { filename: "rowley_innocent_wave.mp4", defaultLabel: "WHOLESOME // OBLIVIOUS" },
  lego_bruce_flabbergasted: { filename: "lego_bruce_flabbergasted.mp4", defaultLabel: "INFATUATION // HYPNOSIS" },
  courtroom_shout_me: { filename: "courtroom_shout_me.mp4", defaultLabel: "CALLED OUT // DEFENSIVE" },
  al_pacino_depressed_bench: { filename: "al_pacino_depressed_bench.mp4", defaultLabel: "ISOLATION // QUIET VOID" },
  ishowspeed_nodding_headphones: { filename: "ishowspeed_nodding_headphones.mp4", defaultLabel: "VALIDATION // FACTS" },
  bateman_iphone_inspection: { filename: "bateman_iphone_inspection.mp4", defaultLabel: "SCRUTINY // SOCIAL ANXIETY" },
  cat_laughing_pointing: { filename: "cat_laughing_pointing.mp4", defaultLabel: "SAVAGE ROAST // REALITY CHECK" },
  tony_stark_explosion: { filename: "tony_stark_explosion.mp4", defaultLabel: "BREAKTHROUGH // POWER UNLOCKED" },
  rdj_shocked_closeup: { filename: "rdj_shocked_closeup.mp4", defaultLabel: "PLOT TWIST // COGNITIVE SHIFT" },
  wet_seal_cat: { filename: "wet_seal_cat.mp4", defaultLabel: "DORSAL VAGAL FREEZE // NUMB" },
  ronaldo_sipping_tea: { filename: "ronaldo_sipping_tea.mp4", defaultLabel: "UNBOTHERED // HIGH AGENCY" },
  sweating_gamer: { filename: "sweating_gamer.mp4", defaultLabel: "ACUTE ANXIETY // OVERTHINKING" },
  chrome_cyborg_overload: { filename: "chrome_cyborg_overload.mp4", defaultLabel: "SENSORY OVERLOAD // DOPAMINE FRIED" },
  doctor_strange_multiverse: { filename: "doctor_strange_multiverse.mp4", defaultLabel: "PARADIGM SHIFT // EGO DEATH" },
};

export const TacticalMemeCard: React.FC<TacticalMemeCardProps> = ({
  memeId,
  startFrame,
  durationFrames = 48,
  playbackRate = 1.4,
  hudLabel,
  theme = "apple_studio",
  position = "top",
  scale: userScale = 1.0,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Clean and map memeId
  const cleanId = memeId.replace(/\.mp4$/i, "").toLowerCase();
  const memeInfo = MEME_FILE_MAP[cleanId] || {
    filename: cleanId.endsWith(".mp4") ? cleanId : `${cleanId}.mp4`,
    defaultLabel: "TACTICAL REACTION // PROTOCOL",
  };

  const endFrame = startFrame + durationFrames;

  // Active visibility check (plus 6 frames for exit animation)
  if (frame < startFrame || frame > endFrame + 6) {
    return null;
  }

  // Entrance spring pop (0 to 1)
  const enterSpring = spring({
    frame: frame - startFrame,
    fps,
    config: {
      damping: 14,
      stiffness: 180,
      mass: 0.7,
    },
  });

  // Exit collapse spring (starts 6 frames before endFrame)
  const isExiting = frame >= endFrame;
  const exitProgress = isExiting
    ? interpolate(frame, [endFrame, endFrame + 6], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  // Combined scale and opacity
  const currentScale = userScale * interpolate(enterSpring, [0, 1], [0.82, 1.0]) * (1 - exitProgress * 0.18);
  const currentOpacity = interpolate(enterSpring, [0, 1], [0, 1]) * (1 - exitProgress);

  // Specular sheen glare progress traversing across the card
  const glareProgress = interpolate(frame - startFrame, [0, 24], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle 3D card tilt
  const tiltX = interpolate(enterSpring, [0, 1], [6, 2]);
  const tiltY = interpolate(enterSpring, [0, 1], [-8, -2]);

  const activeLabel = hudLabel || memeInfo.defaultLabel;

  // Theme borders and accents
  const themeStyles = {
    apple_studio: {
      border: "border-slate-800/80",
      badgeBg: "bg-slate-900/95 text-sky-400 border-sky-500/30",
      accentDot: "#38bdf8",
      glow: "rgba(56, 189, 248, 0.25)",
    },
    dark_obsidian: {
      border: "border-amber-500/40",
      badgeBg: "bg-black/95 text-amber-400 border-amber-500/40",
      accentDot: "#f59e0b",
      glow: "rgba(245, 158, 11, 0.3)",
    },
    cyber_cyan: {
      border: "border-cyan-500/40",
      badgeBg: "bg-slate-950/95 text-cyan-400 border-cyan-500/40",
      accentDot: "#06b6d4",
      glow: "rgba(6, 182, 212, 0.3)",
    },
  }[theme];

  const positionClass = position === "top" ? "top-[7%]" : "top-[26%]";

  return (
    <div
      className={`absolute inset-x-0 ${positionClass} flex flex-col items-center justify-center pointer-events-none z-35 ${className}`}
      style={{
        perspective: "1000px",
        opacity: currentOpacity,
      }}
    >
      <div
        className={`relative w-[560px] max-w-[90vw] rounded-[28px] overflow-hidden border-4 ${themeStyles.border} shadow-[0_30px_70px_rgba(0,0,0,0.65)] bg-slate-950`}
        style={{
          transform: `scale(${currentScale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transformOrigin: "center center",
          boxShadow: `0 25px 60px rgba(0,0,0,0.7), 0 0 40px ${themeStyles.glow}`,
        }}
      >
        {/* 1. Monospace HUD Telemetry Header Pill */}
        <div className="absolute top-3 inset-x-0 flex items-center justify-between px-4 z-20 pointer-events-none">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-md ${themeStyles.badgeBg} shadow-lg`}>
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: themeStyles.accentDot, boxShadow: `0 0 10px ${themeStyles.accentDot}` }}
            />
            <span className="font-mono text-[13px] font-black tracking-wider uppercase">
              {activeLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 border border-white/20 text-white/90 font-mono text-[11px] font-bold">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>&lt;2.5s KINETIC</span>
          </div>
        </div>

        {/* 2. Fast-Forwarded Muted Meme Video */}
        <div className="relative w-full aspect-square max-h-[500px] overflow-hidden bg-black flex items-center justify-center">
          <Video
            src={staticFile(`memes/${memeInfo.filename}`)}
            volume={0}
            playbackRate={playbackRate}
            className="w-full h-full object-cover"
          />

          {/* Subtle vignette for contrast */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/40" />

          {/* 3. Specular Glass Glare Sheen Sweep */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
            style={{
              background: `linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.85) ${glareProgress}%, transparent ${glareProgress + 18}%)`,
            }}
          />
        </div>

        {/* 4. Bottom Tactical Status Bar */}
        <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-between px-4 z-20 pointer-events-none text-white/60 font-mono text-[11px]">
          <span className="tracking-widest uppercase">FAST-FORWARD {playbackRate}x</span>
          <span className="tracking-widest uppercase text-emerald-400">AUDIO MUTED // NARRATION PRESERVED</span>
        </div>
      </div>
    </div>
  );
};
