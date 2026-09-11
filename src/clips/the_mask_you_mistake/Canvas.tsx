import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  GlossyGlowGraph,
  GlossyRadialDial,
  KineticTypoLadder,
} from "../../components/pure_graphics";
import { TacticalMemeCard } from "../../components/TacticalMemeCard";
import { MemeStickerOverlay } from "../../components/MemeStickerOverlay";
import { WordTimestamp } from "../../types";
import {
  Activity,
  Compass,
  Eye,
  EyeOff,
  Shield,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ArrowRight,
  Zap,
  Radio,
  Sliders,
  Check,
  X,
} from "lucide-react";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * 🎬 TheMaskYouMistakeCanvas — Bespoke Remotion Motion Composition
 * Topic: "The Mask You Mistake" {Self Improvement}
 *
 * Safe zones:
 * - Primary graphics strictly between top: 6% and top: 68% (y: 115px to 1300px)
 * - Kinetic Captions reserved: top: 73% to top: 81%
 * - Zero overlap with captions!
 *
 * 4 Distinct Pillar Scenes:
 *   Scene 1 (Frames 0 → 416):   The Cognitive Paradox & Neural Priority Inversion
 *   Scene 2 (Frames 416 → 636): The Conditioning Fork (Reaction Choice vs Raw Preference)
 *   Scene 3 (Frames 637 → 845): The 24-Hour Protocol (3 Banned Defenses & Solitary Baseline Radar)
 *   Scene 4 (Frames 845 → 1018): The Epiphany (Authenticity is Subtraction, Not Volume)
 */
