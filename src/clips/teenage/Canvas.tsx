import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  Brain,
  Sparkles,
  Zap,
  Flame,
  CheckCircle2,
  Compass,
  Users,
  Heart,
  BookOpen,
  Home,
  Dna,
  Scale,
  Activity,
  Lightbulb,
} from "lucide-react";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const TeenageCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // Cinematic slow camera push
  const cameraZoom = interpolate(frame, [0, durationInFrames], [1.0, 1.05], {
    extrapolateRight: "clamp",
  });

  // Ambient float
  const ambientFloat = Math.sin(frame * 0.03) * 4;

  // Snappy spring helper
  const sp = (delayMs: number, d = 20, s = 95, m = 0.85) => {
    const df = Math.floor((delayMs / 1000) * fps);
    return spring({
      frame: Math.max(0, frame - df),
      fps,
      config: { damping: d, stiffness: s, mass: m },
    });
  };

  // Scene timing gates
  const isScene2 = currentMs >= 5200 && currentMs < 11240; // Neural Hardware Mismatch
  const isScene3 = currentMs >= 11240 && currentMs < 16000; // Tug-of-War: Social Mirror vs Authentic Self
  const isScene4 = currentMs >= 16000 && currentMs < 22400; // 5-Axis Convergence Storm
  const isScene6 = currentMs >= 27120 && currentMs < 32000; // Identity Sandbox & Prototyping

  const isCanvasActive = isScene2 || isScene3 || isScene4 || isScene6;
  if (!isCanvasActive) return null;

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none overflow-hidden"
      style={{ transform: `scale(${cameraZoom})`, transformOrigin: "center center" }}
    >
      {/* ===================================================================
          SCENE 2: THE NEURAL HARDWARE MISMATCH (5,200 - 11,240ms)
          "Your brain is still developing... bigger decisions, stronger emotions, who you even are"
      =================================================================== */}
      {isScene2 && (() => {
        const sCard = sp(5200);
        const sBar = sp(5700, 16, 80, 0.9);
        const sP1 = sp(6700); // bigger decisions
        const sP2 = sp(7900); // stronger emotions
        const sP3 = sp(9600); // who you even are

        const barProgress = interpolate(sBar, [0, 1], [15, 62]);

        return (
          <div className="absolute inset-x-0 top-[46%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 45 + ambientFloat}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              {/* Category Diagnostic Pill */}
              <div className="mb-6 px-10 py-4 rounded-full bg-slate-950 text-indigo-300 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-indigo-500/50">
                <Brain className="w-9 h-9 text-indigo-400 animate-pulse" />
                NEURAL HARDWARE MISMATCH
              </div>

              {/* Main Visual Glass Card */}
              <div className="w-full rounded-[56px] p-11 bg-white/98 border-[5px] border-indigo-200 shadow-2xl flex flex-col items-center text-center gap-9">
                <div className="text-5xl sm:text-6xl font-black text-slate-950 leading-tight">
                  Adult Expectations vs. Developing Hardware
                </div>

                {/* Prefrontal Cortex Progress Meter */}
                <div className="w-full bg-slate-100 p-7 rounded-3xl border-3 border-slate-200 flex flex-col gap-4">
                  <div className="flex justify-between items-center text-slate-900 font-black text-2xl">
                    <span className="flex items-center gap-3.5">
                      <Brain className="w-9 h-9 text-indigo-600" />
                      PREFRONTAL CORTEX (BRAIN)
                    </span>
                    <span className="font-mono text-amber-900 bg-amber-200/90 px-5 py-2 rounded-2xl text-2xl font-black border border-amber-400">
                      UNDER CONSTRUCTION • {Math.round(barProgress)}%
                    </span>
                  </div>
                  <div className="w-full h-10 bg-slate-200 rounded-full overflow-hidden p-1 shadow-inner relative">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 transition-all duration-300 shadow-md relative overflow-hidden"
                      style={{ width: `${barProgress}%` }}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.25)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.25)_50%,rgba(255,255,255,0.25)_75%,transparent_75%,transparent)] bg-[length:24px_24px] animate-[move-stripe_2s_linear_infinite]" />
                    </div>
                  </div>
                </div>

                {/* 3 Incoming Pressures (Spacious, bold cards) */}
                <div className="w-full grid grid-cols-3 gap-5">
                  <div
                    className="p-6 rounded-3xl bg-indigo-50 border-3 border-indigo-200 shadow-sm flex flex-col items-center gap-3.5 text-center min-h-[175px] justify-center"
                    style={{
                      transform: `scale(${0.92 + sP1 * 0.08})`,
                      opacity: Math.min(1, sP1 * 1.5),
                    }}
                  >
                    <div className="w-18 h-18 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md p-3">
                      <Scale className="w-10 h-10" />
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-indigo-950 uppercase leading-snug">
                      Bigger Decisions
                    </span>
                  </div>

                  <div
                    className="p-6 rounded-3xl bg-rose-50 border-3 border-rose-200 shadow-sm flex flex-col items-center gap-3.5 text-center min-h-[175px] justify-center"
                    style={{
                      transform: `scale(${0.92 + sP2 * 0.08})`,
                      opacity: Math.min(1, sP2 * 1.5),
                    }}
                  >
                    <div className="w-18 h-18 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md p-3">
                      <Flame className="w-10 h-10" />
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-rose-950 uppercase leading-snug">
                      Stronger Emotions
                    </span>
                  </div>

                  <div
                    className="p-6 rounded-3xl bg-amber-50 border-3 border-amber-200 shadow-sm flex flex-col items-center gap-3.5 text-center min-h-[175px] justify-center"
                    style={{
                      transform: `scale(${0.92 + sP3 * 0.08})`,
                      opacity: Math.min(1, sP3 * 1.5),
                    }}
                  >
                    <div className="w-18 h-18 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md p-3">
                      <Compass className="w-10 h-10" />
                    </div>
                    <span className="text-2xl sm:text-3xl font-black text-amber-950 uppercase leading-snug">
                      Identity Formation
                    </span>
                  </div>
                </div>

                <div className="font-serif italic text-3xl sm:text-4xl font-black text-indigo-600">
                  ✍️ "Adult expectations on an engine still calibrating"
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 3: THE SOCIAL MIRROR VS AUTHENTIC SELF (11,240 - 16,000ms)
          "You care deeply about what people think... while desperately wanting to be your own person"
      =================================================================== */}
      {isScene3 && (() => {
        const sCard = sp(11240);
        const sLeft = sp(11500);
        const sRight = sp(13400);

        const balanceOscillation = Math.sin(frame * 0.08) * 6;

        return (
          <div className="absolute inset-x-0 top-[46%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 45 + ambientFloat}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              {/* Category Pill */}
              <div className="mb-6 px-10 py-4 rounded-full bg-slate-950 text-rose-300 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-rose-500/50">
                <Compass className="w-9 h-9 text-rose-400 animate-spin" style={{ animationDuration: "12s" }} />
                THE DUAL-GRAVITY TUG-OF-WAR
              </div>

              {/* Main Visual Glass Card */}
              <div className="w-full rounded-[56px] p-11 bg-white/98 border-[5px] border-rose-200 shadow-2xl flex flex-col items-center text-center gap-9">
                <div className="text-5xl sm:text-6xl font-black text-slate-950 leading-tight">
                  Belonging vs. Individuality
                </div>

                {/* Dual Magnetic Force Battle (Generous size & large typography) */}
                <div className="w-full grid grid-cols-2 gap-7 relative">
                  {/* Left Side: Social Mirror */}
                  <div
                    className="p-9 rounded-[40px] bg-rose-50 border-4 border-rose-300 shadow-xl flex flex-col items-center gap-5 min-h-[360px] justify-center"
                    style={{
                      transform: `scale(${0.92 + sLeft * 0.08}) translateY(${-balanceOscillation}px)`,
                      opacity: Math.min(1, sLeft * 1.5),
                    }}
                  >
                    <div className="w-22 h-22 rounded-3xl bg-rose-500 text-white flex items-center justify-center shadow-lg p-4">
                      <Users className="w-13 h-13" />
                    </div>
                    <span className="text-rose-700 font-mono text-2xl font-black uppercase tracking-wider bg-rose-100 px-5 py-2 rounded-2xl border border-rose-300">
                      SOCIAL GRAVITY
                    </span>
                    <span className="text-slate-950 font-black text-3xl sm:text-4xl leading-snug">
                      "What do they think of me?"
                    </span>
                  </div>

                  {/* Right Side: Authentic Self */}
                  <div
                    className="p-9 rounded-[40px] bg-sky-50 border-4 border-sky-300 shadow-xl flex flex-col items-center gap-5 min-h-[360px] justify-center"
                    style={{
                      transform: `scale(${0.92 + sRight * 0.08}) translateY(${balanceOscillation}px)`,
                      opacity: Math.min(1, sRight * 1.5),
                    }}
                  >
                    <div className="w-22 h-22 rounded-3xl bg-sky-500 text-white flex items-center justify-center shadow-lg p-4">
                      <Sparkles className="w-13 h-13" />
                    </div>
                    <span className="text-sky-700 font-mono text-2xl font-black uppercase tracking-wider bg-sky-100 px-5 py-2 rounded-2xl border border-sky-300">
                      AUTHENTIC DRIVE
                    </span>
                    <span className="text-slate-950 font-black text-3xl sm:text-4xl leading-snug">
                      "I want to be my own person."
                    </span>
                  </div>
                </div>

                <div className="w-full py-5 rounded-3xl bg-slate-950 text-white font-mono text-2xl sm:text-3xl font-black flex items-center justify-center gap-4 shadow-xl border border-slate-700">
                  <Activity className="w-8 h-8 text-rose-400" />
                  <span>BOTH OCCUR AT MAXIMUM INTENSITY</span>
                </div>

                <div className="font-serif italic text-3xl sm:text-4xl font-black text-rose-600">
                  ✍️ "The hardest paradox of growing up"
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 4: THE 5-AXIS CONVERGENCE STORM (16,000 - 22,400ms)
          "School pressure, friendships, attraction, family expectations, changing body..."
      =================================================================== */}
      {isScene4 && (() => {
        const sCard = sp(16000);
        const sC1 = sp(16200); // School pressure
        const sC2 = sp(17200); // Friendships
        const sC3 = sp(18000); // Attraction
        const sC4 = sp(19000); // Family expectations
        const sC5 = sp(20500); // Changing body

        return (
          <div className="absolute inset-x-0 top-[45%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 45 + ambientFloat}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              {/* Category Pill */}
              <div className="mb-6 px-10 py-4 rounded-full bg-slate-950 text-amber-300 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-amber-500/50">
                <Zap className="w-9 h-9 text-amber-400 animate-pulse" />
                SIMULTANEOUS CONVERGENCE STORM
              </div>

              {/* Main Visual Glass Card (Tall, spacious, filling the frame comfortably) */}
              <div className="w-full rounded-[56px] p-9 sm:p-11 bg-white/98 border-[5px] border-amber-300 shadow-2xl flex flex-col items-center text-center gap-6">
                <div className="text-4xl sm:text-5xl font-black text-slate-950 leading-tight">
                  5 Huge Shifts Colliding At Once
                </div>

                {/* 5 Tactile Rows — Tall, spacious, massive fonts and clear tags */}
                <div className="w-full flex flex-col gap-4">
                  {/* Item 1: School Pressure */}
                  <div
                    className="p-5 px-7 rounded-3xl bg-indigo-50 border-3 border-indigo-200 shadow-sm flex items-center justify-between min-h-[105px]"
                    style={{
                      transform: `translateX(${(1 - sC1) * -30}px)`,
                      opacity: Math.min(1, sC1 * 1.5),
                    }}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <BookOpen className="w-9 h-9" />
                      </div>
                      <span className="text-slate-950 font-black text-3xl sm:text-4xl text-left">
                        1. School & Future Pressure
                      </span>
                    </div>
                    <span className="font-mono text-2xl font-black text-indigo-950 bg-indigo-200 px-5 py-2.5 rounded-2xl border-2 border-indigo-300 shrink-0">
                      GRADES
                    </span>
                  </div>

                  {/* Item 2: Friendships */}
                  <div
                    className="p-5 px-7 rounded-3xl bg-sky-50 border-3 border-sky-200 shadow-sm flex items-center justify-between min-h-[105px]"
                    style={{
                      transform: `translateX(${(1 - sC2) * 30}px)`,
                      opacity: Math.min(1, sC2 * 1.5),
                    }}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Users className="w-9 h-9" />
                      </div>
                      <span className="text-slate-950 font-black text-3xl sm:text-4xl text-left">
                        2. Friendship Dynamics
                      </span>
                    </div>
                    <span className="font-mono text-2xl font-black text-sky-950 bg-sky-200 px-5 py-2.5 rounded-2xl border-2 border-sky-300 shrink-0">
                      SOCIAL
                    </span>
                  </div>

                  {/* Item 3: Attraction */}
                  <div
                    className="p-5 px-7 rounded-3xl bg-rose-50 border-3 border-rose-200 shadow-sm flex items-center justify-between min-h-[105px]"
                    style={{
                      transform: `translateX(${(1 - sC3) * -30}px)`,
                      opacity: Math.min(1, sC3 * 1.5),
                    }}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Heart className="w-9 h-9" />
                      </div>
                      <span className="text-slate-950 font-black text-3xl sm:text-4xl text-left">
                        3. Attraction & Feelings
                      </span>
                    </div>
                    <span className="font-mono text-2xl font-black text-rose-950 bg-rose-200 px-5 py-2.5 rounded-2xl border-2 border-rose-300 shrink-0">
                      ROMANCE
                    </span>
                  </div>

                  {/* Item 4: Family Expectations */}
                  <div
                    className="p-5 px-7 rounded-3xl bg-amber-50 border-3 border-amber-200 shadow-sm flex items-center justify-between min-h-[105px]"
                    style={{
                      transform: `translateX(${(1 - sC4) * 30}px)`,
                      opacity: Math.min(1, sC4 * 1.5),
                    }}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Home className="w-9 h-9" />
                      </div>
                      <span className="text-slate-950 font-black text-3xl sm:text-4xl text-left">
                        4. Family Expectations
                      </span>
                    </div>
                    <span className="font-mono text-2xl font-black text-amber-950 bg-amber-200 px-5 py-2.5 rounded-2xl border-2 border-amber-300 shrink-0">
                      FAMILY
                    </span>
                  </div>

                  {/* Item 5: Changing Body */}
                  <div
                    className="p-5 px-7 rounded-3xl bg-emerald-50 border-3 border-emerald-200 shadow-sm flex items-center justify-between min-h-[105px]"
                    style={{
                      transform: `translateX(${(1 - sC5) * -30}px)`,
                      opacity: Math.min(1, sC5 * 1.5),
                    }}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <Dna className="w-9 h-9" />
                      </div>
                      <span className="text-slate-950 font-black text-3xl sm:text-4xl text-left">
                        5. Rapidly Changing Body
                      </span>
                    </div>
                    <span className="font-mono text-2xl font-black text-emerald-950 bg-emerald-200 px-5 py-2.5 rounded-2xl border-2 border-emerald-300 shrink-0">
                      BIOLOGY
                    </span>
                  </div>
                </div>

                <div className="font-serif italic text-3xl sm:text-4xl font-black text-amber-600">
                  ✍️ "No wonder it feels chaotic — you are in all 5 storms"
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================================================================
          SCENE 6: THE IDENTITY SANDBOX & VERSION TESTING (27,120 - 32,000ms)
          "You’re trying out different versions of yourself to figure out which one actually feels like you"
      =================================================================== */}
      {isScene6 && (() => {
        const sCard = sp(27120);
        const sV1 = sp(27500);
        const sV2 = sp(28500);
        const sV3 = sp(29800);

        return (
          <div className="absolute inset-x-0 top-[46%] -translate-y-1/2 flex flex-col items-center justify-center px-6">
            <div
              className="relative w-full max-w-[1000px] flex flex-col items-center"
              style={{
                transform: `translateY(${(1 - sCard) * 45 + ambientFloat}px)`,
                opacity: Math.min(1, sCard * 1.5),
              }}
            >
              {/* Category Pill */}
              <div className="mb-6 px-10 py-4 rounded-full bg-slate-950 text-emerald-300 font-mono text-2xl font-black uppercase tracking-widest flex items-center gap-4 shadow-2xl border-2 border-emerald-500/50">
                <Sparkles className="w-9 h-9 text-emerald-400 animate-spin" style={{ animationDuration: "10s" }} />
                THE IDENTITY SANDBOX
              </div>

              {/* Main Visual Glass Card */}
              <div className="w-full rounded-[56px] p-11 bg-white/98 border-[5px] border-emerald-300 shadow-2xl flex flex-col items-center text-center gap-9">
                <div className="text-5xl sm:text-6xl font-black text-slate-950 leading-tight">
                  Prototyping Versions of You
                </div>

                {/* 3 Version Prototype Cards (Tall, large typography & clear badges) */}
                <div className="w-full grid grid-cols-3 gap-5">
                  {/* Version 1 */}
                  <div
                    className="p-7 rounded-3xl bg-slate-100 border-3 border-slate-300 flex flex-col items-center gap-4 opacity-85 min-h-[220px] justify-center"
                    style={{
                      transform: `scale(${0.92 + sV1 * 0.08})`,
                      opacity: Math.min(0.85, sV1 * 1.2),
                    }}
                  >
                    <span className="font-mono text-xl font-black text-slate-600 uppercase tracking-wider">
                      PROTOTYPE 1
                    </span>
                    <span className="text-slate-950 font-black text-3xl leading-tight">
                      People Pleaser
                    </span>
                    <span className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xl font-black">
                      Discarded ✖
                    </span>
                  </div>

                  {/* Version 2 */}
                  <div
                    className="p-7 rounded-3xl bg-amber-50 border-3 border-amber-300 flex flex-col items-center gap-4 min-h-[220px] justify-center"
                    style={{
                      transform: `scale(${0.92 + sV2 * 0.08})`,
                      opacity: Math.min(1, sV2 * 1.5),
                    }}
                  >
                    <span className="font-mono text-xl font-black text-amber-800 uppercase tracking-wider">
                      PROTOTYPE 2
                    </span>
                    <span className="text-slate-950 font-black text-3xl leading-tight">
                      Quiet Explorer
                    </span>
                    <span className="px-4 py-2 rounded-xl bg-amber-200 text-amber-950 text-xl font-black">
                      Testing 🔄
                    </span>
                  </div>

                  {/* Version 3 */}
                  <div
                    className="p-7 rounded-3xl bg-emerald-50 border-4 border-emerald-400 shadow-lg flex flex-col items-center gap-4 min-h-[220px] justify-center"
                    style={{
                      transform: `scale(${0.92 + sV3 * 0.08})`,
                      opacity: Math.min(1, sV3 * 1.5),
                    }}
                  >
                    <span className="font-mono text-xl font-black text-emerald-800 uppercase tracking-wider">
                      AUTHENTIC CORE
                    </span>
                    <span className="text-slate-950 font-black text-3xl leading-tight">
                      The Real You
                    </span>
                    <span className="px-4 py-2 rounded-xl bg-emerald-500 text-white text-xl font-black animate-pulse shadow-md">
                      ✨ Becoming...
                    </span>
                  </div>
                </div>

                <div className="w-full py-6 rounded-3xl bg-emerald-100 border-3 border-emerald-300 text-emerald-950 font-black text-3xl flex items-center justify-center gap-4 shadow-sm">
                  <Lightbulb className="w-9 h-9 text-emerald-600 shrink-0" />
                  <span>CONFUSION IS JUST EXPERIMENTAL CALIBRATION</span>
                </div>

                <div className="font-serif italic text-3xl sm:text-4xl font-black text-emerald-600">
                  ✍️ "You are not broken — you are prototyping"
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
