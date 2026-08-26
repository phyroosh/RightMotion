import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterKeyframeAnimator, KeyframePoint } from "../../components/CharacterKeyframeAnimator";
import { Sparkles, Brain, Scale, Clock } from "lucide-react";

interface PresenterProps {
  currentMs: number;
}

export const EmotionsPresenter: React.FC<PresenterProps> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. FULL BODY Keyframes (Intro Hook 0-4.2s & Outro Finale 39.7s-End)
  const fullBodyKeyframes: KeyframePoint[] = [
    // Intro Hook (0s - 4.2s): Full-body pointing — commanding the viewer's attention
    { timeMs: 0,     pose: "fullbody_pointing", scale: 0.95, y: 80, rotate: -1, opacity: 0 },
    { timeMs: 350,   pose: "fullbody_pointing", scale: 1.0,  y: 0,  rotate: 0,  opacity: 1 },
    { timeMs: 3600,  pose: "fullbody_pointing", scale: 1.03, y: -4, rotate: 1,  opacity: 1 },
    { timeMs: 4200,  pose: "fullbody_pointing", scale: 0.95, y: 90, rotate: 2,  opacity: 0 },

    // Outro Finale (39.7s - End): Full-body open hands — empathetic closure & mental clarity
    { timeMs: 39700, pose: "fullbody_open", scale: 0.95, y: 80, rotate: -1, opacity: 0 },
    { timeMs: 40300, pose: "fullbody_open", scale: 1.02, y: 0,  rotate: 0,  opacity: 1 },
    { timeMs: 44200, pose: "fullbody_open", scale: 1.05, y: -5, rotate: 0,  opacity: 1 },
  ];

  // 2. BUST CUTOUT Keyframes (Mid-video explanatory interlude 17.5s - 24.5s)
  const bustKeyframes: KeyframePoint[] = [
    // Conditioning vs Biology (17.5s - 24.5s): Crossed arms — analytical reframing of societal conditioning
    { timeMs: 17500, pose: "crossed", scale: 0.94, y: 80, rotate: 2,  opacity: 0 },
    { timeMs: 18100, pose: "crossed", scale: 1.04, y: 0,  rotate: 0,  opacity: 1 },
    { timeMs: 23800, pose: "crossed", scale: 1.06, y: -5, rotate: -1, opacity: 1 },
    { timeMs: 24500, pose: "crossed", scale: 0.94, y: 90, rotate: -2, opacity: 0 },
  ];

  const isIntro = currentMs >= 0 && currentMs < 4200;
  const isInterlude = currentMs >= 17500 && currentMs < 24500;
  const isOutro = currentMs >= 39700;

  const isPresenterActive = isIntro || isInterlude || isOutro;

  const badgeSpring = spring({ frame, fps, config: { damping: 18, mass: 0.8, stiffness: 110 } });

  if (!isPresenterActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden">
      {/* 1. Frosted Glass Backdrop Overlay */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-white/35 pointer-events-none transition-all duration-500" />

      {/* 2. Soft Ambient Radial Light Halo (anchored at bottom behind character) */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full pointer-events-none blur-[120px]"
        style={{
          background: isIntro
            ? "radial-gradient(circle, rgba(244,63,94,0.28) 0%, rgba(99,102,241,0.2) 60%, transparent 80%)"
            : isInterlude
            ? "radial-gradient(circle, rgba(99,102,241,0.32) 0%, rgba(14,165,233,0.2) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(16,185,129,0.28) 0%, rgba(99,102,241,0.22) 60%, transparent 80%)",
        }}
      />

      {/* 3. Apple Glass Scene Badge (top-anchored, large typography, high contrast) */}
      {isIntro && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(244,63,94,0.22)] border-[5px] border-rose-300 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <Brain className="text-rose-500 animate-pulse" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            EMOTIONAL PROCESSING
          </span>
        </div>
      )}

      {isInterlude && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(99,102,241,0.24)] border-[5px] border-indigo-300 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <Scale className="text-indigo-600" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            CONDITIONING VS BIOLOGY
          </span>
        </div>
      )}

      {isOutro && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(16,185,129,0.25)] border-[5px] border-emerald-300 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <Clock className="text-emerald-600 animate-spin" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            GIVE YOUR MIND TIME
          </span>
        </div>
      )}

      {/* 4. Character Animation: Full Body for Intro/Outro, Bust for Interlude */}
      {(isIntro || isOutro) && (
        <CharacterKeyframeAnimator
          currentMs={currentMs}
          keyframes={fullBodyKeyframes}
          baseWidth={860}
          baseHeight={1550}
          className="-mb-8"
        />
      )}

      {isInterlude && (
        <CharacterKeyframeAnimator
          currentMs={currentMs}
          keyframes={bustKeyframes}
          baseWidth={780}
          baseHeight={1200}
          className="-mb-6"
        />
      )}
    </div>
  );
};
