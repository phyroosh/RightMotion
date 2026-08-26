import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterKeyframeAnimator, KeyframePoint } from "../../components/CharacterKeyframeAnimator";
import { Sparkles, Brain, HeartHandshake, CheckCircle2, ShieldAlert } from "lucide-react";

interface PresenterProps {
  currentMs: number;
}

export const ProcrastinationPresenter: React.FC<PresenterProps> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Multi-pose keyframe tracks for Long-Form Video Essay (558.14s total)
  const keyframes: KeyframePoint[] = [
    // 1. Intro Hook (0s - 12s): Pointing
    { timeMs: 0, pose: "pointing", scale: 0.94, y: 90, rotate: -2, opacity: 0 },
    { timeMs: 400, pose: "pointing", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 11000, pose: "pointing", scale: 1.02, y: -4, rotate: 1, opacity: 1 },
    { timeMs: 12000, pose: "pointing", scale: 0.95, y: 100, rotate: 2, opacity: 0 },

    // 2. The "I'm Just Lazy" Excuse (34s - 42s): Arms Crossed (Skeptical / Analytical)
    { timeMs: 33800, pose: "crossed", scale: 0.94, y: 90, rotate: 2, opacity: 0 },
    { timeMs: 34400, pose: "crossed", scale: 1.04, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 41000, pose: "crossed", scale: 1.06, y: -6, rotate: -1, opacity: 1 },
    { timeMs: 42000, pose: "crossed", scale: 0.95, y: 90, rotate: -2, opacity: 0 },

    // 3. The Core Revelation (42s - 57s): Open Palms (Empathetic / Reframe)
    { timeMs: 41800, pose: "open", scale: 0.94, y: 80, rotate: -2, opacity: 0 },
    { timeMs: 42500, pose: "open", scale: 1.08, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 55800, pose: "open", scale: 1.10, y: -6, rotate: 1, opacity: 1 },
    { timeMs: 57000, pose: "open", scale: 0.95, y: 90, rotate: 2, opacity: 0 },

    // 4. The 11:47 PM Insight (290s - 309s): Arms Crossed (Analytical)
    { timeMs: 289800, pose: "crossed", scale: 0.94, y: 90, rotate: 2, opacity: 0 },
    { timeMs: 290500, pose: "crossed", scale: 1.04, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 307800, pose: "crossed", scale: 1.06, y: -6, rotate: -1, opacity: 1 },
    { timeMs: 309080, pose: "crossed", scale: 0.95, y: 90, rotate: -2, opacity: 0 },

    // 5. The 5-Minute Discomfort Rule (435s - 479s): Pointing (Action Directive)
    { timeMs: 434800, pose: "pointing", scale: 0.94, y: 80, rotate: -2, opacity: 0 },
    { timeMs: 435500, pose: "pointing", scale: 1.08, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 477000, pose: "pointing", scale: 1.10, y: -6, rotate: 1, opacity: 1 },
    { timeMs: 478960, pose: "pointing", scale: 0.95, y: 80, rotate: 2, opacity: 0 },

    // 6. Finale & Compassionate Wisdom (515s - End): Arms Crossed transitioning to Open Palms!
    { timeMs: 514800, pose: "crossed", scale: 0.95, y: 80, rotate: 1, opacity: 0 },
    { timeMs: 515500, pose: "crossed", scale: 1.06, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 535000, pose: "open", scale: 1.08, y: -4, rotate: 0, opacity: 1 },
    { timeMs: 558140, pose: "open", scale: 1.10, y: -6, rotate: 0, opacity: 1 },
  ];

  const isIntro = currentMs >= 0 && currentMs < 12000;
  const isLazyExcuse = currentMs >= 33800 && currentMs < 42000;
  const isCoreRev = currentMs >= 41800 && currentMs < 57000;
  const isLateNightInsight = currentMs >= 289800 && currentMs < 309080;
  const isFiveMinRule = currentMs >= 434800 && currentMs < 478960;
  const isFinale = currentMs >= 514800;

  const isPresenterActive =
    isIntro || isLazyExcuse || isCoreRev || isLateNightInsight || isFiveMinRule || isFinale;

  const fastSpringConfig = { damping: 18, mass: 0.8, stiffness: 110 };
  const badgeSpring = spring({ frame, fps, config: fastSpringConfig });

  if (!isPresenterActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col items-center justify-end overflow-hidden">
      {/* 1. Full 16:9 Frosted Glass Blur Backdrop Overlay */}
      <div className="absolute inset-0 backdrop-blur-3xl bg-white/40 pointer-events-none transition-all duration-500" />

      {/* 2. Soft Ambient Radial Light Halo Behind Character */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1100px] h-[900px] rounded-full pointer-events-none blur-[140px]"
        style={{
          background: isFinale
            ? "radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(14,165,233,0.18) 60%, transparent 80%)"
            : isCoreRev || isFiveMinRule
            ? "radial-gradient(circle, rgba(0,113,227,0.3) 0%, rgba(99,102,241,0.18) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(14,165,233,0.3) 0%, rgba(99,102,241,0.18) 60%, transparent 80%)",
        }}
      />

      {/* 3. Floating Left-Third Insight Pills (No avatar overlap) */}
      {isIntro && (
        <div
          className="absolute left-[8%] top-[26%] px-7 py-3.5 rounded-2xl apple-glass flex items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.08)] border-2 border-white z-40 max-w-md"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
          }}
        >
          <Sparkles className="w-6 h-6 text-sky-500 shrink-0 animate-spin" style={{ animationDuration: "8s" }} />
          <span className="text-slate-950 font-black text-base tracking-wider uppercase">
            THE HIDDEN ANATOMY OF PROCRASTINATION
          </span>
        </div>
      )}

      {isLazyExcuse && (
        <div
          className="absolute left-[8%] top-[26%] px-7 py-3.5 rounded-2xl apple-glass flex items-center gap-3 shadow-[0_20px_50px_rgba(244,63,94,0.15)] border-2 border-rose-300 z-40 max-w-md"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
          }}
        >
          <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0" />
          <span className="text-slate-950 font-black text-base tracking-wider uppercase">
            THE "I'M JUST LAZY" TRAP
          </span>
        </div>
      )}

      {isCoreRev && (
        <div
          className="absolute left-[8%] top-[26%] px-7 py-3.5 rounded-2xl apple-glass flex items-center gap-3 shadow-[0_20px_50px_rgba(0,113,227,0.18)] border-2 border-[#0071e3]/50 z-40 max-w-md"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
          }}
        >
          <Brain className="w-6 h-6 text-[#0071e3] shrink-0 animate-pulse" />
          <span className="text-slate-950 font-black text-base tracking-wider uppercase">
            NOT THE TASK • HOW IT MAKES YOU FEEL
          </span>
        </div>
      )}

      {isFiveMinRule && (
        <div
          className="absolute left-[8%] top-[26%] px-7 py-3.5 rounded-2xl apple-glass flex items-center gap-3 shadow-[0_20px_50px_rgba(16,185,129,0.18)] border-2 border-emerald-400 z-40 max-w-md"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
          }}
        >
          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          <span className="text-slate-950 font-black text-base tracking-wider uppercase">
            FEEL UNCOMFORTABLE AND BEGIN ANYWAY
          </span>
        </div>
      )}

      {isFinale && (
        <div
          className="absolute left-[8%] top-[26%] px-7 py-3.5 rounded-2xl apple-glass flex items-center gap-3 shadow-[0_20px_50px_rgba(16,185,129,0.2)] border-2 border-emerald-400 z-40 max-w-md"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
          }}
        >
          <HeartHandshake className="w-6 h-6 text-emerald-500 shrink-0 animate-bounce" />
          <span className="text-slate-950 font-black text-base tracking-wider uppercase">
            HONEST WITH YOUR FEELINGS
          </span>
        </div>
      )}

      {/* 4. Hero Avatar Presenter with Keyframe Animator Engine */}
      <CharacterKeyframeAnimator
        currentMs={currentMs}
        keyframes={keyframes}
        baseWidth={900}
        baseHeight={1080}
        className="-mb-8"
      />
    </div>
  );
};
