import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GlossyGlowGraph, GlossyBalanceScale, GlossyRadialDial, SteppedProgressionStairs } from "../../components/pure_graphics";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

// ─── Shared easing ────────────────────────────────────────────────────────────
const SPRING_SOFT = { damping: 18, mass: 0.9, stiffness: 100 };
const SPRING_SNAP = { damping: 14, mass: 0.6, stiffness: 180 };

function useEntrance(frame: number, fps: number, startFrame: number, cfg = SPRING_SOFT) {
  const rel = Math.max(0, frame - startFrame);
  return spring({ frame: rel, fps, config: cfg });
}

// ─── Data Callout Pin ────────────────────────────────────────────────────────
interface CalloutProps {
  label: string;
  value: string;
  color: string;
  frame: number;
  startFrame: number;
  fps: number;
  x: string;
  y: string;
  align?: "left" | "right";
}
const DataCallout: React.FC<CalloutProps> = ({ label, value, color, frame, startFrame, fps, x, y, align = "left" }) => {
  const sp = useEntrance(frame, fps, startFrame, SPRING_SNAP);
  const opacity = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
  const translateX = interpolate(sp, [0, 1], [align === "right" ? 18 : -18, 0]);
  const scale = interpolate(sp, [0, 1], [0.82, 1.0]);

  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, opacity, transform: `translateX(${translateX}px) scale(${scale})`, transformOrigin: align === "right" ? "right center" : "left center" }}
    >
      <div
        className="flex flex-col gap-0.5 px-4 py-2.5 rounded-xl"
        style={{
          background: `linear-gradient(135deg, ${color}18, ${color}08)`,
          border: `1.5px solid ${color}50`,
          boxShadow: `0 0 18px ${color}22, inset 0 1px 1px rgba(255,255,255,0.06)`,
          backdropFilter: "blur(8px)",
        }}
      >
        <span className="text-xs font-black tracking-widest uppercase" style={{ color: `${color}bb`, letterSpacing: "0.14em" }}>{label}</span>
        <span className="text-2xl font-black font-mono" style={{ color: "#fff", textShadow: `0 0 16px ${color}cc` }}>{value}</span>
      </div>
      {/* Connector dot */}
      <div className="absolute top-1/2 -translate-y-1/2" style={{ [align === "right" ? "right" : "left"]: "-6px", width: "8px", height: "8px", borderRadius: "50%", backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
    </div>
  );
};

// ─── Floating Neon Word (slams in with spring) ───────────────────────────────
const NeonWord: React.FC<{ text: string; color: string; size: string; frame: number; startFrame: number; fps: number; x: string; y: string; weight?: number }> = ({
  text, color, size, frame, startFrame, fps, x, y, weight = 900
}) => {
  const sp = useEntrance(frame, fps, startFrame, SPRING_SNAP);
  const opacity = interpolate(sp, [0, 0.5], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(sp, [0, 1], [0.6, 1.0]);
  const translateY = interpolate(sp, [0, 1], [14, 0]);

  return (
    <div
      className="absolute pointer-events-none uppercase"
      style={{
        left: x, top: y, opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        fontSize: size, fontWeight: weight,
        color: "#fff",
        textShadow: `0 0 20px ${color}, 0 0 50px ${color}88`,
        letterSpacing: "0.06em",
        fontFamily: "sans-serif",
        lineHeight: 1,
      }}
    >
      {text}
    </div>
  );
};

// ─── Glowing Separator Line ──────────────────────────────────────────────────
const GlowLine: React.FC<{ color: string; frame: number; startFrame: number; fps: number; width: string; x: string; y: string; vertical?: boolean }> = ({
  color, frame, startFrame, fps, width, x, y, vertical = false
}) => {
  const sp = useEntrance(frame, fps, startFrame, { damping: 20, mass: 0.7, stiffness: 120 });
  const scaleW = interpolate(sp, [0, 1], [0, 1], { extrapolateRight: "clamp" });
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: x, top: y,
        width: vertical ? "2px" : width,
        height: vertical ? width : "2px",
        background: `linear-gradient(${vertical ? "to bottom" : "to right"}, transparent, ${color}cc, transparent)`,
        boxShadow: `0 0 12px ${color}88`,
        transform: vertical ? `scaleY(${scaleW})` : `scaleX(${scaleW})`,
        transformOrigin: vertical ? "top center" : "left center",
      }}
    />
  );
};