export const TheMaskYouMistakeCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full select-none overflow-hidden font-sans">
      {/* ======================================================== */}
      {/* TACTICAL RETENTION MEME POP (< 2.5s Strict Cap)          */}
      {/* ======================================================== */}
      <TacticalMemeCard
        memeId="sweating_gamer"
        startFrame={0}
        durationFrames={44}
        playbackRate={1.4}
        hudLabel="PERFORMANCE PANIC // TRYHARD"
        theme="apple_studio"
        position="top"
      />

      {/* ======================================================== */}
      {/* MID-VIDEO GEN-Z MEME REACTION STICKER POP               */}
      {/* Positioned safely in upper-right to avoid card collision */}
      {/* ======================================================== */}
      <MemeStickerOverlay
        stickerId="talking_to_brick_wall"
        startFrame={451}
        durationFrames={34}
        position="top-right"
        badgeText="TALKING TO A WALL"
      />

      {/* ======================================================== */}
      {/* SCENE 1: THE COGNITIVE PARADOX (Frames 0 → 416)          */}
      {/* ======================================================== */}
      {frame >= 0 && frame < 416 && (() => {
        const cam1 = interpolate(frame, [0, 416], [1.0, 1.04], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.0, 0.0, 0.2, 1.0),
        });
        const graphEnter = spring({
          frame: Math.max(0, frame - 38),
          fps,
          config: { damping: 15, mass: 0.8, stiffness: 120 },
        });

        // Cards enter cleanly as Judy finishes pointing and glides down (frame 110)
        const card1Enter = spring({
          frame: Math.max(0, frame - 110),
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 130 },
        });
        const card2Enter = spring({
          frame: Math.max(0, frame - 125),
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 130 },
        });
        const threatEnter = spring({
          frame: Math.max(0, frame - 165),
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 125 },
        });

        const disconnectCount = Math.round(
          interpolate(frame, [110, 220], [20, 88], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.22, 1, 0.36, 1),
          })
        );

        return (
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{ transform: `scale(${cam1})`, transformOrigin: "50% 40%" }}
          >
            {/* Ambient Studio Radiance */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "30%",
                top: "35%",
                width: "600px",
                height: "600px",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(ellipse, rgba(244, 63, 94, 0.12) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                left: "70%",
                top: "45%",
                width: "550px",
                height: "550px",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(ellipse, rgba(2, 132, 199, 0.10) 0%, transparent 70%)",
                filter: "blur(35px)",
              }}
            />

            {/* 3-Tier Kinetic Typographic Ladder */}
            <KineticTypoLadder
              leadIn="THE COGNITIVE PARADOX"
              slamWord="SOCIAL MASKING"
              punchText="BURIES REAL DESIRE"
              startFrame={10}
              theme="light"
              accentColor="#f43f5e"
              showSelectionBox={true}
              showCursor={true}
              cursorType="arrow"
              yOffset="7%"
              align="center"
            />

            {/* Vector Graph: Inversion of Neural Priorities */}
            <div
              className="absolute flex flex-col items-center"
              style={{
                top: "23%",
                opacity: graphEnter,
                transform: `scale(${interpolate(graphEnter, [0, 1], [0.92, 1.0])})`,
              }}
            >
              <GlossyGlowGraph
                title=""
                entranceFrame={40}
                yLabel="NEURAL PRIORITY"
                xLabels={["ORIGIN", "PERFORM", "ADAPT", "MASKED"]}
                theme="light"
                showFloorReflection={false}
                width={820}
                height={370}
                curves={[
                  {
                    id: "external_signals",
                    label: "EXTERNAL APPROVAL",
                    color: "#f43f5e",
                    glowColor: "#f43f5e",
                    startFrame: 48,
                    durationFrames: 45,
                    showArrow: true,
                    pathD: "M 100 295 C 210 280, 310 180, 380 130 C 440 90, 490 75, 548 70",
                    areaD: "M 100 330 L 100 295 C 210 280, 310 180, 380 130 C 440 90, 490 75, 548 70 L 548 330 Z",
                    tipX: 548,
                    tipY: 70,
                  },
                  {
                    id: "internal_signals",
                    label: "INTERNAL SIGNALS",
                    color: "#0284c7",
                    glowColor: "#0284c7",
                    startFrame: 60,
                    durationFrames: 45,
                    showArrow: true,
                    pathD: "M 100 95 C 190 110, 270 210, 350 255 C 420 295, 480 310, 548 318",
                    areaD: "M 100 330 L 100 95 C 190 110, 270 210, 350 255 C 420 295, 480 310, 548 318 L 548 330 Z",
                    tipX: 548,
                    tipY: 318,
                  },
                ]}
              />
            </div>

            {/* Twin High-Contrast Telemetry Badges (Entering frame 110 as Judy glides out) */}
            <div
              className="absolute w-[860px] flex justify-between gap-6"
              style={{ top: "48%" }}
            >
              {/* External Feedback Card */}
              <div
                className="flex-1 p-5 rounded-3xl flex flex-col gap-2"
                style={{
                  opacity: card1Enter,
                  transform: `translateX(${interpolate(card1Enter, [0, 1], [-25, 0])}px)`,
                  background: "linear-gradient(135deg, rgba(255, 241, 242, 0.95) 0%, rgba(255, 255, 255, 0.92) 100%)",
                  border: "2.5px solid rgba(244, 63, 94, 0.4)",
                  boxShadow: "0 18px 36px rgba(244, 63, 94, 0.12), 0 2px 8px rgba(0,0,0,0.04)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-black tracking-widest text-rose-600 uppercase flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-500" />
                    EXTERNAL SIGNAL
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-rose-500/15 text-rose-700 border border-rose-500/30">
                    PRIORITY 1
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-mono font-black tracking-tight text-rose-600">
                    94%
                  </span>
                  <span className="text-sm font-sans font-bold text-rose-950/70">
                    Neural Override
                  </span>
                </div>
                <p className="text-xs font-sans font-semibold text-slate-600 leading-snug">
                  Brain conditioned to scan for outside reactions before acting.
                </p>
              </div>

              {/* Internal Signals Card */}
              <div
                className="flex-1 p-5 rounded-3xl flex flex-col gap-2"
                style={{
                  opacity: card2Enter,
                  transform: `translateX(${interpolate(card2Enter, [0, 1], [25, 0])}px)`,
                  background: "linear-gradient(135deg, rgba(240, 249, 255, 0.95) 0%, rgba(255, 255, 255, 0.92) 100%)",
                  border: "2.5px solid rgba(2, 132, 199, 0.4)",
                  boxShadow: "0 18px 36px rgba(2, 132, 199, 0.12), 0 2px 8px rgba(0,0,0,0.04)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-black tracking-widest text-sky-700 uppercase flex items-center gap-2">
                    <Compass className="w-4 h-4 text-sky-600" />
                    INTERNAL INSTINCT
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-sky-500/15 text-sky-800 border border-sky-500/30">
                    MUTED
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-5xl font-mono font-black tracking-tight text-sky-700">
                    12%
                  </span>
                  <span className="text-sm font-sans font-bold text-sky-950/70">
                    Signal Strength
                  </span>
                </div>
                <p className="text-xs font-sans font-semibold text-slate-600 leading-snug">
                  True personal preference suppressed beneath the performance.
                </p>
              </div>
            </div>

            {/* Staggered Threat Callout Banner (Frame 165+) */}
            <div
              className="absolute w-[860px] flex items-center justify-between px-7 py-4 rounded-2xl"
              style={{
                top: "60%",
                opacity: threatEnter,
                transform: `translateY(${interpolate(threatEnter, [0, 1], [20, 0])}px)`,
                background: "linear-gradient(135deg, rgba(254, 243, 199, 0.96) 0%, rgba(255, 251, 235, 0.94) 100%)",
                border: "2px solid rgba(245, 158, 11, 0.45)",
                boxShadow: "0 12px 30px rgba(245, 158, 11, 0.15)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-700">
                  <AlertTriangle className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-black tracking-widest text-amber-700 uppercase">
                    THREAT DETECTOR ENGAGED
                  </span>
                  <span className="text-lg font-sans font-black text-slate-900 leading-none">
                    Fear of Rejection Fuels the Mask
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-3xl font-mono font-black text-slate-900 leading-none">
                  {disconnectCount}%
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  Self-Disconnect
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 2: THE CONDITIONING FORK (Frames 416 → 636)        */}
      {/* ======================================================== */}
      {frame >= 416 && frame < 636 && (() => {
        const cam2 = interpolate(frame, [416, 636], [1.0, 1.04], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.0, 0.0, 0.2, 1.0),
        });
        const hubEnter = spring({
          frame: Math.max(0, frame - 418),
          fps,
          config: { damping: 15, mass: 0.8, stiffness: 120 },
        });
        const leftBranchEnter = spring({
          frame: Math.max(0, frame - 435),
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 130 },
        });
        const rightBranchEnter = spring({
          frame: Math.max(0, frame - 455),
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 130 },
        });
        const hijackEnter = spring({
          frame: Math.max(0, frame - 485),
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 125 },
        });

        return (
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{ transform: `scale(${cam2})`, transformOrigin: "50% 40%" }}
          >
            {/* Ambient Aura */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "38%",
                width: "650px",
                height: "650px",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(ellipse, rgba(245, 158, 11, 0.12) 0%, transparent 70%)",
                filter: "blur(40px)",
              }}
            />

            {/* Typographic Ladder */}
            <KineticTypoLadder
              leadIn="THE CONDITIONING FORK"
              slamWord="REACTION CHOICE"
              punchText="PREFERENCE REPLACED"
              startFrame={418}
              theme="light"
              accentColor="#f59e0b"
              showSelectionBox={true}
              showCursor={true}
              cursorType="arrow"
              yOffset="7%"
              align="center"
            />

            {/* Top Decision Hub */}
            <div
              className="absolute w-[860px] p-5 rounded-3xl flex items-center justify-between"
              style={{
                top: "23%",
                opacity: hubEnter,
                transform: `scale(${interpolate(hubEnter, [0, 1], [0.93, 1.0])})`,
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.96) 0%, rgba(248, 250, 252, 0.94) 100%)",
                border: "2.5px solid rgba(15, 23, 42, 0.12)",
                boxShadow: "0 16px 36px rgba(0, 0, 0, 0.06)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-slate-900 text-white shadow-md">
                  <Sliders className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-black tracking-widest text-slate-500 uppercase">
                    INCOMING DECISION POINT
                  </span>
                  <span className="text-2xl font-sans font-black text-slate-900">
                    "What Should I Do / Say / Choose?"
                  </span>
                </div>
              </div>
              <span className="px-4 py-2 rounded-full text-xs font-mono font-black bg-amber-500/15 text-amber-800 border border-amber-500/30">
                NEURAL FORK
              </span>
            </div>

            {/* Branching SVG Connector Lines */}
            <div
              className="absolute w-[860px] pointer-events-none"
              style={{ top: "33%", height: "70px" }}
            >
              <svg width="860" height="70" viewBox="0 0 860 70" fill="none">
                {/* Left Branch to Reaction */}
                <path
                  d="M 430 0 C 430 35, 215 35, 215 70"
                  stroke="#f43f5e"
                  strokeWidth="3.5"
                  strokeDasharray="8 6"
                  opacity={0.85}
                />
                {/* Right Branch to Preference */}
                <path
                  d="M 430 0 C 430 35, 645 35, 645 70"
                  stroke="#cbd5e1"
                  strokeWidth="2.5"
                  strokeDasharray="6 6"
                  opacity={0.6}
                />
              </svg>
            </div>

            {/* Choice Engine Comparison Branches */}
            <div
              className="absolute w-[860px] flex justify-between gap-6"
              style={{ top: "37%" }}
            >
              {/* Branch A: Conditioned Reaction (Red / 92% Auto Selection) */}
              <div
                className="flex-1 p-6 rounded-3xl flex flex-col gap-3 relative overflow-hidden"
                style={{
                  opacity: leftBranchEnter,
                  transform: `translateX(${interpolate(leftBranchEnter, [0, 1], [-20, 0])}px)`,
                  background: "linear-gradient(135deg, rgba(255, 241, 242, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)",
                  border: "3px solid rgba(244, 63, 94, 0.5)",
                  boxShadow: "0 20px 40px rgba(244, 63, 94, 0.16)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-rose-600 tracking-widest uppercase flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-rose-500" />
                    ROUTE A: EXPECTED REACTION
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-rose-500 text-white">
                    92% CHOSEN
                  </span>
                </div>

                <div className="text-2xl font-sans font-black text-slate-900 mt-1">
                  "Will they approve?"
                </div>

                <div className="flex items-center gap-2 text-xs font-sans font-bold text-rose-700 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>Conditioned habit to avoid judgment.</span>
                </div>

                <p className="text-xs font-sans font-semibold text-slate-600 leading-relaxed">
                  You stop consulting what you desire and solely calculate what will keep you safely accepted.
                </p>
              </div>

              {/* Branch B: Genuine Preference (Muted Slate / 08% Discarded) */}
              <div
                className="flex-1 p-6 rounded-3xl flex flex-col gap-3 relative overflow-hidden"
                style={{
                  opacity: rightBranchEnter,
                  transform: `translateX(${interpolate(rightBranchEnter, [0, 1], [20, 0])}px)`,
                  background: "linear-gradient(135deg, rgba(248, 250, 252, 0.95) 0%, rgba(255, 255, 255, 0.92) 100%)",
                  border: "2px solid rgba(148, 163, 184, 0.35)",
                  boxShadow: "0 14px 30px rgba(0, 0, 0, 0.05)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-slate-500 tracking-widest uppercase flex items-center gap-1.5">
                    <EyeOff className="w-4 h-4 text-slate-400" />
                    ROUTE B: TRUE PREFERENCE
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-slate-200 text-slate-600">
                    08% MUTED
                  </span>
                </div>

                <div className="text-2xl font-sans font-black text-slate-700 mt-1">
                  "What do I actually want?"
                </div>

                <div className="flex items-center gap-2 text-xs font-sans font-bold text-slate-600 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                  <X className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Silenced before conscious execution.</span>
                </div>

                <p className="text-xs font-sans font-semibold text-slate-500 leading-relaxed">
                  Internal signals fade from lack of use, until you forget what your genuine preference even was.
                </p>
              </div>
            </div>

            {/* Bottom Alert Pill: Decision Hijack */}
            <div
              className="absolute w-[860px] flex items-center justify-between px-7 py-4 rounded-2xl"
              style={{
                top: "58%",
                opacity: hijackEnter,
                transform: `translateY(${interpolate(hijackEnter, [0, 1], [20, 0])}px)`,
                background: "linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 41, 59, 0.96) 100%)",
                border: "2px solid rgba(255, 255, 255, 0.15)",
                boxShadow: "0 16px 36px rgba(0, 0, 0, 0.18)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                  <Zap className="w-6 h-6 text-amber-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-black tracking-widest text-amber-400 uppercase">
                    CONDITIONING SYSTEM ENGAGED
                  </span>
                  <span className="text-lg font-sans font-black text-white leading-none">
                    Decision Making Fully Externalized
                  </span>
                </div>
              </div>

              <span className="px-4 py-1.5 rounded-full text-xs font-mono font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">
                REVERSE WITH 1 DAILY RULE
              </span>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 3: THE 24-HOUR PROTOCOL (Frames 637 → 845)         */}
      {/* ======================================================== */}
      {frame >= 637 && frame < 845 && (() => {
        const cam3 = interpolate(frame, [637, 845], [1.0, 1.04], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.0, 0.0, 0.2, 1.0),
        });

        // 3 Rules Entrance
        const r1Enter = spring({
          frame: Math.max(0, frame - 648),
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 130 },
        });
        const r2Enter = spring({
          frame: Math.max(0, frame - 682),
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 130 },
        });
        const r3Enter = spring({
          frame: Math.max(0, frame - 716),
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 130 },
        });

        // Solitary Observation Mode Transition (frame 765+)
        const obsEnter = spring({
          frame: Math.max(0, frame - 765),
          fps,
          config: { damping: 15, mass: 0.8, stiffness: 120 },
        });

        const radarPulse = (Math.sin((frame / fps) * 4) + 1) / 2;

        return (
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{ transform: `scale(${cam3})`, transformOrigin: "50% 40%" }}
          >
            {/* Ambient Emerald Aura */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "40%",
                width: "680px",
                height: "680px",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(ellipse, rgba(16, 185, 129, 0.14) 0%, transparent 70%)",
                filter: "blur(45px)",
              }}
            />

            {/* Typographic Ladder */}
            <KineticTypoLadder
              leadIn="THE 24-HOUR PROTOCOL"
              slamWord="ONE DECISION"
              punchText="ZERO EXPLANATIONS"
              startFrame={638}
              theme="light"
              accentColor="#10b981"
              showSelectionBox={true}
              showCursor={true}
              cursorType="arrow"
              yOffset="7%"
              align="center"
            />

            {/* Phase A: The 3 Banned Behaviors (Frames 637 - 765) */}
            {frame < 765 && (
              <div
                className="absolute w-[860px] flex flex-col gap-4"
                style={{ top: "23%" }}
              >
                {/* Rule 01 */}
                <div
                  className="p-6 rounded-3xl flex items-center justify-between"
                  style={{
                    opacity: r1Enter,
                    transform: `translateY(${interpolate(r1Enter, [0, 1], [30, 0])}px)`,
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.94) 100%)",
                    border: "2.5px solid rgba(16, 185, 129, 0.45)",
                    boxShadow: "0 14px 32px rgba(16, 185, 129, 0.12)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center font-mono font-black text-2xl text-emerald-700">
                      01
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-mono font-black tracking-widest text-rose-600 uppercase">
                        FORBIDDEN: NO DEFENSE
                      </span>
                      <span className="text-2xl font-sans font-black text-slate-900">
                        Zero Explaining
                      </span>
                      <span className="text-sm font-sans font-semibold text-slate-500">
                        Never preface or follow your choice with a reason.
                      </span>
                    </div>
                  </div>
                  <span className="px-4 py-2 rounded-2xl text-xs font-mono font-black bg-rose-500/15 text-rose-700 border border-rose-500/30 uppercase">
                    BANNED ❌
                  </span>
                </div>

                {/* Rule 02 */}
                <div
                  className="p-6 rounded-3xl flex items-center justify-between"
                  style={{
                    opacity: r2Enter,
                    transform: `translateY(${interpolate(r2Enter, [0, 1], [30, 0])}px)`,
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.94) 100%)",
                    border: "2.5px solid rgba(16, 185, 129, 0.45)",
                    boxShadow: "0 14px 32px rgba(16, 185, 129, 0.12)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center font-mono font-black text-2xl text-emerald-700">
                      02
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-mono font-black tracking-widest text-rose-600 uppercase">
                        FORBIDDEN: NO EXCUSES
                      </span>
                      <span className="text-2xl font-sans font-black text-slate-900">
                        Zero Justifying
                      </span>
                      <span className="text-sm font-sans font-semibold text-slate-500">
                        Do not apologize or seek to soften the other person's reaction.
                      </span>
                    </div>
                  </div>
                  <span className="px-4 py-2 rounded-2xl text-xs font-mono font-black bg-rose-500/15 text-rose-700 border border-rose-500/30 uppercase">
                    BANNED ❌
                  </span>
                </div>

                {/* Rule 03 */}
                <div
                  className="p-6 rounded-3xl flex items-center justify-between"
                  style={{
                    opacity: r3Enter,
                    transform: `translateY(${interpolate(r3Enter, [0, 1], [30, 0])}px)`,
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.94) 100%)",
                    border: "2.5px solid rgba(16, 185, 129, 0.45)",
                    boxShadow: "0 14px 32px rgba(16, 185, 129, 0.12)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center font-mono font-black text-2xl text-emerald-700">
                      03
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-mono font-black tracking-widest text-rose-600 uppercase">
                        FORBIDDEN: NO SCANNING
                      </span>
                      <span className="text-2xl font-sans font-black text-slate-900">
                        Zero Reaction Checks
                      </span>
                      <span className="text-sm font-sans font-semibold text-slate-500">
                        Keep your eyes forward. Do not search their face for approval.
                      </span>
                    </div>
                  </div>
                  <span className="px-4 py-2 rounded-2xl text-xs font-mono font-black bg-rose-500/15 text-rose-700 border border-rose-500/30 uppercase">
                    BANNED ❌
                  </span>
                </div>

                {/* Bottom Takeaway Badge */}
                <div
                  className="p-4 rounded-2xl flex items-center justify-center gap-3 bg-emerald-500/15 border border-emerald-500/30 shadow-sm"
                >
                  <Lock className="w-5 h-5 text-emerald-700" />
                  <span className="text-sm font-mono font-black text-emerald-900 uppercase tracking-widest">
                    ONE SMALL UNAPOLOGETIC CHOICE PER DAY
                  </span>
                </div>
              </div>
            )}

            {/* Phase B: Solitary Observation Mode (Frames 765 - 845) */}
            {frame >= 765 && (
              <div
                className="absolute w-[860px] flex flex-col gap-6"
                style={{
                  top: "23%",
                  opacity: obsEnter,
                  transform: `scale(${interpolate(obsEnter, [0, 1], [0.94, 1.0])})`,
                }}
              >
                {/* Solitary Baseline Master Sensor Card */}
                <div
                  className="p-8 rounded-[40px] flex flex-col gap-6 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(240, 253, 244, 0.98) 0%, rgba(255, 255, 255, 0.96) 100%)",
                    border: "3.5px solid rgba(16, 185, 129, 0.5)",
                    boxShadow: "0 28px 56px rgba(16, 185, 129, 0.18)",
                    backdropFilter: "blur(20px)",
                  }}
                >
                  {/* Glowing Radar Rings */}
                  <div
                    className="absolute -right-8 -top-8 w-72 h-72 rounded-full border-2 border-emerald-500/30 pointer-events-none"
                    style={{
                      transform: `scale(${1 + radarPulse * 0.35})`,
                      opacity: 0.85 - radarPulse * 0.5,
                    }}
                  />
                  <div
                    className="absolute -right-8 -top-8 w-48 h-48 rounded-full border-2 border-emerald-500/40 pointer-events-none"
                    style={{
                      transform: `scale(${1 + radarPulse * 0.2})`,
                    }}
                  />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-mono font-black tracking-widest text-emerald-700 uppercase flex items-center gap-2">
                      <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
                      OBSERVATION PROTOCOL
                    </span>
                    <span className="px-4 py-1.5 rounded-full text-xs font-mono font-black bg-emerald-500/20 text-emerald-800 border border-emerald-500/40">
                      SOLITARY BASELINE
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-4xl font-sans font-black text-slate-900 leading-tight">
                      When Nobody Is Watching
                    </span>
                    <p className="text-lg font-sans font-semibold text-slate-600 leading-relaxed">
                      Notice what feels effortless when there is zero audience to impress or placate.
                    </p>
                  </div>

                  {/* Twin Metric Readout Tiles */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-emerald-500/25 flex flex-col">
                      <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                        AUDIENCE AUDIT
                      </span>
                      <span className="text-4xl font-mono font-black text-slate-900 mt-1">
                        0%
                      </span>
                      <span className="text-xs font-sans font-semibold text-slate-600">
                        Outside pressure eliminated
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-emerald-500/25 flex flex-col">
                      <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                        INTERNAL RECEPTIVITY
                      </span>
                      <span className="text-4xl font-mono font-black text-emerald-600 mt-1">
                        100%
                      </span>
                      <span className="text-xs font-sans font-semibold text-emerald-800">
                        Natural instinct discovered
                      </span>
                    </div>
                  </div>

                  {/* Action Rule Pill */}
                  <div className="flex items-center justify-between pt-4 border-t border-emerald-500/20">
                    <span className="text-sm font-mono font-bold text-slate-600">
                      Baseline instinct identified
                    </span>
                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-mono font-black text-sm shadow-md shadow-emerald-600/30">
                      <CheckCircle2 className="w-5 h-5" />
                      TRUST RECONNECTED
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* SCENE 4: THE EPIPHANY — SUBTRACTION (Frames 845 → 1018)   */}
      {/* ======================================================== */}
      {frame >= 845 && frame < 1018 && (() => {
        const cam4 = interpolate(frame, [845, 1018], [1.0, 1.04], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.0, 0.0, 0.2, 1.0),
        });
        const formulaEnter = spring({
          frame: Math.max(0, frame - 848),
          fps,
          config: { damping: 15, mass: 0.8, stiffness: 120 },
        });
        const dialEnter = spring({
          frame: Math.max(0, frame - 865),
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 130 },
        });
        const bannerEnter = spring({
          frame: Math.max(0, frame - 905),
          fps,
          config: { damping: 14, mass: 0.7, stiffness: 125 },
        });

        return (
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{ transform: `scale(${cam4})`, transformOrigin: "50% 40%" }}
          >
            {/* Ambient Radiance */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "35%",
                width: "700px",
                height: "700px",
                transform: "translate(-50%, -50%)",
                background: "radial-gradient(ellipse, rgba(2, 132, 199, 0.12) 0%, transparent 70%)",
                filter: "blur(45px)",
              }}
            />

            {/* Typographic Ladder */}
            <KineticTypoLadder
              leadIn="THE DEFINITIVE LAW"
              slamWord="SUBTRACTION"
              punchText="NOT BECOMING LOUDER"
              startFrame={846}
              theme="light"
              accentColor="#0284c7"
              showSelectionBox={true}
              showCursor={true}
              cursorType="arrow"
              yOffset="7%"
              align="center"
            />

            {/* Formula Comparison: Louder vs Subtraction */}
            <div
              className="absolute w-[860px] flex justify-between items-center gap-6"
              style={{
                top: "23%",
                opacity: formulaEnter,
                transform: `scale(${interpolate(formulaEnter, [0, 1], [0.93, 1.0])})`,
              }}
            >
              {/* Myth: Louder Self (Red / Strike) */}
              <div
                className="flex-1 p-5 rounded-3xl flex flex-col gap-2 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(255, 241, 242, 0.96) 0%, rgba(255, 255, 255, 0.94) 100%)",
                  border: "2px solid rgba(244, 63, 94, 0.35)",
                  boxShadow: "0 14px 30px rgba(244, 63, 94, 0.10)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-rose-600 tracking-widest uppercase">
                    FALSE INTUITION
                  </span>
                  <span className="text-xs font-mono font-black text-rose-600">
                    ❌ NOT IT
                  </span>
                </div>
                <span className="text-2xl font-sans font-black text-slate-800 line-through opacity-85">
                  Becoming Louder
                </span>
                <div className="flex flex-col gap-1 text-xs font-sans font-semibold text-slate-500 mt-1">
                  <span>+ Extra posturing & projection</span>
                  <span>+ Dominating conversations</span>
                  <span>+ Aggressive over-explaining</span>
                </div>
              </div>

              {/* Central Unequal Divider */}
              <div className="flex flex-col items-center justify-center">
                <span className="text-3xl font-mono font-black text-slate-400">
                  ≠
                </span>
              </div>

              {/* Reality: Subtraction Self (Emerald Hero) */}
              <div
                className="flex-1 p-5 rounded-3xl flex flex-col gap-2 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(240, 253, 244, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%)",
                  border: "2.5px solid rgba(16, 185, 129, 0.45)",
                  boxShadow: "0 18px 36px rgba(16, 185, 129, 0.14)",
                  backdropFilter: "blur(20px)",
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-black text-emerald-700 tracking-widest uppercase">
                    TRUE FORMULA
                  </span>
                  <span className="text-xs font-mono font-black text-emerald-700">
                    ✅ AUTHENTIC
                  </span>
                </div>
                <span className="text-2xl font-sans font-black text-slate-900">
                  Subtractive Removal
                </span>
                <div className="flex flex-col gap-1 text-xs font-sans font-semibold text-emerald-900 mt-1">
                  <span>− Drop performed behaviors</span>
                  <span>− Strip approval-seeking filters</span>
                  <span>− Discard unneeded defense</span>
                </div>
              </div>
            </div>

            {/* Hero Radial Dial: Unmasked State */}
            <div
              className="absolute flex flex-col items-center"
              style={{
                top: "39%",
                opacity: dialEnter,
                transform: `scale(${interpolate(dialEnter, [0, 1], [0.92, 1.0])})`,
              }}
            >
              <GlossyRadialDial
                title=""
                targetPercent={100}
                valueText="UNMASKED"
                labelText="AUTHENTIC CORE"
                accentColor="#10b981"
                glowColor="rgba(16, 185, 129, 0.25)"
                startFrame={865}
                size={380}
                theme="light"
                showFloorReflection={false}
              />
            </div>

            {/* Pinned Authority Takeaway Banner */}
            <div
              className="absolute w-[860px] flex items-center justify-between px-7 py-4 rounded-2xl"
              style={{
                top: "60%",
                opacity: bannerEnter,
                transform: `translateY(${interpolate(bannerEnter, [0, 1], [20, 0])}px)`,
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(255, 255, 255, 0.98) 100%)",
                border: "2.5px solid rgba(16, 185, 129, 0.5)",
                boxShadow: "0 18px 38px rgba(16, 185, 129, 0.16)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-700">
                  <Shield className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-black tracking-widest text-emerald-700 uppercase">
                    REBUILD INTERNAL TRUST
                  </span>
                  <span className="text-lg font-sans font-black text-slate-900 leading-tight">
                    Repeatedly choosing yourself restores self-respect.
                  </span>
                </div>
              </div>

              <span className="px-4 py-1.5 rounded-full text-xs font-mono font-black bg-emerald-600 text-white shadow-md">
                RULE DELIVERED
              </span>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
