import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  🎬 RIGHTMOTION CREATIVE MISSION — RuminationLoopCanvas
 * ║  Topic: "How Rumination Traps Your Brain"
 * ║  Primary Visual Mechanism: CLOSED FEEDBACK ORBIT TO HORIZON UNROLL
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * 🎯 THE RIGHTMOTION CREATIVE MANTRA:
 *    • RIGHTMOTION DOES NOT TRY TO LOOK CREATIVE. RIGHTMOTION TRIES TO MAKE THE IDEA CLEAR.
 *    • CLARITY OVER COMPLEXITY · SIMPLICITY OVER SPECTACLE · MEANING OVER DECORATION.
 *    • ONE STRONG VISUAL IDEA BEATS FIVE COMPETING IDEAS.
 *
 * 🏛️ CREATIVE CONSTITUTION: Read RIGHTMOTION_CREATIVE_CONSTITUTION.md
 *    Precedence: CONSTITUTION > BRIEF > SHOT DIRECTIVES > COMPONENT INDEX > AGENT IMPLEMENTATION.
 *
 * 📖 CANONICAL BRIEF: Read src/clips/rumination_loop/creative_brief.json
 *
 * 🛑 MINIMALIST EDITORIAL LAWS:
 *    1. Visual Hierarchy: Exactly one dominant visual system per scene.
 *    2. Law of No Unmotivated Cardification: Open canvas mechanics only.
 *    3. Motion Communicates Meaning: Linear path = decision; closed loop = overthinking; cut = physical grounding.
 */
