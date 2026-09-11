import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TacticalMemeCard } from "../../components/TacticalMemeCard";
import { MemeStickerOverlay } from "../../components/MemeStickerOverlay";
import { WordTimestamp } from "../../types";
import {
  Compass,
  EyeOff,
  Sparkles,
  Shield,
  CheckCircle2,
  RefreshCw,
  Award,
  Users,
  Target,
  ArrowRight,
  HelpCircle,
  Lock,
} from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * 🎬 ThePersonYouNeverChoseCanvas — 100% Bespoke Motion Graphics
 * Topic: "The Person You Never Chose" {Self Improvement}
 * Channel: Judy Insights (Apple Studio Light Canvas)
 *
 * Safe Zones:
 * - Primary graphics strictly between top: 6% and top: 68% (y: 115px to 1300px)
 * - Kinetic Captions reserved: top: 73% to top: 81%
 * - Zero overlap with captions!
 *
 * 4 Speech-Synchronized Pillar Scenes:
 *   Scene 1 (Frames 0 → 285):   The Trap of Borrowed Success & Performance Habit
 *   Scene 2 (Frames 285 → 525): The Validation Loop (Adapt > Validate > Repeat) & Familiarity Trap
 *   Scene 3 (Frames 525 → 720): The Sovereign Question ("Would I Choose This If Nobody Knew?")
 *   Scene 4 (Frames 720 → 901): The Unshakable Foundation (Answers That Survive Without Applause)
 */
export const ThePersonYouNeverChoseCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full select-none overflow-hidden font-sans">
      {/* ======================================================== */}
      {/* TACTICAL RETENTION MEME POP (< 2.5s Strict Cap)          */}
      {/* ======================================================== */}
      <TacticalMemeCard
        memeId="doctor_strange_loop"
        startFrame={0}
        durationFrames={46}
        playbackRate={1.4}
        hudLabel="AUTOPILOT LOOP // RECURSION"
        theme="apple_studio"
        position="top"
      />

      {/* ======================================================== */}
      {/* MID-VIDEO GEN-Z MEME REACTION STICKER POP               */}
      {/* Positioned safely in upper right (top: 14%) away from text */}
      {/* ======================================================== */}
      <MemeStickerOverlay
        stickerId="friends_dapping_laughing"
        startFrame={384}
        durationFrames={34}
        position="top-right"
        badgeText="REAL ONES ONLY"
      />

      {/* ======================================================== */}
      {/* SCENE 1: BORROWED SUCCESS & PERFORMANCE HABIT (0 → 285)  */}
      {/* "You can become incredibly successful at living a life..."*/}
      {/* ======================================================== */}
      {frame >= 0 && frame < 285 && (() => {
        const cam1 = interpolate(frame, [0, 285], [1.0, 1.05], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });

        // Part 1A: Frames 0 -> 110 (Hook: Successful at a life never chosen)
        const hookOpacity = interpolate(frame, [95, 110], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Part 1B: Frames 110 -> 285 (Reshaping for expectations & performance habit)
        const part1BProgress = interpolate(frame, [110, 135], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });

        const habitSpring = spring({
          frame: Math.max(0, frame - 210),
          fps,
          config: { damping: 12, mass: 0.6, stiffness: 140 },
        });

        return (
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{ transform: `scale(${cam1})`, transformOrigin: "50% 35%" }}
          >
            {/* Ambient Studio Radiance */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "40%",
                top: "28%",
                width: "750px",
                height: "750px",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(ellipse, rgba(244, 63, 94, 0.11) 0%, transparent 70%)",
                filter: "blur(50px)",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                left: "65%",
                top: "35%",
                width: "600px",
                height: "600px",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(ellipse, rgba(99, 102, 241, 0.10) 0%, transparent 70%)",
                filter: "blur(45px)",
              }}
            />

            {/* PART 1A: Opening Hook (Frames 0 -> 110) */}
            {frame < 115 && (
              <div
                className="absolute flex flex-col items-center text-center px-8"
                style={{
                  top: "14%",
                  opacity: hookOpacity,
                  transform: `translateY(${interpolate(hookOpacity, [0, 1], [-30, 0])}px)`,
                }}
              >
                <span className="font-mono text-[38px] font-bold tracking-[0.25em] text-slate-400 uppercase mb-3">
                  THE SILENT TRAP
                </span>

                <h1 className="font-sans font-black text-[92px] leading-[1.02] tracking-tight text-slate-900 mb-6">
                  NEVER CHOSE
                </h1>

                {/* Apple Studio Metrics Contrast Card */}
                <div className="w-[840px] bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-[36px] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.06)] flex items-center justify-between">
                  <div className="flex flex-col items-start">
                    <span className="font-mono text-[34px] font-bold text-slate-400 uppercase">
                      EXTERNAL METRIC
                    </span>
                    <span className="font-sans font-black text-[56px] text-emerald-600 mt-1">
                      100% SUCCESS
                    </span>
                  </div>

                  <div className="h-16 w-[2px] bg-slate-200" />

                  <div className="flex flex-col items-end">
                    <span className="font-mono text-[34px] font-bold text-slate-400 uppercase">
                      OWNERSHIP
                    </span>
                    <span className="font-sans font-black text-[56px] text-rose-600 mt-1">
                      0% INTENTIONAL
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* PART 1B: Reshaping & Performance Habit (Frames 110 -> 285) */}
            {frame >= 110 && (
              <div
                className="absolute flex flex-col items-center w-full px-8"
                style={{
                  top: "11%",
                  opacity: part1BProgress,
                  transform: `translateY(${interpolate(part1BProgress, [0, 1], [40, 0])}px)`,
                }}
              >
                <span className="font-mono text-[38px] font-bold tracking-[0.25em] text-rose-500 uppercase mb-2">
                  THE RESHAPING CYCLE
                </span>

                <h1 className="font-sans font-black text-[74px] leading-tight tracking-tight text-slate-900 text-center mb-6">
                  BORROWED GOALS
                </h1>

                {/* Reshaping Identity Visual Card */}
                <div className="w-[900px] bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-[38px] p-7 shadow-[0_25px_60px_rgba(0,0,0,0.06)] flex flex-col items-center">
                  <div className="flex items-center justify-between w-full mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold">
                        <Users className="w-8 h-8" />
                      </div>
                      <span className="font-sans font-extrabold text-[40px] text-slate-800">
                        OTHERS' EXPECTATIONS
                      </span>
                    </div>

                    <ArrowRight className="w-10 h-10 text-slate-400" />

                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 px-5 py-2.5 rounded-2xl">
                      <Award className="w-8 h-8 text-amber-600" />
                      <span className="font-mono font-bold text-[34px] text-amber-700">
                        VALIDATION
                      </span>
                    </div>
                  </div>

                  {/* Core Diagnostic Readout */}
                  <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex items-center justify-between">
                    <span className="font-mono text-[36px] font-bold text-slate-500">
                      REWARD MECHANISM:
                    </span>
                    <span className="font-sans font-black text-[42px] text-slate-900">
                      EXTERNAL APPROVAL
                    </span>
                  </div>
                </div>

                {/* Performance Becomes The Habit Punch */}
                {frame >= 200 && (
                  <div
                    className="w-[900px] mt-6 bg-rose-600 text-white rounded-[32px] p-6 shadow-xl flex items-center justify-between"
                    style={{ transform: `scale(${habitSpring})` }}
                  >
                    <span className="font-mono text-[36px] font-extrabold tracking-wide uppercase">
                      THE TRAP
                    </span>
                    <span className="font-sans font-black text-[48px] tracking-tight">
                      PERFORMING = HABIT
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 2: THE VALIDATION LOOP (Frames 285 → 525)          */}
      {/* "The loop is simple: adapt, receive validation, repeat..."*/}
      {/* ======================================================== */}
      {frame >= 285 && frame < 525 && (() => {
        const cam2 = interpolate(frame, [285, 525], [0.98, 1.04], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });

        // Part 2A: Tri-Stage Loop (Frames 285 -> 415)
        const scene2AOpacity = interpolate(frame, [405, 420], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Part 2B: Familiar vs Values (Frames 415 -> 525)
        const truthSpring = spring({
          frame: Math.max(0, frame - 418),
          fps,
          config: { damping: 13, mass: 0.7, stiffness: 135 },
        });

        return (
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{ transform: `scale(${cam2})`, transformOrigin: "50% 36%" }}
          >
            {/* Ambient Aura */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "32%",
                width: "800px",
                height: "800px",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(ellipse, rgba(245, 158, 11, 0.12) 0%, transparent 70%)",
                filter: "blur(50px)",
              }}
            />

            {/* PART 2A: THE RECURSIVE ORBITAL LOOP (Adapt -> Validate -> Repeat) */}
            {frame < 420 && (() => {
              const loopRotation = interpolate(frame, [285, 420], [0, 360], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.linear,
              });

              const node1Spring = spring({
                frame: Math.max(0, frame - 285),
                fps,
                config: { damping: 13, mass: 0.6, stiffness: 140 },
              });
              const node2Spring = spring({
                frame: Math.max(0, frame - 315),
                fps,
                config: { damping: 13, mass: 0.6, stiffness: 140 },
              });
              const node3Spring = spring({
                frame: Math.max(0, frame - 345),
                fps,
                config: { damping: 13, mass: 0.6, stiffness: 140 },
              });

              return (
                <div
                  className="absolute flex flex-col items-center w-full px-8"
                  style={{
                    top: "10%",
                    opacity: scene2AOpacity,
                    transform: `translateY(${interpolate(scene2AOpacity, [0, 1], [-40, 0])}px)`,
                  }}
                >
                  <span className="font-mono text-[38px] font-bold tracking-[0.25em] text-amber-600 uppercase mb-2">
                    CLOSED FEEDBACK SYSTEM
                  </span>

                  <h1 className="font-sans font-black text-[76px] leading-tight tracking-tight text-slate-900 text-center mb-6">
                    THE LOOP IS SIMPLE
                  </h1>

                  {/* Bespoke Geometric Orbital Loop Canvas */}
                  <div className="relative w-[860px] h-[440px] bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-[44px] shadow-[0_25px_60px_rgba(0,0,0,0.06)] flex items-center justify-center">
                    {/* Rotating SVG Vector Loop Track */}
                    <svg
                      className="absolute w-[360px] h-[360px]"
                      viewBox="0 0 360 360"
                      style={{ transform: `rotate(${loopRotation}deg)` }}
                    >
                      <circle
                        cx="180"
                        cy="180"
                        r="140"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="5"
                        strokeDasharray="16 12"
                        className="opacity-60"
                      />
                      {/* Orbiting Laser Pulse */}
                      <circle cx="180" cy="40" r="10" fill="#f59e0b" />
                    </svg>

                    {/* Central Core Indicator */}
                    <div className="z-10 flex flex-col items-center text-center px-6">
                      <RefreshCw className="w-12 h-12 text-amber-500 animate-spin mb-2" />
                      <span className="font-mono text-[32px] font-black text-slate-400 uppercase tracking-widest">
                        AUTONOMOUS
                      </span>
                      <span className="font-sans font-black text-[46px] text-slate-900 leading-none mt-1">
                        CYCLE
                      </span>
                    </div>

                    {/* Node 1: ADAPT (Top) */}
                    <div
                      className="absolute top-4 px-7 py-3.5 rounded-2xl bg-slate-900 text-white font-sans font-black text-[38px] shadow-xl flex items-center gap-3"
                      style={{ transform: `scale(${node1Spring})` }}
                    >
                      1. ADAPT
                    </div>

                    {/* Node 2: RECEIVE VALIDATION (Bottom Right) */}
                    <div
                      className="absolute bottom-6 right-8 px-7 py-3.5 rounded-2xl bg-amber-500 text-white font-sans font-black text-[38px] shadow-xl flex items-center gap-3"
                      style={{ transform: `scale(${node2Spring})` }}
                    >
                      2. VALIDATE
                    </div>

                    {/* Node 3: REPEAT (Bottom Left) */}
                    <div
                      className="absolute bottom-6 left-8 px-7 py-3.5 rounded-2xl bg-rose-600 text-white font-sans font-black text-[38px] shadow-xl flex items-center gap-3"
                      style={{ transform: `scale(${node3Spring})` }}
                    >
                      3. REPEAT
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* PART 2B: FAMILIAR DOES NOT EQUAL VALUES */}
            {frame >= 415 && (
              <div
                className="absolute flex flex-col items-center text-center px-8 w-full"
                style={{
                  top: "12%",
                  transform: `scale(${truthSpring})`,
                  opacity: Math.min(1, truthSpring),
                }}
              >
                <div className="px-8 py-3 rounded-full bg-slate-900 text-white font-mono text-[36px] font-black tracking-widest uppercase mb-4 shadow-lg flex items-center gap-3">
                  <RefreshCw className="w-8 h-8 text-amber-400" />
                  THE CONDITIONING
                </div>

                <h1 className="font-sans font-black text-[74px] tracking-tight text-slate-900 leading-tight mb-6">
                  FEELS RIGHT?
                </h1>

                {/* Comparison Card: Familiar vs True Values */}
                <div className="w-[900px] bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-[40px] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.08)] flex flex-col gap-6">
                  <div className="flex items-center justify-between p-6 rounded-3xl bg-amber-50 border border-amber-200">
                    <span className="font-mono text-[38px] font-extrabold text-amber-900">
                      FEELS RIGHT:
                    </span>
                    <span className="font-sans font-black text-[54px] text-amber-600">
                      JUST FAMILIAR
                    </span>
                  </div>

                  {/* Red Slash Barrier */}
                  <div className="flex items-center justify-between p-6 rounded-3xl bg-rose-50 border-2 border-rose-300">
                    <span className="font-mono text-[38px] font-extrabold text-rose-900">
                      NOT ALIGNED:
                    </span>
                    <span className="font-sans font-black text-[54px] text-rose-600 line-through decoration-rose-600">
                      YOUR VALUES
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 3: THE SOVEREIGN QUESTION (Frames 525 → 720)       */}
      {/* "Break the loop by asking one question before major..."   */}
      {/* ======================================================== */}
      {frame >= 525 && frame < 720 && (() => {
        const cam3 = interpolate(frame, [525, 720], [1.0, 1.04], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });

        const scene3Enter = spring({
          frame: Math.max(0, frame - 525),
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 130 },
        });

        // Question punch at frame 585 ("Would I still choose this if nobody knew?")
        const questionSpring = spring({
          frame: Math.max(0, frame - 580),
          fps,
          config: { damping: 12, mass: 0.6, stiffness: 140 },
        });

        return (
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{ transform: `scale(${cam3})`, transformOrigin: "50% 36%" }}
          >
            {/* Ambient Electric Indigo Radiance */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "30%",
                width: "800px",
                height: "800px",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(ellipse, rgba(99, 102, 241, 0.14) 0%, transparent 70%)",
                filter: "blur(50px)",
              }}
            />

            <div
              className="absolute flex flex-col items-center w-full px-8"
              style={{
                top: "10%",
                opacity: scene3Enter,
                transform: `translateY(${interpolate(scene3Enter, [0, 1], [40, 0])}px)`,
              }}
            >
              <span className="font-mono text-[38px] font-bold tracking-[0.25em] text-indigo-600 uppercase mb-2">
                THE SOVEREIGN TEST
              </span>

              <h1 className="font-sans font-black text-[74px] leading-tight tracking-tight text-slate-900 text-center mb-6">
                BREAK THE LOOP
              </h1>

              {/* The Diagnostic Question Frost Card */}
              <div
                className="w-[920px] bg-white/95 backdrop-blur-2xl border-2 border-indigo-500/40 rounded-[40px] p-8 shadow-[0_25px_60px_rgba(99,102,241,0.12)] flex flex-col items-center text-center"
                style={{ transform: `scale(${questionSpring})` }}
              >
                <div className="flex items-center gap-3 text-indigo-600 mb-4">
                  <EyeOff className="w-10 h-10" />
                  <span className="font-mono font-bold text-[36px] uppercase tracking-wider">
                    MENTAL AUDIENCE REMOVAL
                  </span>
                </div>

                <div className="bg-indigo-50/90 rounded-[28px] p-7 w-full border border-indigo-200 mb-6">
                  <p className="font-sans font-black text-[56px] leading-[1.25] text-slate-900">
                    “WOULD I STILL
                    <br />
                    <span className="text-indigo-600">CHOOSE THIS</span>
                    <br />
                    IF NOBODY KNEW?”
                  </p>
                </div>

                <span className="font-mono text-[36px] font-bold text-slate-500">
                  DECIDE IN TOTAL PRIVACY
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 4: ANSWERS THAT SURVIVE WITHOUT APPLAUSE (720 → 901) */}
      {/* "Build your life around answers that survive without..."  */}
      {/* ======================================================== */}
      {frame >= 720 && (() => {
        const cam4 = interpolate(frame, [720, 901], [0.99, 1.04], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });

        const scene4Enter = spring({
          frame: Math.max(0, frame - 720),
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 130 },
        });

        const coreHit = spring({
          frame: Math.max(0, frame - 780),
          fps,
          config: { damping: 12, mass: 0.6, stiffness: 140 },
        });

        return (
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{ transform: `scale(${cam4})`, transformOrigin: "50% 36%" }}
          >
            {/* Radiant Emerald & Gold Aura */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "30%",
                width: "850px",
                height: "850px",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(ellipse, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
                filter: "blur(50px)",
              }}
            />

            <div
              className="absolute flex flex-col items-center w-full px-8"
              style={{
                top: "10%",
                opacity: scene4Enter,
                transform: `translateY(${interpolate(scene4Enter, [0, 1], [40, 0])}px)`,
              }}
            >
              <span className="font-mono text-[38px] font-bold tracking-[0.25em] text-emerald-600 uppercase mb-2">
                UNSHAKABLE ALIGNMENT
              </span>

              <h1 className="font-sans font-black text-[74px] leading-tight tracking-tight text-slate-900 text-center mb-6">
                WITHOUT APPLAUSE
              </h1>

              {/* The Unshakable Foundation Card */}
              <div className="w-[900px] bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-[40px] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.07)] flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-6">
                  <span className="font-sans font-black text-[42px] text-slate-900 flex items-center gap-4">
                    <Compass className="w-11 h-11 text-emerald-600" />
                    AUTHENTIC CHOICE
                  </span>
                  <div className="px-5 py-2 rounded-2xl bg-emerald-100 text-emerald-700 font-mono font-black text-[36px]">
                    100% INTERNAL
                  </div>
                </div>

                {/* 2 Core Sovereign Tenets */}
                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col">
                    <span className="font-mono text-[36px] font-bold text-slate-400 uppercase">
                      EXTERNAL NOISE
                    </span>
                    <span className="font-sans font-extrabold text-[42px] text-slate-700 mt-1">
                      DISREGARDED
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col">
                    <span className="font-mono text-[36px] font-bold text-emerald-600 uppercase">
                      PERSONAL VALUES
                    </span>
                    <span className="font-sans font-extrabold text-[42px] text-emerald-900 mt-1">
                      PROTECTED
                    </span>
                  </div>
                </div>
              </div>

              {/* Final Hero Impact Punch */}
              {frame >= 770 && (
                <div
                  className="w-[900px] mt-6 bg-slate-900 text-white rounded-[32px] p-7 shadow-2xl flex flex-col items-center text-center"
                  style={{ transform: `scale(${coreHit})` }}
                >
                  <span className="font-mono text-[34px] font-bold text-emerald-400 uppercase tracking-widest mb-1">
                    THE BLUEPRINT
                  </span>
                  <span className="font-sans font-black text-[54px] tracking-tight text-white leading-tight">
                    BUILD WHAT SURVIVES IN SILENCE
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
