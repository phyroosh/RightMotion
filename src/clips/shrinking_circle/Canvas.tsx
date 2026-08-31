import React from "react";
import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { ProCutout } from "../../components/ProCutout";
import { PropComparison } from "../../components/PropComparison";
import { WordTimestamp } from "../../types";
import { Sparkles, AlertCircle, HeartHandshake, ShieldCheck, Zap } from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const ShrinkingCircleCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Scene Timings:
  // Scene 1 (The Quality Shift & Progressive Morphing VS Card): 5,200ms - 19,200ms
  //   - 5,200ms: Single compact card drops in (20 Drama Friends)
  //   - 9,800ms: Card dynamically expands to 1020px + VS pops + 3 Genuine Allies pops in!
  // Scene 2 (The Loneliness Filter): 19,200ms - 24,800ms
  // Scene 3 (Reclaiming Inner Peace Epiphany): 24,800ms - 28,800ms
  const isScene1 = currentMs >= 5200 && currentMs < 19200;
  const isScene2 = currentMs >= 19200 && currentMs < 24800;
  const isScene3 = currentMs >= 24800 && currentMs < 28800;

  const sp = (delayMs: number, d = 20, s = 90, m = 0.85) => {
    const df = Math.floor((delayMs / 1000) * fps);
    return spring({
      frame: Math.max(0, frame - df),
      fps,
      config: { damping: d, stiffness: s, mass: m },
    });
  };

  if (!isScene1 && !isScene2 && !isScene3) return null;

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden flex flex-col items-center justify-center px-6">
      {/* ─────────────────────────────────────────────────────────────
          SCENE 1: PROGRESSIVE MORPHING EXPANSION (5.2s - 19.2s)
      ───────────────────────────────────────────────────────────── */}
      {isScene1 && (() => {
        const sEnter = sp(5200);
        // Smooth exit transition into Scene 2
        const sExit = currentMs >= 18600 ? sp(18600, 18, 110, 0.8) : 0;
        const exitY = sExit * -60;
        const exitOpacity = 1 - sExit * 1.2;

        return (
          <div
            className="w-full flex flex-col items-center gap-7 transition-all"
            style={{
              transform: `translateY(${exitY}px)`,
              opacity: Math.max(0, Math.min(1, exitOpacity)),
            }}
          >
            {/* Ghost Background Headline Depth */}
            <div className="absolute -top-32 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase pointer-events-none select-none">
              CIRCLE
            </div>

            {/* Stage Badge with Live Indicator */}
            <div
              className="px-10 py-3.5 rounded-full bg-slate-950 text-indigo-400 font-mono text-[22px] font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-indigo-500/30"
              style={{
                transform: `translateY(${(1 - sEnter) * -20}px)`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <HeartHandshake className="w-7 h-7 text-indigo-400" />
              QUALITY OVER QUANTITY
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
            </div>

            {/* Progressive Morphing Comparison Component */}
            <div
              style={{
                transform: `translateY(${(1 - sEnter) * 45}px) scale(${0.94 + sEnter * 0.06})`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <PropComparison
                leftAssetId="peer_pressure_criticism"
                leftTitle="20 Drama Friends"
                leftSubtitle="Only include you when you are useful"
                leftBadge="DRAINING"
                leftGlow="rose"
                rightAssetId="friendship_comfort_support"
                rightTitle="3 Genuine Allies"
                rightSubtitle="Respect, real support & want you to grow"
                rightBadge="REAL CORE"
                rightGlow="emerald"
                centerDividerText="VS"
                startMs={5200}
                revealRightMs={9800} // Expands and reveals Right Card exactly at 9.8s!
                progressive={true}
              />
            </div>
          </div>
        );
      })()}

      {/* ─────────────────────────────────────────────────────────────
          SCENE 2: THE LONELINESS GROWTH FILTER (19.2s - 24.8s)
      ───────────────────────────────────────────────────────────── */}
      {isScene2 && (() => {
        const sEnter = sp(19200);
        const sExit = currentMs >= 24200 ? sp(24200, 18, 110, 0.8) : 0;
        const exitY = sExit * -60;
        const exitOpacity = 1 - sExit * 1.2;

        return (
          <div
            className="w-full max-w-[1000px] flex flex-col items-center gap-7"
            style={{
              transform: `translateY(${exitY}px)`,
              opacity: Math.max(0, Math.min(1, exitOpacity)),
            }}
          >
            {/* Ghost Background Typography */}
            <div className="absolute -top-32 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase pointer-events-none select-none">
              FILTER
            </div>

            {/* Stage Badge */}
            <div
              className="px-10 py-3.5 rounded-full bg-slate-950 text-amber-300 font-mono text-[22px] font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-amber-500/30"
              style={{
                transform: `translateY(${(1 - sEnter) * -20}px)`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <AlertCircle className="w-7 h-7 text-amber-400" />
              STAGE 02 • THE GROWTH FILTER
            </div>

            {/* Hero Card with Punch-In Spring */}
            <div
              className="w-full rounded-[52px] p-10 bg-white/95 backdrop-blur-2xl border-[4px] border-amber-200/80 shadow-[0_30px_90px_rgba(0,0,0,0.12)] flex items-center gap-8"
              style={{
                transform: `translateY(${(1 - sEnter) * 45}px) scale(${0.94 + sEnter * 0.06})`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <div className="w-64 h-64 shrink-0">
                <ProCutout
                  assetId="cute_sad_mascot_knees"
                  glowColor="indigo"
                  animation="punch_in"
                  annotation="GROWTH PAINS"
                  annotationPosition="top-right"
                  width="100%"
                  height="100%"
                />
              </div>

              <div className="flex-1 flex flex-col gap-4">
                <div className="text-4xl font-black text-slate-950 uppercase tracking-tight leading-tight flex items-center gap-3">
                  <span>Temporary Solitude</span>
                  <Zap className="w-8 h-8 text-amber-500 shrink-0" />
                </div>
                <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-950 font-black text-2xl flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shrink-0 animate-ping" />
                  <span>Shrinking the circle feels lonely at first</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ─────────────────────────────────────────────────────────────
          SCENE 3: RECLAIMING INNER PEACE EPIPHANY (24.8s - 28.8s)
      ───────────────────────────────────────────────────────────── */}
      {isScene3 && (() => {
        const sEnter = sp(24800);

        return (
          <div className="w-full max-w-[1000px] flex flex-col items-center gap-7">
            {/* Ghost Background Typography */}
            <div className="absolute -top-32 text-[260px] font-black text-slate-900/[0.04] leading-none tracking-tighter uppercase pointer-events-none select-none">
              PEACE
            </div>

            {/* Stage Badge */}
            <div
              className="px-10 py-3.5 rounded-full bg-slate-950 text-emerald-400 font-mono text-[22px] font-black uppercase tracking-widest flex items-center gap-3.5 shadow-2xl border-2 border-emerald-500/30"
              style={{
                transform: `translateY(${(1 - sEnter) * -20}px)`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <Sparkles className="w-7 h-7 text-emerald-400" />
              STAGE 03 • THE REALITY
            </div>

            {/* Hero Card with Stamp Impact */}
            <div
              className="w-full rounded-[52px] p-10 bg-white/95 backdrop-blur-2xl border-[4px] border-emerald-200/80 shadow-[0_30px_90px_rgba(0,0,0,0.12)] flex items-center gap-8"
              style={{
                transform: `translateY(${(1 - sEnter) * 45}px) scale(${0.94 + sEnter * 0.06})`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <div className="w-64 h-64 shrink-0">
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
                <div className="text-4xl font-black text-slate-950 uppercase tracking-tight leading-tight">
                  Not Losing Friends
                </div>
                <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-emerald-950 font-black text-2xl flex items-center gap-3 shadow-inner">
                  <ShieldCheck className="w-7 h-7 text-emerald-600 shrink-0" />
                  <span>Finally Reclaiming Your Mental Peace</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
