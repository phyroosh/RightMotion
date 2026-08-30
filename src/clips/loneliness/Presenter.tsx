import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterKeyframeAnimator, KeyframePoint } from "../../components/CharacterKeyframeAnimator";
import { Sparkles, HeartHandshake, ShieldCheck, Globe, LockKeyholeOpen } from "lucide-react";

interface PresenterProps {
  currentMs: number;
}

export const LonelinessPresenter: React.FC<PresenterProps> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Multi-pose keyframe tracks for Loneliness Shorts (36.3s total)
  const keyframes: KeyframePoint[] = [
    // 1. Intro Hook (0s - 5.2s): Pointing with thoughtful gesture
    { timeMs: 0, pose: "pointing", scale: 0.94, y: 80, rotate: -2, opacity: 0 },
    { timeMs: 350, pose: "pointing", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 4400, pose: "pointing", scale: 1.02, y: -4, rotate: 1, opacity: 1 },
    { timeMs: 5200, pose: "pointing", scale: 0.95, y: 90, rotate: 2, opacity: 0 },

    // 2. The Emotional Safety Finale (32.2s - 36.3s): Open Palms (Deeply Grounding & Authentic)
    { timeMs: 32200, pose: "open", scale: 0.94, y: 80, rotate: -2, opacity: 0 },
    { timeMs: 32800, pose: "open", scale: 1.06, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 36300, pose: "open", scale: 1.08, y: -6, rotate: 0, opacity: 1 },
  ];

  const isIntro = currentMs >= 0 && currentMs < 5200;
  const isFinale = currentMs >= 32200;
  const isPresenterActive = isIntro || isFinale;

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
            ? "radial-gradient(circle, rgba(16,185,129,0.32) 0%, rgba(244,63,94,0.2) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(99,102,241,0.32) 0%, rgba(244,63,94,0.18) 60%, transparent 80%)",
        }}
      />

      {/* 3. Floating Apple Glass Badge */}
      {isIntro && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(99,102,241,0.25)] border-[5px] border-white z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <Globe className="text-indigo-600 animate-spin" style={{ width: 56, height: 56, animationDuration: "12s" }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 42 }}>
            THE DIGITAL SOLITUDE PARADOX
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
          <HeartHandshake className="text-emerald-500" style={{ width: 56, height: 56 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 42 }}>
            1 REAL PERSON • SAFE HARBOR
          </span>
        </div>
      )}

      {/* 4. Judy Presenter Keyframe Animator */}
      <CharacterKeyframeAnimator keyframes={keyframes} currentMs={currentMs} />
    </div>
  );
};
