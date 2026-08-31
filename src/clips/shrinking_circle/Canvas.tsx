import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ProCutout } from "../../components/ProCutout";
import { WordTimestamp } from "../../types";
import {
  Sparkles,
  AlertCircle,
  HeartHandshake,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Scale,
  TrendingUp
} from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const ShrinkingCircleCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Timings matched to en-US-AvaMultilingualNeural:
  // Scene 1: 5,200ms - 14,800ms (The 3 Value Pillars of True Friends)
  // Scene 2: 14,800ms - 19,200ms (The 20 Fake Friends Contrast Metric)
  // Scene 3: 19,200ms - 24,800ms (The Growth Filter / Solitude)
  // Scene 4: 24,800ms - 28,800ms (Reclaiming Peace Revelation)
  const isScene1 = currentMs >= 5200 && currentMs < 14800;
  const isScene2 = currentMs >= 14800 && currentMs < 19200;
  const isScene3 = currentMs >= 19200 && currentMs < 24800;
  const isScene4 = currentMs >= 24800 && currentMs < 28800;

  const sp = (delayMs: number, d = 20, s = 95, m = 0.85) => {
    const df = Math.floor((delayMs / 1000) * fps);
    return spring({
      frame: Math.max(0, frame - df),
      fps,
      config: { damping: d, stiffness: s, mass: m },
    });
  };

  if (!isScene1 && !isScene2 && !isScene3 && !isScene4) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden flex flex-col items-center justify-center px-6">
      {/* ─────────────────────────────────────────────────────────────
          SCENE 1: THE 3 PILLARS OF TRUE CIRCLE (5.2s - 14.8s)
          "Honestly you don't need a huge circle... A few genuine friends who respect you, support you, and want you to grow..."
      ───────────────────────────────────────────────────────────── */}
      {isScene1 && (() => {
        const sEnter = sp(5200);
        // 3 Pillars dropping sequentially with Ava's spoken words
        const sPillar1 = sp(10600); // 10.6s: "respect you"
        const sPillar2 = sp(11800); // 11.8s: "support you"
        const sPillar3 = sp(13400); // 13.4s: "want to see you grow"

        const sExit = currentMs >= 14400 ? sp(14400, 18, 110, 0.8) : 0;
        const exitY = sExit * -50;
        const exitOpacity = 1 - sExit * 1.2;

        return (
          <div
            className="w-full max-w-[1020px] flex flex-col items-center gap-7"
            style={{
              transform: `translateY(${exitY}px)`,
              opacity: Math.max(0, Math.min(1, exitOpacity)),
            }}
          >
            {/* Ghost Background Headline */}
            <div className="absolute -top-36 text-[280px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase pointer-events-none select-none">
              PILLARS
            </div>

            {/* Stage Header Badge (Mobile High-Visibility) */}
            <div
              className="px-12 py-4 rounded-full glass-tile-dark text-emerald-400 font-mono text-[26px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl"
              style={{
                transform: `translateY(${(1 - sEnter) * -20}px)`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <HeartHandshake className="w-8 h-8 text-emerald-400" />
              STAGE 01 &bull; THE GENUINE CIRCLE
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </div>

            {/* Glassmorphic Translucent Hero Card */}
            <div
              className="w-full rounded-[56px] p-9 glass-tile flex items-center gap-9"
              style={{
                transform: `translateY(${(1 - sEnter) * 45}px) scale(${0.94 + sEnter * 0.06})`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              {/* Cutout Visual Anchor */}
              <div className="w-60 h-60 shrink-0">
                <ProCutout
                  assetId="friendship_comfort_support"
                  glowColor="emerald"
                  animation="punch_in"
                  annotation="REAL ALLIES"
                  annotationPosition="top-right"
                  width="100%"
                  height="100%"
                />
              </div>

              {/* 3 Sequential Value Pillars (Large Mobile Typography) */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="text-[38px] font-black text-slate-950 uppercase tracking-tight mb-1">
                  The 3 Core Traits
                </div>

                {/* Pillar 01: Respects You */}
                <div
                  className="p-5 rounded-2xl glass-pill-emerald text-emerald-950 font-black text-[26px] flex items-center gap-4"
                  style={{
                    transform: `translateY(${(1 - sPillar1) * 20}px) scale(${0.95 + sPillar1 * 0.05})`,
                    opacity: Math.min(1, sPillar1 * 1.5),
                  }}
                >
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                  <span>01. Respects Your Boundaries</span>
                </div>

                {/* Pillar 02: Supports You */}
                <div
                  className="p-5 rounded-2xl glass-pill-sky text-sky-950 font-black text-[26px] flex items-center gap-4"
                  style={{
                    transform: `translateY(${(1 - sPillar2) * 20}px) scale(${0.95 + sPillar2 * 0.05})`,
                    opacity: Math.min(1, sPillar2 * 1.5),
                  }}
                >
                  <CheckCircle2 className="w-8 h-8 text-sky-600 shrink-0" />
                  <span>02. Unconditional Support</span>
                </div>

                {/* Pillar 03: Wants You to Grow */}
                <div
                  className="p-5 rounded-2xl glass-pill-indigo text-indigo-950 font-black text-[26px] flex items-center gap-4"
                  style={{
                    transform: `translateY(${(1 - sPillar3) * 20}px) scale(${0.95 + sPillar3 * 0.05})`,
                    opacity: Math.min(1, sPillar3 * 1.5),
                  }}
                >
                  <TrendingUp className="w-8 h-8 text-indigo-600 shrink-0" />
                  <span>03. Celebrates Your Growth</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─────────────────────────────────────────────────────────────
          SCENE 2: THE 20 FAKE FRIENDS CONTRAST (14.8s - 19.2s)
          "...are worth way more than 20 people who only make you feel included when you're useful to them."
      ───────────────────────────────────────────────────────────── */}
      {isScene2 && (() => {
        const sEnter = sp(14800);
        const sWarning = sp(16800);
        const sExit = currentMs >= 18800 ? sp(18800, 18, 110, 0.8) : 0;
        const exitY = sExit * -50;
        const exitOpacity = 1 - sExit * 1.2;

        return (
          <div
            className="w-full max-w-[1020px] flex flex-col items-center gap-7"
            style={{
              transform: `translateY(${exitY}px)`,
              opacity: Math.max(0, Math.min(1, exitOpacity)),
            }}
          >
            {/* Ghost Background Headline */}
            <div className="absolute -top-36 text-[280px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase pointer-events-none select-none">
              VALUE
            </div>

            {/* Dynamic Value Scale Header Metric */}
            <div
              className="px-12 py-4 rounded-full glass-tile-dark text-amber-300 font-mono text-[26px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl"
              style={{
                transform: `translateY(${(1 - sEnter) * -20}px)`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <Scale className="w-8 h-8 text-amber-400" />
              <span>3 TRUE ALLIES &gt;&gt;&gt; 20 DRAMA FRIENDS</span>
            </div>

            {/* Glassmorphic Contrast Problem Card */}
            <div
              className="w-full rounded-[56px] p-9 glass-tile flex items-center gap-9"
              style={{
                transform: `translateY(${(1 - sEnter) * 45}px) scale(${0.94 + sEnter * 0.06})`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              {/* Problem Cutout */}
              <div className="w-60 h-60 shrink-0">
                <ProCutout
                  assetId="peer_pressure_criticism"
                  glowColor="rose"
                  animation="punch_in"
                  annotation="THE TRAP"
                  annotationPosition="top-right"
                  width="100%"
                  height="100%"
                />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="text-[44px] font-black text-slate-950 uppercase tracking-tight leading-tight">
                  The Conditional Circle
                </div>
                <div className="text-[28px] font-bold text-slate-800 leading-snug">
                  Twenty people who only make you feel included when convenient.
                </div>

                {/* Diagnostic Warning Pill (Mobile Big Bold Scale) */}
                <div
                  className="p-5 rounded-2xl glass-pill-rose text-rose-950 font-black text-[26px] flex items-center gap-4"
                  style={{
                    transform: `scale(${0.95 + sWarning * 0.05})`,
                    opacity: Math.min(1, sWarning * 1.5),
                  }}
                >
                  <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" />
                  <span>"Only Included When You're Useful"</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─────────────────────────────────────────────────────────────
          SCENE 3: THE GROWTH FILTER & SOLITUDE (19.2s - 24.8s)
          "And yeah, shrinking your circle can feel lonely at first."
      ───────────────────────────────────────────────────────────── */}
      {isScene3 && (() => {
        const sEnter = sp(19200);
        const sExit = currentMs >= 24200 ? sp(24200, 18, 110, 0.8) : 0;
        const exitY = sExit * -50;
        const exitOpacity = 1 - sExit * 1.2;

        return (
          <div
            className="w-full max-w-[1020px] flex flex-col items-center gap-7"
            style={{
              transform: `translateY(${exitY}px)`,
              opacity: Math.max(0, Math.min(1, exitOpacity)),
            }}
          >
            {/* Ghost Background Headline */}
            <div className="absolute -top-36 text-[280px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase pointer-events-none select-none">
              FILTER
            </div>

            {/* Stage Badge */}
            <div
              className="px-12 py-4 rounded-full glass-tile-dark text-indigo-400 font-mono text-[26px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl"
              style={{
                transform: `translateY(${(1 - sEnter) * -20}px)`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <AlertCircle className="w-8 h-8 text-indigo-400" />
              STAGE 02 &bull; THE NECESSARY FILTER
            </div>

            {/* Glassmorphic Solitude Hero Card */}
            <div
              className="w-full rounded-[56px] p-9 glass-tile flex items-center gap-9"
              style={{
                transform: `translateY(${(1 - sEnter) * 45}px) scale(${0.94 + sEnter * 0.06})`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <div className="w-60 h-60 shrink-0">
                <ProCutout
                  assetId="cute_sad_mascot_knees"
                  glowColor="indigo"
                  animation="punch_in"
                  annotation="GROWTH PAIN"
                  annotationPosition="top-right"
                  width="100%"
                  height="100%"
                />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="text-[44px] font-black text-slate-950 uppercase tracking-tight flex items-center gap-3">
                  <span>Temporary Solitude</span>
                  <Zap className="w-9 h-9 text-amber-500 shrink-0" />
                </div>
                <div className="p-5 rounded-2xl glass-pill-indigo text-indigo-950 font-black text-[26px] flex items-center gap-4">
                  <span className="w-4 h-4 rounded-full bg-indigo-600 shrink-0 animate-ping" />
                  <span>Shrinking the circle feels lonely at first</span>
                </div>
                <div className="text-[22px] font-black text-slate-700 uppercase tracking-wider">
                  Phase 1: Disconnection &rarr; Phase 2: High Clarity
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─────────────────────────────────────────────────────────────
          SCENE 4: RECLAIMING INNER PEACE EPIPHANY (24.8s - 28.8s)
          "But sometimes having fewer people around you isn't losing friends. It's finally getting some peace."
      ───────────────────────────────────────────────────────────── */}
      {isScene4 && (() => {
        const sEnter = sp(24800);

        return (
          <div className="w-full max-w-[1020px] flex flex-col items-center gap-7">
            {/* Ghost Background Headline */}
            <div className="absolute -top-36 text-[280px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase pointer-events-none select-none">
              PEACE
            </div>

            {/* Stage Badge */}
            <div
              className="px-12 py-4 rounded-full glass-tile-dark text-emerald-400 font-mono text-[26px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl"
              style={{
                transform: `translateY(${(1 - sEnter) * -20}px)`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <Sparkles className="w-8 h-8 text-emerald-400" />
              STAGE 03 &bull; THE EPIPHANY
            </div>

            {/* Glassmorphic Reclaimed Peace Hero Card */}
            <div
              className="w-full rounded-[56px] p-9 glass-tile flex items-center gap-9 relative overflow-hidden"
              style={{
                transform: `translateY(${(1 - sEnter) * 45}px) scale(${0.94 + sEnter * 0.06})`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <div className="w-60 h-60 shrink-0">
                <ProCutout
                  assetId="mindful_heart_gratitude"
                  glowColor="emerald"
                  animation="stamp_impact"
                  annotation="INNER PEACE"
                  annotationPosition="top-right"
                  width="100%"
                  height="100%"
                />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="text-[44px] font-black text-slate-950 uppercase tracking-tight">
                  Not Losing Friends
                </div>
                <div className="p-5 rounded-2xl glass-pill-emerald text-emerald-950 font-black text-[26px] flex items-center gap-4">
                  <ShieldCheck className="w-9 h-9 text-emerald-600 shrink-0" />
                  <span>Finally Reclaiming 100% Mental Peace</span>
                </div>
                <div className="text-[22px] font-black text-emerald-800 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-emerald-500" />
                  <span>Quality Connections &bull; Zero Drama</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
