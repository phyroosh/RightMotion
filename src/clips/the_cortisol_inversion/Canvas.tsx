import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  GlossyGlowGraph,
  GlossyBalanceScale,
  GlossyRadialDial,
  SteppedProgressionStairs,
} from "../../components/pure_graphics";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

// ─── Shared Spring Physics ───────────────────────────────────────────────────
const SPRING_SOFT = { damping: 18, mass: 0.9, stiffness: 100 };
const SPRING_SNAP = { damping: 14, mass: 0.6, stiffness: 180 };

function useEntrance(frame: number, fps: number, startFrame: number, cfg = SPRING_SOFT) {
  const rel = Math.max(0, frame - startFrame);
  return spring({ frame: rel, fps, config: cfg });
}

// ─── Mobile-First Data Callout (Readable at 480p on iPhone 11) ───────────────
interface CalloutProps {
  label: string;
  value: string;
  color: string;
  frame: number;
  startFrame: number;
  fps: number;
  x?: string;
  y?: string;
  right?: string;
  align?: "left" | "right";
}

const DataCallout: React.FC<CalloutProps> = ({
  label,
  value,
  color,
  frame,
  startFrame,
  fps,
  x,
  y,
  right,
  align = "left",
}) => {
  const sp = useEntrance(frame, fps, startFrame, SPRING_SNAP);
  const opacity = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const translateX = interpolate(sp, [0, 1], [align === "right" ? 20 : -20, 0]);
  const scale = interpolate(sp, [0, 1], [0.8, 1.0]);

  return (
    <div
      className="absolute pointer-events-none z-30"
      style={{
        left: x,
        right,
        top: y,
        opacity,
        transform: `translateX(${translateX}px) scale(${scale})`,
        transformOrigin: align === "right" ? "right center" : "left center",
      }}
    >
      <div
        className="flex flex-col gap-1 px-6 py-3.5 rounded-2xl"
        style={{
          background: `linear-gradient(135deg, ${color}22 0%, rgba(10, 15, 28, 0.96) 100%)`,
          border: `2.5px solid ${color}88`,
          boxShadow: `0 12px 32px rgba(0,0,0,0.8), 0 0 24px ${color}33, inset 0 1.5px 2px rgba(255,255,255,0.15)`,
          backdropFilter: "blur(16px)",
        }}
      >
        {/* Font Style 2: Technical JetBrains Mono for telemetry tags */}
        <span
          className="text-base md:text-lg font-mono font-black uppercase"
          style={{ color: `${color}`, letterSpacing: "0.16em", textShadow: `0 0 10px ${color}88` }}
        >
          {label}
        </span>
        {/* Font Style 1: Punchy Montserrat Display for high-impact value */}
        <span
          className="text-3xl md:text-4xl font-display font-black tracking-tight leading-none mt-0.5"
          style={{ color: "#ffffff", textShadow: `0 0 20px ${color}cc, 0 0 40px rgba(255,255,255,0.4)` }}
        >
          {value}
        </span>
      </div>
      {/* High-visibility connector beacon */}
      <div
        className="absolute top-1/2 -translate-y-1/2"
        style={{
          [align === "right" ? "right" : "left"]: "-7px",
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          border: `3px solid ${color}`,
          boxShadow: `0 0 16px 4px ${color}`,
        }}
      />
    </div>
  );
};

