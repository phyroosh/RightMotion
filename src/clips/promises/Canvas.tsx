import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Calendar,
  ShieldAlert,
  Zap,
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingDown,
  Target,
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

  const ambientFloat = Math.sin(frame * 0.03) * 4;

  // Slow buttery spring helper
  const sp = (delayMs: number, d = 20, s = 95, m = 0.85) => {
    const df = Math.floor((delayMs / 1000) * fps);
    return spring({
      frame: Math.max(0, frame - df),
      fps,
      config: { damping: d, stiffness: s, mass: m },
    });
  };

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
          <div className="absolute inset-x-0 top-[46%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 50 + ambientFloat}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              <div className="mb-6 px-10 py-4 rounded-full bg-slate-950 text-amber-300 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-amber-500/50">
                <Calendar className="w-9 h-9 text-amber-400" />
                THE PROCRASTINATION ILLUSION
              </div>

              <div className="w-full rounded-[56px] p-11 bg-white/98 border-[5px] border-amber-200 shadow-2xl flex flex-col gap-8">
                <div className="grid grid-cols-2 gap-6">
                  {/* Today Promise */}
                  <div className="p-8 rounded-[36px] bg-slate-50 border-3 border-slate-200 flex flex-col gap-3.5 min-h-[220px] justify-center">
                    <div className="text-lg font-mono font-black text-slate-500 uppercase">TODAY'S INTENTION</div>
                    <div className="text-3xl sm:text-4xl font-black text-slate-950">“Tomorrow, I’ll do it.”</div>
                    <div className="mt-2 text-lg font-bold text-amber-900 bg-amber-200/80 px-4 py-1.5 rounded-2xl w-fit border border-amber-300">
                      100% Future Fantasy
                    </div>
                  </div>

                  {/* Tomorrow Reality */}
                  <div
                    className="p-8 rounded-[36px] bg-rose-50 border-3 border-rose-200 flex flex-col gap-3.5 min-h-[220px] justify-center transition"
                    style={{
                      transform: `scale(${0.95 + sTomorrow * 0.05})`,
                      opacity: Math.min(1, sTomorrow * 1.5),
                    }}
                  >
                    <div className="text-lg font-mono font-black text-rose-600 uppercase">TOMORROW ARRIVES</div>
                    <div className="text-3xl sm:text-4xl font-black text-rose-950">“And you don’t.”</div>
                    <div className="mt-2 text-lg font-black text-rose-800 bg-rose-200 px-4 py-1.5 rounded-2xl w-fit flex items-center gap-2 border border-rose-300">
                      <XCircle className="w-6 h-6 text-rose-600" /> Avoidance Loop Repeats
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-amber-500/15 border-2 border-amber-500/40 flex items-center justify-between text-xl font-mono font-black text-amber-950">
                  <span>Loop: Postponing action fractures internal integrity</span>
                  <span className="text-amber-700 font-extrabold">CYCLE ACTIVE</span>
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
          <div className="absolute inset-x-0 top-[46%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sGauge) * 50 + ambientFloat}px)`,
                opacity: Math.min(1, sGauge * 1.5),
              }}
            >
              <div className="mb-6 px-10 py-4 rounded-full bg-rose-950 text-rose-200 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-rose-500/40">
                <ShieldAlert className="w-9 h-9 text-rose-400" />
                CONSEQUENCE: TRUST EROSION
              </div>

              <div className="w-full rounded-[56px] p-11 bg-white/98 border-[5px] border-rose-200 shadow-2xl flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl font-mono font-black text-rose-600 uppercase mb-1">INTERNAL REPUTATION</div>
                    <div className="text-4xl sm:text-5xl font-black text-slate-950">You Stop Trusting Yourself</div>
                  </div>
                  <div className="px-5 py-2.5 rounded-2xl bg-rose-500/20 border-2 border-rose-500/40 text-rose-700 font-mono font-black text-xl">
                    CRITICAL LOW
                  </div>
                </div>

                {/* Meter Bar */}
                <div className="w-full flex flex-col gap-3">
                  <div className="flex justify-between text-2xl font-mono font-black text-slate-800">
                    <span>Self-Credibility Score</span>
                    <span className="text-rose-600 font-black">
                      {Math.round(interpolate(sDrop, [0, 1], [85, 12]))}%
                    </span>
                  </div>
                  <div className="w-full h-10 rounded-full bg-slate-100 overflow-hidden p-1.5 border-2 border-slate-200 shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300 shadow-md"
                      style={{
                        width: `${interpolate(sDrop, [0, 1], [85, 12])}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-slate-50 border-2 border-slate-200 text-slate-800 text-2xl font-bold flex items-center gap-4">
                  <TrendingDown className="w-8 h-8 text-rose-500 shrink-0" />
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
          <div className="absolute inset-x-0 top-[46%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 50 + ambientFloat}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              <div className="mb-6 px-10 py-4 rounded-full bg-amber-950 text-amber-200 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-amber-500/40">
                <Zap className="w-9 h-9 text-amber-400" />
                THE OVERWHELM TRAP
              </div>

              <div className="w-full rounded-[56px] p-11 bg-white/98 border-[5px] border-amber-200 shadow-2xl flex flex-col gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-rose-500/15 border-2 border-rose-500/30 text-rose-600 flex items-center justify-center shrink-0">
                    <XCircle className="w-12 h-12" />
                  </div>
                  <div>
                    <div className="text-xl font-mono font-black text-rose-600 uppercase mb-1">THE WRONG APPROACH</div>
                    <div className="text-4xl sm:text-5xl font-black text-slate-950">Don’t Rebuild Your Whole Life Overnight</div>
                  </div>
                </div>

                <div className="p-7 rounded-3xl bg-slate-50 border-2 border-slate-200 text-slate-800 text-2xl sm:text-3xl font-bold leading-relaxed">
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
          <div className="absolute inset-x-0 top-[46%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sBlueprint) * 50 + ambientFloat}px)`,
                opacity: Math.min(1, sBlueprint * 1.5),
              }}
            >
              <div className="mb-6 px-10 py-4 rounded-full bg-emerald-950 text-emerald-200 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-emerald-500/40">
                <Sparkles className="w-9 h-9 text-emerald-400" />
                THE MICRO-PROMISE BLUEPRINT
              </div>

              <div className="w-full rounded-[56px] p-11 bg-white/98 border-[5px] border-emerald-300 shadow-2xl flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-18 h-18 rounded-3xl bg-emerald-500 flex items-center justify-center text-white shadow-lg p-3">
                      <Target className="w-10 h-10" />
                    </div>
                    <div>
                      <div className="text-xl font-mono font-black text-emerald-600 uppercase mb-1">THE DAILY COMMITMENT</div>
                      <div className="text-4xl sm:text-5xl font-black text-slate-950">Make 1 Tiny Promise Today</div>
                    </div>
                  </div>
                  <div
                    className="px-5 py-3 rounded-2xl bg-emerald-500/20 text-emerald-800 border-2 border-emerald-500/40 font-mono font-black text-xl flex items-center gap-2"
                    style={{
                      transform: `scale(${0.9 + sCheck * 0.1})`,
                      opacity: Math.min(1, sCheck * 2),
                    }}
                  >
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    ACTUALLY KEEP IT
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  {[
                    { title: "5-Min Walk", label: "Micro Action" },
                    { title: "1 Page Read", label: "Zero Friction" },
                    { title: "Drink Water", label: "100% Kept" },
                  ].map((item, idx) => (
                    <div key={idx} className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-200 flex flex-col gap-2 text-center min-h-[140px] justify-center">
                      <div className="text-2xl sm:text-3xl font-black text-slate-950">{item.title}</div>
                      <div className="text-lg font-mono text-emerald-800 font-black">{item.label}</div>
                    </div>
                  ))}
                </div>

                <div className="font-serif italic text-3xl font-black text-emerald-600 text-center">
                  ✍️ "Every kept promise rebuilds self-trust"
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
