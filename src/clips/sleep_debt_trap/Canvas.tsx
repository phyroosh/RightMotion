import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  GlossyGlowGraph,
  GlossyRadialDial,
  GlossyBalanceScale,
  GlossyFrictionSlider,
  SteppedProgressionStairs,
  KineticTypoLadder,
} from "../../components/pure_graphics";
import { TacticalMemeCard } from "../../components/TacticalMemeCard";
import { MemeStickerOverlay } from "../../components/MemeStickerOverlay";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

export const SleepDebtTrapCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-8 select-none">
      {/* ========================================================================= */}
      {/* SCENE 1: THE SLEEP DEBT PARADOX (Frames 0 - 175 / 0.0s - 5.8s)            */}
      {/* "Ruining your sleep to squeeze in more work can quietly make tomorrow's..." */}
      {/* ========================================================================= */}
      {frame >= 0 && frame < 175 && (() => {
        const cam1 = interpolate(frame, [0, 175], [1.0, 1.05], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.0, 0.0, 0.2, 1.0),
        });
        const c1Op = interpolate(frame, [50, 68], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        const c1X = interpolate(frame, [50, 68], [-20, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        const c2Op = interpolate(frame, [72, 90], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const c3Op = interpolate(frame, [94, 112], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const cntProg = interpolate(frame, [85, 130], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        const breathe = 1 + Math.sin((frame / fps) * 1.2) * 0.05;

        return (
          <div
            className="absolute inset-0"
            style={{ transform: `scale(${cam1})`, transformOrigin: "55% 50%" }}
          >
            {/* Atmospheric subtle backlight glow orbs */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "35%",
                top: "54%",
                width: `${560 * breathe}px`,
                height: `${560 * breathe}px`,
                transform: "translate(-50%,-50%)",
                background: "radial-gradient(ellipse, rgba(244, 63, 94, 0.16) 0%, transparent 65%)",
                borderRadius: "50%",
                filter: "blur(28px)",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                left: "72%",
                top: "44%",
                width: `${260 * breathe}px`,
                height: `${260 * breathe}px`,
                transform: "translate(-50%,-50%)",
                background: "radial-gradient(ellipse, rgba(16, 185, 129, 0.15) 0%, transparent 65%)",
                borderRadius: "50%",
                filter: "blur(20px)",
              }}
            />

            {/* ── 3-TIER KINETIC TYPOGRAPHIC LADDER ── */}
            <KineticTypoLadder
              leadIn="BORROWING FROM SLEEP"
              slamWord="DEBT TRAP"
              punchText="SLOWER & SLOPPIER"
              startFrame={44}
              theme="light"
              accentColor="#f43f5e"
              showSelectionBox={true}
              showCursor={true}
              cursorType="arrow"
              yOffset="9%"
              align="center"
            />

            {/* VECTOR GRAPH: Cognition collapse vs Rested recovery */}
            <div
              className="absolute"
              style={{ left: "-4%", top: "54%", transform: "translateY(-50%)" }}
            >
              <GlossyGlowGraph
                title=""
                entranceFrame={46}
                yLabel="OUTPUT QUALITY"
                xLabels={["10 PM", "12 AM", "2 AM", "8 AM"]}
                showFloorReflection={true}
                reflectionOpacity={0.25}
                theme="light"
                curves={[
                  {
                    id: "rested_curve",
                    label: "RESTED",
                    color: "#10b981",
                    glowColor: "#10b981",
                    startFrame: 52,
                    durationFrames: 38,
                    showArrow: true,
                    pathD: "M 100 240 C 180 140, 260 110, 340 120 C 420 130, 480 115, 548 110",
                    areaD: "M 100 340 L 100 240 C 180 140, 260 110, 340 120 C 420 130, 480 115, 548 110 L 548 340 Z",
                    tipX: 548,
                    tipY: 110,
                  },
                  {
                    id: "debt_curve",
                    label: "SLEEP DEBT",
                    color: "#f43f5e",
                    glowColor: "#f43f5e",
                    startFrame: 66,
                    durationFrames: 46,
                    showArrow: true,
                    pathD: "M 100 240 C 180 250, 280 280, 360 305 C 440 330, 500 325, 550 328",
                    areaD: "M 100 340 L 100 240 C 180 250, 280 280, 360 305 C 440 330, 500 325, 550 328 L 550 340 Z",
                    tipX: 550,
                    tipY: 328,
                  },
                ]}
                width={740}
                height={420}
              />
            </div>

            {/* STAGGERED DATA CALLOUTS (Mobile 480p High Legibility) */}
            <div
              className="absolute pointer-events-none z-20"
              style={{ left: "58%", top: "40%", opacity: c1Op, transform: `translateX(${c1X}px)` }}
            >
              <div
                className="flex flex-col gap-1 px-6 py-4 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(244,63,94,0.18) 0%, rgba(10,15,28,0.96) 100%)",
                  border: "2.5px solid #f43f5e88",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.8), 0 0 20px rgba(244,63,94,0.25)",
                }}
              >
                <span className="text-lg font-mono font-black tracking-widest uppercase" style={{ color: "#f43f5e", letterSpacing: "0.15em" }}>
                  COGNITIVE SPEED
                </span>
                <span className="text-3xl font-display font-black tracking-tight leading-none" style={{ color: "#fff", textShadow: "0 0 16px rgba(244,63,94,0.8)" }}>
                  SLOWER (−45%)
                </span>
              </div>
            </div>

            <div
              className="absolute pointer-events-none z-20"
              style={{ left: "58%", top: "53%", opacity: c2Op }}
            >
              <div
                className="flex flex-col gap-1 px-6 py-4 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(251,113,133,0.18) 0%, rgba(10,15,28,0.96) 100%)",
                  border: "2.5px solid #fb718588",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.8), 0 0 20px rgba(251,113,133,0.25)",
                }}
              >
                <span className="text-lg font-mono font-black tracking-widest uppercase" style={{ color: "#fb7185", letterSpacing: "0.15em" }}>
                  ERROR RATE
                </span>
                <span className="text-3xl font-display font-black tracking-tight leading-none" style={{ color: "#fff", textShadow: "0 0 16px rgba(251,113,133,0.8)" }}>
                  SLOPPIER (+3X)
                </span>
              </div>
            </div>

            <div
              className="absolute pointer-events-none z-20"
              style={{ left: "58%", top: "66%", opacity: c3Op }}
            >
              <div
                className="flex flex-col gap-1 px-6 py-4 rounded-2xl"
                style={{
                  background: "linear-gradient(135deg, rgba(251,146,60,0.18) 0%, rgba(10,15,28,0.96) 100%)",
                  border: "2.5px solid #fb923c88",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.8), 0 0 20px rgba(251,146,60,0.25)",
                }}
              >
                <span className="text-lg font-mono font-black tracking-widest uppercase" style={{ color: "#fb923c", letterSpacing: "0.15em" }}>
                  TASK RESISTANCE
                </span>
                <span className="text-3xl font-display font-black tracking-tight leading-none" style={{ color: "#fff", textShadow: "0 0 16px rgba(251,146,60,0.8)" }}>
                  HARDER (MAX)
                </span>
              </div>
            </div>

            {/* ANIMATED COUNTER (72px JetBrains Mono) */}
            <div
              className="absolute pointer-events-none flex flex-col items-center"
              style={{ left: "73%", bottom: "8%", opacity: c3Op }}
            >
              <span
                className="font-black font-mono tracking-tight"
                style={{ fontSize: "68px", color: "#0f172a", textShadow: "0 0 28px rgba(244,63,94,0.35)", lineHeight: 1 }}
              >
                +{Math.round(cntProg * 300)}
                <span style={{ fontSize: "0.5em", color: "#f43f5e", verticalAlign: "super", marginLeft: "4px" }}>%</span>
              </span>
              <span
                className="text-base font-mono font-extrabold tracking-widest uppercase mt-1.5"
                style={{ color: "#475569", letterSpacing: "0.18em" }}
              >
                Cognitive Tax
              </span>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* SCENE 2: THE BIOLOGICAL BREAKDOWN (Frames 175 - 420 / 5.8s - 14.0s)        */}
      {/* "Sleep loss weakens prefrontal control, attention, memory consolidation..." */}
      {/* ========================================================================= */}
      {frame >= 175 && frame < 420 && (() => {
        const cam2 = interpolate(frame, [175, 420], [1.03, 1.0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        const sceneF = frame - 175;
        const b1Op = interpolate(sceneF, [24, 40], [0, 1], { extrapolateRight: "clamp" });
        const b2Op = interpolate(sceneF, [42, 58], [0, 1], { extrapolateRight: "clamp" });
        const b3Op = interpolate(sceneF, [60, 76], [0, 1], { extrapolateRight: "clamp" });
        const b4Op = interpolate(sceneF, [78, 94], [0, 1], { extrapolateRight: "clamp" });
        const bottomStatOp = interpolate(sceneF, [88, 108], [0, 1], { extrapolateRight: "clamp" });
        const breathe = 1 + Math.sin((frame / fps) * 1.1) * 0.05;

        return (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ transform: `scale(${cam2})`, transformOrigin: "50% 48%" }}
          >
            {/* Atmospheric lighting glows */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "30%",
                top: "45%",
                width: `${460 * breathe}px`,
                height: `${460 * breathe}px`,
                transform: "translate(-50%,-50%)",
                background: "radial-gradient(ellipse, rgba(244,63,94,0.18) 0%, transparent 65%)",
                borderRadius: "50%",
                filter: "blur(28px)",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                left: "70%",
                top: "55%",
                width: `${460 * breathe}px`,
                height: `${460 * breathe}px`,
                transform: "translate(-50%,-50%)",
                background: "radial-gradient(ellipse, rgba(251,146,60,0.16) 0%, transparent 65%)",
                borderRadius: "50%",
                filter: "blur(28px)",
              }}
            />

            {/* ── 3-TIER KINETIC TYPOGRAPHIC LADDER ── */}
            <KineticTypoLadder
              leadIn="SLEEP LOSS CRIPPLES"
              slamWord="PREFRONTAL"
              punchText="EXECUTIVE CONTROL"
              startFrame={178}
              theme="light"
              accentColor="#f43f5e"
              showSelectionBox={true}
              showCursor={true}
              cursorType="arrow"
              yOffset="9%"
              align="center"
            />

            {/* TACTILE FRICTION SLIDER: Dragging into High Sleep Pressure */}
            <div className="absolute" style={{ top: "31%", transform: "translateY(-50%)" }}>
              <GlossyFrictionSlider
                title=""
                startLabel="RESTED FLOW"
                endLabel="SLEEP PRESSURE"
                startPercent={10}
                endPercent={94}
                accentColor="#f43f5e"
                glowColor="rgba(244, 63, 94, 0.25)"
                startFrame={185}
                dragDurationFrames={75}
                width={720}
                theme="light"
                showCursor={true}
                showFloorReflection={false}
              />
            </div>

            {/* 2x2 GRID OF 4 NEURAL SYSTEMS WEAKENED (Safe zone: top 42% - 60%) */}
            <div className="absolute grid grid-cols-2 gap-5" style={{ top: "42%", width: "860px" }}>
              {/* Faculty 1: Prefrontal Control */}
              <div
                className="flex flex-col gap-1.5 p-5 rounded-3xl"
                style={{
                  background: "rgba(15, 23, 42, 0.94)",
                  border: "2.5px solid #f43f5e88",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.7), 0 0 20px rgba(244,63,94,0.25)",
                  opacity: b1Op,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-black uppercase text-rose-400 tracking-wider">
                    FACULTY 01
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">EXECUTIVE</span>
                </div>
                <span className="text-2xl font-display font-black text-white leading-tight">
                  PREFRONTAL CONTROL
                </span>
                <span className="text-base font-mono font-extrabold text-rose-400">
                  −68% Inhibition Power
                </span>
              </div>

              {/* Faculty 2: Attention Span */}
              <div
                className="flex flex-col gap-1.5 p-5 rounded-3xl"
                style={{
                  background: "rgba(15, 23, 42, 0.94)",
                  border: "2.5px solid #fb718588",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.7), 0 0 20px rgba(251,113,133,0.25)",
                  opacity: b2Op,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-black uppercase text-rose-300 tracking-wider">
                    FACULTY 02
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">FOCUS</span>
                </div>
                <span className="text-2xl font-display font-black text-white leading-tight">
                  SUSTAINED ATTENTION
                </span>
                <span className="text-base font-mono font-extrabold text-rose-300">
                  −74% Focus Stability
                </span>
              </div>

              {/* Faculty 3: Memory Consolidation */}
              <div
                className="flex flex-col gap-1.5 p-5 rounded-3xl"
                style={{
                  background: "rgba(15, 23, 42, 0.94)",
                  border: "2.5px solid #f59e0b88",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.7), 0 0 20px rgba(245,158,11,0.25)",
                  opacity: b3Op,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-black uppercase text-amber-400 tracking-wider">
                    FACULTY 03
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">SYNAPSE</span>
                </div>
                <span className="text-2xl font-display font-black text-white leading-tight">
                  MEMORY RETENTION
                </span>
                <span className="text-base font-mono font-extrabold text-amber-400">
                  Severely Impaired
                </span>
              </div>

              {/* Faculty 4: Emotional Regulation */}
              <div
                className="flex flex-col gap-1.5 p-5 rounded-3xl"
                style={{
                  background: "rgba(15, 23, 42, 0.94)",
                  border: "2.5px solid #ea580c88",
                  backdropFilter: "blur(16px)",
                  boxShadow: "0 12px 28px rgba(0,0,0,0.7), 0 0 20px rgba(234,88,12,0.25)",
                  opacity: b4Op,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-black uppercase text-orange-400 tracking-wider">
                    FACULTY 04
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">LIMBIC</span>
                </div>
                <span className="text-2xl font-display font-black text-white leading-tight">
                  EMOTION REGULATION
                </span>
                <span className="text-base font-mono font-extrabold text-orange-400">
                  Reactivity Spikes
                </span>
              </div>
            </div>

            {/* Bottom Telemetry Bar */}
            <div
              className="absolute flex items-center gap-4 px-8 py-3 rounded-2xl pointer-events-none z-20"
              style={{
                top: "62%",
                opacity: bottomStatOp,
                background: "rgba(15, 23, 42, 0.95)",
                border: "2px solid #f43f5e88",
                backdropFilter: "blur(16px)",
                boxShadow: "0 10px 25px rgba(0,0,0,0.6)",
              }}
            >
              <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" style={{ boxShadow: "0 0 10px #f43f5e" }} />
              <span className="text-lg font-mono font-black text-white tracking-wider">
                SLEEP PRESSURE:
              </span>
              <span className="text-xl font-mono font-black text-rose-400">
                +450% CRITICAL ELEVATION
              </span>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* SCENE 3: THE MIDNIGHT TRADE-OFF (Frames 420 - 650 / 14.0s - 21.7s)        */}
      {/* "That extra hour at midnight often gets paid back through reduced focus..."*/}
      {/* ========================================================================= */}
      {frame >= 420 && frame < 650 && (() => {
        const cam3 = interpolate(frame, [420, 640], [0.97, 1.02], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        const sceneF = frame - 420;
        const leftX = interpolate(sceneF, [0, 24], [-30, 0], {
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        const leftOp = interpolate(sceneF, [0, 20], [0, 1], { extrapolateRight: "clamp" });
        const rightX = interpolate(sceneF, [12, 36], [30, 0], {
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        const rightOp = interpolate(sceneF, [12, 30], [0, 1], { extrapolateRight: "clamp" });
        const breathe = 1 + Math.sin((frame / fps) * 1.1) * 0.05;

        return (
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{ transform: `scale(${cam3})`, transformOrigin: "50% 50%" }}
          >
            <div
              className="absolute pointer-events-none"
              style={{
                left: "30%",
                top: "45%",
                width: `${480 * breathe}px`,
                height: `${480 * breathe}px`,
                transform: "translate(-50%,-50%)",
                background: "radial-gradient(ellipse, rgba(244,63,94,0.18) 0%, transparent 65%)",
                borderRadius: "50%",
                filter: "blur(28px)",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                left: "70%",
                top: "45%",
                width: `${480 * breathe}px`,
                height: `${480 * breathe}px`,
                transform: "translate(-50%,-50%)",
                background: "radial-gradient(ellipse, rgba(251,191,36,0.18) 0%, transparent 65%)",
                borderRadius: "50%",
                filter: "blur(28px)",
              }}
            />

            {/* ── 3-TIER KINETIC TYPOGRAPHIC LADDER ── */}
            <KineticTypoLadder
              leadIn="THE FAKE TRADE-OFF"
              slamWord="EXTRA HOUR"
              punchText="PAID BACK IN FOCUS"
              startFrame={422}
              theme="light"
              accentColor="#f59e0b"
              showSelectionBox={true}
              showCursor={true}
              cursorType="arrow"
              yOffset="9%"
              align="center"
            />

            {/* BALANCE SEE-SAW: Midnight hour vs Tomorrow's penalty */}
            <div className="absolute" style={{ top: "30%" }}>
              <GlossyBalanceScale
                title=""
                titleColor="#ffffff"
                leftLabel="MIDNIGHT WORK"
                leftSub="+1 Hour Stolen"
                leftColor="#f43f5e"
                rightLabel="TOMORROW'S COST"
                rightSub="−3 Hours Lost Focus"
                rightColor="#fbbf24"
                winner="right"
                startFrame={420}
                width={720}
                height={410}
                glowColor="rgba(245, 158, 11, 0.22)"
                showFloorReflection={true}
                reflectionOpacity={0.25}
              />
            </div>

            {/* COMPARATIVE VERDICT CARDS (Safe zone: top 50% - 66%) */}
            <div className="absolute flex gap-6 items-center" style={{ top: "50%" }}>
              {/* The Illusion Card */}
              <div
                className="flex flex-col gap-2 p-6 rounded-3xl shadow-2xl"
                style={{
                  width: "430px",
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "2.5px solid #f43f5e88",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(244,63,94,0.25)",
                  opacity: leftOp,
                  transform: `translateX(${leftX}px)`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-base font-mono font-black uppercase px-4 py-1.5 rounded-full"
                    style={{ background: "rgba(244,63,94,0.18)", color: "#f43f5e", border: "1px solid rgba(244,63,94,0.5)" }}
                  >
                    THE ILLUSION
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-400">+1 HR TONIGHT</span>
                </div>
                <span className="text-3xl font-display font-black text-white mt-1 leading-tight">
                  FALSE PRODUCTIVITY
                </span>
                <span className="text-lg font-mono font-bold text-rose-400">
                  Late-night work feels productive
                </span>
              </div>

              {/* The Real Cost Card */}
              <div
                className="flex flex-col gap-2 p-6 rounded-3xl shadow-2xl"
                style={{
                  width: "430px",
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "2.5px solid #fbbf2488",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(251,191,36,0.25)",
                  opacity: rightOp,
                  transform: `translateX(${rightX}px)`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-base font-mono font-black uppercase px-4 py-1.5 rounded-full"
                    style={{ background: "rgba(251,191,36,0.18)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.5)" }}
                  >
                    THE REPAYMENT
                  </span>
                  <span className="text-sm font-mono font-bold text-amber-400">−3 HRS TOMORROW</span>
                </div>
                <span className="text-3xl font-display font-black text-white mt-1 leading-tight">
                  SLOW DECISION-MAKING
                </span>
                <span className="text-lg font-mono font-bold text-amber-300">
                  Mistakes & sluggish execution
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* SCENE 4: HIGH-LEVERAGE PROTOCOL (Frames 650 - End / 21.7s - 32.3s)        */}
      {/* "Instead of stealing hours from sleep, set a hard shutdown time..."       */}
      {/* ========================================================================= */}
      {frame >= 650 && (() => {
        const cam4 = interpolate(frame, [650, 800], [0.96, 1.01], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        const sceneF = frame - 650;
        const divH = interpolate(sceneF, [15, 38], [0, 320], {
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });
        const verdictOp = interpolate(sceneF, [35, 55], [0, 1], { extrapolateRight: "clamp" });
        const breathe = 1 + Math.sin((frame / fps) * 1.1) * 0.05;

        return (
          <div
            className="absolute inset-0 flex items-center"
            style={{ transform: `scale(${cam4})`, transformOrigin: "50% 50%" }}
          >
            <div
              className="absolute pointer-events-none"
              style={{
                left: "28%",
                top: "52%",
                width: `${420 * breathe}px`,
                height: `${420 * breathe}px`,
                transform: "translate(-50%,-50%)",
                background: "radial-gradient(ellipse, rgba(16,185,129,0.18) 0%, transparent 65%)",
                borderRadius: "50%",
                filter: "blur(26px)",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                left: "72%",
                top: "52%",
                width: `${480 * breathe}px`,
                height: `${480 * breathe}px`,
                transform: "translate(-50%,-50%)",
                background: "radial-gradient(ellipse, rgba(56,189,248,0.18) 0%, transparent 65%)",
                borderRadius: "50%",
                filter: "blur(26px)",
              }}
            />

            {/* ── 3-TIER KINETIC TYPOGRAPHIC LADDER ── */}
            <KineticTypoLadder
              leadIn="THE HIGH-LEVERAGE PROTOCOL"
              slamWord="COMPRESS TASK"
              punchText="NEVER THE SLEEP"
              startFrame={653}
              theme="light"
              accentColor="#10b981"
              showSelectionBox={true}
              showCursor={true}
              cursorType="arrow"
              yOffset="9%"
              align="center"
            />

            {/* LEFT: Stepped Progression Stairs */}
            <div
              className="absolute"
              style={{ left: "3%", top: "50%", transform: "translateY(-50%)" }}
            >
              <SteppedProgressionStairs
                title=""
                titleColor="#ffffff"
                orbColor="#10b981"
                startFrame={655}
                stepDurationFrames={26}
                showFloorReflection={true}
                reflectionOpacity={0.25}
                theme="light"
                width={500}
                height={420}
                steps={[
                  { id: "s1_sleep", label: "SHUTDOWN" },
                  { id: "s2_sleep", label: "FIXED WAKE" },
                  { id: "s3_sleep", label: "ENERGY BLOCK" },
                  { id: "s4_sleep", label: "COMPRESS TASK", isGoal: true },
                ]}
              />
            </div>

            {/* VERTICAL DIVIDER */}
            <div
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "40%",
                width: "3px",
                height: `${divH}px`,
                background: "linear-gradient(to bottom, transparent, rgba(15,23,42,0.25), transparent)",
                boxShadow: "0 0 14px rgba(0,0,0,0.08)",
              }}
            />

            {/* RIGHT: Radial Dial gauge */}
            <div
              className="absolute"
              style={{ right: "4%", top: "50%", transform: "translateY(-52%)" }}
            >
              <GlossyRadialDial
                title=""
                titleColor="#ffffff"
                targetPercent={100}
                valueText="RULE #1"
                labelText="PROTECT SLEEP"
                accentColor="#10b981"
                glowColor="rgba(16, 185, 129, 0.22)"
                startFrame={675}
                size={380}
                showFloorReflection={true}
                reflectionOpacity={0.25}
                theme="light"
              />
            </div>

            {/* SLEEK CENTERED TELEMETRY VERDICT BAR (Safe zone: top 63%, zero caption overlap) */}
            <div
              className="absolute flex gap-8 items-center px-8 py-3.5 rounded-2xl pointer-events-none z-20"
              style={{
                top: "63%",
                left: "50%",
                transform: "translateX(-50%)",
                opacity: verdictOp,
                background: "rgba(15, 23, 42, 0.95)",
                border: "2px solid rgba(16, 185, 129, 0.65)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 12px 35px rgba(0,0,0,0.7), 0 0 20px rgba(16, 185, 129, 0.25)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400" style={{ boxShadow: "0 0 10px #10b981" }} />
                <span className="text-lg font-mono font-black text-emerald-400 tracking-wider">RULE:</span>
                <span className="text-2xl font-display font-black text-white">COMPRESS THE TASK</span>
              </div>
              <div style={{ width: "2px", height: "28px", background: "rgba(255,255,255,0.25)" }} />
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-sky-400" style={{ boxShadow: "0 0 10px #38bdf8" }} />
                <span className="text-lg font-mono font-black text-sky-400 tracking-wider">PROTECT:</span>
                <span className="text-2xl font-display font-black text-white">CONSISTENT SLEEP</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ======================================================== */}
      {/* TACTICAL RETENTION MEME POP (< 2.5s Strict Cap)          */}
      {/* ======================================================== */}
      <TacticalMemeCard
        memeId="ronaldo_sipping_tea"
        startFrame={0}
        durationFrames={44}
        playbackRate={1.35}
        hudLabel="UNBOTHERED CHAD // STOIC DETACHMENT"
        theme="apple_studio"
        position="top"
      />

      {/* ======================================================== */}
      {/* MID-VIDEO GEN-Z MEME REACTION STICKER POP               */}
      {/* ======================================================== */}
      <MemeStickerOverlay
        stickerId="spiderman_scheming_chair"
        startFrame={456}
        durationFrames={34}
        position="center-right"
        badgeText="LETTING HIM COOK"
      />
    </div>
  );
};