// ─── Atmospheric Glow Orb ────────────────────────────────────────────────────
const AtmosphericGlow: React.FC<{
  color: string;
  frame: number;
  size?: number;
  cx?: string;
  cy?: string;
}> = ({ color, frame, size = 480, cx = "50%", cy = "50%" }) => {
  const breathe = 1 + Math.sin((frame / 30) * 1.1) * 0.08;
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: cx,
        top: cy,
        width: `${size * breathe}px`,
        height: `${size * breathe}px`,
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(ellipse, ${color}35 0%, ${color}10 45%, transparent 70%)`,
        borderRadius: "50%",
        filter: "blur(32px)",
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// THE MOBILE-OPTIMIZED 10/10 CANVAS (iPhone 11 @ 480p Ready)
// ═══════════════════════════════════════════════════════════════════════════════

export const TheCortisolInversionCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene timing (approx 30fps)
  const S1 = 0;
  const S2 = 145;
  const S3 = 290;
  const S4 = 440;

  // Camera push-in for cinematic depth
  const cameraScale = (sceneStart: number, duration: number = 160, fromScale = 1.0, toScale = 1.06) => {
    return interpolate(frame, [sceneStart, sceneStart + duration], [fromScale, toScale], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.0, 0.0, 0.2, 1.0),
    });
  };

  return (
    <div className="absolute inset-0 w-full h-full select-none overflow-hidden font-display bg-black">

      {/* ================================================================== */}
      {/* SCENE 1 — "THE CORTISOL INVERSION" (Hook & Problem)                */}
      {/* Layout: Graph anchored LEFT + Massive Callouts & Metric RIGHT      */}
      {/* ================================================================== */}
      {frame >= S1 && frame < S2 && (() => {
        const cam = cameraScale(S1, S2 - S1, 1.0, 1.05);
        const cntProg = interpolate(frame, [S1 + 80, S1 + 125], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.22, 1, 0.36, 1),
        });

        const titleSp = useEntrance(frame, fps, S1 + 8, SPRING_SNAP);
        const titleOp = interpolate(titleSp, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
        const titleY = interpolate(titleSp, [0, 1], [16, 0]);

        return (
          <div
            className="absolute inset-0 flex items-center"
            style={{ transform: `scale(${cam})`, transformOrigin: "55% 50%" }}
          >
            <AtmosphericGlow color="#f43f5e" frame={frame} size={650} cx="36%" cy="48%" />
            <AtmosphericGlow color="#10b981" frame={frame} size={320} cx="74%" cy="32%" />

            {/* ── GRAPH: Shifted left for mobile balance (740x440) ── */}
            <div className="absolute" style={{ left: "-3%", top: "44%", transform: "translateY(-50%)" }}>
              <GlossyGlowGraph
                title=""
                entranceFrame={S1 + 5}
                yLabel="CORTISOL"
                xLabels={["WAKE", "NOON", "EVENING", "12 AM"]}
                showFloorReflection={true}
                reflectionOpacity={0.34}
                curves={[
                  {
                    id: "healthy_curve",
                    label: "OPTIMAL",
                    color: "#10b981",
                    glowColor: "#10b981",
                    startFrame: S1 + 12,
                    durationFrames: 38,
                    showArrow: true,
                    pathD: "M 100 310 C 160 130, 240 100, 310 130 C 390 165, 470 295, 550 320",
                    areaD: "M 100 340 L 100 310 C 160 130, 240 100, 310 130 C 390 165, 470 295, 550 320 L 550 340 Z",
                    tipX: 550,
                    tipY: 320,
                  },
                  {
                    id: "inverted_spike",
                    label: "INVERTED",
                    color: "#f43f5e",
                    glowColor: "#f43f5e",
                    startFrame: S1 + 30,
                    durationFrames: 50,
                    showArrow: true,
                    pathD: "M 100 310 C 200 305, 320 310, 400 308 C 455 305, 500 160, 552 82",
                    areaD: "M 100 340 L 100 310 C 200 305, 320 310, 400 308 C 455 305, 500 160, 552 82 L 552 340 Z",
                    tipX: 552,
                    tipY: 82,
                  },
                ]}
                width={740}
                height={440}
              />
            </div>

            {/* ── HERO HEADLINE SLAM (Right-aligned, zero overflow) ── */}
            <div
              className="absolute pointer-events-none flex flex-col items-end z-20"
              style={{
                right: "5%",
                top: "6%",
                opacity: titleOp,
                transform: `translateY(${titleY}px)`,
              }}
            >
              <span
                className="font-display font-black uppercase text-right leading-none"
                style={{
                  fontSize: "82px",
                  color: "#ffffff",
                  textShadow: "0 0 25px #f43f5e, 0 0 55px #f43f5e99",
                  letterSpacing: "0.03em",
                }}
              >
                CORTISOL
              </span>
              <span
                className="font-display font-extrabold uppercase text-right leading-none mt-2"
                style={{
                  fontSize: "48px",
                  color: "#ffffff",
                  textShadow: "0 0 20px rgba(255,255,255,0.4)",
                  letterSpacing: "0.06em",
                }}
              >
                INVERSION
              </span>
              <div
                className="mt-3 h-1 rounded-full"
                style={{
                  width: "180px",
                  background: "linear-gradient(90deg, #10b981, #f43f5e)",
                  boxShadow: "0 0 12px #f43f5e",
                }}
              />
            </div>

            {/* ── BOLD DATA CALLOUTS: Right-aligned pins ── */}
            <DataCallout
              label="OPTIMAL PEAK"
              value="8–10 AM"
              color="#10b981"
              frame={frame}
              startFrame={S1 + 48}
              fps={fps}
              right="5%"
              y="30%"
              align="right"
            />
            <DataCallout
              label="INVERTED SPIKE"
              value="11 PM↑"
              color="#f43f5e"
              frame={frame}
              startFrame={S1 + 68}
              fps={fps}
              right="5%"
              y="44%"
              align="right"
            />
            <DataCallout
              label="ENERGY DEFICIT"
              value="ALL DAY"
              color="#fb923c"
              frame={frame}
              startFrame={S1 + 88}
              fps={fps}
              right="5%"
              y="58%"
              align="right"
            />

            {/* ── METRIC COUNTER (JetBrains Mono 68px, safely above captions at top 68%) ── */}
            <div
              className="absolute pointer-events-none flex flex-col items-end z-20"
              style={{
                right: "6%",
                top: "68%",
                opacity: interpolate(frame, [S1 + 80, S1 + 100], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              <span
                className="font-black font-mono tracking-tight"
                style={{
                  fontSize: "68px",
                  color: "#ffffff",
                  textShadow: `0 0 30px #f43f5ecc, 0 0 60px #f43f5e66`,
                  lineHeight: 1,
                }}
              >
                {Math.round(cntProg * 78)}
                <span style={{ fontSize: "0.5em", color: "#f43f5e", verticalAlign: "super", marginLeft: "4px" }}>
                  %
                </span>
              </span>
              <span
                className="text-base font-mono font-extrabold tracking-widest uppercase mt-1.5"
                style={{ color: "rgba(255,255,255,0.75)", letterSpacing: "0.18em" }}
              >
                DAILY LETHARGY
              </span>
            </div>
          </div>
        );
      })()}

      {/* ================================================================== */}
      {/* SCENE 2 — "THE MECHANISM" (Explain Logic)                          */}
      {/* Layout: Full-Width Comparison Graph + Direct Curve Badges + Stats  */}
      {/* ================================================================== */}
      {frame >= S2 && frame < S3 && (() => {
        const cam = cameraScale(S2, S3 - S2, 1.04, 1.0);
        const sceneFrame = frame - S2;

        return (
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{ transform: `scale(${cam})`, transformOrigin: "50% 48%" }}
          >
            <AtmosphericGlow color="#10b981" frame={frame} size={480} cx="26%" cy="45%" />
            <AtmosphericGlow color="#f43f5e" frame={frame} size={480} cx="74%" cy="45%" />

            {/* ── SCENE TITLE (Font Style 1: Montserrat Black 32px) ── */}
            <div
              className="absolute flex flex-col items-center"
              style={{
                top: "6%",
                left: "50%",
                transform: "translateX(-50%)",
                opacity: interpolate(sceneFrame, [0, 18], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              <span
                className="text-3xl font-display font-black tracking-[0.2em] uppercase"
                style={{
                  color: "#ffffff",
                  textShadow: "0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(16,185,129,0.3)",
                }}
              >
                THE BIOLOGICAL MECHANISM
              </span>
              <div
                className="mt-2 h-1 rounded-full"
                style={{
                  width: "160px",
                  background: "linear-gradient(90deg, #10b981, #38bdf8)",
                  boxShadow: "0 0 14px #10b981",
                }}
              />
            </div>

            {/* ── FULL-WIDTH DUAL GRAPH (Centered at top 20%) ── */}
            <div className="absolute" style={{ top: "18%" }}>
              <GlossyGlowGraph
                title=""
                entranceFrame={S2 + 8}
                yLabel="ENERGY"
                xLabels={["WAKE", "NOON", "6 PM", "MIDNIGHT"]}
                showFloorReflection={true}
                reflectionOpacity={0.28}
                curves={[
                  {
                    id: "morning_light",
                    label: "WITH SUNLIGHT",
                    color: "#10b981",
                    glowColor: "#10b981",
                    startFrame: S2 + 15,
                    durationFrames: 42,
                    showArrow: true,
                    pathD: "M 100 305 C 155 120, 240 95, 315 118 C 400 148, 475 290, 548 315",
                    areaD: "M 100 340 L 100 305 C 155 120, 240 95, 315 118 C 400 148, 475 290, 548 315 L 548 340 Z",
                    tipX: 548,
                    tipY: 315,
                  },
                  {
                    id: "no_light",
                    label: "NO SUNLIGHT",
                    color: "#f43f5e",
                    glowColor: "#f43f5e",
                    startFrame: S2 + 42,
                    durationFrames: 44,
                    showArrow: true,
                    pathD: "M 100 312 C 200 308, 330 312, 400 308 C 450 305, 498 162, 548 88",
                    areaD: "M 100 340 L 100 312 C 200 308, 330 312, 400 308 C 450 305, 498 162, 548 88 L 548 340 Z",
                    tipX: 548,
                    tipY: 88,
                  },
                ]}
                width={860}
                height={420}
              />
            </div>

            {/* ── FLOATING CURVE PINS (Font Style 1 + 2) ── */}
            <DataCallout
              label="EARLY CORTISOL PEAK"
              value="8–9 AM"
              color="#10b981"
              frame={frame}
              startFrame={S2 + 56}
              fps={fps}
              x="14%"
              y="16%"
            />
            <DataCallout
              label="MIDNIGHT REBOUND"
              value="11 PM↑"
              color="#f43f5e"
              frame={frame}
              startFrame={S2 + 78}
              fps={fps}
              right="8%"
              y="10%"
              align="right"
            />

            {/* ── METRIC BAR: Anchored cleanly at top 64% (ABOVE CAPTIONS) ── */}
            <div
              className="absolute flex gap-16 items-center px-10 py-4 rounded-3xl z-20"
              style={{
                top: "63%",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(10, 15, 28, 0.92)",
                border: "2.5px solid rgba(255,255,255,0.2)",
                boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(16,185,129,0.15)",
                backdropFilter: "blur(20px)",
                opacity: interpolate(sceneFrame, [60, 80], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <span
                  className="text-5xl font-black font-mono tracking-tight"
                  style={{ color: "#10b981", textShadow: "0 0 25px #10b981aa" }}
                >
                  +340%
                </span>
                <span
                  className="text-base font-mono font-black tracking-widest uppercase"
                  style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "0.15em" }}
                >
                  DAYTIME ALERTNESS
                </span>
              </div>
              <div style={{ width: "2px", height: "46px", background: "rgba(255,255,255,0.25)" }} />
              <div className="flex flex-col items-center gap-1">
                <span
                  className="text-5xl font-black font-mono tracking-tight"
                  style={{ color: "#f43f5e", textShadow: "0 0 25px #f43f5eaa" }}
                >
                  −16 HRS
                </span>
                <span
                  className="text-base font-mono font-black tracking-widest uppercase"
                  style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "0.15em" }}
                >
                  MELATONIN TIMER
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ================================================================== */}
      {/* SCENE 3 — "THE CIRCADIAN SHIFT" (Twist & Comparative Breakdown)    */}
      {/* Layout: Center Balance Scale + Large Stacked Comparative Verdicts  */}
      {/* ================================================================== */}
      {frame >= S3 && frame < S4 && (() => {
        const cam = cameraScale(S3, S4 - S3, 0.96, 1.02);
        const sceneFrame = frame - S3;

        // Card entrance springs
        const leftSp = useEntrance(frame, fps, S3 + 15, SPRING_SNAP);
        const rightSp = useEntrance(frame, fps, S3 + 30, SPRING_SNAP);

        return (
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{ transform: `scale(${cam})`, transformOrigin: "50% 50%" }}
          >
            <AtmosphericGlow color="#f43f5e" frame={frame} size={520} cx="28%" cy="32%" />
            <AtmosphericGlow color="#10b981" frame={frame} size={520} cx="72%" cy="32%" />

            {/* ── SCENE TITLE ── */}
            <div
              className="absolute"
              style={{
                top: "5%",
                left: "50%",
                transform: "translateX(-50%)",
                opacity: interpolate(sceneFrame, [0, 16], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              <span
                className="text-3xl font-display font-black tracking-[0.2em] uppercase"
                style={{ color: "#ffffff", textShadow: "0 0 20px rgba(56, 189, 248, 0.5)" }}
              >
                THE CIRCADIAN SHIFT
              </span>
            </div>

            {/* ── HERO BALANCE SCALE (Upper-Center: top 13%) ── */}
            <div className="absolute" style={{ top: "13%" }}>
              <GlossyBalanceScale
                title=""
                titleColor="#ffffff"
                leftLabel="MISS MORNING LIGHT"
                leftSub="INVERTED CORTISOL"
                leftColor="#f43f5e"
                rightLabel="60-MIN PHOTONS"
                rightSub="OPTIMAL SURGE"
                rightColor="#10b981"
                winner="right"
                startFrame={S3}
                width={700}
                height={360}
                glowColor="rgba(56, 189, 248, 0.22)"
                showFloorReflection={true}
                reflectionOpacity={0.32}
              />
            </div>

            {/* ── TWO PROMINENT COMPARATIVE VERDICT CARDS (Framed at top 48% — safely above captions) ── */}
            <div className="absolute flex gap-8 items-center z-20" style={{ top: "48%" }}>
              {/* LEFT CARD: The Trap (Red) */}
              <div
                className="flex flex-col gap-2 p-6 rounded-3xl shadow-2xl"
                style={{
                  width: "440px",
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "2.5px solid rgba(244, 63, 94, 0.8)",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 30px rgba(244,63,94,0.3)",
                  opacity: interpolate(leftSp, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
                  transform: `translateX(${interpolate(leftSp, [0, 1], [-30, 0])}px)`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-base font-mono font-black uppercase px-4 py-1.5 rounded-full"
                    style={{ background: "rgba(244,63,94,0.25)", color: "#f43f5e", border: "1px solid #f43f5e88" }}
                  >
                    THE TRAP
                  </span>
                  <span className="text-sm font-mono font-bold text-slate-400">0 LUX MORNING</span>
                </div>
                <span className="text-3xl font-display font-black text-white mt-1 leading-tight">
                  LETHARGY & INSOMNIA
                </span>
                <span className="text-lg font-mono font-bold text-rose-400">
                  Flatlined cortisol → Spikes at 11 PM
                </span>
              </div>

              {/* RIGHT CARD: The Protocol (Green) */}
              <div
                className="flex flex-col gap-2 p-6 rounded-3xl shadow-2xl"
                style={{
                  width: "440px",
                  background: "rgba(15, 23, 42, 0.95)",
                  border: "2.5px solid rgba(16, 185, 129, 0.85)",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(16,185,129,0.35)",
                  opacity: interpolate(rightSp, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
                  transform: `translateX(${interpolate(rightSp, [0, 1], [30, 0])}px)`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-base font-mono font-black uppercase px-4 py-1.5 rounded-full"
                    style={{ background: "rgba(16,185,129,0.25)", color: "#10b981", border: "1px solid #10b98188" }}
                  >
                    THE PROTOCOL
                  </span>
                  <span className="text-sm font-mono font-bold text-emerald-400">EARLY SUNLIGHT</span>
                </div>
                <span className="text-3xl font-display font-black text-white mt-1 leading-tight">
                  PHYSICAL ALERTNESS
                </span>
                <span className="text-lg font-mono font-bold text-emerald-300">
                  Morning cortisol unlocks glucose + drive
                </span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ================================================================== */}
      {/* SCENE 4 — "THE 60-MINUTE PROTOCOL" (Solution & Resolution)         */}
      {/* Layout: Staircase LEFT + Radial Dial RIGHT + Double Word Slam      */}
      {/* ================================================================== */}
      {frame >= S4 && (() => {
        const cam = cameraScale(S4, 120, 0.95, 1.01);
        const sceneFrame = frame - S4;

        const w1Sp = spring({ frame: Math.max(0, sceneFrame - 50), fps, config: SPRING_SNAP });
        const w2Sp = spring({ frame: Math.max(0, sceneFrame - 65), fps, config: SPRING_SNAP });

        return (
          <div
            className="absolute inset-0 flex items-center"
            style={{ transform: `scale(${cam})`, transformOrigin: "50% 50%" }}
          >
            <AtmosphericGlow color="#fbbf24" frame={frame} size={480} cx="70%" cy="42%" />
            <AtmosphericGlow color="#10b981" frame={frame} size={400} cx="28%" cy="46%" />

            {/* ── SCENE TITLE ── */}
            <div
              className="absolute"
              style={{
                top: "5%",
                left: "50%",
                transform: "translateX(-50%)",
                opacity: interpolate(sceneFrame, [0, 16], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              <span
                className="text-3xl font-display font-black tracking-[0.2em] uppercase"
                style={{ color: "#ffffff", textShadow: "0 0 20px rgba(251, 191, 36, 0.5)" }}
              >
                THE 60-MINUTE PROTOCOL
              </span>
            </div>

            {/* ── LEFT: Stepped Progression Staircase (top 42%) ── */}
            <div className="absolute" style={{ left: "3%", top: "42%", transform: "translateY(-50%)" }}>
              <SteppedProgressionStairs
                title=""
                titleColor="#ffffff"
                orbColor="#10b981"
                startFrame={S4}
                stepDurationFrames={24}
                showFloorReflection={true}
                reflectionOpacity={0.30}
                width={500}
                height={400}
                steps={[
                  { id: "s1", label: "WAKE UP" },
                  { id: "s2", label: "STEP OUTSIDE" },
                  { id: "s3", label: "DIRECT SUNLIGHT" },
                  { id: "s4", label: "10–15 MIN", isGoal: true },
                ]}
              />
            </div>

            {/* ── RIGHT: 360° Circular Chrono Dial (size 380, top 42%) ── */}
            <div className="absolute" style={{ right: "4%", top: "42%", transform: "translateY(-50%)" }}>
              <GlossyRadialDial
                title=""
                titleColor="#ffffff"
                targetPercent={88}
                valueText="60 MIN"
                labelText="WINDOW"
                accentColor="#fbbf24"
                glowColor="rgba(251, 191, 36, 0.25)"
                startFrame={S4 + 18}
                size={380}
                showFloorReflection={true}
                reflectionOpacity={0.32}
              />
            </div>

            {/* ── FLOATING CALLOUT: Melatonin Timer (top 15%) ── */}
            <DataCallout
              label="MELATONIN TIMER"
              value="16 HRS LATER"
              color="#fbbf24"
              frame={frame}
              startFrame={S4 + 40}
              fps={fps}
              right="6%"
              y="14%"
              align="right"
            />

            {/* ── FLOATING CALLOUT: Sunlight Window (top 58%) ── */}
            <DataCallout
              label="WITHIN WAKING"
              value="60 MINUTES"
              color="#10b981"
              frame={frame}
              startFrame={S4 + 28}
              fps={fps}
              x="5%"
              y="58%"
            />

            {/* ── FINAL RESOLUTION WORD SLAM (Centered at top 64%, safely above captions) ── */}
            <div
              className="absolute pointer-events-none flex gap-4 items-center z-30"
              style={{ top: "64%", left: "50%", transform: "translateX(-50%)" }}
            >
              <span
                className="font-display font-black uppercase inline-block"
                style={{
                  fontSize: "64px",
                  color: "#ffffff",
                  textShadow: "0 0 25px #fbbf24, 0 0 50px #fbbf2488",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                  opacity: interpolate(w1Sp, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
                  transform: `scale(${interpolate(w1Sp, [0, 1], [0.65, 1.0])})`,
                }}
              >
                CORTISOL
              </span>
              <span
                className="font-display font-black uppercase inline-block"
                style={{
                  fontSize: "64px",
                  color: "#10b981",
                  textShadow: "0 0 25px #10b981, 0 0 50px #10b98188",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                  opacity: interpolate(w2Sp, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
                  transform: `scale(${interpolate(w2Sp, [0, 1], [0.65, 1.0])})`,
                }}
              >
                RESET
              </span>
            </div>
          </div>
        );
      })()}

    </div>
  );
};