export const RuminationLoopCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ═══ NARRATIVE PHASES (Aligned to transcript.json) ═══
  // Phase 1 (Hook):        0 → 180   ("You think you're analyzing a problem. In reality...")
  // Phase 2 (Contrast):  180 → 650   ("Real reflection moves in a straight line... But rumination bends back")
  // Phase 3 (Loop Spin): 650 → 990   ("Each repeated thought feeds anxiety, spinning faster solving nothing")
  // Phase 4 (Grounding): 990 → 1330  ("To break the cycle... movement forces the circuit to open")

  // --- Spring Dynamics ---
  const hookSpring = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const scene2Spring = spring({ frame: Math.max(0, frame - 180), fps, config: { damping: 14, stiffness: 110 } });
  const scene3Spring = spring({ frame: Math.max(0, frame - 650), fps, config: { damping: 15, stiffness: 100 } });
  const scene4Spring = spring({ frame: Math.max(0, frame - 990), fps, config: { damping: 13, stiffness: 90 } });

  // --- Phase Visibility Crossfades ---
  const hookOpacity = interpolate(frame, [0, 20, 160, 185], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scene2Opacity = interpolate(frame, [180, 210, 630, 655], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scene3Opacity = interpolate(frame, [650, 680, 970, 995], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scene4Opacity = interpolate(frame, [990, 1020, 1310, 1330], [0, 1, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="absolute inset-0 flex flex-col items-center select-none pointer-events-none"
      style={{ width: 1080, height: 1920 }}
    >
      {/* ════════════════════════════════════════════════════════════════
          PHASE 1: HOOK & HERO ILLUSTRATION (Frames 0 → 180)
          Narrative Motivation: Hero card introduces the looping thought ribbon.
          ════════════════════════════════════════════════════════════════ */}
      {frame < 190 && (
        <div
          className="absolute flex flex-col items-center justify-center w-full px-12"
          style={{
            top: 320,
            opacity: hookOpacity,
            transform: `translateY(${interpolate(hookSpring, [0, 1], [40, 0])}px)`,
          }}
        >
          {/* Eyebrow Label */}
          <div
            className="text-slate-900 font-mono tracking-widest text-2xl font-bold uppercase mb-4"
            style={{ letterSpacing: "0.25em" }}
          >
            COGNITIVE ILLUSION // 01
          </div>

          {/* Hero Headline */}
          <h1
            className="text-slate-950 font-black text-center leading-[1.08] mb-8"
            style={{ fontSize: 78, fontFamily: "Montserrat, sans-serif" }}
          >
            ANALYZING <br />
            <span className="text-rose-600">VS LOOPING</span>
          </h1>

          {/* Motivated Hero Illustration Card */}
          <div
            className="w-full max-w-[820px] rounded-3xl overflow-hidden border-[3px] border-slate-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.18)] bg-white"
            style={{ aspectRatio: "16 / 9" }}
          >
            <img
              src={staticFile("rumination_loop/assets/scene_illustration.png")}
              alt="Rumination Loop Hero Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          PHASE 2: THE TWO TRAJECTORIES (Frames 180 → 650)
          Open canvas comparison: Linear Decision Vector vs Closed Rumination Loop.
          Zero unmotivated cards. Live SVG vector animation.
          ════════════════════════════════════════════════════════════════ */}
      {frame >= 175 && frame < 660 && (
        <div
          className="absolute flex flex-col items-center w-full px-12"
          style={{
            top: 340,
            opacity: scene2Opacity,
            transform: `translateY(${interpolate(scene2Spring, [0, 1], [30, 0])}px)`,
          }}
        >
          <div
            className="text-slate-900 font-mono tracking-widest text-2xl font-bold uppercase mb-4"
            style={{ letterSpacing: "0.2em" }}
          >
            TRAJECTORY COMPARISON
          </div>

          <h2
            className="text-slate-950 font-black text-center mb-16 leading-tight"
            style={{ fontSize: 64, fontFamily: "Montserrat, sans-serif" }}
          >
            THOUGHT <span className="text-slate-800">ARCHITECTURE</span>
          </h2>

          {/* SVG Open Stage Canvas */}
          <svg
            width="880"
            height="720"
            viewBox="0 0 880 720"
            className="overflow-visible"
          >
            {/* --- Track 1: Real Reflection (Linear Vector) --- */}
            {(() => {
              const lineProgress = interpolate(frame, [200, 330], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const lineLength = 580 * lineProgress;

              return (
                <g transform="translate(60, 120)">
                  {/* Label */}
                  <text
                    x="0"
                    y="-30"
                    fill="#0f172a"
                    fontFamily="Montserrat, sans-serif"
                    fontWeight="800"
                    fontSize="36"
                  >
                    REAL REFLECTION
                  </text>
                  <text
                    x="500"
                    y="-30"
                    fill="#059669"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="700"
                    fontSize="28"
                  >
                    LINEAR → FORWARD
                  </text>

                  {/* Baseline Rail */}
                  <line
                    x1="0"
                    y1="40"
                    x2="600"
                    y2="40"
                    stroke="#e2e8f0"
                    strokeWidth="6"
                    strokeDasharray="8 8"
                  />

                  {/* Active Forward Line */}
                  <line
                    x1="0"
                    y1="40"
                    x2={lineLength}
                    y2="40"
                    stroke="#059669"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />

                  {/* Destination Node */}
                  {lineProgress > 0.95 && (
                    <g transform="translate(600, 40)">
                      <circle r="18" fill="#059669" />
                      <circle r="28" fill="none" stroke="#059669" strokeWidth="3" opacity="0.4" />
                      <text
                        x="36"
                        y="10"
                        fill="#059669"
                        fontFamily="Montserrat, sans-serif"
                        fontWeight="900"
                        fontSize="32"
                      >
                        DECISION
                      </text>
                    </g>
                  )}
                </g>
              );
            })()}

            {/* --- Track 2: Rumination (Closed Loop Vector) --- */}
            {(() => {
              const loopProgress = interpolate(frame, [360, 560], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              // SVG Circle path representing closed loop
              const circumference = 2 * Math.PI * 130;
              const strokeOffset = circumference * (1 - loopProgress);

              return (
                <g transform="translate(60, 420)">
                  {/* Label */}
                  <text
                    x="0"
                    y="-30"
                    fill="#0f172a"
                    fontFamily="Montserrat, sans-serif"
                    fontWeight="800"
                    fontSize="36"
                  >
                    RUMINATION
                  </text>
                  <text
                    x="480"
                    y="-30"
                    fill="#e11d48"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="700"
                    fontSize="28"
                  >
                    CLOSED CIRCUIT
                  </text>

                  {/* Initial path bending into loop */}
                  <path
                    d="M 0 40 L 220 40"
                    stroke="#e11d48"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />

                  {/* The Loop Orbit */}
                  <g transform="translate(360, 40)">
                    <circle
                      cx="0"
                      cy="0"
                      r="130"
                      fill="none"
                      stroke="#fecdd3"
                      strokeWidth="6"
                    />
                    <circle
                      cx="0"
                      cy="0"
                      r="130"
                      fill="none"
                      stroke="#e11d48"
                      strokeWidth="10"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                      transform="rotate(-90)"
                    />

                    {/* Returning Arrow */}
                    {loopProgress > 0.85 && (
                      <polygon
                        points="-140,0 -120,-15 -120,15"
                        fill="#e11d48"
                        transform="rotate(35)"
                      />
                    )}
                  </g>

                  {/* Status annotation */}
                  <text
                    x="560"
                    y="50"
                    fill="#e11d48"
                    fontFamily="Montserrat, sans-serif"
                    fontWeight="900"
                    fontSize="32"
                  >
                    NO EXIT
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          PHASE 3: THE ACCELERATING CLOSED LOOP (Frames 650 → 990)
          Primary Mechanism: Closed orbital loop spinning under escalating tension.
          The viewer watches live speed acceleration and stroke thickening.
          ════════════════════════════════════════════════════════════════ */}
      {frame >= 640 && frame < 1000 && (
        <div
          className="absolute flex flex-col items-center w-full px-12"
          style={{
            top: 340,
            opacity: scene3Opacity,
            transform: `translateY(${interpolate(scene3Spring, [0, 1], [30, 0])}px)`,
          }}
        >
          <div
            className="text-rose-600 font-mono tracking-widest text-2xl font-bold uppercase mb-4"
            style={{ letterSpacing: "0.2em" }}
          >
            ACTIVE FEEDBACK DYNAMIC
          </div>

          <h2
            className="text-slate-950 font-black text-center mb-8 leading-none"
            style={{ fontSize: 72, fontFamily: "Montserrat, sans-serif" }}
          >
            THE INFINITE LOOP
          </h2>

          {(() => {
            // Speed up rotation: accelerates as frame increases
            const rotation = interpolate(frame, [650, 990], [0, 1080], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            // Tension load increases
            const strokeThickness = interpolate(frame, [650, 950], [8, 22], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            const pulseScale = 1 + 0.05 * Math.sin(frame * 0.2);

            return (
              <div className="relative flex flex-col items-center justify-center my-6">
                <svg
                  width="680"
                  height="680"
                  viewBox="-340 -340 680 680"
                  className="overflow-visible"
                >
                  {/* Outer pulse boundary */}
                  <circle
                    r="240"
                    fill="none"
                    stroke="#fda4af"
                    strokeWidth="3"
                    strokeDasharray="12 12"
                    opacity="0.6"
                    style={{ transform: `scale(${pulseScale})` }}
                  />

                  {/* Main Closed Circuit Orbit */}
                  <circle
                    r="200"
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth={strokeThickness}
                  />

                  {/* Fast Orbital Node */}
                  <g style={{ transform: `rotate(${rotation}deg)` }}>
                    <circle cx="200" cy="0" r="22" fill="#be123c" />
                    <circle cx="200" cy="0" r="32" fill="none" stroke="#be123c" strokeWidth="4" opacity="0.5" />
                    {/* Tail */}
                    <path
                      d="M 200 0 A 200 200 0 0 0 170 -105"
                      fill="none"
                      stroke="#fb7185"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                  </g>

                  {/* Center Node: Thought Feeding Thought */}
                  <circle r="80" fill="#0f172a" />
                  <text
                    x="0"
                    y="-8"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontFamily="Montserrat, sans-serif"
                    fontWeight="900"
                    fontSize="26"
                  >
                    THOUGHT
                  </text>
                  <text
                    x="0"
                    y="24"
                    textAnchor="middle"
                    fill="#f43f5e"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="700"
                    fontSize="20"
                  >
                    FEEDS ANXIETY
                  </text>
                </svg>

                {/* Quantitative Telemetry Readout */}
                <div className="flex items-center space-x-12 mt-6">
                  <div className="text-center">
                    <div className="text-slate-800 font-mono text-xl font-semibold">VELOCITY</div>
                    <div className="text-rose-600 font-mono font-black text-4xl">
                      {interpolate(frame, [650, 950], [1.0, 4.8], { extrapolateRight: "clamp" }).toFixed(1)}x
                    </div>
                  </div>
                  <div className="w-[2px] h-12 bg-slate-300" />
                  <div className="text-center">
                    <div className="text-slate-800 font-mono text-xl font-semibold">PROGRESS</div>
                    <div className="text-slate-950 font-mono font-black text-4xl">0.00%</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          PHASE 4: GROUNDED PHYSICAL DISRUPTION (Frames 990 → 1330)
          Primary Mechanism: Physical action cuts the circuit; loop uncurls into
          a stable, quiet horizontal baseline. Generous breathing space.
          ════════════════════════════════════════════════════════════════ */}
      {frame >= 980 && (
        <div
          className="absolute flex flex-col items-center w-full px-12"
          style={{
            top: 360,
            opacity: scene4Opacity,
            transform: `translateY(${interpolate(scene4Spring, [0, 1], [30, 0])}px)`,
          }}
        >
          <div
            className="text-emerald-700 font-mono tracking-widest text-2xl font-bold uppercase mb-4"
            style={{ letterSpacing: "0.25em" }}
          >
            CIRCUIT BREAKER // REALITY
          </div>

          <h2
            className="text-slate-950 font-black text-center mb-16 leading-tight"
            style={{ fontSize: 72, fontFamily: "Montserrat, sans-serif" }}
          >
            PHYSICAL <span className="text-emerald-700">MOVEMENT</span>
          </h2>

          {/* SVG Transformation: Loop Uncurling to Open Horizon */}
          {(() => {
            // Cut progress: circuit snaps and unrolls into horizontal ground
            const unrollProgress = interpolate(frame, [1010, 1180], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            const curveRadius = interpolate(unrollProgress, [0, 1], [180, 0]);
            const groundLineWidth = interpolate(unrollProgress, [0, 1], [0, 840]);

            return (
              <div className="relative flex flex-col items-center justify-center my-8">
                <svg
                  width="880"
                  height="460"
                  viewBox="-440 -160 880 460"
                  className="overflow-visible"
                >
                  {/* The straight unrolled horizon ground line */}
                  <line
                    x1={-groundLineWidth / 2}
                    y1="80"
                    x2={groundLineWidth / 2}
                    y2="80"
                    stroke="#059669"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />

                  {/* Residual uncurling arc (shrinks to zero as horizon settles) */}
                  {unrollProgress < 0.95 && (
                    <circle
                      cx="0"
                      cy="80 - curveRadius"
                      r={curveRadius}
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth={8 * (1 - unrollProgress)}
                      strokeDasharray="16 16"
                      opacity={1 - unrollProgress}
                    />
                  )}

                  {/* Grounded Foundation Anchor Nodes */}
                  {unrollProgress > 0.7 && (
                    <g transform="translate(0, 80)">
                      <circle r="22" fill="#059669" />
                      <circle r="34" fill="none" stroke="#059669" strokeWidth="4" opacity="0.3" />
                      <text
                        x="0"
                        y="70"
                        textAnchor="middle"
                        fill="#059669"
                        fontFamily="Montserrat, sans-serif"
                        fontWeight="900"
                        fontSize="36"
                      >
                        CIRCUIT OPENED
                      </text>
                      <text
                        x="0"
                        y="115"
                        textAnchor="middle"
                        fill="#475569"
                        fontFamily="JetBrains Mono, monospace"
                        fontWeight="700"
                        fontSize="26"
                      >
                        SOVEREIGN ACTION RESTORED
                      </text>
                    </g>
                  )}
                </svg>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
