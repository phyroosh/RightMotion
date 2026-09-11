import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TacticalMemeCard } from "../../components/TacticalMemeCard";
import { MemeStickerOverlay } from "../../components/MemeStickerOverlay";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * 🎬 BESPOKE MOTION DESIGN CANVAS: HowToRuinYourTeensCanvas
 * Built according to the authoritative RightMotion specification (Rule 5.8, 5.8a, 5.18):
 * - ZERO pill badges, capsule labels, or dashboard list rows.
 * - MAXIMUM 3 distinct text elements per screen.
 * - MAXIMUM 2 visual objects per screen.
 * - Hero slam words: 80–110px Montserrat Black.
 * - Scene headlines: 56–72px Montserrat Bold minimum.
 * - Supporting lines: 40–48px Montserrat Bold.
 * - Absolute floor: 40px (never below 36px).
 * - Safe zone: strictly top 8% to top 68% (captions live at 73%–81%).
 */
export const HowToRuinYourTeensCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden select-none font-sans pointer-events-none">
      {/* ========================================================================= */}
      {/* ── SCENE 1: HOOK & PARADOX (Frames 0 - 110) ────────────────────────────── */}
      {/* ========================================================================= */}
      {frame >= 0 && frame < 111 && (() => {
        // Meme runs 0-46 frames at top.
        // Paradox typography appears at frame 48 in upper safe zone above Judy.
        const spr = spring({ frame: frame - 48, fps, config: { damping: 14, stiffness: 120 } });
        const opacity = interpolate(frame, [46, 52], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const y = interpolate(spr, [0, 1], [35, 0]);

        return (
          <div className="absolute inset-0 flex flex-col items-center">
            {frame >= 46 && (
              <div
                className="absolute w-[940px] top-[14%] flex flex-col items-center text-center"
                style={{ opacity, transform: `translateY(${y}px)` }}
              >
                {/* Text Element 1: Headline (56px) */}
                <div className="text-[56px] font-extrabold text-slate-800 tracking-tight mb-2">
                  THE FASTEST WAY TO RUIN:
                </div>

                {/* Text Element 2: Hero Slam (104px) */}
                <div className="text-[104px] leading-none font-black text-rose-600 tracking-tight mb-4">
                  EFFORTLESS.
                </div>

                {/* Text Element 3: Supporting Line (42px) */}
                <div className="text-[42px] font-bold text-slate-500 tracking-tight">
                  Zero friction guarantees atrophy.
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* ── SCENE 2: THE 4 TRAPS ─ KINETIC HERO SEQUENCE (Frames 111 - 340) ──────── */}
      {/* ========================================================================= */}
      {frame >= 111 && frame < 342 && (() => {
        const exitOpacity = interpolate(frame, [330, 342], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        // Beat 2A: Instant Dopamine (111 - 175)
        // Beat 2B: Avoid Difficult (175 - 225)
        // Beat 2C: Sleep Whenever (225 - 265)
        // Beat 2D: Infinite Scroll (265 - 340)
        return (
          <div
            className="absolute top-[8%] h-[60%] w-full flex flex-col items-center justify-center text-center px-12"
            style={{ opacity: exitOpacity }}
          >
            {/* 2A: INSTANT DOPAMINE */}
            {frame >= 111 && frame < 175 && (() => {
              const spr = spring({ frame: frame - 111, fps, config: { damping: 12, stiffness: 140 } });
              return (
                <div
                  className="flex flex-col items-center"
                  style={{
                    opacity: interpolate(spr, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(spr, [0, 1], [0.9, 1])}) translateY(${interpolate(spr, [0, 1], [40, 0])}px)`,
                  }}
                >
                  <div className="text-[140px] mb-4 leading-none">⚡</div>
                  <div className="text-[96px] leading-[1.05] font-black text-rose-600 tracking-tight mb-4">
                    INSTANT DOPAMINE
                  </div>
                  <div className="text-[44px] font-bold text-slate-700 tracking-tight max-w-[840px]">
                    Conditioning circuits to reject deep focus.
                  </div>
                </div>
              );
            })()}

            {/* 2B: AVOID DIFFICULT */}
            {frame >= 175 && frame < 225 && (() => {
              const spr = spring({ frame: frame - 175, fps, config: { damping: 12, stiffness: 140 } });
              return (
                <div
                  className="flex flex-col items-center"
                  style={{
                    opacity: interpolate(spr, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(spr, [0, 1], [0.9, 1])}) translateY(${interpolate(spr, [0, 1], [40, 0])}px)`,
                  }}
                >
                  <div className="text-[140px] mb-4 leading-none">🛡️</div>
                  <div className="text-[96px] leading-[1.05] font-black text-amber-500 tracking-tight mb-4">
                    AVOID FRICTION
                  </div>
                  <div className="text-[44px] font-bold text-slate-700 tracking-tight max-w-[840px]">
                    Zero cognitive load starves mental resilience.
                  </div>
                </div>
              );
            })()}

            {/* 2C: CIRCADIAN CHAOS */}
            {frame >= 225 && frame < 265 && (() => {
              const spr = spring({ frame: frame - 225, fps, config: { damping: 12, stiffness: 140 } });
              return (
                <div
                  className="flex flex-col items-center"
                  style={{
                    opacity: interpolate(spr, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(spr, [0, 1], [0.9, 1])}) translateY(${interpolate(spr, [0, 1], [40, 0])}px)`,
                  }}
                >
                  <div className="text-[140px] mb-4 leading-none">🌙</div>
                  <div className="text-[96px] leading-[1.05] font-black text-indigo-600 tracking-tight mb-4">
                    CIRCADIAN CHAOS
                  </div>
                  <div className="text-[44px] font-bold text-slate-700 tracking-tight max-w-[840px]">
                    Sleep whenever you want. Destroy recovery.
                  </div>
                </div>
              );
            })()}

            {/* 2D: INFINITE SCROLL */}
            {frame >= 265 && frame < 342 && (() => {
              const spr = spring({ frame: frame - 265, fps, config: { damping: 12, stiffness: 140 } });
              return (
                <div
                  className="flex flex-col items-center"
                  style={{
                    opacity: interpolate(spr, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(spr, [0, 1], [0.9, 1])}) translateY(${interpolate(spr, [0, 1], [40, 0])}px)`,
                  }}
                >
                  <div className="text-[140px] mb-4 leading-none">📱</div>
                  <div className="text-[96px] leading-[1.05] font-black text-rose-600 tracking-tight mb-4">
                    INFINITE SCROLL
                  </div>
                  <div className="text-[44px] font-bold text-slate-700 tracking-tight max-w-[840px]">
                    Trading real craft for algorithmic feeds.
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* ── SCENE 3: NEURAL PLASTICITY & THE HARDWIRING LOOP (Frames 340 - 555) ─── */}
      {/* ========================================================================= */}
      {frame >= 340 && frame < 558 && (() => {
        const exitOpacity = interpolate(frame, [544, 558], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        // 340 - 438: Adolescence neural plasticity intro
        // 439 - 555: Easier to repeat vs Harder to escape divergence
        const introSpr = spring({ frame: frame - 340, fps, config: { damping: 14, stiffness: 120 } });
        const branch1Spr = spring({ frame: frame - 478, fps, config: { damping: 12, stiffness: 140 } });
        const branch2Spr = spring({ frame: frame - 522, fps, config: { damping: 12, stiffness: 140 } });

        return (
          <div
            className="absolute top-[8%] h-[60%] w-full flex flex-col items-center justify-center text-center px-8"
            style={{ opacity: exitOpacity }}
          >
            {/* 3A: NEURAL PLASTICITY (340 - 438) */}
            {frame < 439 && (
              <div
                className="flex flex-col items-center"
                style={{
                  opacity: interpolate(introSpr, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(introSpr, [0, 1], [30, 0])}px)`,
                }}
              >
                <div className="text-[48px] font-bold text-slate-400 tracking-wider mb-2">
                  DEVELOPMENTAL REALITY:
                </div>
                <div className="text-[92px] leading-[1.05] font-black text-indigo-600 tracking-tight mb-6">
                  NEURAL PLASTICITY
                </div>
                <div className="text-[44px] font-bold text-slate-700 max-w-[860px]">
                  What you repeat right now becomes permanent hardware.
                </div>
              </div>
            )}

            {/* 3B: THE DIVERGENCE FORK (439 - 558) */}
            {frame >= 439 && (
              <div className="w-[960px] flex flex-col items-center gap-6">
                {/* Branch 1: EASIER TO REPEAT */}
                <div
                  className="w-full glass-tile rounded-[36px] p-8 flex flex-col items-center text-center border-2 border-emerald-500 shadow-xl"
                  style={{
                    opacity: interpolate(frame, [439, 452], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                    transform: frame >= 478 ? `scale(${interpolate(branch1Spr, [0, 1], [0.96, 1])})` : "scale(0.96)",
                  }}
                >
                  <div className="text-[38px] font-extrabold text-slate-400 mb-1">
                    REPEATED BEHAVIORS BECOME:
                  </div>
                  <div className="text-[76px] leading-tight font-black text-emerald-600 tracking-tight">
                    EASIER TO REPEAT
                  </div>
                </div>

                {/* Branch 2: HARDER TO ESCAPE */}
                <div
                  className="w-full glass-tile rounded-[36px] p-8 flex flex-col items-center text-center border-2 border-rose-500 shadow-xl"
                  style={{
                    opacity: interpolate(frame, [505, 520], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                    transform: frame >= 522 ? `scale(${interpolate(branch2Spr, [0, 1], [0.96, 1])})` : "scale(0.96)",
                  }}
                >
                  <div className="text-[38px] font-extrabold text-slate-400 mb-1">
                    DEFAULT LOOPS BECOME:
                  </div>
                  <div className="text-[76px] leading-tight font-black text-rose-600 tracking-tight">
                    HARDER TO ESCAPE
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* ── SCENE 4: THE PARADIGM SHIFT ─ DEMAND GROWTH (Frames 555 - 665) ──────── */}
      {/* ========================================================================= */}
      {frame >= 555 && frame < 668 && (() => {
        const exitOpacity = interpolate(frame, [652, 668], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        // 555 - 605: "The fix is brutally simple"
        // 606 - 665: "make your environment demand growth"
        const fixSpr = spring({ frame: frame - 555, fps, config: { damping: 14, stiffness: 120 } });
        const demandSpr = spring({ frame: frame - 606, fps, config: { damping: 12, stiffness: 140 } });

        return (
          <div
            className="absolute top-[8%] h-[60%] w-full flex flex-col items-center justify-center text-center px-8"
            style={{ opacity: exitOpacity }}
          >
            {/* 4A: THE FIX IS BRUTALLY SIMPLE */}
            {frame < 606 && (
              <div
                className="flex flex-col items-center"
                style={{
                  opacity: interpolate(fixSpr, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(fixSpr, [0, 1], [30, 0])}px)`,
                }}
              >
                <div className="text-[52px] font-bold text-slate-400 mb-2">
                  THE FIX IS:
                </div>
                <div className="text-[104px] leading-none font-black text-slate-900 tracking-tight">
                  BRUTALLY SIMPLE.
                </div>
              </div>
            )}

            {/* 4B: DEMAND GROWTH */}
            {frame >= 606 && (
              <div
                className="w-[940px] glass-tile rounded-[40px] p-10 flex flex-col items-center text-center shadow-2xl border-2 border-slate-900"
                style={{
                  opacity: interpolate(frame, [606, 616], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  transform: `scale(${interpolate(demandSpr, [0, 1], [0.94, 1])})`,
                }}
              >
                <div className="text-[44px] font-bold text-slate-500 mb-3">
                  STOP RELYING ON WILLPOWER
                </div>
                <div className="text-[76px] leading-[1.08] font-black text-slate-900 tracking-tight mb-6">
                  MAKE ENVIRONMENT{" "}
                  <span className="text-emerald-600 block">DEMAND GROWTH.</span>
                </div>
                <div className="text-[40px] font-bold text-slate-600">
                  Engineer friction on distractions.
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* ── SCENE 5: THE 5 NON-NEGOTIABLES ─ RAPID SLAM SEQUENCE (665 - 855) ────── */}
      {/* ========================================================================= */}
      {frame >= 665 && frame < 858 && (() => {
        const exitOpacity = interpolate(frame, [844, 858], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        // Beat 5A: Protect sleep (672 - 695)
        // Beat 5B: Limit feeds (695 - 742)
        // Beat 5C: Exercise (742 - 774)
        // Beat 5D: One difficult skill (774 - 822)
        // Beat 5E: Tolerate boredom (822 - 858)
        return (
          <div
            className="absolute top-[8%] h-[60%] w-full flex flex-col items-center justify-center text-center px-10"
            style={{ opacity: exitOpacity }}
          >
            {/* 5A: PROTECT SLEEP */}
            {frame >= 665 && frame < 695 && (() => {
              const spr = spring({ frame: frame - 672, fps, config: { damping: 12, stiffness: 140 } });
              return (
                <div
                  className="flex flex-col items-center"
                  style={{
                    opacity: interpolate(spr, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(spr, [0, 1], [0.9, 1])}) translateY(${interpolate(spr, [0, 1], [30, 0])}px)`,
                  }}
                >
                  <div className="text-[130px] mb-3 leading-none">🌙</div>
                  <div className="text-[96px] leading-tight font-black text-indigo-600 tracking-tight mb-3">
                    PROTECT SLEEP
                  </div>
                  <div className="text-[44px] font-bold text-slate-700">
                    8.5 Hours Locked • Zero Phones in Bed
                  </div>
                </div>
              );
            })()}

            {/* 5B: LIMIT FEEDS */}
            {frame >= 695 && frame < 742 && (() => {
              const spr = spring({ frame: frame - 695, fps, config: { damping: 12, stiffness: 140 } });
              return (
                <div
                  className="flex flex-col items-center"
                  style={{
                    opacity: interpolate(spr, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(spr, [0, 1], [0.9, 1])}) translateY(${interpolate(spr, [0, 1], [30, 0])}px)`,
                  }}
                >
                  <div className="text-[130px] mb-3 leading-none">📵</div>
                  <div className="text-[96px] leading-tight font-black text-rose-500 tracking-tight mb-3">
                    LIMIT FEEDS
                  </div>
                  <div className="text-[44px] font-bold text-slate-700">
                    Hard App Limits • Greyscale Display
                  </div>
                </div>
              );
            })()}

            {/* 5C: DAILY EXERCISE */}
            {frame >= 742 && frame < 774 && (() => {
              const spr = spring({ frame: frame - 742, fps, config: { damping: 12, stiffness: 140 } });
              return (
                <div
                  className="flex flex-col items-center"
                  style={{
                    opacity: interpolate(spr, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(spr, [0, 1], [0.9, 1])}) translateY(${interpolate(spr, [0, 1], [30, 0])}px)`,
                  }}
                >
                  <div className="text-[130px] mb-3 leading-none">⚡</div>
                  <div className="text-[96px] leading-tight font-black text-amber-500 tracking-tight mb-3">
                    DAILY EXERCISE
                  </div>
                  <div className="text-[44px] font-bold text-slate-700">
                    Heavy Resistance • Elevate BDNF
                  </div>
                </div>
              );
            })()}

            {/* 5D: ONE HARD SKILL */}
            {frame >= 774 && frame < 822 && (() => {
              const spr = spring({ frame: frame - 774, fps, config: { damping: 12, stiffness: 140 } });
              return (
                <div
                  className="flex flex-col items-center"
                  style={{
                    opacity: interpolate(spr, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(spr, [0, 1], [0.9, 1])}) translateY(${interpolate(spr, [0, 1], [30, 0])}px)`,
                  }}
                >
                  <div className="text-[130px] mb-3 leading-none">🛠️</div>
                  <div className="text-[92px] leading-tight font-black text-emerald-600 tracking-tight mb-3">
                    ONE HARD SKILL
                  </div>
                  <div className="text-[44px] font-bold text-slate-700">
                    Code, Craft, Math • 60m Deep Focus
                  </div>
                </div>
              );
            })()}

            {/* 5E: TOLERATE BOREDOM */}
            {frame >= 822 && frame < 858 && (() => {
              const spr = spring({ frame: frame - 822, fps, config: { damping: 12, stiffness: 140 } });
              return (
                <div
                  className="flex flex-col items-center"
                  style={{
                    opacity: interpolate(spr, [0, 1], [0, 1]),
                    transform: `scale(${interpolate(spr, [0, 1], [0.9, 1])}) translateY(${interpolate(spr, [0, 1], [30, 0])}px)`,
                  }}
                >
                  <div className="text-[130px] mb-3 leading-none">🧘</div>
                  <div className="text-[88px] leading-tight font-black text-teal-600 tracking-tight mb-3">
                    TOLERATE BOREDOM
                  </div>
                  <div className="text-[44px] font-bold text-slate-700">
                    Zero Stimulation • Upregulate Baseline
                  </div>
                </div>
              );
            })()}
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* ── SCENE 6: THE DECISIVE CLOSER (Frames 855 - 1016) ────────────────────── */}
      {/* ========================================================================= */}
      {frame >= 855 && (() => {
        // 857 - 935: "Your teenage years do not disappear overnight"
        // 935 - 1016: "they disappear one comfortable decision at a time."
        const spr1 = spring({ frame: frame - 857, fps, config: { damping: 14, stiffness: 120 } });
        const spr2 = spring({ frame: frame - 935, fps, config: { damping: 12, stiffness: 140 } });

        return (
          <div className="absolute top-[8%] h-[60%] w-full flex flex-col items-center justify-center text-center px-8">
            {/* 6A: NOT OVERNIGHT (855 - 935) */}
            {frame < 935 && (
              <div
                className="flex flex-col items-center"
                style={{
                  opacity: interpolate(spr1, [0, 1], [0, 1]),
                  transform: `translateY(${interpolate(spr1, [0, 1], [30, 0])}px)`,
                }}
              >
                <div className="text-[52px] font-bold text-slate-400 mb-3">
                  YOUR PRIME YEARS:
                </div>
                <div className="text-[88px] leading-none font-black text-slate-400 line-through tracking-tight mb-4">
                  DO NOT DISAPPEAR OVERNIGHT.
                </div>
                <div className="text-[42px] font-bold text-slate-500">
                  No sudden catastrophe occurs.
                </div>
              </div>
            )}

            {/* 6B: ONE COMFORTABLE DECISION AT A TIME (935 - 1016) */}
            {frame >= 935 && (
              <div
                className="flex flex-col items-center"
                style={{
                  opacity: interpolate(frame, [935, 945], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
                  transform: `scale(${interpolate(spr2, [0, 1], [0.94, 1])})`,
                }}
              >
                <div className="text-[56px] font-bold text-slate-600 mb-2">
                  THEY DISAPPEAR
                </div>
                <div className="text-[96px] leading-[1.05] font-black text-rose-600 tracking-tight mb-1">
                  ONE COMFORTABLE
                </div>
                <div className="text-[88px] leading-[1.05] font-black text-slate-900 tracking-tight mb-6">
                  DECISION AT A TIME.
                </div>
                <div className="text-[44px] font-extrabold text-slate-900 px-8 py-3 rounded-full bg-slate-100 border border-slate-300">
                  CHOOSE YOUR FRICTION TODAY.
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* ── TACTICAL RETENTION MEME POP (< 2.0s Hook Frame 0) ──────────────────── */}
      {/* ========================================================================= */}
      <TacticalMemeCard
        memeId="walter_white_despair"
        startFrame={0}
        durationFrames={46}
        playbackRate={1.35}
        hudLabel="CATASTROPHIC COLLAPSE // ROCK BOTTOM"
        theme="apple_studio"
        position="top"
      />

      {/* ========================================================================= */}
      {/* ── MID-VIDEO GEN-Z REACTION STICKER POP ───────────────────────────────── */}
      {/* ========================================================================= */}
      <MemeStickerOverlay
        stickerId="toddler_head_panic"
        startFrame={146}
        durationFrames={34}
        position="center-right"
        badgeText="PANIC MODE"
      />
    </div>
  );
};
