import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { TacticalMemeCard } from "../../components/TacticalMemeCard";
import { MemeStickerOverlay } from "../../components/MemeStickerOverlay";
import { WordTimestamp } from "../../types";
import {
  Brain,
  Lock,
  Zap,
  Target,
  Clock,
  Utensils,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowDown,
  Sparkles,
  Layers,
  Flame,
} from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * 🎬 ChoiceOverloadCanvas — 100% Bespoke Motion Graphics
 * Topic: "Too Many Choices Break You" {Self Improvement}
 * Channel: Judy Insights (Apple Studio Light Canvas)
 *
 * Safe Zones:
 * - Primary graphics strictly between top: 6% and top: 68% (y: 115px to 1300px)
 * - Kinetic Captions reserved: top: 73% to top: 81%
 * - Zero overlap with captions!
 *
 * 4 Speech-Synchronized Pillar Scenes:
 *   Scene 1 (Frames 0 → 328):   The Biological Limit & Exponential Overload Surge
 *   Scene 2 (Frames 328 → 612): The Paradox of Infinity (Unlimited Options → 0 Action) & Stop Mandate
 *   Scene 3 (Frames 612 → 785): The Architecture of Defaults (4 Locked Anchors Matrix)
 *   Scene 4 (Frames 785 → 963): Bandwidth Reservoir Preservation & Decisive High Ground
 */
