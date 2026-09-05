import React from "react";
import {
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Zap } from "lucide-react";

export interface TacticalMemeFrameProps {
  memeId: string;
  startFrame: number;
  durationFrames?: number; // Default 36 frames (~1.2s) - Ultra snappy reaction
  hudLabel?: string;
  theme?: "apple_studio" | "dark_obsidian" | "cyber_cyan";
  position?: "top" | "center";
  scale?: number;
  className?: string;
}

const MEME_LABEL_MAP: Record<string, string> = {
  ishowspeed_stare: "COGNITIVE FREEZE // SPEECHLESS",
  doctor_strange_loop: "AUTOPILOT LOOP // RECURSION",
  side_eye_dog: "SKEPTICISM // CAUGHT",
  angry_grandpa_rage: "BREAKING POINT // EXPLOSION",
  awkward_smile_dog: "SOCIAL MASK // THIS IS FINE",
  confused_kid: "PARADOX // COGNITIVE DISSONANCE",
  walter_white_despair: "ROCK BOTTOM // SYSTEM FAILURE",
  office_rage_smash: "BURNOUT OVERLOAD // CRASH",
  michael_jackson_popcorn: "SPECTATOR MODE // DRAMA",
  rowley_innocent_wave: "WHOLESOME // OBLIVIOUS",
  lego_bruce_flabbergasted: "INFATUATION // HYPNOSIS",
  courtroom_shout_me: "CALLED OUT // DEFENSIVE",
  al_pacino_depressed_bench: "ISOLATION // QUIET VOID",
  ishowspeed_nodding_headphones: "VALIDATION // FACTS",
  bateman_iphone_inspection: "SCRUTINY // SOCIAL ANXIETY",
  cat_laughing_pointing: "SAVAGE ROAST // REALITY CHECK",
  tony_stark_explosion: "BREAKTHROUGH // POWER UNLOCKED",
  rdj_shocked_closeup: "PLOT TWIST // COGNITIVE SHIFT",
  wet_seal_cat: "DORSAL VAGAL FREEZE // NUMB",
  ronaldo_sipping_tea: "UNBOTHERED // HIGH AGENCY",
  sweating_gamer: "ACUTE ANXIETY // OVERTHINKING",
  chrome_cyborg_overload: "SENSORY OVERLOAD // DOPAMINE FRIED",
  doctor_strange_multiverse: "PARADIGM SHIFT // EGO DEATH",
};

export const TacticalMemeFrame: React.FC<TacticalMemeFrameProps> = ({
  memeId,
  startFrame,
  durationFrames = 36,
  hudLabel,
  theme = "apple_studio",
  position = "top",
  scale: userScale = 1.0,
  className = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cleanId = memeId.replace(/\.(mp4|png)$/i, "").toLowerCase();
  const defaultLabel = MEME_LABEL_MAP[cleanId] || "REACTION PROTOCOL // 01";
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
      damping: 12,
      stiffness: 220,
      mass: 0.6,
    },
  });

  // Exit collapse spring
  const isExiting = frame >= endFrame;
  const exitProgress = isExiting
    ? interpolate(frame, [endFrame, endFrame + 6], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  const currentScale =
    userScale * interpolate(enterSpring, [0, 1], [0.75, 1.0]) * (1 - exitProgress * 0.2);
  const currentOpacity = interpolate(enterSpring, [0, 1], [0, 1]) * (1 - exitProgress);

  // Specular sheen glare sweep
  const glareProgress = interpolate(frame - startFrame, [0, 18], [-100, 200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Dynamic tactical tilt
  const tiltX = interpolate(enterSpring, [0, 1], [8, 2]);
  const tiltY = interpolate(enterSpring, [0, 1], [-10, -3]);

  const activeLabel = hudLabel || defaultLabel;

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

  const positionClass = position === "top" ? "top-[5.5%]" : "top-[24%]";

  return (
    <div
      className={`absolute inset-x-0 ${positionClass} flex flex-col items-center justify-center pointer-events-none z-50 ${className}`}
      style={{
        perspective: "1000px",
        opacity: currentOpacity,
      }}
    >
      <div
        className={`relative w-[540px] max-w-[88vw] rounded-[26px] overflow-hidden border-4 ${themeStyles.border} shadow-[0_30px_70px_rgba(0,0,0,0.65)] bg-slate-950`}
        style={{
          transform: `scale(${currentScale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transformOrigin: "center center",
          boxShadow: `0 25px 60px rgba(0,0,0,0.7), 0 0 35px ${themeStyles.glow}`,
        }}
      >
        {/* Monospace HUD Header Pill */}
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
            <span>KINETIC REACTION</span>
          </div>
        </div>

        {/* High-Impact Freeze Frame Reaction Image */}
        <div className="relative w-full aspect-square max-h-[480px] overflow-hidden bg-black flex items-center justify-center">
          <Img
            src={staticFile(`memes/frames/${cleanId}.png`)}
            className="w-full h-full object-cover"
          />

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/40" />

          {/* Specular Glare Sweep */}
          <div
            className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
            style={{
              background: `linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.85) ${glareProgress}%, transparent ${glareProgress + 18}%)`,
            }}
          />
        </div>

        {/* Bottom Status Bar */}
        <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-between px-4 z-20 pointer-events-none text-white/60 font-mono text-[11px]">
          <span className="tracking-widest uppercase">TACTICAL REACTION FRAME</span>
          <span className="tracking-widest uppercase text-emerald-400">AUDIO MUTED // NARRATION PRESERVED</span>
        </div>
      </div>
    </div>
  );
};
