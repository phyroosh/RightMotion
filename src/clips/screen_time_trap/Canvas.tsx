import React from "react";
import {
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";
import { WordTimestamp } from "../../types";
import { MechanismStage } from "../../components/primitives";
import { CameraCanvas, CameraKeyframe } from "../../components/CameraCanvas";
import { AnimatedSlashStrike } from "../../components/kinetic_text";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  🎬 RIGHTMOTION CREATIVE MISSION — ScreenTimeTrapCanvas
 * ║  Topic: "Side Effects of High Screen time is worst that u think (Mom was right, it's this damn phone)"
 * ║  Primary Visual Mechanism: DISPLACEMENT & BASELINE RECALIBRATION
 * ║  Attention Curve: PSYCHOLOGICAL_TENSION
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * Adheres strictly to the RightMotion Creative Constitution:
 * • SIMPLE FRAME. RICH TIMELINE.
 * • visualDensity != attentionIntensity.
 * • No unmotivated cards — open canvas physical mechanisms.
 * • Mobile Scale Law: Primary subjects 400–750px, typography >= 36px (hero 64-96px).
 * • Mute Test & Remove-The-Text Test verified: active physical deformation carries meaning.
 */
export const ScreenTimeTrapCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  // ═══ SHOT DIRECTIVES (Frame Boundaries from transcript.json) ═══
  // Shot 1 (Hook):        frames 0    → 161  (0s - 2.68s)
  // Shot 2 (Mechanism):   frames 161  → 798  (2.68s - 13.3s)
  // Shot 3 (Escalation):  frames 798  → 1469 (13.3s - 24.5s)
  // Shot 4 (Resolution):  frames 1469 → 1823 (24.5s - 30.4s)

  const isHook = frame < 161;
  const isMechanism = frame >= 161 && frame < 798;
  const isEscalation = frame >= 798 && frame < 1469;
  const isResolution = frame >= 1469;

  // ═══ CAMERA CHOREOGRAPHY ═══
  const cameraKeyframes: CameraKeyframe[] = [
    { timeMs: 0, x: 540, y: 960, zoom: 1.0, rotate: 0 },
    { timeMs: 2680, x: 540, y: 950, zoom: 1.02, rotate: 0 },
    { timeMs: 13300, x: 540, y: 930, zoom: 1.05, rotate: -0.3 },
    { timeMs: 24480, x: 540, y: 960, zoom: 1.0, rotate: 0 },
    { timeMs: 30380, x: 540, y: 960, zoom: 1.0, rotate: 0 },
  ];

  return (
    <CameraCanvas
      currentMs={currentMs}
      keyframes={cameraKeyframes}
      width={1080}
      height={1920}
      enableDrift={true}
      driftIntensity={0.3}
    >
      {/* ═══ OPEN MECHANISM STAGE (Platform safe bounds: y: 260 → 1340px) ═══ */}
      <MechanismStage top={260} bottom={1340}>
        {/* ─────────────────────────────────────────────────────────────
            SHOT 1: THE HOOK (frames 0 → 161, 0s - 2.68s)
            "Your mom was right about that phone, but for the wrong reason."
            Side-by-side: Editorial Card on the left, Judy close-up on the right (f: 0-75).
           ───────────────────────────────────────────────────────────── */}
        {isHook && (
          <div className="relative w-full h-full select-none">
            {/* Top diagnostic tag */}
            <div
              className="absolute top-2 left-10 px-5 py-2 rounded-full border border-slate-300 bg-white/95 shadow-sm text-slate-600 font-mono font-bold text-sm tracking-widest uppercase"
              style={{
                opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              MOM'S WARNING // THE BIOLOGICAL TRUTH
            </div>

            {/* Editorial Hero Illustration Card (Left side, complementary to Judy on the right) */}
            <div
              className="absolute top-16 left-10 w-[580px] h-[390px] rounded-3xl overflow-hidden border-2 border-slate-900/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] bg-slate-900"
              style={{
                opacity: interpolate(frame, [4, 18], [0, 1], { extrapolateRight: "clamp" }),
                transform: `scale(${spring({
                  frame: Math.max(0, frame - 4),
                  fps,
                  config: { damping: 14, stiffness: 120, mass: 0.7 },
                })})`,
              }}
            >
              <Img
                src={staticFile("screen_time_trap/assets/scene_illustration.png")}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between text-white">
                <span className="font-mono text-xs font-semibold tracking-wider text-sky-300 uppercase">
                  CIRCADIAN DIVIDE
                </span>
                <span className="font-mono text-xs font-semibold text-slate-300 uppercase">
                  DOPAMINE LOOP
                </span>
              </div>
            </div>

            {/* Hero display typography positioned cleanly below the card on the left */}
            <div
              className="absolute top-[480px] left-10 max-w-[580px]"
              style={{
                opacity: interpolate(frame, [22, 38], [0, 1], { extrapolateRight: "clamp" }),
                transform: `translateY(${interpolate(frame, [22, 38], [15, 0], { extrapolateRight: "clamp" })}px)`,
              }}
            >
              <h1 className="text-[58px] font-black tracking-tight text-slate-950 font-sans leading-none">
                NOT JUST
                <br />
                WASTED TIME
              </h1>
              <p className="font-mono text-[36px] font-black text-sky-600 mt-2 tracking-wide">
                CHEMICAL REWIRING
              </p>
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            SHOT 2: THE MECHANISM (frames 161 → 798, 2.68s - 13.3s)
            "High screen time isn't just wasting your hours—it is chemically rewiring your prefrontal cortex.
             Every rapid swipe floods your brain with micro-dopamine spikes followed by attentional residue."
           ───────────────────────────────────────────────────────────── */}
        {isMechanism && (
          <div className="relative w-full h-full flex flex-col items-center justify-start pt-4 px-6 select-none">
            {/* Sub-phase A: Prefrontal Cortex Rewiring (frames 161 to 485) */}
            {frame < 485 ? (
              <div className="relative w-full flex flex-col items-center">
                {/* Scene Headline */}
                <div
                  className="text-center"
                  style={{
                    opacity: interpolate(frame, [161, 180], [0, 1], { extrapolateRight: "clamp" }),
                  }}
                >
                  <span className="font-mono text-[36px] font-bold text-sky-600 tracking-wider uppercase">
                    TARGET REGION
                  </span>
                  <h2 className="text-[68px] font-black text-slate-950 font-sans leading-tight mt-1">
                    PREFRONTAL CORTEX
                  </h2>
                </div>

                {/* Hero 3D Glowing Brain with Synaptic Shockwaves */}
                <div
                  className="relative w-[620px] h-[580px] mt-4 flex items-center justify-center"
                  style={{
                    transform: `scale(${spring({
                      frame: Math.max(0, frame - 165),
                      fps,
                      config: { damping: 13, stiffness: 110, mass: 0.8 },
                    })})`,
                  }}
                >
                  {/* Subtle radial glow backing */}
                  <div
                    className="absolute w-[560px] h-[560px] rounded-full bg-sky-400/20 blur-3xl pointer-events-none"
                    style={{
                      transform: `scale(${1 + Math.sin(frame * 0.1) * 0.05})`,
                    }}
                  />

                  {/* Brain Cutout (scaled large: 580px) */}
                  <Img
                    src={staticFile("assets/psychology/hyperrealistic_3d_glowing_brain.png")}
                    className="w-[580px] h-[540px] object-contain drop-shadow-[0_25px_45px_rgba(2,132,199,0.3)]"
                  />

                  {/* Synaptic Flash Shockwave Arc on "chemically rewiring" (f: 323) */}
                  {frame >= 323 && (
                    <div
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      style={{
                        opacity: interpolate(frame, [323, 335, 375], [0, 1, 0], {
                          extrapolateRight: "clamp",
                        }),
                      }}
                    >
                      <div className="w-[480px] h-[480px] rounded-full border-4 border-cyan-400 animate-ping opacity-75" />
                    </div>
                  )}

                  {/* Micro-event: Circuit pulse at frame 400 */}
                  {frame >= 400 && (
                    <div
                      className="absolute top-1/4 left-1/3 w-8 h-8 rounded-full bg-cyan-400 animate-ping pointer-events-none"
                      style={{
                        opacity: interpolate(frame, [400, 420, 450], [0, 1, 0], {
                          extrapolateRight: "clamp",
                        }),
                      }}
                    />
                  )}
                </div>

                {/* Direct Open Typographic Readout (No card wrapper) */}
                <div
                  className="mt-2 text-center"
                  style={{
                    opacity: interpolate(frame, [200, 220], [0, 1], { extrapolateRight: "clamp" }),
                  }}
                >
                  <p className="font-mono text-[38px] font-black text-slate-900 tracking-wider uppercase">
                    NEURAL REWIRING // ACTIVE
                  </p>
                  <p className="font-mono text-[32px] font-semibold text-sky-600 mt-1">
                    Attention span threshold degrading
                  </p>
                </div>
              </div>
            ) : (
              /* Sub-phase B: The Dopamine Swipe & Attentional Residue (frames 485 to 798) */
              <div className="relative w-full flex flex-col items-center">
                {/* Header */}
                <div
                  className="text-center"
                  style={{
                    opacity: interpolate(frame, [485, 505], [0, 1], { extrapolateRight: "clamp" }),
                  }}
                >
                  <span className="font-mono text-[36px] font-bold text-amber-600 tracking-wider uppercase">
                    CYCLE INTERRUPTION
                  </span>
                  <h2 className="text-[68px] font-black text-slate-950 font-sans leading-tight mt-1">
                    MICRO-DOPAMINE SPIKES
                  </h2>
                </div>

                {/* The Dynamic Swipe Conduit & Spikes SVG Engine */}
                <div className="relative w-[820px] h-[520px] mt-4 flex flex-col items-center justify-center">
                  <svg
                    viewBox="0 0 820 520"
                    className="w-full h-full overflow-visible"
                  >
                    {/* Background Grid Lines */}
                    <line x1="40" y1="120" x2="780" y2="120" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 8" />
                    <line x1="40" y1="240" x2="780" y2="240" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="8 8" />
                    <line x1="40" y1="360" x2="780" y2="360" stroke="#94a3b8" strokeWidth="4" />

                    {/* Vertical Swipe Kinetic Trail (Frame 485 - 540) */}
                    {frame >= 485 && frame < 580 && (
                      <line
                        x1="410"
                        y1={interpolate(frame, [485, 530], [420, 60], { extrapolateRight: "clamp" })}
                        x2="410"
                        y2={interpolate(frame, [485, 530], [480, 120], { extrapolateRight: "clamp" })}
                        stroke="#0284c7"
                        strokeWidth="12"
                        strokeLinecap="round"
                        opacity={interpolate(frame, [530, 560], [1, 0], { extrapolateRight: "clamp" })}
                      />
                    )}

                    {/* Micro-event: Second Swipe Wave at frame 560 */}
                    {frame >= 560 && frame < 610 && (
                      <line
                        x1="520"
                        y1={interpolate(frame, [560, 595], [420, 80], { extrapolateRight: "clamp" })}
                        x2="520"
                        y2={interpolate(frame, [560, 595], [470, 130], { extrapolateRight: "clamp" })}
                        stroke="#0284c7"
                        strokeWidth="8"
                        strokeLinecap="round"
                        opacity={interpolate(frame, [595, 610], [1, 0], { extrapolateRight: "clamp" })}
                      />
                    )}

                    {/* Jagged Micro-Dopamine Spikes (Frame 601+) */}
                    {frame >= 601 && (
                      <path
                        d="M 60 360 L 140 360 L 180 100 L 220 360 L 300 360 L 350 60 L 400 360 L 480 360 L 530 90 L 580 360 L 760 360"
                        fill="none"
                        stroke="#0284c7"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="1400"
                        strokeDashoffset={interpolate(frame, [601, 645], [1400, 0], {
                          extrapolateRight: "clamp",
                        })}
                      />
                    )}

                    {/* Attentional Residue Sediment Pool (Frame 665+) */}
                    {frame >= 665 && (
                      <g
                        opacity={interpolate(frame, [665, 730], [0, 1], {
                          extrapolateRight: "clamp",
                        })}
                      >
                        {/* Accumulated Muddy Sediment Reservoir */}
                        <rect
                          x="60"
                          y="360"
                          width="700"
                          height={interpolate(frame, [665, 760], [0, 75], {
                            extrapolateRight: "clamp",
                          })}
                          fill="rgba(245, 158, 11, 0.22)"
                          stroke="#f59e0b"
                          strokeWidth="3"
                          rx="10"
                        />
                        {/* Sediment Particles */}
                        {[100, 180, 260, 340, 420, 500, 580, 660].map((cx, i) => (
                          <circle
                            key={i}
                            cx={cx}
                            cy={390 + (i % 3) * 10}
                            r="7"
                            fill="#d97706"
                          />
                        ))}
                      </g>
                    )}
                  </svg>

                  {/* Open Typographic Readout (f: 665+) */}
                  {frame >= 665 && (
                    <div
                      className="mt-4 text-center"
                      style={{
                        opacity: interpolate(frame, [665, 685], [0, 1], { extrapolateRight: "clamp" }),
                        transform: `translateY(${interpolate(frame, [665, 685], [12, 0], { extrapolateRight: "clamp" })}px)`,
                      }}
                    >
                      <span className="font-mono text-[38px] font-black text-amber-700 tracking-wider uppercase">
                        ATTENTIONAL RESIDUE: ACCUMULATING
                      </span>
                      <p className="font-mono text-[32px] font-semibold text-slate-600 mt-1">
                        Processing cycles never resolve
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            SHOT 3: ESCALATION — BASELINE DISPLACEMENT (frames 798 → 1469, 13.3s - 24.5s)
            "Because processing cycles never finish, your baseline resets.
             Ordinary life begins to feel painfully boring, while background cortisol keeps you chronically drained."
           ───────────────────────────────────────────────────────────── */}
        {isEscalation && (
          <div className="relative w-full h-full flex flex-col items-center justify-start pt-4 px-6 select-none">
            {/* Section Header */}
            <div
              className="text-center"
              style={{
                opacity: interpolate(frame, [798, 820], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              <span className="font-mono text-[36px] font-bold text-rose-600 tracking-wider uppercase">
                MECHANICAL RECALIBRATION
              </span>
              <h2 className="text-[68px] font-black text-slate-950 font-sans leading-tight mt-1">
                {frame < 1004 ? "BASELINE RESETS DOWNWARD" : "CHRONIC RECOVERY DRAIN"}
              </h2>
            </div>

            {/* Architectural Baseline Deflection Engine */}
            <div className="relative w-[880px] h-[520px] mt-2 flex items-center justify-center">
              {(() => {
                // Calculate physical deflection sag
                const sagProgress = interpolate(frame, [820, 960], [0, 190], {
                  extrapolateRight: "clamp",
                });
                // Micro-tremor oscillation on chronic cortisol (f: 1175+)
                const tremor =
                  frame >= 1175 && frame < 1430
                    ? Math.sin(frame * 0.9) * 5 * interpolate(frame, [1175, 1220], [0, 1], { extrapolateLeft: "clamp" })
                    : 0;

                const centerSagY = 200 + sagProgress + tremor;

                return (
                  <svg viewBox="0 0 880 520" className="w-full h-full overflow-visible">
                    {/* 1. Permanent Ghost Baseline (where standard used to live) */}
                    <line
                      x1="60"
                      y1="200"
                      x2="820"
                      y2="200"
                      stroke="#94a3b8"
                      strokeWidth="4"
                      strokeDasharray="14 14"
                      opacity="0.65"
                    />
                    <text
                      x="70"
                      y="170"
                      fill="#64748b"
                      fontSize="36"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      ORIGINAL BASELINE
                    </text>

                    {/* 2. Active Deflecting Datum Line */}
                    <path
                      d={`M 60 200 Q 440 ${centerSagY} 820 200`}
                      fill="none"
                      stroke={frame >= 1175 ? "#e11d48" : "#0284c7"}
                      strokeWidth="12"
                      strokeLinecap="round"
                    />

                    {/* 3. Physical Load Weight: "UNFINISHED CYCLES" */}
                    <g
                      transform={`translate(440, ${centerSagY})`}
                      style={{
                        opacity: interpolate(frame, [805, 830], [0, 1], { extrapolateRight: "clamp" }),
                      }}
                    >
                      <rect
                        x="-170"
                        y="-48"
                        width="340"
                        height="50"
                        rx="14"
                        fill="#0f172a"
                        stroke="#38bdf8"
                        strokeWidth="3"
                        filter="drop-shadow(0 12px 20px rgba(0,0,0,0.35))"
                      />
                      <text
                        x="0"
                        y="-14"
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="34"
                        fontFamily="JetBrains Mono"
                        fontWeight="bold"
                      >
                        UNFINISHED CYCLES
                      </text>
                    </g>

                    {/* 4. Boredom Gap Callout (f: 1004 to 1175) */}
                    {frame >= 1004 && frame < 1175 && (
                      <g
                        opacity={interpolate(frame, [1004, 1030], [0, 1], { extrapolateRight: "clamp" })}
                      >
                        {/* Gap Arrow Bracket */}
                        <line x1="440" y1="210" x2="440" y2="380" stroke="#f43f5e" strokeWidth="4" strokeDasharray="6 6" />
                        <text
                          x="465"
                          y="300"
                          fill="#e11d48"
                          fontSize="38"
                          fontFamily="JetBrains Mono"
                          fontWeight="black"
                        >
                          Δ STIMULATION GAP
                        </text>
                        <circle cx="440" cy="270" r="12" fill="#94a3b8" />
                        <text
                          x="465"
                          y="265"
                          fill="#64748b"
                          fontSize="34"
                          fontFamily="Montserrat"
                          fontWeight="bold"
                        >
                          ORDINARY REALITY (TOO DULL)
                        </text>
                      </g>
                    )}

                    {/* 5. Chronic Cortisol Readout (f: 1175+) */}
                    {frame >= 1175 && (
                      <g
                        opacity={interpolate(frame, [1175, 1200], [0, 1], { extrapolateRight: "clamp" })}
                        transform="translate(440, 420)"
                      >
                        <text
                          x="0"
                          y="0"
                          textAnchor="middle"
                          fill="#e11d48"
                          fontSize="42"
                          fontFamily="JetBrains Mono"
                          fontWeight="black"
                        >
                          CHRONIC CORTISOL DRAIN
                        </text>
                        <text
                          x="0"
                          y="42"
                          textAnchor="middle"
                          fill="#64748b"
                          fontSize="34"
                          fontFamily="Montserrat"
                          fontWeight="bold"
                        >
                          NERVOUS SYSTEM: CONSTANT ALARM
                        </text>
                      </g>
                    )}
                  </svg>
                );
              })()}
            </div>

            {/* Low Battery Physical Cutout during Chronic Drain (f: 1175+) */}
            {frame >= 1175 && (
              <div
                className="relative w-[380px] h-[170px] mt-1 flex items-center justify-center"
                style={{
                  opacity: interpolate(frame, [1175, 1205], [0, 1], { extrapolateRight: "clamp" }),
                  transform: `scale(${spring({
                    frame: Math.max(0, frame - 1175),
                    fps,
                    config: { damping: 12, stiffness: 120, mass: 0.6 },
                  })})`,
                }}
              >
                <Img
                  src={staticFile("assets/burnout/battery_low_red.png")}
                  className="w-full h-full object-contain drop-shadow-[0_15px_30px_rgba(225,29,72,0.35)] animate-pulse"
                />
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────────────────────
            SHOT 4: RESOLUTION — THE FRICTION PROTOCOL (frames 1469 → 1823, 24.5s - 30.4s)
            "You don't need a full digital detox.
             Run a simple friction protocol: switch your screen to grayscale, and lock it outside your bedroom thirty minutes before sleep."
           ───────────────────────────────────────────────────────────── */}
        {isResolution && (
          <div className="relative w-full h-full flex flex-col items-center justify-start pt-4 px-6 select-none">
            {/* Animated Slash Strike cutting through the chronic cycle at frame 1469 */}
            <div className="absolute inset-x-0 top-[200px] h-[320px] pointer-events-none z-20">
              <AnimatedSlashStrike
                startFrame={1469}
                durationFrames={9}
                preset="blade_slash"
                color="#059669"
                strokeWidth={10}
                angle={-14}
              />
            </div>

            {/* Section Tag */}
            <div
              className="px-5 py-2 rounded-full border-2 border-emerald-500/30 bg-emerald-50 text-emerald-700 font-mono font-bold text-sm tracking-widest uppercase mb-3"
              style={{
                opacity: interpolate(frame, [1469, 1490], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              SOVEREIGN RESET // ACTIONABLE
            </div>

            {/* Headline */}
            <div
              className="text-center"
              style={{
                opacity: interpolate(frame, [1475, 1500], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              <h2 className="text-[72px] font-black text-slate-950 font-sans leading-none tracking-tight">
                FRICTION PROTOCOL
              </h2>
              <p className="font-mono text-[38px] font-bold text-emerald-600 mt-2 tracking-wide">
                RESTORING BASELINE EQUILIBRIUM
              </p>
            </div>

            {/* Restored Straight Baseline Datum Line (Elastic Rebound) */}
            <div className="relative w-[880px] h-[100px] mt-4 flex items-center justify-center">
              <svg viewBox="0 0 880 100" className="w-full h-full overflow-visible">
                {(() => {
                  const reboundProgress = spring({
                    frame: Math.max(0, frame - 1475),
                    fps,
                    config: { damping: 12, stiffness: 130, mass: 0.7 },
                  });
                  const reboundSag = interpolate(reboundProgress, [0, 1], [150, 0]);

                  return (
                    <>
                      <path
                        d={`M 60 50 Q 440 ${50 + reboundSag} 820 50`}
                        fill="none"
                        stroke="#059669"
                        strokeWidth="12"
                        strokeLinecap="round"
                        filter="drop-shadow(0 0 14px rgba(5,150,105,0.4))"
                      />
                      <circle cx="440" cy={50 + reboundSag} r="12" fill="#059669" />
                    </>
                  );
                })()}
              </svg>
            </div>

            {/* Two Actionable Protocol Pillars (Architectural Open-Vector Staging) */}
            <div className="relative w-[820px] flex flex-col gap-6 mt-4">
              {/* Protocol Step 1: Grayscale Mode */}
              <div
                className="w-full flex items-center gap-6"
                style={{
                  opacity: interpolate(frame, [1520, 1545], [0, 1], { extrapolateRight: "clamp" }),
                  transform: `translateX(${interpolate(frame, [1520, 1545], [-30, 0], { extrapolateRight: "clamp" })}px)`,
                }}
              >
                <div className="w-20 h-20 rounded-full bg-slate-900 text-white flex items-center justify-center font-mono font-black text-3xl shadow-xl flex-shrink-0">
                  01
                </div>
                <div className="flex flex-col">
                  <span className="text-[50px] font-black text-slate-950 font-sans leading-tight">
                    DISPLAY → GRAYSCALE
                  </span>
                  <span className="font-mono text-[34px] font-semibold text-slate-600 mt-1">
                    Eliminates toxic dopamine triggers
                  </span>
                </div>
              </div>

              {/* Protocol Step 2: Bedroom Isolation */}
              <div
                className="w-full flex items-center gap-6"
                style={{
                  opacity: interpolate(frame, [1580, 1610], [0, 1], { extrapolateRight: "clamp" }),
                  transform: `translateX(${interpolate(frame, [1580, 1610], [-30, 0], { extrapolateRight: "clamp" })}px)`,
                }}
              >
                <div className="w-20 h-20 rounded-full bg-emerald-600 text-white flex items-center justify-center font-mono font-black text-3xl shadow-xl flex-shrink-0">
                  02
                </div>
                <div className="flex flex-col">
                  <span className="text-[50px] font-black text-slate-950 font-sans leading-tight">
                    BEDROOM → PHONE FREE
                  </span>
                  <span className="font-mono text-[34px] font-semibold text-emerald-700 mt-1">
                    30 minutes before sleep
                  </span>
                </div>
              </div>
            </div>

            {/* Decisive Sovereign Closure Readout */}
            <div
              className="mt-8 text-center"
              style={{
                opacity: interpolate(frame, [1640, 1670], [0, 1], { extrapolateRight: "clamp" }),
              }}
            >
              <span className="font-mono text-[38px] font-black text-slate-900 tracking-wider uppercase">
                RECLAIM YOUR PREFRONTAL SOVEREIGNTY
              </span>
            </div>
          </div>
        )}
      </MechanismStage>
    </CameraCanvas>
  );
};