export const ChoiceOverloadCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full select-none overflow-hidden font-sans">
      {/* ======================================================== */}
      {/* TACTICAL RETENTION MEME POP (< 2.5s Strict Cap)          */}
      {/* ======================================================== */}
      <TacticalMemeCard
        memeId="al_pacino_depressed_bench"
        startFrame={0}
        durationFrames={48}
        playbackRate={1.35}
        hudLabel="CHRONIC EXHAUSTION // BURNOUT"
        theme="apple_studio"
        position="top"
      />

      {/* ======================================================== */}
      {/* MID-VIDEO GEN-Z MEME REACTION STICKER POP               */}
      {/* Positioned safely in upper right (top: 14%) away from text */}
      {/* ======================================================== */}
      <MemeStickerOverlay
        stickerId="girl_crying_at_desk"
        startFrame={369}
        durationFrames={34}
        position="top-right"
        badgeText="BURNOUT FR"
      />

      {/* ======================================================== */}
      {/* SCENE 1: BIOLOGICAL LIMIT & SURGE (Frames 0 → 328)       */}
      {/* "Your brain can handle far fewer decisions..."           */}
      {/* ======================================================== */}
      {frame >= 0 && frame < 328 && (() => {
        // Camera push-in for psychological tension
        const cam1 = interpolate(frame, [0, 328], [1.0, 1.05], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });

        // Part A: Opening Hook (Frames 0 -> 115) - Biological Bottleneck
        const hookOpacity = interpolate(frame, [100, 115], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Part B: Option Branching & Overload Surge (Frames 115 -> 328)
        const surgeProgress = interpolate(frame, [115, 140], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        });

        // Live cognitive load digital readout: 18% -> 99%
        const loadCounter = Math.round(
          interpolate(frame, [130, 260], [18, 98], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.25, 1, 0.5, 1),
          })
        );

        // Warning flash at frame 255 ("until simple choices start feeling exhausting")
        const exhaustionHit = spring({
          frame: Math.max(0, frame - 250),
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
                width: "700px",
                height: "700px",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(ellipse, rgba(244, 63, 94, 0.12) 0%, transparent 70%)",
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

            {/* PART A: Frames 0 -> 115 (Hook: Far Fewer Decisions) */}
            {frame < 120 && (
              <div
                className="absolute flex flex-col items-center text-center px-8"
                style={{
                  top: "14%",
                  opacity: hookOpacity,
                  transform: `translateY(${interpolate(hookOpacity, [0, 1], [-30, 0])}px)`,
                }}
              >
                <span className="font-mono text-[38px] font-bold tracking-[0.25em] text-slate-400 uppercase mb-3">
                  BIOLOGICAL LIMIT
                </span>

                <h1 className="font-sans font-black text-[96px] leading-[1.02] tracking-tight text-slate-900 mb-6">
                  FAR FEWER
                </h1>

                {/* Apple Studio Capacity Vessel Meter */}
                <div className="w-[840px] bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-[36px] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.06)] flex flex-col items-center">
                  <div className="flex items-center justify-between w-full mb-6">
                    <span className="font-sans font-extrabold text-[40px] text-slate-800 flex items-center gap-4">
                      <Brain className="w-12 h-12 text-rose-500" />
                      DECISION CAPACITY
                    </span>
                    <span className="font-mono font-bold text-[38px] text-rose-500">
                      MAX 4–7 / DAY
                    </span>
                  </div>

                  {/* 5 Discrete Fuel Slots */}
                  <div className="grid grid-cols-5 gap-4 w-full h-[64px]">
                    {[1, 2, 3, 4, 5].map((idx) => {
                      const isFilled = idx <= 2;
                      return (
                        <div
                          key={idx}
                          className={`rounded-2xl border transition-all duration-300 flex items-center justify-center ${
                            isFilled
                              ? "bg-rose-500 border-rose-600 shadow-[0_0_24px_rgba(244,63,94,0.35)]"
                              : "bg-slate-100 border-slate-200/80"
                          }`}
                        >
                          {isFilled && (
                            <Zap className="w-7 h-7 text-white fill-white" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* PART B: Frames 115 -> 328 (Branching & Cognitive Overload) */}
            {frame >= 115 && (
              <div
                className="absolute flex flex-col items-center w-full px-8"
                style={{
                  top: "11%",
                  opacity: surgeProgress,
                  transform: `translateY(${interpolate(surgeProgress, [0, 1], [40, 0])}px)`,
                }}
              >
                <span className="font-mono text-[38px] font-bold tracking-[0.25em] text-rose-500 uppercase mb-2">
                  PARADOX OF COMPARISON
                </span>

                <h1 className="font-sans font-black text-[76px] leading-tight tracking-tight text-slate-900 text-center mb-6">
                  MULTIPLE CHOICES
                </h1>

                {/* Dynamic Branching Cascade Visualization */}
                <div className="relative w-[900px] h-[340px] bg-white/90 backdrop-blur-2xl border border-slate-200/90 rounded-[40px] p-6 shadow-[0_25px_60px_rgba(0,0,0,0.06)] flex flex-col items-center justify-between">
                  {/* Root Decision Point */}
                  <div className="px-8 py-3.5 rounded-full bg-slate-900 text-white font-mono text-[36px] font-bold shadow-lg flex items-center gap-3">
                    <Target className="w-8 h-8 text-rose-400" />
                    SINGLE DECISION
                  </div>

                  {/* Divergent SVG Evaluation Paths */}
                  <svg className="w-full h-[120px]" viewBox="0 0 800 120">
                    <defs>
                      <linearGradient id="branchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#0f172a" />
                        <stop offset="100%" stopColor="#f43f5e" />
                      </linearGradient>
                    </defs>
                    {/* 5 Diverging Evaluation Vectors */}
                    {[100, 250, 400, 550, 700].map((xPos, idx) => (
                      <path
                        key={idx}
                        d={`M 400 0 C 400 60, ${xPos} 60, ${xPos} 120`}
                        fill="none"
                        stroke="url(#branchGrad)"
                        strokeWidth="5"
                        strokeDasharray="8 6"
                        className="opacity-75"
                      />
                    ))}
                  </svg>

                  {/* 5 Competing Option Leaves */}
                  <div className="flex justify-between w-full px-4">
                    {["OPTION A", "OPTION B", "OPTION C", "OPTION D", "OPTION E"].map((opt, i) => (
                      <div
                        key={i}
                        className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-300 font-mono text-[30px] font-bold text-slate-700"
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overload Metric Readout */}
                <div className="w-[900px] mt-6 bg-rose-50/80 border border-rose-200 rounded-[32px] p-6 flex items-center justify-between shadow-sm">
                  <div className="flex flex-col">
                    <span className="font-mono text-[36px] font-extrabold text-slate-500 uppercase tracking-wider">
                      COGNITIVE OVERLOAD
                    </span>
                    <span className="font-sans font-black text-[64px] text-rose-600 leading-none mt-1">
                      {loadCounter}% EXHAUSTED
                    </span>
                  </div>

                  {frame >= 250 && (
                    <div
                      className="px-6 py-3 rounded-2xl bg-rose-600 text-white font-sans font-black text-[42px] tracking-wide flex items-center gap-3 shadow-lg"
                      style={{
                        transform: `scale(${exhaustionHit})`,
                      }}
                    >
                      <AlertTriangle className="w-10 h-10 text-yellow-300 fill-yellow-300" />
                      CRITICAL
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 2: THE PARALYSIS PARADOX (Frames 328 → 612)        */}
      {/* "That is why unlimited menus, endless scrolling..."      */}
      {/* ======================================================== */}
      {frame >= 328 && frame < 612 && (() => {
        const cam2 = interpolate(frame, [328, 612], [0.98, 1.03], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });

        // Part 2A: Unlimited Inputs -> Zero Output (Frames 328 -> 495)
        const scene2AOpacity = interpolate(frame, [485, 505], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        // Part 2B: "Stop Treating Every Decision..." (Frames 495 -> 612)
        const stopSpring = spring({
          frame: Math.max(0, frame - 505),
          fps,
          config: { damping: 12, mass: 0.6, stiffness: 140 },
        });

        return (
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{ transform: `scale(${cam2})`, transformOrigin: "50% 36%" }}
          >
            {/* Ambient Background Aura */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "32%",
                width: "800px",
                height: "800px",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(ellipse, rgba(239, 68, 68, 0.12) 0%, transparent 70%)",
                filter: "blur(50px)",
              }}
            />

            {/* PART 2A: UNLIMITED OPTIONS -> ZERO ACTION */}
            {frame < 505 && (
              <div
                className="absolute flex flex-col items-center w-full px-8"
                style={{
                  top: "10%",
                  opacity: scene2AOpacity,
                  transform: `translateY(${interpolate(scene2AOpacity, [0, 1], [-40, 0])}px)`,
                }}
              >
                <span className="font-mono text-[38px] font-bold tracking-[0.25em] text-slate-400 uppercase mb-2">
                  THE PARALYSIS TRAP
                </span>

                <h1 className="font-sans font-black text-[76px] leading-tight tracking-tight text-slate-900 text-center mb-6">
                  UNLIMITED INPUTS
                </h1>

                {/* 3 Prominent tactile choice trigger cards */}
                <div className="w-[900px] flex items-center justify-between gap-4 mb-6">
                  {[
                    { label: "UNLIMITED MENUS", icon: Utensils, col: "text-amber-500", delay: 335 },
                    { label: "ENDLESS SCROLL", icon: Layers, col: "text-rose-500", delay: 360 },
                    { label: "DOZENS OF TASKS", icon: Clock, col: "text-indigo-500", delay: 385 },
                  ].map((item, idx) => {
                    const cardSpring = spring({
                      frame: Math.max(0, frame - item.delay),
                      fps,
                      config: { damping: 14, mass: 0.7, stiffness: 130 },
                    });
                    const IconComp = item.icon;
                    return (
                      <div
                        key={idx}
                        className="flex-1 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-[28px] p-5 shadow-[0_20px_45px_rgba(0,0,0,0.06)] flex flex-col items-center text-center"
                        style={{
                          transform: `scale(${cardSpring}) translateY(${interpolate(cardSpring, [0, 1], [30, 0])}px)`,
                        }}
                      >
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                          <IconComp className={`w-9 h-9 ${item.col}`} />
                        </div>
                        <span className="font-sans font-extrabold text-[36px] text-slate-800 leading-snug">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Downward Funnel Transition Arrow */}
                <div className="flex items-center justify-center mb-4">
                  <ArrowDown className="w-12 h-12 text-slate-400 animate-bounce" />
                </div>

                {/* Colossal Result: ZERO ACTION */}
                <div className="w-[900px] bg-white/95 backdrop-blur-2xl border-2 border-rose-200 rounded-[36px] p-6 shadow-[0_25px_60px_rgba(244,63,94,0.12)] flex items-center justify-center gap-8">
                  <span className="font-sans font-black text-[130px] leading-none text-rose-600">
                    0
                  </span>
                  <div className="flex flex-col">
                    <span className="font-sans font-black text-[56px] text-slate-900 leading-tight">
                      OUTPUT PRODUCED
                    </span>
                    <span className="font-mono text-[36px] font-bold text-slate-500">
                      LEAVES YOU PARALYZED
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* PART 2B: STOP TREATING EVERY DECISION LIKE ANALYSIS */}
            {frame >= 495 && (
              <div
                className="absolute flex flex-col items-center text-center px-8 w-full"
                style={{
                  top: "14%",
                  transform: `scale(${stopSpring})`,
                  opacity: Math.min(1, stopSpring),
                }}
              >
                <div className="px-8 py-3 rounded-full bg-rose-600 text-white font-mono text-[36px] font-black tracking-widest uppercase mb-4 shadow-lg">
                  MANDATORY INTERVENTION
                </div>

                <h1 className="font-sans font-black text-[104px] tracking-tight text-rose-600 leading-none mb-3">
                  STOP.
                </h1>

                {/* Strike-through Over-Analysis Card */}
                <div className="w-[900px] bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-[40px] p-10 shadow-[0_25px_60px_rgba(0,0,0,0.08)] flex flex-col items-center">
                  <div className="relative inline-block mb-4">
                    <span className="font-sans font-black text-[68px] text-slate-800 tracking-tight">
                      FULL ANALYSIS
                    </span>
                    {/* Laser Strike-through line */}
                    <div className="absolute top-1/2 left-[-20px] right-[-20px] h-[10px] bg-rose-600 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.6)]" />
                  </div>

                  <span className="font-mono text-[40px] font-bold text-slate-500 text-center leading-relaxed">
                    NOT EVERY CHOICE
                    <br />
                    <strong className="text-slate-900 font-black">DESERVES YOUR BRAIN</strong>
                  </span>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 3: THE ARCHITECTURE OF DEFAULTS (Frames 612 → 785) */}
      {/* "Predefine your defaults: what you eat, when you work..."  */}
      {/* ======================================================== */}
      {frame >= 612 && frame < 785 && (() => {
        const cam3 = interpolate(frame, [612, 785], [1.0, 1.04], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });

        // Entrance spring for Scene 3
        const scene3Enter = spring({
          frame: Math.max(0, frame - 612),
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 130 },
        });

        // 4 Sequential Lock Frames based on transcript:
        // 1. "what you eat" (frames 648 - 685)
        // 2. "when you work" (frames 685 - 710)
        // 3. "what you ignore" (frames 710 - 738)
        // 4. "first task each morning" (frames 738 - 785)
        const lock1 = frame >= 648;
        const lock2 = frame >= 685;
        const lock3 = frame >= 710;
        const lock4 = frame >= 738;

        const anchors = [
          {
            title: "MEALS",
            desc: "WHAT YOU EAT",
            icon: Utensils,
            locked: lock1,
            lockFrame: 648,
          },
          {
            title: "SCHEDULE",
            desc: "WHEN YOU WORK",
            icon: Clock,
            locked: lock2,
            lockFrame: 685,
          },
          {
            title: "FILTERS",
            desc: "WHAT YOU IGNORE",
            icon: Filter,
            locked: lock3,
            lockFrame: 710,
          },
          {
            title: "TASK ONE",
            desc: "FIRST MORNING TASK",
            icon: Target,
            locked: lock4,
            lockFrame: 738,
          },
        ];

        return (
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{ transform: `scale(${cam3})`, transformOrigin: "50% 36%" }}
          >
            {/* Ambient Cyan/Emerald Radiance */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "30%",
                width: "800px",
                height: "800px",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(ellipse, rgba(16, 185, 129, 0.12) 0%, transparent 70%)",
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
              <span className="font-mono text-[38px] font-bold tracking-[0.25em] text-emerald-600 uppercase mb-2">
                AUTOMATION PROTOCOL
              </span>

              <h1 className="font-sans font-black text-[74px] leading-tight tracking-tight text-slate-900 text-center mb-6">
                PREDEFINE DEFAULTS
              </h1>

              {/* 2x2 Tactile Anchor Matrix */}
              <div className="w-[920px] grid grid-cols-2 gap-5">
                {anchors.map((item, idx) => {
                  const lockSpring = spring({
                    frame: Math.max(0, frame - item.lockFrame),
                    fps,
                    config: { damping: 12, mass: 0.6, stiffness: 150 },
                  });
                  const IconComp = item.icon;

                  return (
                    <div
                      key={idx}
                      className={`relative rounded-[32px] p-6 border-2 transition-all duration-300 flex flex-col justify-between h-[230px] ${
                        item.locked
                          ? "bg-white/95 border-emerald-500 shadow-[0_20px_50px_rgba(16,185,129,0.14)]"
                          : "bg-slate-50/80 border-slate-200/80 shadow-sm"
                      }`}
                    >
                      {/* Top Row: Icon + Status Lock */}
                      <div className="flex items-center justify-between w-full">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                            item.locked ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          <IconComp className="w-8 h-8" />
                        </div>

                        {item.locked ? (
                          <div
                            className="px-4 py-1.5 rounded-full bg-emerald-600 text-white font-mono text-[28px] font-black tracking-wider flex items-center gap-2 shadow-md"
                            style={{ transform: `scale(${lockSpring})` }}
                          >
                            <Lock className="w-6 h-6" />
                            LOCKED
                          </div>
                        ) : (
                          <div className="px-4 py-1.5 rounded-full bg-slate-200 text-slate-500 font-mono text-[28px] font-bold">
                            PENDING
                          </div>
                        )}
                      </div>

                      {/* Bottom Row: Large Title & Description */}
                      <div className="flex flex-col mt-2">
                        <span className="font-sans font-black text-[46px] text-slate-900 leading-tight">
                          {item.title}
                        </span>
                        <span className="font-mono text-[34px] font-bold text-slate-500 mt-1">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Sub-Banner: Lock-in Benefit */}
              <div className="w-[920px] mt-6 bg-slate-900 text-white rounded-[26px] py-4 px-8 flex items-center justify-between shadow-xl">
                <span className="font-mono text-[36px] font-bold text-slate-300">
                  RECURRING DECISIONS
                </span>
                <span className="font-sans font-black text-[40px] text-emerald-400 flex items-center gap-3">
                  <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                  ELIMINATED
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 4: BANDWIDTH PRESERVATION & HIGH VALUE (785 → 963)  */}
      {/* "Reduce the number of decisions competing for attention..."*/}
      {/* ======================================================== */}
      {frame >= 785 && (() => {
        const cam4 = interpolate(frame, [785, 963], [0.99, 1.04], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        });

        // Entrance spring for Scene 4
        const scene4Enter = spring({
          frame: Math.max(0, frame - 785),
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 130 },
        });

        // Energy fluid surge: 30% -> 100%
        const energySurge = interpolate(frame, [800, 890], [30, 100], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.2, 0.8, 0.2, 1),
        });

        // High-impact decision punch (frame 900 -> "decisions that actually matter")
        const matterPunch = spring({
          frame: Math.max(0, frame - 895),
          fps,
          config: { damping: 12, mass: 0.6, stiffness: 140 },
        });

        return (
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{ transform: `scale(${cam4})`, transformOrigin: "50% 36%" }}
          >
            {/* Radiant Indigo & Emerald Aura */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "30%",
                width: "850px",
                height: "850px",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(ellipse, rgba(99, 102, 241, 0.14) 0%, transparent 70%)",
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
              <span className="font-mono text-[38px] font-bold tracking-[0.25em] text-indigo-600 uppercase mb-2">
                COGNITIVE FUEL RESERVED
              </span>

              <h1 className="font-sans font-black text-[74px] leading-tight tracking-tight text-slate-900 text-center mb-6">
                RESERVE BANDWIDTH
              </h1>

              {/* Mental Bandwidth Vessel Core */}
              <div className="w-[900px] bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-[40px] p-8 shadow-[0_25px_60px_rgba(0,0,0,0.07)] flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-6">
                  <span className="font-sans font-black text-[42px] text-slate-900 flex items-center gap-4">
                    <Sparkles className="w-11 h-11 text-indigo-600" />
                    MENTAL BANDWIDTH
                  </span>
                  <span className="font-mono font-black text-[48px] text-indigo-600">
                    {Math.round(energySurge)}%
                  </span>
                </div>

                {/* Energy Fluid Progress Bar */}
                <div className="w-full h-[54px] bg-slate-100 rounded-2xl overflow-hidden p-1.5 border border-slate-200/80 mb-6">
                  <div
                    className="h-full rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 shadow-[0_0_25px_rgba(99,102,241,0.4)]"
                    style={{ width: `${energySurge}%` }}
                  />
                </div>

                {/* Focus Filter Architecture */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col">
                    <span className="font-mono text-[30px] font-bold text-slate-400 uppercase">
                      TRIVIAL ROUTINES
                    </span>
                    <span className="font-sans font-extrabold text-[38px] text-slate-700 mt-1">
                      100% AUTOMATED
                    </span>
                  </div>

                  <div className="p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200 flex flex-col">
                    <span className="font-mono text-[30px] font-bold text-indigo-500 uppercase">
                      PEAK FOCUS FUEL
                    </span>
                    <span className="font-sans font-extrabold text-[38px] text-indigo-900 mt-1">
                      FULLY PROTECTED
                    </span>
                  </div>
                </div>
              </div>

              {/* Decisive Hero Punch: "FOR DECISIONS THAT ACTUALLY MATTER" */}
              {frame >= 880 && (
                <div
                  className="w-[900px] mt-6 bg-slate-900 text-white rounded-[32px] p-7 shadow-2xl flex flex-col items-center text-center"
                  style={{ transform: `scale(${matterPunch})` }}
                >
                  <span className="font-mono text-[34px] font-bold text-emerald-400 uppercase tracking-widest mb-1">
                    THE TARGET
                  </span>
                  <span className="font-sans font-black text-[54px] tracking-tight text-white leading-tight">
                    DECISIONS THAT ACTUALLY MATTER
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
