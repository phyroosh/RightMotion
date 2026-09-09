import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  GlossyGlowGraph,
  GlossyBarChart,
  GlossyRadialDial,
  GlossyBalanceScale,
  GlossyFrictionSlider,
  GlossyToggleBoard,
  SteppedProgressionStairs,
  GlossyFeatureGrid,
  PolishStickerFloat,
  KineticTypoLadder,
  ArchitecturalDraftingCanvas,
  VectorCursor,
} from "../../components/pure_graphics";
import { TacticalMemeCard } from "../../components/TacticalMemeCard";
import { MemeStickerOverlay } from "../../components/MemeStickerOverlay";
import { WordTimestamp } from "../../types";

/*
 * =====================================================================================
 * 🎬 BESPOKE MOTION DESIGN CANVAS: TrainYourBrainCanvas
 * =====================================================================================
 * Topic: Train Your Brain Better (Neuroplasticity & Cognitive Resistance)
 * Script-synchronized 4-Beat Information Architecture:
 * - Scene 1 (Frames 0-167): Hook — Neural Pathways Adapt Blindly to Repetition
 * - Scene 2 (Frames 167-313): Mechanism — Neuroplasticity: Myelinated vs Pruned Circuits
 * - Scene 3 (Frames 313-592): Trap — Passive Scrolling Literally Trains Distraction
 * - Scene 4 (Frames 592-1053): Protocol — 20-Min Cognitive Resistance (Read/Solve/Recall)
 * =====================================================================================
 */

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const TrainYourBrainCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none">
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* ── SCENE 1: THE HOOK ─ "Brain gets trained by repetition" (Frames 0-167) ─ */}
      {/* ========================================================================= */}
      {frame >= 0 && frame < 167 && (() => {
        const cam1 = interpolate(frame, [0, 167], [1.0, 1.03], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.0, 0.0, 0.2, 1.0),
        });
        
        // After Judy fully exits (frame 112+), reveal the hero graph and clean cards
        const heroOp = interpolate(frame, [112, 126], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        const heroY = interpolate(frame, [112, 126], [30, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        const cardsOp = interpolate(frame, [122, 136], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const cardsY = interpolate(frame, [122, 136], [24, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        const cntProg = interpolate(frame, [128, 155], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        const breathe = 1 + Math.sin((frame / fps) * 1.1) * 0.05;

        return (
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{ transform: `scale(${cam1})`, transformOrigin: "50% 48%" }}
          >
            {/* Atmospheric Emerald Back-Glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "44%",
                width: `${600 * breathe}px`,
                height: `${600 * breathe}px`,
                transform: "translate(-50%,-50%)",
                background: "radial-gradient(ellipse, rgba(16, 185, 129, 0.18) 0%, transparent 65%)",
                borderRadius: "50%",
                filter: "blur(35px)",
                opacity: interpolate(frame, [112, 125], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
              }}
            />

            {/* ── 3-Tier Kinetic Typographic Ladder ── */}
            <KineticTypoLadder
              leadIn="YOUR BRAIN GETS"
              slamWord="TRAINED"
              punchText="BY REPETITION"
              startFrame={3}
              theme="light"
              accentColor="#10b981"
              showSelectionBox={true}
              showCursor={true}
              cursorType="arrow"
              yOffset="10%"
              align="center"
            />

            {/* HERO CENTERPIECE: Centered Synapse Growth Graph (Canva Cleanliness) */}
            <div
              className="absolute flex flex-col items-center z-10"
              style={{
                top: "26%",
                left: "50%",
                transform: `translateX(-50%) translateY(${heroY}px)`,
                opacity: heroOp,
                width: "900px",
              }}
            >
              <GlossyGlowGraph
                title=""
                entranceFrame={112}
                yLabel="SYNAPSE"
                xLabels={["DAY 1", "DAY 7", "DAY 21", "AUTO"]}
                showFloorReflection={false}
                theme="light"
                curves={[
                  {
                    id: "active_pathway",
                    label: "SYNAPSE DENSITY",
                    color: "#10b981",
                    glowColor: "#10b981",
                    startFrame: 118,
                    durationFrames: 30,
                    showArrow: true,
                    pathD: "M 100 280 C 220 270, 360 210, 520 120 C 640 55, 740 40, 810 32",
                    areaD: "M 100 310 L 100 280 C 220 270, 360 210, 520 120 C 640 55, 740 40, 810 32 L 810 310 Z",
                    tipX: 810,
                    tipY: 32,
                  },
                  {
                    id: "neglected_pathway",
                    label: "INACTIVE",
                    color: "#94a3b8",
                    glowColor: "#cbd5e1",
                    startFrame: 126,
                    durationFrames: 30,
                    showArrow: true,
                    pathD: "M 100 280 C 280 282, 460 285, 600 280 C 690 276, 750 265, 810 260",
                    areaD: "M 100 310 L 100 280 C 280 282, 460 285, 600 280 C 690 276, 750 265, 810 260 L 810 310 Z",
                    tipX: 810,
                    tipY: 260,
                  },
                ]}
                width={880}
                height={390}
              />
            </div>

            {/* SYMMETRICAL DUAL STATUS CARDS (Anchored cleanly at top: 56%, centered) */}
            <div
              className="absolute flex justify-between items-center pointer-events-none z-20"
              style={{
                top: "56%",
                left: "50%",
                transform: `translateX(-50%) translateY(${cardsY}px)`,
                opacity: cardsOp,
                width: "880px",
              }}
            >
              {/* Left Card: Repetition Wins */}
              <div
                className="flex flex-col gap-2 p-6 rounded-3xl"
                style={{
                  width: "425px",
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "2.5px solid #10b981",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.08), 0 0 25px rgba(16, 185, 129, 0.15)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
                    ADAPTATION RULE
                  </span>
                  <span className="text-xl font-mono font-black text-emerald-600">
                    +{Math.round(cntProg * 280)}%
                  </span>
                </div>
                <span className="text-3xl font-display font-black tracking-tight text-slate-900 leading-tight">
                  REPETITION WINS
                </span>
                <span className="text-sm font-mono font-bold text-slate-500 uppercase tracking-wide">
                  Brain automates what you repeat
                </span>
              </div>

              {/* Right Card: Useless Habits */}
              <div
                className="flex flex-col gap-2 p-6 rounded-3xl"
                style={{
                  width: "425px",
                  background: "rgba(255, 255, 255, 0.95)",
                  border: "2.5px solid rgba(244, 63, 94, 0.7)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 16px 40px rgba(0,0,0,0.08), 0 0 25px rgba(244, 63, 94, 0.12)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-black tracking-wider uppercase text-rose-700 bg-rose-100/80 px-3 py-1 rounded-full">
                    BLIND MOTOR
                  </span>
                  <span className="text-xl font-mono font-black text-rose-500">
                    AUTOPILOT
                  </span>
                </div>
                <span className="text-3xl font-display font-black tracking-tight text-slate-900 leading-tight">
                  USELESS HABITS
                </span>
                <span className="text-sm font-mono font-bold text-slate-500 uppercase tracking-wide">
                  Distraction becomes hardwired
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* ── SCENE 2: THE MECHANISM ─ Neuroplasticity Pathways (Frames 167-313) ─── */}
      {/* ========================================================================= */}
      {frame >= 167 && frame < 313 && (() => {
        const sceneF = frame - 167;
        const cam2 = interpolate(sceneF, [0, 146], [1.03, 1.0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        const topTrackOp = interpolate(sceneF, [10, 28], [0, 1], { extrapolateRight: "clamp" });
        const topTrackX = interpolate(sceneF, [10, 28], [-30, 0], {
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        const btmTrackOp = interpolate(sceneF, [24, 42], [0, 1], { extrapolateRight: "clamp" });
        const btmTrackX = interpolate(sceneF, [24, 42], [30, 0], {
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        const statsOp = interpolate(sceneF, [50, 70], [0, 1], { extrapolateRight: "clamp" });

        // Sub-scene sequencing: fade out paths and pop up the stats bar
        const pathsExitOp = interpolate(sceneF, [100, 115], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const pathsScale = interpolate(sceneF, [100, 115], [1, 0.95], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });
        const statsTop = interpolate(sceneF, [100, 120], [54, 38], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });
        const statsScale = interpolate(sceneF, [100, 120], [1, 1.25], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });

        // High-velocity electrical signal pulse traveling along the active pathway
        const pulseProgress = (sceneF * 8) % 680;
        const breathe = 1 + Math.sin((frame / fps) * 1.1) * 0.05;

        return (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ transform: `scale(${cam2})`, transformOrigin: "50% 48%" }}
          >
            {/* Atmospheric Cyan Glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "40%",
                width: `${600 * breathe}px`,
                height: `${600 * breathe}px`,
                transform: "translate(-50%,-50%)",
                background: "radial-gradient(ellipse, rgba(2, 132, 199, 0.16) 0%, transparent 65%)",
                borderRadius: "50%",
                filter: "blur(32px)",
              }}
            />

            {/* ── 3-Tier Kinetic Typographic Ladder ── */}
            <KineticTypoLadder
              leadIn="THE MECHANISM IS"
              slamWord="NEUROPLASTICITY"
              punchText="USE IT OR LOSE IT"
              startFrame={170}
              theme="light"
              accentColor="#0284c7"
              showSelectionBox={true}
              showCursor={true}
              cursorType="arrow"
              yOffset="10%"
              align="center"
            />

            {/* DUAL SYNAPTIC PATHWAY SHOWCASE (Safe Zone: top: 25%) */}
            <div
              className="absolute flex flex-col gap-6 items-center w-full max-w-[960px]"
              style={{ top: "26%", opacity: pathsExitOp, transform: `scale(${pathsScale})` }}
            >
              {/* TOP PATHWAY: Frequently Used (Myelinated, Strong, Pulsing) */}
              <div
                className="w-full flex flex-col gap-4 p-8 rounded-[32px]"
                style={{
                  background: "rgba(255, 255, 255, 0.90)",
                  border: "3px solid #10b981",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.1), 0 0 30px rgba(16, 185, 129, 0.2)",
                  backdropFilter: "blur(20px)",
                  opacity: topTrackOp,
                  transform: `translateX(${topTrackX}px)`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span
                      className="px-5 py-2 rounded-full text-base font-mono font-black uppercase text-emerald-700"
                      style={{ background: "rgba(16, 185, 129, 0.15)", border: "1.5px solid #10b981" }}
                    >
                      FREQUENTLY USED
                    </span>
                    <span className="text-2xl font-display font-black text-slate-900 tracking-tight">
                      THICK MYELIN SHEATH
                    </span>
                  </div>
                  <span className="text-xl font-mono font-black text-emerald-600">
                    +100% SIGNAL VELOCITY
                  </span>
                </div>

                {/* SVG Circuit Highway */}
                <div className="relative w-full h-14 bg-emerald-50/80 rounded-[20px] overflow-hidden border border-emerald-200/60 flex items-center px-6">
                  <svg className="w-full h-5 overflow-visible">
                    <line
                      x1="0"
                      y1="10"
                      x2="850"
                      y2="10"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    {/* Animated Traveling Signal Spark */}
                    <circle
                      cx={pulseProgress}
                      cy="10"
                      r="12"
                      fill="#34d399"
                      filter="drop-shadow(0 0 10px #10b981)"
                    />
                    <circle cx={pulseProgress} cy="10" r="5" fill="#ffffff" />
                  </svg>
                </div>
              </div>

              {/* BOTTOM PATHWAY: Neglected (Pruned, Atrophied, Fading) */}
              <div
                className="w-full flex flex-col gap-4 p-8 rounded-[32px]"
                style={{
                  background: "rgba(255, 255, 255, 0.90)",
                  border: "3px solid rgba(244, 63, 94, 0.7)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.1), 0 0 30px rgba(244, 63, 94, 0.15)",
                  backdropFilter: "blur(20px)",
                  opacity: btmTrackOp,
                  transform: `translateX(${btmTrackX}px)`,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span
                      className="px-5 py-2 rounded-full text-base font-mono font-black uppercase text-rose-700"
                      style={{ background: "rgba(244, 63, 94, 0.15)", border: "1.5px solid #f43f5e" }}
                    >
                      NEGLECTED
                    </span>
                    <span className="text-2xl font-display font-black text-slate-800 tracking-tight">
                      SYNAPTIC PRUNING
                    </span>
                  </div>
                  <span className="text-xl font-mono font-black text-rose-500">
                    -85% SIGNAL LOSS
                  </span>
                </div>

                {/* SVG Broken Circuit */}
                <div className="relative w-full h-14 bg-rose-50/60 rounded-[20px] overflow-hidden border border-rose-200/50 flex items-center px-6">
                  <svg className="w-full h-5 overflow-visible">
                    <line
                      x1="0"
                      y1="10"
                      x2="850"
                      y2="10"
                      stroke="#f43f5e"
                      strokeWidth="5"
                      strokeDasharray="14 14"
                      strokeLinecap="round"
                      opacity="0.5"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Bottom Live Telemetry Stat Bar (Safe Zone: starts top: 54%, scales up) */}
            <div
              className="absolute flex gap-16 items-center px-14 py-6 rounded-[32px] z-20"
              style={{
                top: `${statsTop}%`,
                left: "50%",
                transform: `translateX(-50%) scale(${statsScale})`,
                opacity: statsOp,
                background: "rgba(255, 255, 255, 0.96)",
                border: "2.5px solid rgba(15, 23, 42, 0.12)",
                boxShadow: "0 16px 45px rgba(0,0,0,0.1), 0 0 20px rgba(0,0,0,0.05)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-7xl font-black font-mono tracking-tight text-emerald-600">
                  98.4%
                </span>
                <span className="text-base font-mono font-black tracking-widest uppercase text-slate-600">
                  TRANSMISSION SPEED
                </span>
              </div>
              <div style={{ width: "3px", height: "64px", background: "rgba(0,0,0,0.12)" }} />
              <div className="flex flex-col items-center gap-1">
                <span className="text-7xl font-black font-mono tracking-tight text-rose-600">
                  0.14ms
                </span>
                <span className="text-base font-mono font-black tracking-widest uppercase text-slate-600">
                  SYNAPSE LATENCY
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* ── SCENE 3: THE TRAP ─ Passive Scrolling Balance Scale (Frames 313-592) ── */}
      {/* ========================================================================= */}
      {frame >= 313 && frame < 592 && (() => {
        const sceneF = frame - 313;
        const cam3 = interpolate(sceneF, [0, 90], [0.97, 1.02], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        // Cards Enter
        const leftX = interpolate(sceneF, [0, 28], [-40, 0], {
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        const leftOp = interpolate(sceneF, [0, 22], [0, 1], { extrapolateRight: "clamp" });
        const rightX = interpolate(sceneF, [12, 40], [40, 0], {
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        const rightOp = interpolate(sceneF, [12, 34], [0, 1], { extrapolateRight: "clamp" });

        // Phase 2: Fade out Scale & Cards around frame 140
        const p1Op = interpolate(sceneF, [130, 150], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        
        // Phase 2: Fade in ToggleBoard and FrictionSlider
        const p2Op = interpolate(sceneF, [145, 165], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const p2Y = interpolate(sceneF, [145, 165], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });

        const breathe = 1 + Math.sin((frame / fps) * 1.1) * 0.05;

        return (
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{ transform: `scale(${cam3})`, transformOrigin: "50% 50%" }}
          >
            {/* Atmospheric Rose/Alert Glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "30%",
                top: "45%",
                width: `${500 * breathe}px`,
                height: `${500 * breathe}px`,
                transform: "translate(-50%,-50%)",
                background: "radial-gradient(ellipse, rgba(244, 63, 94, 0.16) 0%, transparent 65%)",
                borderRadius: "50%",
                filter: "blur(30px)",
                opacity: p1Op,
              }}
            />

            {/* ── 3-Tier Kinetic Typographic Ladder ── */}
            <KineticTypoLadder
              leadIn="THE HIDDEN TRAP"
              slamWord="PASSIVE SCROLLING"
              punchText="TRAINS DISTRACTION"
              startFrame={316}
              theme="light"
              accentColor="#f43f5e"
              showSelectionBox={true}
              showCursor={true}
              cursorType="arrow"
              yOffset="10%"
              align="center"
            />

            {/* ==== PHASE 1: BALANCE SCALE & SYMMETRICAL CARDS ==== */}
            <div className="absolute inset-0 flex flex-col items-center" style={{ opacity: p1Op }}>
              {/* CENTER: Hero Balance Scale */}
              <div
                className="absolute flex justify-center items-center"
                style={{ top: "26%", left: "50%", transform: "translateX(-50%)", width: "860px" }}
              >
                <GlossyBalanceScale
                  title=""
                  titleColor="#0f172a"
                  leftLabel="PASSIVE SCROLL"
                  leftSub="DOPAMINE DRIP"
                  leftColor="#f43f5e"
                  rightLabel="COGNITIVE STIMULUS"
                  rightSub="DEEP RESISTANCE"
                  rightColor="#10b981"
                  winner="left"
                  startFrame={313}
                  width={840}
                  height={420}
                  glowColor="rgba(244, 63, 94, 0.15)"
                  showFloorReflection={false}
                />
              </div>

              {/* TWO SYMMETRICAL COMPARATIVE VERDICT CARDS (Anchored at top: 56%, centered) */}
              <div
                className="absolute flex justify-between items-center pointer-events-none z-20"
                style={{ top: "56%", left: "50%", transform: "translateX(-50%)", width: "880px" }}
              >
                {/* Trap Card */}
                <div
                  className="flex flex-col gap-2 p-6 rounded-3xl"
                  style={{
                    width: "425px",
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "2.5px solid rgba(244, 63, 94, 0.8)",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.08), 0 0 25px rgba(244, 63, 94, 0.12)",
                    opacity: leftOp,
                    transform: `translateX(${leftX}px)`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-mono font-black uppercase tracking-wider px-3 py-1 rounded-full"
                      style={{ background: "rgba(244, 63, 94, 0.15)", color: "#e11d48", border: "1.5px solid #f43f5e" }}
                    >
                      THE INVISIBLE TRAP
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">AUTOPILOT</span>
                  </div>
                  <span className="text-3xl font-display font-black text-slate-900 leading-tight">
                    ATTENTION ATROPHY
                  </span>
                  <span className="text-sm font-mono font-bold text-rose-600 uppercase tracking-wide">
                    Zero effort trains distraction
                  </span>
                </div>

                {/* Protocol Principle Card */}
                <div
                  className="flex flex-col gap-2 p-6 rounded-3xl"
                  style={{
                    width: "425px",
                    background: "rgba(255, 255, 255, 0.95)",
                    border: "2.5px solid rgba(16, 185, 129, 0.8)",
                    boxShadow: "0 16px 40px rgba(0,0,0,0.08), 0 0 25px rgba(16, 185, 129, 0.12)",
                    opacity: rightOp,
                    transform: `translateX(${rightX}px)`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-mono font-black uppercase tracking-wider px-3 py-1 rounded-full"
                      style={{ background: "rgba(16, 185, 129, 0.15)", color: "#059669", border: "1.5px solid #10b981" }}
                    >
                      THE BIOLOGICAL RULE
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600">STIMULUS</span>
                  </div>
                  <span className="text-3xl font-display font-black text-slate-900 leading-tight">
                    RESISTANCE BUILDS
                  </span>
                  <span className="text-sm font-mono font-bold text-emerald-700 uppercase tracking-wide">
                    Circuits require difficulty
                  </span>
                </div>
              </div>
            </div>

            {/* ==== PHASE 2: CENTERED FRICTION SLIDER (Clean & Minimalist Canva Hero) ==== */}
            <div
              className="absolute inset-0 flex flex-col items-center pointer-events-none"
              style={{ opacity: p2Op, transform: `translateY(${p2Y}px)` }}
            >
              <div
                className="absolute flex flex-col items-center"
                style={{ top: "32%", left: "50%", transform: "translateX(-50%)", width: "860px" }}
              >
                <GlossyFrictionSlider
                  title="COGNITIVE FRICTION"
                  titleColor="#0f172a"
                  accentColor="#10b981"
                  glowColor="rgba(16, 185, 129, 0.25)"
                  startFrame={458} // 313 + 145
                  theme="light"
                  showFloorReflection={false}
                  width={840}
                />
              </div>

              {/* Centered Minimalist Rule Banner */}
              <div
                className="absolute flex items-center justify-between px-8 py-5 rounded-[28px] bg-white/95 border-2 border-emerald-500 shadow-xl"
                style={{ top: "54%", left: "50%", transform: "translateX(-50%)", width: "860px" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                  <span className="text-lg font-mono font-black text-emerald-700 uppercase">BIOLOGICAL LAW</span>
                </div>
                <span className="text-2xl font-display font-black text-slate-900">FRICTION TRIGGERS MYELIN</span>
                <span className="text-base font-mono font-bold text-slate-500 uppercase">EFFORT = GROWTH</span>
              </div>
            </div>

          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* ── SCENE 4: THE PROTOCOL ─ Canva-Clean 3-Phase Resolution (Frames 592-1053) ─ */}
      {/* ========================================================================= */}
      {frame >= 592 && (() => {
        const sceneF = frame - 592;
        const cam4 = interpolate(sceneF, [0, 120], [0.97, 1.01], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        
        // Phase 1 (0 to 145) -> Centered Chronograph Dial
        const p1Op = interpolate(sceneF, [130, 145], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const p1Scale = interpolate(sceneF, [130, 145], [1, 0.96], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

        // Phase 2 (145 to 285) -> Centered Progression Staircase
        const p2Op = interpolate(sceneF, [145, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const p2Out = interpolate(sceneF, [270, 285], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const p2Y = interpolate(sceneF, [145, 160], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });

        // Phase 3 (285 to End) -> Feature Grid + Centered Telemetry Verdict
        const p3Op = interpolate(sceneF, [285, 300], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const p3Y = interpolate(sceneF, [285, 300], [30, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) });

        const breathe = 1 + Math.sin((frame / fps) * 1.1) * 0.05;

        return (
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{ transform: `scale(${cam4})`, transformOrigin: "50% 50%" }}
          >
            {/* Atmospheric Gold/Sky Ambient Glow */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "44%",
                width: `${550 * breathe}px`,
                height: `${550 * breathe}px`,
                transform: "translate(-50%,-50%)",
                background: "radial-gradient(ellipse, rgba(2, 132, 199, 0.16) 0%, transparent 65%)",
                borderRadius: "50%",
                filter: "blur(35px)",
              }}
            />

            {/* ── 3-Tier Kinetic Typographic Ladder ── */}
            <KineticTypoLadder
              leadIn="THE DAILY PROTOCOL"
              slamWord="COGNITIVE RESISTANCE"
              punchText="20 MIN DAILY"
              startFrame={595}
              theme="light"
              accentColor="#0284c7"
              showSelectionBox={true}
              showCursor={true}
              cursorType="arrow"
              yOffset="10%"
              align="center"
            />

            {/* ==== PHASE 1: CENTERED CHRONOGRAPH DIAL (Minimalist & Focused) ==== */}
            <div
              className="absolute inset-0 flex flex-col items-center"
              style={{ opacity: p1Op, transform: `scale(${p1Scale})`, pointerEvents: "none" }}
            >
              {/* Centered 360° Circular Chronograph Dial */}
              <div
                className="absolute flex justify-center items-center"
                style={{ top: "27%", left: "50%", transform: "translateX(-50%)", width: "860px" }}
              >
                <GlossyRadialDial
                  title=""
                  titleColor="#0f172a"
                  targetPercent={100}
                  valueText="20 MIN"
                  labelText="DAILY RESISTANCE"
                  accentColor="#0284c7"
                  glowColor="rgba(2, 132, 199, 0.25)"
                  startFrame={595}
                  size={420}
                  showFloorReflection={false}
                  theme="light"
                />
              </div>

              {/* Centered Protocol Rule Banner */}
              <div
                className="absolute flex items-center justify-between px-8 py-5 rounded-[28px] bg-white/95 border-2 border-sky-500 shadow-xl"
                style={{ top: "56%", left: "50%", transform: "translateX(-50%)", width: "860px" }}
              >
                <span className="text-xl font-mono font-black text-sky-700 uppercase">PROTOCOL RULE</span>
                <span className="text-3xl font-display font-black text-slate-900">20 MIN ACTIVE FRICTION</span>
                <span className="text-base font-mono font-bold text-slate-500 uppercase">DAILY MINIMUM</span>
              </div>
            </div>

            {/* ==== PHASE 2: CENTERED STEPPED PROGRESSION STAIRS ==== */}
            <div
              className="absolute inset-0 flex flex-col items-center"
              style={{ opacity: Math.min(p2Op, p2Out), transform: `translateY(${p2Y}px)`, pointerEvents: "none" }}
            >
              <div
                className="absolute flex justify-center items-center"
                style={{ top: "27%", left: "50%", transform: "translateX(-50%)", width: "860px" }}
              >
                <SteppedProgressionStairs
                  title=""
                  titleColor="#0f172a"
                  orbColor="#fbbf24"
                  startFrame={740}
                  stepDurationFrames={24}
                  showFloorReflection={false}
                  theme="light"
                  width={840}
                  height={420}
                  steps={[
                    { id: "s1_brain", label: "READ" },
                    { id: "s2_brain", label: "SOLVE" },
                    { id: "s3_brain", label: "RECALL" },
                    { id: "s4_brain", label: "STRONG CIRCUITS", isGoal: true },
                  ]}
                />
              </div>

              {/* Centered Subtitle Banner */}
              <div
                className="absolute flex items-center justify-center px-8 py-5 rounded-[28px] bg-amber-50/95 border-2 border-amber-400 shadow-lg text-center"
                style={{ top: "56%", left: "50%", transform: "translateX(-50%)", width: "860px" }}
              >
                <span className="text-2xl font-display font-black text-amber-900 tracking-wide">
                  READ • SOLVE • RECALL (ACTIVE EFFORT GROWS CIRCUITS)
                </span>
              </div>
            </div>

            {/* ==== PHASE 3: CENTERED 4-CARD PROTOCOL MATRIX + TELEMETRY VERDICT ==== */}
            <div
              className="absolute inset-0 flex flex-col items-center pointer-events-none"
              style={{ opacity: p3Op, transform: `translateY(${p3Y}px)` }}
            >
              {/* 4-Card Grid (w-[880px], perfectly balanced) */}
              <div
                className="absolute grid grid-cols-2 gap-5"
                style={{ top: "31%", left: "50%", transform: "translateX(-50%)", width: "880px" }}
              >
                {[
                  { title: "THICK MYELIN", desc: "Rapid signal conductance", color: "#10b981", badge: "01" },
                  { title: "RAPID RECALL", desc: "Zero cognitive latency", color: "#0284c7", badge: "02" },
                  { title: "DEEP FOCUS", desc: "Attention resistance shield", color: "#6366f1", badge: "03" },
                  { title: "NEUROGENESIS", desc: "Permanent neural rewiring", color: "#f59e0b", badge: "04" },
                ].map((item, idx) => {
                  const itemSpring = spring({
                    frame: Math.max(0, sceneF - (288 + idx * 5)),
                    fps,
                    config: { damping: 14, mass: 0.7, stiffness: 140 },
                  });
                  return (
                    <div
                      key={item.badge}
                      className="flex items-center gap-5 px-6 py-5 rounded-[28px]"
                      style={{
                        background: "rgba(255, 255, 255, 0.96)",
                        border: `2.5px solid ${item.color}99`,
                        backdropFilter: "blur(20px)",
                        boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
                        transform: `scale(${interpolate(itemSpring, [0, 1], [0.92, 1])})`,
                        opacity: itemSpring,
                      }}
                    >
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-black text-xl text-white shrink-0 shadow-md"
                        style={{ background: item.color }}
                      >
                        ✓
                      </div>
                      <div className="flex flex-col">
                        <span className="text-2xl font-display font-black text-slate-900 leading-tight">
                          {item.title}
                        </span>
                        <span className="text-sm font-mono font-bold text-slate-500 uppercase tracking-wide">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Massive Centered Telemetry Verdict Bar */}
              <div
                className="absolute flex gap-12 items-center px-10 py-5 rounded-[32px] z-20"
                style={{
                  top: "48%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "880px",
                  background: "rgba(255, 255, 255, 0.96)",
                  border: "3px solid rgba(2, 132, 199, 0.7)",
                  backdropFilter: "blur(24px)",
                  boxShadow: "0 24px 60px rgba(0,0,0,0.1), 0 0 30px rgba(2, 132, 199, 0.2)",
                  justifyContent: "space-around",
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-sky-500 shadow-[0_0_12px_#0284c7]" />
                  <span className="text-lg font-mono font-black text-sky-700 tracking-wider">RULE:</span>
                  <span className="text-3xl font-display font-black text-slate-900">REPETITION + DIFFICULTY</span>
                </div>
                <div style={{ width: "3px", height: "42px", background: "rgba(0,0,0,0.15)" }} />
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_12px_#fbbf24]" />
                  <span className="text-lg font-mono font-black text-amber-700 tracking-wider">GOAL:</span>
                  <span className="text-3xl font-display font-black text-slate-900">STRONGER CIRCUITS</span>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
