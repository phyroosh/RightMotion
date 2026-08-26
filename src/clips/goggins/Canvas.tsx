import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Img } from "remotion";
import {
  Flame,
  Shield,
  Trophy,
  Zap,
  RotateCcw,
  Sparkles,
  HeartCrack,
  CheckCircle2,
  AlertTriangle,
  Award,
  Lock,
} from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const GogginsCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Cinematic slow camera push across entire video
  const cameraZoom = interpolate(frame, [0, durationInFrames], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });

  // Slow buttery spring helper per editing rules
  const sp = (delayMs: number, d = 20, s = 80, m = 1.0) => {
    const df = Math.floor((delayMs / 1000) * fps);
    return spring({
      frame: Math.max(0, frame - df),
      fps,
      config: { damping: d, stiffness: s, mass: m },
    });
  };

  // B-Roll Scenes Active Timings:
  // Scene 1: 3,300 - 9,600ms (The Adrenaline Myth & David Goggins photo cutout)
  // Scene 2: 12,400 - 25,500ms (The Cookie Jar & Mental Vault)
  // Scene 3: 25,500 - 34,900ms (Reigniting the Drive & Neural Surge)
  // Scene 4: 40,700 - 43,400ms (The Unbreakable Statement)
  const isScene1 = currentMs >= 3300 && currentMs < 9600;
  const isScene2 = currentMs >= 12400 && currentMs < 25500;
  const isScene3 = currentMs >= 25500 && currentMs < 34900;
  const isScene4 = currentMs >= 40700 && currentMs < 43400;

  const isBRollActive = isScene1 || isScene2 || isScene3 || isScene4;
  if (!isBRollActive) return null;

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden"
      style={{ transform: `scale(${cameraZoom})`, transformOrigin: "center center" }}
    >
      {/* ===================================================================
          SCENE 1: THE ADRENALINE MYTH (3,300 - 9,600ms)
          "Like somehow he feels insanely motivated… and that’s why he can keep going when everyone else stops."
      =================================================================== */}
      {isScene1 && (() => {
        const sEnter = sp(3300);
        const sCutout = sp(3600);
        const sComparison = sp(5000);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            <div className="absolute -top-36 -right-6 text-[280px] font-black text-slate-900/[0.05] leading-none tracking-tighter select-none pointer-events-none">
              MYTH
            </div>

            {/* Category Header Badge */}
            <div
              className="mb-8 px-12 py-5 rounded-[28px] bg-slate-950 text-white font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-slate-700"
              style={{
                transform: `translateY(${(1 - sEnter) * -30}px)`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <Flame className="w-9 h-9 text-amber-400" />
              CASE 01 • THE ADRENALINE ILLUSION
            </div>

            {/* Hero Card containing Cutout and Myth Breakdown */}
            <div
              className="w-full max-w-[980px] rounded-[52px] p-10 bg-white/98 border-4 border-amber-200 shadow-2xl flex flex-col gap-8"
              style={{
                transform: `translateY(${(1 - sEnter) * 60}px) scale(${0.92 + sEnter * 0.08})`,
                opacity: Math.min(1, sEnter * 1.5),
              }}
            >
              <div className="flex items-center gap-8">
                {/* David Goggins High-Impact Cutout Frame */}
                <div
                  className="relative w-64 h-80 rounded-3xl overflow-hidden bg-gradient-to-b from-amber-50 via-slate-100 to-amber-100 border-4 border-amber-300 shadow-2xl shrink-0 flex items-center justify-center"
                  style={{
                    transform: `scale(${0.92 + sCutout * 0.08})`,
                    opacity: Math.min(1, sCutout * 1.5),
                  }}
                >
                  <Img
                    src={staticFile("goggins/goggins_cutout.png")}
                    className="w-full h-full object-contain object-bottom filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.35)]"
                    style={{
                      transform: `scale(${1 + Math.sin((frame / fps) * 2) * 0.02})`,
                    }}
                  />
                  <div className="absolute bottom-2 left-2 right-2 px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md text-amber-300 font-mono text-center text-xs font-black uppercase border border-amber-400/40">
                    BADWATER 135 • #88
                  </div>
                </div>

                {/* Myth Breakdown */}
                <div className="flex flex-col gap-5 flex-1 justify-center">
                  <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full bg-rose-500" />
                      <span className="text-rose-900 font-mono text-lg font-black uppercase line-through">
                        PERCEPTION: 100% MOTIVATION
                      </span>
                    </div>
                    <span className="px-3.5 py-1 rounded-lg bg-rose-200 text-rose-800 font-mono text-xs font-black uppercase">
                      FALSE
                    </span>
                  </div>

                  <div
                    className="p-6 rounded-2xl bg-slate-950 text-white border-2 border-amber-400 flex items-center justify-between shadow-xl"
                    style={{
                      transform: `scale(${0.95 + sComparison * 0.05})`,
                      opacity: Math.min(1, sComparison * 1.5),
                    }}
                  >
                    <div>
                      <div className="text-amber-400 font-mono text-xs font-black uppercase tracking-wider">
                        THE COLD REALITY
                      </div>
                      <div className="text-white font-black text-3xl uppercase tracking-tight mt-1">
                        Suffers Like Everyone
                      </div>
                      <div className="text-slate-300 text-sm font-medium mt-0.5">
                        Mind & body beg him to stop too.
                      </div>
                    </div>
                    <Flame className="w-12 h-12 text-amber-400 animate-pulse shrink-0" />
                  </div>
                </div>
              </div>

              {/* Bottom Insight Callout */}
              <div className="flex items-center justify-between pt-3 border-t-2 border-slate-100">
                <span className="text-slate-600 font-bold text-2xl">
                  Nobody stays motivated at mile 70.
                </span>
                <span className="font-serif italic text-4xl font-black text-[#0071e3]">
                  ✍️ "Motivation always runs out"
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 2: THE COOKIE JAR & MENTAL VAULT (12,400 - 25,500ms)
          "He uses something he calls the Cookie Jar. When things get brutally hard, he mentally goes back to moments when he already survived something difficult..."
      =================================================================== */}
      {isScene2 && (() => {
        const sJar = sp(12400);
        const sQuote = sp(21500);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            <div className="absolute -top-36 -left-8 text-[280px] font-black text-slate-900/[0.05] leading-none tracking-tighter select-none pointer-events-none">
              JAR
            </div>

            {/* Category Header Badge */}
            <div
              className="mb-8 px-12 py-5 rounded-[28px] bg-slate-950 text-white font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-amber-400"
              style={{
                transform: `translateY(${(1 - sJar) * -30}px)`,
                opacity: Math.min(1, sJar * 1.5),
              }}
            >
              <Award className="w-9 h-9 text-amber-400" />
              THE TACTICAL TOOL • THE COOKIE JAR
            </div>

            {/* Hero Cookie Jar & Evidence Card */}
            <div
              className="w-full max-w-[980px] rounded-[52px] p-10 bg-white/98 border-4 border-amber-300 shadow-[0_30px_90px_rgba(245,158,11,0.2)] flex flex-col gap-8"
              style={{
                transform: `translateY(${(1 - sJar) * 60}px) scale(${0.92 + sJar * 0.08})`,
                opacity: Math.min(1, sJar * 1.5),
              }}
            >
              {/* Glass Cookie Jar Visual Container */}
              <div className="grid grid-cols-12 gap-6 items-center">
                {/* Left: The Translucent 3D Glass Jar with Stored Wins */}
                <div className="col-span-5 p-6 rounded-[38px] bg-gradient-to-b from-amber-500/15 via-amber-200/25 to-amber-500/20 border-4 border-amber-400/90 shadow-inner flex flex-col items-center justify-between h-[360px] relative overflow-hidden">
                  <div className="w-40 h-7 rounded-full bg-amber-400/50 border-2 border-amber-600 shadow-sm" />
                  
                  {/* Stored Memory Tokens */}
                  <div className="flex flex-col gap-3.5 w-full my-auto">
                    <div className="p-3.5 rounded-2xl bg-white/95 border-2 border-amber-300 shadow-md flex items-center gap-3">
                      <Shield className="w-6 h-6 text-amber-600 shrink-0" />
                      <span className="font-mono text-xs font-black uppercase text-slate-900">
                        Survived Hell Week
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-white/95 border-2 border-amber-300 shadow-md flex items-center gap-3">
                      <Flame className="w-6 h-6 text-orange-500 shrink-0 animate-pulse" />
                      <span className="font-mono text-xs font-black uppercase text-slate-900">
                        100-Mile Ultramarathon
                      </span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-amber-500 text-white shadow-lg flex items-center gap-3 border border-amber-300">
                      <Trophy className="w-6 h-6 text-yellow-200 shrink-0" />
                      <span className="font-mono text-xs font-black uppercase">
                        Past Heavy Battles
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-[11px] font-black uppercase text-amber-900 tracking-wider">
                    RESERVOIR OF PROVEN WINS
                  </span>
                </div>

                {/* Right: The Mental Recall Process */}
                <div className="col-span-7 flex flex-col justify-between h-[360px]">
                  {currentMs < 21000 ? (
                    <div className="p-7 rounded-[32px] bg-slate-950 text-white border-3 border-amber-400 shadow-xl flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-mono text-xs font-black uppercase flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                          TACTICAL RETRIEVAL
                        </span>
                        <RotateCcw className="w-6 h-6 text-amber-400" />
                      </div>
                      <div className="text-white font-black text-3xl uppercase tracking-tight">
                        Mentally Going Back
                      </div>
                      <div className="text-slate-300 text-base font-medium">
                        Pulling out proven memories when the mind starts begging you to stop.
                      </div>
                    </div>
                  ) : (
                    /* The Big Anchor Quote */
                    <div
                      className="p-7 rounded-[32px] bg-gradient-to-br from-amber-500 to-orange-600 text-white border-3 border-yellow-200 shadow-2xl flex flex-col gap-3"
                      style={{
                        transform: `scale(${0.92 + sQuote * 0.08})`,
                        opacity: Math.min(1, sQuote * 1.5),
                      }}
                    >
                      <div className="font-mono text-xs font-black text-amber-100 uppercase tracking-widest">
                        ANCHOR AFFIRMATION
                      </div>
                      <div className="text-white font-black text-3xl uppercase tracking-tight leading-tight">
                        "I'VE BEEN HERE BEFORE. I CAN HANDLE THIS."
                      </div>
                      <div className="text-amber-100 font-mono text-xs font-bold uppercase mt-1">
                        Hard evidence &gt; Temporary fatigue
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-center gap-3">
                    <CheckCircle2 className="w-7 h-7 text-amber-600 shrink-0" />
                    <span className="text-amber-950 font-bold text-lg">
                      Stored wins neutralize self-doubt instantly.
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Insight Script Callout */}
              <div className="flex items-center justify-between pt-3 border-t-2 border-slate-100">
                <span className="text-slate-700 font-bold text-2xl">
                  Not wishful thinking — concrete past data.
                </span>
                <span className="font-serif italic text-4xl font-black text-[#0071e3]">
                  ✍️ "You have a cookie jar too"
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 3: REIGNITING THE DRIVE (25,500 - 34,900ms)
          "And sometimes, he deliberately remembers the emotions from those victories, using them to reignite that drive when his body and mind start begging him to stop."
      =================================================================== */}
      {isScene3 && (() => {
        const sIgnite = sp(25500);
        const sCharge = sp(28500);

        // Drive power meter 15% -> 100%
        const drivePercent = Math.min(
          100,
          Math.floor(
            interpolate(currentMs, [28500, 32500], [15, 100], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          )
        );

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            <div className="absolute -top-36 -right-6 text-[280px] font-black text-slate-900/[0.05] leading-none tracking-tighter select-none pointer-events-none">
              IGNITE
            </div>

            {/* Category Header Badge */}
            <div
              className="mb-8 px-12 py-5 rounded-[28px] bg-slate-950 text-white font-mono text-[24px] font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-orange-500"
              style={{
                transform: `translateY(${(1 - sIgnite) * -30}px)`,
                opacity: Math.min(1, sIgnite * 1.5),
              }}
            >
              <Zap className="w-9 h-9 text-yellow-400 animate-bounce" />
              EMOTIONAL RE-IGNITION ENGINE
            </div>

            {/* Drive Reignite Card */}
            <div
              className="w-full max-w-[980px] rounded-[52px] p-10 bg-white/98 border-4 border-orange-300 shadow-2xl flex flex-col gap-8"
              style={{
                transform: `translateY(${(1 - sIgnite) * 60}px) scale(${0.92 + sIgnite * 0.08})`,
                opacity: Math.min(1, sIgnite * 1.5),
              }}
            >
              <div className="grid grid-cols-2 gap-7">
                {/* 1. Body & Mind Signal */}
                <div className="p-8 rounded-[36px] bg-rose-50 border-3 border-rose-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-rose-600 font-mono text-sm font-black uppercase">
                      FATIGUE SIGNAL
                    </span>
                    <HeartCrack className="w-7 h-7 text-rose-500" />
                  </div>
                  <div>
                    <div className="text-slate-950 font-black text-3xl uppercase tracking-tight">
                      "Begging To Stop"
                    </div>
                    <div className="text-slate-600 text-lg font-bold mt-1">
                      Body screaming to quit.
                    </div>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-rose-100 text-rose-900 font-mono font-black text-xs uppercase">
                    TEMPORARY BIOLOGY
                  </div>
                </div>

                {/* 2. Emotional Surge HUD */}
                <div
                  className="p-8 rounded-[36px] bg-slate-950 text-white border-4 border-amber-400 flex flex-col justify-between shadow-xl"
                  style={{
                    transform: `scale(${0.95 + sCharge * 0.05})`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-mono text-sm font-black uppercase flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                      DRIVE SURGE
                    </span>
                    <span className="px-4 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-mono font-black text-sm">
                      {drivePercent}%
                    </span>
                  </div>

                  <div>
                    <div className="text-white font-black text-3xl uppercase tracking-tight">
                      Reignited Energy
                    </div>
                    <div className="w-full h-5 rounded-full bg-slate-800 mt-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 transition-all duration-300"
                        style={{ width: `${drivePercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="text-amber-200 font-mono text-xs font-black uppercase">
                    EMOTIONAL MEMORY UNLOCKED
                  </div>
                </div>
              </div>

              {/* Bottom Insight Script Callout */}
              <div className="flex items-center justify-between pt-3 border-t-2 border-slate-100">
                <span className="text-slate-700 font-bold text-2xl">
                  Feel the win before the finish line.
                </span>
                <span className="font-serif italic text-4xl font-black text-[#0071e3]">
                  ✍️ "Reignite that fire"
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 4: THE UNBREAKABLE EVIDENCE STATEMENT (40,700 - 43,400ms)
          "I’ve gotten through hard things before."
      =================================================================== */}
      {isScene4 && (() => {
        const sStatement = sp(40700);

        return (
          <div className="absolute inset-x-0 top-[42%] -translate-y-1/2 flex flex-col items-center justify-center px-8">
            <div className="absolute -top-36 -left-6 text-[280px] font-black text-slate-900/[0.05] leading-none tracking-tighter select-none pointer-events-none">
              PROOF
            </div>

            <div
              className="w-full max-w-[980px] rounded-[52px] p-12 bg-slate-950 text-white border-4 border-amber-400 shadow-[0_30px_90px_rgba(245,158,11,0.35)] flex flex-col items-center text-center gap-6"
              style={{
                transform: `scale(${0.92 + sStatement * 0.08})`,
                opacity: Math.min(1, sStatement * 1.5),
              }}
            >
              <div className="px-8 py-3 rounded-full bg-amber-400 text-slate-950 font-mono text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Trophy className="w-5 h-5 text-slate-950" />
                UNSHAKABLE LIFE EVIDENCE
              </div>

              <div className="text-5xl font-black uppercase tracking-tight text-white leading-tight">
                “I’ve Gotten Through Hard Things Before.”
              </div>

              <div className="font-serif italic text-3xl font-black text-amber-300">
                ✍️ "And you will get through this one too"
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
