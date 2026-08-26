import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CharacterKeyframeAnimator, KeyframePoint } from "../../components/CharacterKeyframeAnimator";
import { Sparkles, BatteryCharging, Feather, HeartHandshake, Compass } from "lucide-react";

interface PresenterProps {
  currentMs: number;
}

export const BreaksPresenter: React.FC<PresenterProps> = ({ currentMs }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Multi-pose keyframe tracks for Taking A Break Shorts (47.28s total)
  const keyframes: KeyframePoint[] = [
    // 1. Intro Hook (0s - 5.6s): Pointing Pose
    { timeMs: 0, pose: "pointing", scale: 0.94, y: 80, rotate: -2, opacity: 0 },
    { timeMs: 300, pose: "pointing", scale: 1.0, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 5100, pose: "pointing", scale: 1.02, y: -4, rotate: 1, opacity: 1 },
    { timeMs: 5700, pose: "pointing", scale: 0.95, y: 90, rotate: 2, opacity: 0 },

    // 2. The Reframing (8.2s - 12.3s): Arms Crossed (Analytical & Skeptical)
    { timeMs: 8200, pose: "crossed", scale: 0.94, y: 90, rotate: 2, opacity: 0 },
    { timeMs: 8800, pose: "crossed", scale: 1.04, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 11800, pose: "crossed", scale: 1.06, y: -5, rotate: -1, opacity: 1 },
    { timeMs: 12400, pose: "crossed", scale: 0.95, y: 90, rotate: -2, opacity: 0 },

    // 3. The Disappear Call (19.5s - 24.6s): Open Palms (Compassionate Permission)
    { timeMs: 19500, pose: "open", scale: 0.94, y: 80, rotate: -2, opacity: 0 },
    { timeMs: 20100, pose: "open", scale: 1.05, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 24000, pose: "open", scale: 1.07, y: -5, rotate: 1, opacity: 1 },
    { timeMs: 24700, pose: "open", scale: 0.95, y: 80, rotate: 2, opacity: 0 },

    // 4. Meaningful Finale (38.1s - End): Open Palms (Deep Empathy & Grounding Wisdom)
    { timeMs: 38100, pose: "open", scale: 0.95, y: 70, rotate: 1, opacity: 0 },
    { timeMs: 38700, pose: "open", scale: 1.06, y: 0, rotate: 0, opacity: 1 },
    { timeMs: 47300, pose: "open", scale: 1.08, y: -4, rotate: 0, opacity: 1 },
  ];

  const isIntro = currentMs >= 0 && currentMs < 5700;
  const isReframing = currentMs >= 8200 && currentMs < 12400;
  const isDisappear = currentMs >= 19500 && currentMs < 24700;
  const isFinale = currentMs >= 38100;

  const isPresenterActive = isIntro || isReframing || isDisappear || isFinale;

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
            ? "radial-gradient(circle, rgba(16,185,129,0.35) 0%, rgba(14,165,233,0.2) 60%, transparent 80%)"
            : isDisappear
            ? "radial-gradient(circle, rgba(168,85,247,0.3) 0%, rgba(56,189,248,0.2) 60%, transparent 80%)"
            : isReframing
            ? "radial-gradient(circle, rgba(245,158,11,0.3) 0%, rgba(244,63,94,0.2) 60%, transparent 80%)"
            : "radial-gradient(circle, rgba(16,185,129,0.32) 0%, rgba(0,113,227,0.2) 60%, transparent 80%)",
        }}
      />

      {/* 3. Floating Apple Glass Badge (High Contrast for Mobile) */}
      {isIntro && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(16,185,129,0.22)] border-[5px] border-emerald-300 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <Feather className="text-emerald-500 animate-bounce" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            THE ART OF THE PAUSE
          </span>
        </div>
      )}

      {isReframing && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(245,158,11,0.24)] border-[5px] border-amber-300 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <BatteryCharging className="text-amber-500 animate-pulse" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            NOT LAZY • EXHAUSTED
          </span>
        </div>
      )}

      {isDisappear && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(168,85,247,0.24)] border-[5px] border-purple-300 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <Sparkles className="text-purple-500 animate-spin" style={{ width: 60, height: 60, animationDuration: "10s" }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            TAKE THE PRESSURE OFF
          </span>
        </div>
      )}

      {isFinale && (
        <div
          className="absolute top-[13%] apple-glass flex items-center shadow-[0_30px_70px_rgba(16,185,129,0.28)] border-[5px] border-emerald-400 z-40"
          style={{
            transform: `translateY(${(1 - badgeSpring) * -20}px) scale(${0.96 + badgeSpring * 0.04})`,
            padding: "26px 60px",
            borderRadius: 48,
            gap: 24,
          }}
        >
          <HeartHandshake className="text-emerald-500 animate-pulse" style={{ width: 60, height: 60 }} />
          <span className="text-slate-950 font-black tracking-wider uppercase" style={{ fontSize: 44 }}>
            REST UNTIL YOU WANT TO RETURN
          </span>
        </div>
      )}

      {/* 4. Animated Character with Keyframe Engine */}
      <CharacterKeyframeAnimator
        currentMs={currentMs}
        keyframes={keyframes}
        baseWidth={780}
        baseHeight={1200}
        className="-mb-6"
      />
    </div>
  );
};