// ─── Animated Metric Counter ─────────────────────────────────────────────────
const MetricCounter: React.FC<{ from: number; to: number; unit: string; color: string; frame: number; startFrame: number; fps: number; x: string; y: string; size?: string }> = ({
  from, to, unit, color, frame, startFrame, fps, x, y, size = "52px"
}) => {
  const progress = interpolate(frame, [startFrame, startFrame + 40], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const value = Math.round(from + (to - from) * progress);
  const sp = useEntrance(frame, fps, startFrame, SPRING_SOFT);
  const opacity = interpolate(sp, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div className="absolute pointer-events-none flex flex-col items-center" style={{ left: x, top: y, opacity, transform: "translateX(-50%)" }}>
      <span className="font-black font-mono" style={{ fontSize: size, color: "#fff", textShadow: `0 0 24px ${color}cc, 0 0 50px ${color}55`, lineHeight: 1 }}>
        {value}<span style={{ fontSize: "0.45em", color, verticalAlign: "super" }}>{unit}</span>
      </span>
    </div>
  );
};

// ─── Atmospheric Glow Orb ────────────────────────────────────────────────────
const AtmosphericGlow: React.FC<{ color: string; frame: number; size?: number; cx?: string; cy?: string }> = ({
  color, frame, size = 420, cx = "50%", cy = "50%"
}) => {
  const breathe = 1 + Math.sin((frame / 30) * 1.1) * 0.06;
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: cx, top: cy,
        width: `${size * breathe}px`, height: `${size * breathe}px`,
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(ellipse, ${color}28 0%, ${color}08 45%, transparent 70%)`,
        borderRadius: "50%",
        filter: "blur(28px)",
      }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// THE CANVAS
// ═══════════════════════════════════════════════════════════════════════════════

export const TheCortisolInversionCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene timing (matching audio roughly: 30fps)
  // S1: Hook — inverted curve + paradox data (0 → 145)
  // S2: Logic — mechanism explained + dual comparison (145 → 290)
  // S3: Twist — balance reveal + data proof (290 → 440)
  // S4: Solution — protocol staircase + radial dial (440 → end)

  const S1 = 0;
  const S2 = 145;
  const S3 = 290;
  const S4 = 440;

  // ─── Camera Push-In (scene-local progress scale for cinematic zoom) ──────
  const cameraScale = (sceneStart: number, duration: number = 160, fromScale = 1.0, toScale = 1.06) => {
    return interpolate(frame, [sceneStart, sceneStart + duration], [fromScale, toScale], {
      extrapolateLeft: "clamp", extrapolateRight: "clamp",
      easing: Easing.bezier(0.0, 0.0, 0.2, 1.0),
    });
  };

  return (
    <div className="absolute inset-0 w-full h-full select-none overflow-hidden">

      {/* ================================================================== */}
      {/* SCENE 1 — "THE CORTISOL INVERSION" (Hook)                          */}
      {/* Layout: Asymmetric — Graph anchored LEFT, data callouts RIGHT      */}
      {/* ================================================================== */}
      {frame >= S1 && frame < S2 && (() => {
        const cam = cameraScale(S1, S2 - S1, 1.0, 1.06);
        return (
          <div
            className="absolute inset-0 flex items-center"
            style={{ transform: `scale(${cam})`, transformOrigin: "55% 50%" }}
          >
            {/* Atmospheric glow — rose red for cortisol spike */}
            <AtmosphericGlow color="#f43f5e" frame={frame} size={580} cx="38%" cy="52%" />
            <AtmosphericGlow color="#fb923c" frame={frame} size={260} cx="72%" cy="38%" />

            {/* ── GRAPH: shifted left-center ── */}
            <div className="absolute" style={{ left: "-5%", top: "50%", transform: "translateY(-52%)" }}>
              <GlossyGlowGraph
                title=""
                entranceFrame={S1 + 5}
                yLabel="CORTISOL"
                xLabels={["WAKE", "NOON", "EVENING", "MIDNIGHT"]}
                showFloorReflection={true}
                reflectionOpacity={0.32}
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
                    tipX: 550, tipY: 320,
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
                    tipX: 552, tipY: 82,
                  },
                ]}
                width={740}
                height={420}
              />
            </div>

            {/* ── FLOATING TITLE: top-right quadrant ── */}
            <NeonWord
              text="CORTISOL"
              color="#f43f5e"
              size="80px"
              frame={frame} startFrame={S1 + 8} fps={fps}
              x="57%" y="8%"
            />
            <NeonWord
              text="INVERSION"
              color="#ffffff"
              size="52px"
              frame={frame} startFrame={S1 + 22} fps={fps}
              x="58%" y="21%"
              weight={700}
            />
            <GlowLine color="#f43f5e" frame={frame} startFrame={S1 + 28} fps={fps} width="180px" x="58%" y="33%" />

            {/* ── DATA CALLOUTS: right side staggered ── */}
            <DataCallout
              label="MORNING PEAK" value="8–10 AM"
              color="#10b981"
              frame={frame} startFrame={S1 + 50} fps={fps}
              x="60%" y="37%"
            />
            <DataCallout
              label="INVERTED SPIKE" value="11 PM↑"
              color="#f43f5e"
              frame={frame} startFrame={S1 + 70} fps={fps}
              x="60%" y="53%"
              align="left"
            />
            <DataCallout
              label="ENERGY DEFICIT" value="ALL DAY"
              color="#fb923c"
              frame={frame} startFrame={S1 + 92} fps={fps}
              x="60%" y="69%"
            />

            {/* ── BOTTOM METRIC ── */}
            <MetricCounter
              from={0} to={78} unit="%" color="#f43f5e"
              frame={frame} startFrame={S1 + 85} fps={fps}
              x="73%" y="82%"
              size="44px"
            />
            <NeonWord text="lethargic hours" color="#f43f5e88" size="13px" frame={frame} startFrame={S1 + 100} fps={fps} x="64%" y="91%" weight={700} />

            {/* Separator vertical line between graph and callouts */}
            <GlowLine color="#ffffff" frame={frame} startFrame={S1 + 40} fps={fps} width="240px" x="57.5%" y="30%" vertical={true} />
          </div>
        );
      })()}

      {/* ================================================================== */}
      {/* SCENE 2 — "THE MECHANISM" (Explain Logic)                          */}
      {/* Layout: Center stage — dual-curve comparison with in-graph labels  */}
      {/* ================================================================== */}
      {frame >= S2 && frame < S3 && (() => {
        const cam = cameraScale(S2, S3 - S2, 1.04, 1.0); // Reverse zoom — zoom OUT for reveal
        const sceneFrame = frame - S2;
        return (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ transform: `scale(${cam})`, transformOrigin: "50% 48%" }}
          >
            {/* Atmospheric glow — dual: green left, red right */}
            <AtmosphericGlow color="#10b981" frame={frame} size={400} cx="28%" cy="55%" />
            <AtmosphericGlow color="#f43f5e" frame={frame} size={400} cx="72%" cy="55%" />

            {/* ── SCENE TITLE — centered, small, fades in first ── */}
            <div
              className="absolute"
              style={{
                top: "7%", left: "50%", transform: "translateX(-50%)",
                opacity: interpolate(sceneFrame, [0, 18], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              <span
                className="text-base font-black tracking-[0.25em] uppercase"
                style={{ color: "rgba(255,255,255,0.45)", letterSpacing: "0.25em" }}
              >
                THE MECHANISM
              </span>
            </div>

            {/* ── MAIN DUAL GRAPH ── */}
            <div style={{ marginTop: "30px" }}>
              <GlossyGlowGraph
                title=""
                entranceFrame={S2 + 8}
                yLabel="ENERGY LEVEL"
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
                    tipX: 548, tipY: 315,
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
                    tipX: 548, tipY: 88,
                  },
                ]}
                width={820}
                height={420}
              />
            </div>

            {/* ── FLOATING DATA PINS on graph ── */}
            {/* Green curve peak label */}
            <DataCallout
              label="MORNING CORTISOL PEAK" value="8–9 AM"
              color="#10b981"
              frame={frame} startFrame={S2 + 58} fps={fps}
              x="18%" y="22%"
            />
            {/* Red curve spike label */}
            <DataCallout
              label="LATE-NIGHT CORTISOL SPIKE" value="11 PM"
              color="#f43f5e"
              frame={frame} startFrame={S2 + 80} fps={fps}
              x="60%" y="11%"
              align="left"
            />

            {/* ── BOTTOM ROW: two metrics side by side ── */}
            <div
              className="absolute flex gap-16 items-center"
              style={{
                bottom: "5%", left: "50%", transform: "translateX(-50%)",
                opacity: interpolate(sceneFrame, [70, 90], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-black font-mono" style={{ color: "#10b981", textShadow: "0 0 20px #10b98188" }}>+340%</span>
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.45)" }}>daytime energy</span>
              </div>
              <div style={{ width: "1px", height: "36px", background: "rgba(255,255,255,0.15)" }} />
              <div className="flex flex-col items-center gap-1">
                <span className="text-3xl font-black font-mono" style={{ color: "#f43f5e", textShadow: "0 0 20px #f43f5e88" }}>−16 HRS</span>
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.45)" }}>delayed melatonin</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ================================================================== */}
      {/* SCENE 3 — "THE CIRCADIAN SHIFT" (Comparative Twist)               */}
      {/* Layout: Balance scale center + flanking stat panels                */}
      {/* ================================================================== */}
      {frame >= S3 && frame < S4 && (() => {
        const cam = cameraScale(S3, S4 - S3, 0.96, 1.02); // Gentle push IN
        const sceneFrame = frame - S3;

        // Left panel slide-in from left
        const leftPanelX = interpolate(
          sceneFrame, [0, 28], [-80, 0],
          { extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) }
        );
        const leftPanelOp = interpolate(sceneFrame, [0, 22], [0, 1], { extrapolateRight: "clamp" });
        // Right panel slide-in from right
        const rightPanelX = interpolate(
          sceneFrame, [12, 40], [80, 0],
          { extrapolateRight: "clamp", easing: Easing.bezier(0.22, 1, 0.36, 1) }
        );
        const rightPanelOp = interpolate(sceneFrame, [12, 34], [0, 1], { extrapolateRight: "clamp" });

        return (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ transform: `scale(${cam})`, transformOrigin: "50% 50%" }}
          >
            <AtmosphericGlow color="#f43f5e" frame={frame} size={480} cx="25%" cy="50%" />
            <AtmosphericGlow color="#10b981" frame={frame} size={480} cx="75%" cy="50%" />
            <AtmosphericGlow color="#38bdf8" frame={frame} size={200} cx="50%" cy="50%" />

            {/* ── LEFT STAT PANEL — "MISS MORNING LIGHT" ── */}
            <div
              className="absolute flex flex-col gap-3"
              style={{
                left: "3%", top: "50%", transform: `translateY(-50%) translateX(${leftPanelX}px)`,
                opacity: leftPanelOp, width: "220px",
              }}
            >
              <span className="text-xs font-black tracking-widest uppercase" style={{ color: "#f43f5e99", letterSpacing: "0.2em" }}>Without Sunlight</span>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Morning Cortisol", value: "FLAT" },
                  { label: "Night Cortisol", value: "SPIKED" },
                  { label: "Daytime Energy", value: "DRAINED" },
                  { label: "Sleep Quality", value: "BROKEN" },
                ].map((row, i) => {
                  const rowOp = interpolate(sceneFrame, [i * 12, i * 12 + 18], [0, 1], { extrapolateRight: "clamp" });
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-2 rounded-lg"
                      style={{
                        background: "rgba(244, 63, 94, 0.08)",
                        border: "1px solid rgba(244, 63, 94, 0.25)",
                        opacity: rowOp,
                      }}
                    >
                      <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>{row.label}</span>
                      <span className="text-xs font-black" style={{ color: "#f43f5e" }}>{row.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── CENTER: Balance Scale ── */}
            <GlossyBalanceScale
              title=""
              titleColor="#ffffff"
              leftLabel="MISS MORNING LIGHT"
              leftSub="Inverted cortisol"
              leftColor="#f43f5e"
              rightLabel="60-MIN SUNLIGHT"
              rightSub="Optimal morning peak"
              rightColor="#10b981"
              winner="right"
              startFrame={S3}
              width={520}
              height={380}
              glowColor="rgba(56, 189, 248, 0.18)"
              showFloorReflection={true}
              reflectionOpacity={0.32}
            />

            {/* ── RIGHT STAT PANEL — "WITH SUNLIGHT PROTOCOL" ── */}
            <div
              className="absolute flex flex-col gap-3"
              style={{
                right: "3%", top: "50%", transform: `translateY(-50%) translateX(${rightPanelX}px)`,
                opacity: rightPanelOp, width: "220px",
              }}
            >
              <span className="text-xs font-black tracking-widest uppercase" style={{ color: "#10b98199", letterSpacing: "0.2em" }}>With Sunlight</span>
              <div className="flex flex-col gap-2">
                {[
                  { label: "Morning Cortisol", value: "PEAKED" },
                  { label: "Night Cortisol", value: "DROPS" },
                  { label: "Daytime Energy", value: "POWERED" },
                  { label: "Sleep Quality", value: "RESTORED" },
                ].map((row, i) => {
                  const rowOp = interpolate(sceneFrame, [i * 12 + 8, i * 12 + 26], [0, 1], { extrapolateRight: "clamp" });
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between px-3 py-2 rounded-lg"
                      style={{
                        background: "rgba(16, 185, 129, 0.08)",
                        border: "1px solid rgba(16, 185, 129, 0.25)",
                        opacity: rowOp,
                      }}
                    >
                      <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>{row.label}</span>
                      <span className="text-xs font-black" style={{ color: "#10b981" }}>{row.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── SCENE LABEL ── */}
            <div
              className="absolute"
              style={{
                top: "6%", left: "50%", transform: "translateX(-50%)",
                opacity: interpolate(sceneFrame, [0, 16], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              <span className="text-base font-black tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
                THE CIRCADIAN SHIFT
              </span>
            </div>
          </div>
        );
      })()}

      {/* ================================================================== */}
      {/* SCENE 4 — "THE 60-MINUTE PROTOCOL" (Solution)                      */}
      {/* Layout: Staircase LEFT + Radial Dial RIGHT + time metric TOP-RIGHT  */}
      {/* ================================================================== */}
      {frame >= S4 && (() => {
        const cam = cameraScale(S4, 120, 0.95, 1.01);
        const sceneFrame = frame - S4;

        return (
          <div
            className="absolute inset-0 flex items-center"
            style={{ transform: `scale(${cam})`, transformOrigin: "50% 50%" }}
          >
            <AtmosphericGlow color="#fbbf24" frame={frame} size={400} cx="68%" cy="48%" />
            <AtmosphericGlow color="#10b981" frame={frame} size={320} cx="28%" cy="52%" />

            {/* ── SCENE LABEL ── */}
            <div
              className="absolute"
              style={{
                top: "6%", left: "50%", transform: "translateX(-50%)",
                opacity: interpolate(sceneFrame, [0, 16], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              <span className="text-base font-black tracking-[0.25em] uppercase" style={{ color: "rgba(255,255,255,0.4)" }}>
                THE PROTOCOL
              </span>
            </div>

            {/* ── LEFT: Stepped Staircase ── */}
            <div className="absolute" style={{ left: "0%", top: "50%", transform: "translateY(-50%)" }}>
              <SteppedProgressionStairs
                title=""
                titleColor="#ffffff"
                orbColor="#10b981"
                startFrame={S4}
                stepDurationFrames={24}
                showFloorReflection={true}
                reflectionOpacity={0.28}
                width={460}
                height={380}
                steps={[
                  { id: "s1", label: "WAKE UP" },
                  { id: "s2", label: "STEP OUTSIDE" },
                  { id: "s3", label: "DIRECT SUNLIGHT" },
                  { id: "s4", label: "10–15 MIN", isGoal: true },
                ]}
              />
            </div>

            {/* ── VERTICAL DIVIDER ── */}
            <GlowLine
              color="#ffffff"
              frame={frame} startFrame={S4 + 20} fps={fps}
              width="280px" x="48%" y="18%"
              vertical={true}
            />

            {/* ── RIGHT: Radial Dial ── */}
            <div className="absolute" style={{ right: "2%", top: "50%", transform: "translateY(-52%)" }}>
              <GlossyRadialDial
                title=""
                titleColor="#ffffff"
                targetPercent={88}
                valueText="60 MIN"
                labelText="WINDOW"
                accentColor="#fbbf24"
                glowColor="rgba(251, 191, 36, 0.22)"
                startFrame={S4 + 18}
                size={360}
                showFloorReflection={true}
                reflectionOpacity={0.30}
              />
            </div>

            {/* ── FLOATING CALLOUT on Dial ── */}
            <DataCallout
              label="MELATONIN RELEASE" value="16 HRS LATER"
              color="#fbbf24"
              frame={frame} startFrame={S4 + 55} fps={fps}
              x="51%" y="18%"
            />

            {/* ── KEY PROTOCOL METRICS: staggered top-right ── */}
            <DataCallout
              label="WITHIN WAKING" value="60 MIN"
              color="#10b981"
              frame={frame} startFrame={S4 + 30} fps={fps}
              x="51%" y="71%"
            />

            {/* ── Solution word slam ── */}
            <NeonWord
              text="CORTISOL"
              color="#fbbf24"
              size="42px"
              frame={frame} startFrame={S4 + 70} fps={fps}
              x="51.5%" y="80%"
            />
            <NeonWord
              text="RESET"
              color="#10b981"
              size="42px"
              frame={frame} startFrame={S4 + 84} fps={fps}
              x="74%" y="80%"
            />
          </div>
        );
      })()}

    </div>
  );
};
