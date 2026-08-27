import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Calendar,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Zap,
  ArrowRight,
  Brain,
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingDown,
  Target,
  Flame,
} from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const PromisesCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Cinematic slow camera push across entire video
  const cameraZoom = interpolate(frame, [0, durationInFrames], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });

  // Slow buttery spring helper
  const sp = (delayMs: number, d = 24, s = 75, m = 1.0) => {
    const df = Math.floor((delayMs / 1000) * fps);
    return spring({
      frame: Math.max(0, frame - df),
      fps,
      config: { damping: d, stiffness: s, mass: m },
    });
  };

  // Render B-Roll Motion Graphics during:
  // Scene 2: 4,500ms - 8,800ms (Tomorrow Illusion)
  // Scene 3: 8,800ms - 13,000ms (Self-Trust Erosion)
  // Scene 5: 19,600ms - 23,000ms (Don't Rebuild Overnight)
  // Scene 6: 23,000ms - 27,500ms (One Tiny Promise)
  const isScene2 = currentMs >= 4500 && currentMs < 8800;
  const isScene3 = currentMs >= 8800 && currentMs < 13000;
  const isScene5 = currentMs >= 19600 && currentMs < 23000;
  const isScene6 = currentMs >= 23000 && currentMs < 27500;

  const isBRollActive = isScene2 || isScene3 || isScene5 || isScene6;
  if (!isBRollActive) return null;

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden"
      style={{ transform: `scale(${cameraZoom})`, transformOrigin: "center center" }}
    >
      {/* ===================================================================
          SCENE 2: THE "TOMORROW" PHANTOM LOOP (4,500 - 8,800ms)
      =================================================================== */}
      {isScene2 && (() => {
        const sCard = sp(4500);
        const sTomorrow = sp(6200);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            <div
              className="relative w-full max-w-[940px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 50}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              <div className="mb-6 px-7 py-3 rounded-2xl bg-slate-900 text-white font-mono text-sm font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                <Calendar className="w-5 h-5 text-amber-400" />
                THE PROCRASTINATION ILLUSION
              </div>

              <div className="w-full rounded-[44px] p-9 bg-white/98 border-3 border-amber-200 shadow-2xl flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Today Promise */}
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col gap-2">
                    <div className="text-xs font-mono font-black text-slate-500 uppercase">TODAY'S INTENTION</div>
                    <div className="text-2xl font-black text-slate-900">"Tomorrow, I'll do it."</div>
                    <div className="mt-2 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-xl w-fit">
                      100% Future Fantasy
                    </div>
                  </div>

                  {/* Tomorrow Reality */}
                  <div
                    className="p-6 rounded-3xl bg-rose-50 border border-rose-200 flex flex-col gap-2 transition"
                    style={{
                      transform: `scale(${0.95 + sTomorrow * 0.05})`,
                      opacity: Math.min(1, sTomorrow * 1.5),
                    }}
                  >
                    <div className="text-xs font-mono font-black text-rose-500 uppercase">TOMORROW ARRIVES</div>
                    <div className="text-2xl font-black text-rose-950">"And you don't."</div>
                    <div className="mt-2 text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-xl w-fit flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Avoidance Repeats
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs font-mono font-bold text-amber-900">
                  <span>Loop: Postponing action fractures internal integrity</span>
                  <span className="text-amber-600">Cycle = Active</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 3: SELF-TRUST EROSION METER (8,800 - 13,000ms)
      =================================================================== */}
      {isScene3 && (() => {
        const sGauge = sp(8800);
        const sDrop = sp(10200);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            <div
              className="relative w-full max-w-[940px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sGauge) * 50}px)`,
                opacity: Math.min(1, sGauge * 1.5),
              }}
            >
              <div className="mb-6 px-7 py-3 rounded-2xl bg-rose-950 text-rose-200 font-mono text-sm font-black uppercase tracking-widest flex items-center gap-2 shadow-lg border border-rose-500/30">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                CONSEQUENCE: TRUST EROSION
              </div>

              <div className="w-full rounded-[44px] p-9 bg-white/98 border-3 border-rose-200 shadow-2xl flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-mono font-black text-rose-600 uppercase">INTERNAL REPUTATION</div>
                    <div className="text-3xl font-black text-slate-950">You Stop Trusting Yourself</div>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 font-mono font-black text-xs">
                    CRITICAL LOW
                  </div>
                </div>

                {/* Meter Bar */}
                <div className="w-full flex flex-col gap-2">
                  <div className="flex justify-between text-xs font-mono font-bold text-slate-600">
                    <span>Self-Credibility Level</span>
                    <span className="text-rose-600 font-black">
                      {Math.round(interpolate(sDrop, [0, 1], [85, 12]))}%
                    </span>
                  </div>
                  <div className="w-full h-6 rounded-full bg-slate-100 overflow-hidden p-1 border border-slate-200">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300 shadow-md"
                      style={{
                        width: `${interpolate(sDrop, [0, 1], [85, 12])}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold flex items-center gap-2.5">
                  <TrendingDown className="w-5 h-5 text-rose-500 shrink-0" />
                  <span>Years of repeated broken micro-promises teach the brain your word is unreliable.</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 5: DON'T REBUILD OVERNIGHT (19,600 - 23,000ms)
      =================================================================== */}
      {isScene5 && (() => {
        const sCard = sp(19600);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            <div
              className="relative w-full max-w-[940px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 50}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              <div className="mb-6 px-7 py-3 rounded-2xl bg-amber-950 text-amber-200 font-mono text-sm font-black uppercase tracking-widest flex items-center gap-2 shadow-lg border border-amber-500/30">
                <Zap className="w-5 h-5 text-amber-400" />
                THE OVERWHELM TRAP
              </div>

              <div className="w-full rounded-[44px] p-9 bg-white/98 border-3 border-amber-200 shadow-2xl flex flex-col gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-600 flex items-center justify-center shrink-0">
                    <XCircle className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-black text-rose-600 uppercase">THE WRONG APPROACH</div>
                    <div className="text-3xl font-black text-slate-950">Don't Rebuild Your Whole Life Overnight</div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-base font-semibold leading-relaxed">
                  Grand 10-habit overhauls collapse under cognitive fatigue within 72 hours.
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 6: MAKE ONE TINY PROMISE (23,000 - 27,500ms)
      =================================================================== */}
      {isScene6 && (() => {
        const sBlueprint = sp(23000);
        const sCheck = sp(25200);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            <div
              className="relative w-full max-w-[940px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sBlueprint) * 50}px)`,
                opacity: Math.min(1, sBlueprint * 1.5),
              }}
            >
              <div className="mb-6 px-7 py-3 rounded-2xl bg-emerald-950 text-emerald-200 font-mono text-sm font-black uppercase tracking-widest flex items-center gap-2 shadow-lg border border-emerald-500/30">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                THE MICRO-PROMISE BLUEPRINT
              </div>

              <div className="w-full rounded-[44px] p-9 bg-white/98 border-3 border-emerald-200 shadow-2xl flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg">
                      <Target className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-xs font-mono font-black text-emerald-600 uppercase">THE DAILY COMMITMENT</div>
                      <div className="text-3xl font-black text-slate-950">Make 1 Tiny Promise Today</div>
                    </div>
                  </div>
                  <div
                    className="px-4 py-2 rounded-2xl bg-emerald-500/20 text-emerald-700 border border-emerald-500/40 font-mono font-black text-xs flex items-center gap-1.5"
                    style={{
                      transform: `scale(${0.9 + sCheck * 0.1})`,
                      opacity: Math.min(1, sCheck * 2),
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ACTUALLY KEEP IT
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { title: "5-Min Walk", label: "Micro Action" },
                    { title: "1 Page Read", label: "Zero Friction" },
                    { title: "Drink Water", label: "100% Kept" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col gap-1 text-center">
                      <div className="text-sm font-black text-slate-900">{item.title}</div>
                      <div className="text-[11px] font-mono text-emerald-700 font-bold">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
