import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterKeyframeAnimator, KeyframePoint } from "../../components/CharacterKeyframeAnimator";
import { Sparkles, Brain, HeartHandshake, ShieldAlert, Compass, Target, CheckCircle2 } from "lucide-react";

interface PresenterProps {
  currentMs: number;
}

export const NeuroproductivityPresenter: React.FC<PresenterProps> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Full body keyframes (Intro & Outro)
  const fullBodyKeyframes: KeyframePoint[] = [
    // 1. Intro Hook (0s - 4.5s): Full Body Pointing
    { timeMs: 0, pose: "fullbody_pointing", scale: 0.96, y: 80, rotate: -1, opacity: 0 },
    { timeMs: 350, pose: "fullbody_pointing", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 3900, pose: "fullbody_pointing", scale: 1.02, y: -4, rotate: 0.5, opacity: 1 },
    { timeMs: 4500, pose: "fullbody_pointing", scale: 0.95, y: 90, rotate: 1, opacity: 0 },

    // 8. Finale & Outro (483s - End): Full Body Open -> Casual
    { timeMs: 482500, pose: "fullbody_open", scale: 0.95, y: 80, rotate: -1, opacity: 0 },
    { timeMs: 483200, pose: "fullbody_open", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 512000, pose: "fullbody_casual", scale: 1.03, y: -4, rotate: 0.5, opacity: 1 },
    { timeMs: 530680, pose: "fullbody_casual", scale: 1.05, y: -6, rotate: 0, opacity: 1 },
  ];

  // Bust cutout keyframes (Mid-video explanatory shots)
  const bustKeyframes: KeyframePoint[] = [
    // 2. Discipline Myth (17.0s - 28.0s): Arms Crossed (Analytical)
    { timeMs: 16800, pose: "crossed", scale: 0.94, y: 80, rotate: 1.5, opacity: 0 },
    { timeMs: 17400, pose: "crossed", scale: 1.04, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 27000, pose: "crossed", scale: 1.06, y: -4, rotate: -1, opacity: 1 },
    { timeMs: 28000, pose: "crossed", scale: 0.95, y: 90, rotate: -1.5, opacity: 0 },

    // 3. Patterns Insight (40.0s - 58.5s): Open Palms (Empathetic)
    { timeMs: 39800, pose: "open", scale: 0.94, y: 80, rotate: -1, opacity: 0 },
    { timeMs: 40500, pose: "open", scale: 1.06, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 57500, pose: "open", scale: 1.08, y: -5, rotate: 1, opacity: 1 },
    { timeMs: 58500, pose: "open", scale: 0.95, y: 90, rotate: 1.5, opacity: 0 },

    // 4. Different Mechanism (111.0s - 115.6s): Pointing (Action Directive)
    { timeMs: 110800, pose: "pointing", scale: 0.94, y: 80, rotate: -1, opacity: 0 },
    { timeMs: 111400, pose: "pointing", scale: 1.05, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 114800, pose: "pointing", scale: 1.07, y: -3, rotate: 0.5, opacity: 1 },
    { timeMs: 115600, pose: "pointing", scale: 0.95, y: 90, rotate: 1, opacity: 0 },

    // 5. AuDHD Balance Wisdom (204.0s - 214.5s): Open Palms (Compassionate)
    { timeMs: 203800, pose: "open", scale: 0.94, y: 80, rotate: 1, opacity: 0 },
    { timeMs: 204500, pose: "open", scale: 1.06, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 213500, pose: "open", scale: 1.08, y: -4, rotate: -0.5, opacity: 1 },
    { timeMs: 214500, pose: "open", scale: 0.95, y: 90, rotate: -1, opacity: 0 },

    // 6. Resilient Recovery (388.0s - 399.5s): Arms Crossed to Open Palms
    { timeMs: 387800, pose: "crossed", scale: 0.94, y: 80, rotate: -1.5, opacity: 0 },
    { timeMs: 388500, pose: "crossed", scale: 1.05, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 395000, pose: "open", scale: 1.07, y: -4, rotate: 0.5, opacity: 1 },
    { timeMs: 399500, pose: "open", scale: 0.95, y: 90, rotate: 1, opacity: 0 },

    // 7. Internal Experience (446.0s - 454.0s): Arms Crossed (Analytical)
    { timeMs: 445800, pose: "crossed", scale: 0.94, y: 80, rotate: 1.5, opacity: 0 },
    { timeMs: 446500, pose: "crossed", scale: 1.05, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 453000, pose: "crossed", scale: 1.07, y: -4, rotate: -1, opacity: 1 },
    { timeMs: 454000, pose: "crossed", scale: 0.95, y: 90, rotate: -1.5, opacity: 0 },
  ];

  const isIntro = currentMs >= 0 && currentMs < 4500;
  const isDisciplineReframe = currentMs >= 16800 && currentMs < 28000;
  const isPatternsInsight = currentMs >= 39800 && currentMs < 58500;
  const isDiffMechanism = currentMs >= 110800 && currentMs < 115600;
  const isAuDHDBalance = currentMs >= 203800 && currentMs < 214500;
  const isRecoveryReframe = currentMs >= 387800 && currentMs < 399500;
  const isInternalExp = currentMs >= 445800 && currentMs < 454000;
  const isFinale = currentMs >= 482500;

  const isPresenterActive =
    isIntro ||
    isDisciplineReframe ||
    isPatternsInsight ||
    isDiffMechanism ||
    isAuDHDBalance ||
    isRecoveryReframe ||
    isInternalExp ||
    isFinale;

  const fastSpringConfig = { damping: 18, mass: 0.8, stiffness: 110 };
  const badgeSpring = spring({ frame, fps, config: fastSpringConfig });

  if (!isPresenterActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">

      {/* 2. Soft Ambient Radial Glow Behind Character (left-anchored) */}
      <div
        className="absolute bottom-0 left-[5%] w-[700px] h-[800px] rounded-full pointer-events-none blur-[120px]"
        style={{
          background: isFinale
            ? "radial-gradient(circle, rgba(16,185,129,0.3) 0%, rgba(14,165,233,0.18) 60%, transparent 80%)"
            : isDisciplineReframe
            ? "radial-gradient(circle, rgba(244,63,94,0.25) 0%, rgba(99,102,241,0.18) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(0,113,227,0.3) 0%, rgba(99,102,241,0.18) 60%, transparent 80%)",
        }}
      />

      {/* 3. Floating Left-Third Insight Badge (No avatar overlap) */}
      {isIntro && (
        <div
          className="absolute left-[8%] top-[24%] px-7 py-3.5 rounded-2xl apple-glass flex items-center gap-3.5 shadow-2xl border-2 border-white z-40 max-w-md"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
          }}
        >
          <Sparkles className="w-6 h-6 text-sky-500 shrink-0 animate-spin" style={{ animationDuration: "8s" }} />
          <span className="text-slate-950 font-black text-base tracking-wider uppercase">
            WHY ADVICE SOUNDS SO OBVIOUS
          </span>
        </div>
      )}

      {isDisciplineReframe && (
        <div
          className="absolute left-[8%] top-[24%] px-7 py-3.5 rounded-2xl apple-glass flex items-center gap-3.5 shadow-2xl border-2 border-rose-400 z-40 max-w-md"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
          }}
        >
          <ShieldAlert className="w-6 h-6 text-rose-500 shrink-0" />
          <span className="text-slate-950 font-black text-base tracking-wider uppercase">
            NOT A LACK OF DISCIPLINE
          </span>
        </div>
      )}

      {isPatternsInsight && (
        <div
          className="absolute left-[8%] top-[24%] px-7 py-3.5 rounded-2xl apple-glass flex items-center gap-3.5 shadow-2xl border-2 border-sky-400 z-40 max-w-md"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
          }}
        >
          <Brain className="w-6 h-6 text-[#0071e3] shrink-0 animate-pulse" />
          <span className="text-slate-950 font-black text-base tracking-wider uppercase">
            USEFUL BEHAVIORAL PATTERNS
          </span>
        </div>
      )}

      {isDiffMechanism && (
        <div
          className="absolute left-[8%] top-[24%] px-7 py-3.5 rounded-2xl apple-glass flex items-center gap-3.5 shadow-2xl border-2 border-emerald-400 z-40 max-w-md"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
          }}
        >
          <Target className="w-6 h-6 text-emerald-500 shrink-0" />
          <span className="text-slate-950 font-black text-base tracking-wider uppercase">
            SAME GOAL • DIFFERENT MECHANISM
          </span>
        </div>
      )}

      {isAuDHDBalance && (
        <div
          className="absolute left-[8%] top-[24%] px-7 py-3.5 rounded-2xl apple-glass flex items-center gap-3.5 shadow-2xl border-2 border-indigo-400 z-40 max-w-md"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
          }}
        >
          <Compass className="w-6 h-6 text-indigo-500 shrink-0" />
          <span className="text-slate-950 font-black text-base tracking-wider uppercase">
            PREDICTABLE YET INTERESTING
          </span>
        </div>
      )}

      {isRecoveryReframe && (
        <div
          className="absolute left-[8%] top-[24%] px-7 py-3.5 rounded-2xl apple-glass flex items-center gap-3.5 shadow-2xl border-2 border-emerald-400 z-40 max-w-md"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
          }}
        >
          <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
          <span className="text-slate-950 font-black text-base tracking-wider uppercase">
            RELIABLE RECOVERY SYSTEM
          </span>
        </div>
      )}

      {isInternalExp && (
        <div
          className="absolute left-[8%] top-[24%] px-7 py-3.5 rounded-2xl apple-glass flex items-center gap-3.5 shadow-2xl border-2 border-amber-400 z-40 max-w-md"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
          }}
        >
          <Brain className="w-6 h-6 text-amber-500 shrink-0" />
          <span className="text-slate-950 font-black text-base tracking-wider uppercase">
            FOUR DIFFERENT EXPERIENCES
          </span>
        </div>
      )}

      {isFinale && (
        <div
          className="absolute left-[8%] top-[24%] px-7 py-3.5 rounded-2xl apple-glass flex items-center gap-3.5 shadow-2xl border-2 border-emerald-400 z-40 max-w-md"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
          }}
        >
          <HeartHandshake className="w-6 h-6 text-emerald-500 shrink-0 animate-bounce" />
          <span className="text-slate-950 font-black text-base tracking-wider uppercase">
            FIT STRATEGY TO THE PERSON
          </span>
        </div>
      )}

      {/* 4. Full Body Avatar — Left-Anchored for 16:9 layout */}
      {(isIntro || isFinale) && (
        <div className="absolute bottom-0 left-0">
          <CharacterKeyframeAnimator
            currentMs={currentMs}
            keyframes={fullBodyKeyframes}
            baseWidth={480}
            baseHeight={1080}
            className="-mb-6"
          />
        </div>
      )}

      {/* 5. Bust Cutout Avatar for Mid-Video Explanatory A-Roll */}
      {/* 5. Bust Cutout Avatar — Left-Anchored for Mid-Video A-Roll */}
      {!isIntro && !isFinale && (
        <div className="absolute bottom-0 left-0">
          <CharacterKeyframeAnimator
            currentMs={currentMs}
            keyframes={bustKeyframes}
            baseWidth={480}
            baseHeight={1000}
            className="-mb-6"
          />
        </div>
      )}
    </div>
  );
};
