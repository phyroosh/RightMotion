import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterKeyframeAnimator, KeyframePoint } from "../../components/CharacterKeyframeAnimator";
import { Sparkles, Brain, ShieldCheck, HeartHandshake } from "lucide-react";

interface PresenterProps {
  currentMs: number;
}

export const PromisesPresenter: React.FC<PresenterProps> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Multi-pose keyframe tracks for Promises Shorts (32.86s total)
  const keyframes: KeyframePoint[] = [
    // 1. Intro Hook (0s - 4.5s): Pointing
    { timeMs: 0, pose: "pointing", scale: 0.94, y: 80, rotate: -2, opacity: 0 },
    { timeMs: 350, pose: "pointing", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 3800, pose: "pointing", scale: 1.02, y: -4, rotate: 1, opacity: 1 },
    { timeMs: 4500, pose: "pointing", scale: 0.95, y: 90, rotate: 2, opacity: 0 },

    // 2. The Neurological Reframe (13.0s - 19.5s): Analytical / Skeptical Arms Crossed
    { timeMs: 13000, pose: "crossed", scale: 0.94, y: 90, rotate: 2, opacity: 0 },
    { timeMs: 13600, pose: "crossed", scale: 1.04, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 18800, pose: "crossed", scale: 1.06, y: -6, rotate: -1, opacity: 1 },
    { timeMs: 19600, pose: "crossed", scale: 0.95, y: 90, rotate: -2, opacity: 0 },

    // 3. The Core Rebuild Word & Finale (27.5s - End): Open Palms (Empowering)
    { timeMs: 27500, pose: "open", scale: 0.94, y: 80, rotate: -2, opacity: 0 },
    { timeMs: 28200, pose: "open", scale: 1.06, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 33000, pose: "open", scale: 1.08, y: -6, rotate: 0, opacity: 1 },
  ];

  const isIntro = currentMs >= 0 && currentMs < 4500;
  const isNeuralReframe = currentMs >= 13000 && currentMs < 19600;
  const isFinale = currentMs >= 27500;

  const isPresenterActive = isIntro || isNeuralReframe || isFinale;

  const fastSpringConfig = { damping: 18, mass: 0.8, stiffness: 110 };
  const badgeSpring = spring({ frame, fps, config: fastSpringConfig });

  if (!isPresenterActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden">
      {/* 1. Frosted Glass Backdrop Overlay */}
      <div className="absolute inset-0 backdrop-blur-2xl bg-white/35 pointer-events-none transition-all duration-500" />

      {/* 2. Soft Ambient Radial Light Halo */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[850px] h-[850px] rounded-full pointer-events-none blur-[120px]"
        style={{
          background: isFinale
            ? "radial-gradient(circle, rgba(16,185,129,0.32) 0%, rgba(14,165,233,0.2) 60%, transparent 80%)"
            : isNeuralReframe
            ? "radial-gradient(circle, rgba(245,158,11,0.32) 0%, rgba(99,102,241,0.2) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(244,63,94,0.32) 0%, rgba(99,102,241,0.18) 60%, transparent 80%)",
        }}
      />

      {/* 3. Floating Apple Glass Badge */}
      {isIntro && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(244,63,94,0.25)] border-[5px] border-white z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <Sparkles className="text-rose-500 animate-spin" style={{ width: 60, height: 60, animationDuration: "8s" }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            THE SELF-TRUST PARADOX
          </span>
        </div>
      )}

      {isNeuralReframe && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(245,158,11,0.25)] border-[5px] border-amber-300 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <Brain className="text-amber-500" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            CONDITIONED BRAIN
          </span>
        </div>
      )}

      {isFinale && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(16,185,129,0.25)] border-[5px] border-emerald-400 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <HeartHandshake className="text-emerald-500 animate-bounce" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            BECOMING TRUSTWORTHY
          </span>
        </div>
      )}

      {/* 4. Multi-Pose Character Presenter */}
      <CharacterKeyframeAnimator keyframes={keyframes} currentMs={currentMs} />
    </div>
  );
};
