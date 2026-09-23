import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  🎬 RIGHTMOTION CREATIVE MISSION — HabitGrooveCanvas
 * ║  Topic: "How Habits Are Physically Carved"
 * ║  Primary Visual Mechanism: KINETIC FURROW CARVING & FRICTION RELAXATION
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
 * 📖 CANONICAL BRIEF: Read src/clips/habit_groove/creative_brief.json
 *
 * 🛑 MINIMALIST EDITORIAL LAWS:
 *    1. Visual Hierarchy: PRIMARY (live furrow depth mutation) → SECONDARY (friction coefficient readout) → AMBIENT.
 *    2. Law of No Unmotivated Cardification: Open canvas physical mechanics only.
 *    3. Motion Communicates Meaning: Trench deepens = habit forming; friction drops = ease of execution.
 */
export const HabitGrooveCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ═══ NARRATIVE PHASES (from transcript.json timing) ═══
  // Phase 1 (Hook):          0 → 180   ("Starting a new habit feels exhausting... surface friction")
  // Phase 2 (Rough Surface):180 → 380  ("The first time you take an action, the ground resists")
  // Phase 3 (Live Carving): 380 → 900  ("Each repetition carves a deeper groove... friction drops to zero")
  // Phase 4 (Momentum):     900 → 1220 ("You just need to carve the track until momentum takes over")

  // --- Spring Dynamics ---
  const hookSpring = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const scene2Spring = spring({ frame: Math.max(0, frame - 180), fps, config: { damping: 14, stiffness: 110 } });
  const scene3Spring = spring({ frame: Math.max(0, frame - 380), fps, config: { damping: 15, stiffness: 100 } });
  const scene4Spring = spring({ frame: Math.max(0, frame - 900), fps, config: { damping: 13, stiffness: 90 } });

  // --- Phase Visibility Crossfades ---
  const hookOpacity = interpolate(frame, [0, 20, 160, 185], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scene2Opacity = interpolate(frame, [180, 210, 360, 385], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scene3Opacity = interpolate(frame, [380, 410, 880, 905], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scene4Opacity = interpolate(frame, [900, 930, 1200, 1220], [0, 1, 1, 1], {
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
          Narrative Motivation: Hero card establishes the architectural path in ground.
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
            NEUROLOGICAL MECHANISM // 02
          </div>

          {/* Hero Headline */}
          <h1
            className="text-slate-950 font-black text-center leading-[1.08] mb-8"
            style={{ fontSize: 78, fontFamily: "Montserrat, sans-serif" }}
          >
            DISCIPLINE <br />
            <span className="text-amber-600">VS FRICTION</span>
          </h1>

          {/* Motivated Hero Illustration Card */}
          <div
            className="w-full max-w-[820px] rounded-3xl overflow-hidden border-[3px] border-slate-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.18)] bg-white"
            style={{ aspectRatio: "16 / 9" }}
          >
            <img
              src={staticFile("habit_groove/assets/scene_illustration.png")}
              alt="Habit Groove Hero Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          PHASE 2: THE FLAT UNCARVED SURFACE (Frames 180 → 380)
          The first repetition experiences severe surface friction.
          Open canvas physical mechanics.
          ════════════════════════════════════════════════════════════════ */}
      {frame >= 175 && frame < 390 && (
        <div
          className="absolute flex flex-col items-center w-full px-12"
          style={{
            top: 340,
            opacity: scene2Opacity,
            transform: `translateY(${interpolate(scene2Spring, [0, 1], [30, 0])}px)`,
          }}
        >
          <div
            className="text-amber-600 font-mono tracking-widest text-2xl font-bold uppercase mb-4"
            style={{ letterSpacing: "0.2em" }}
          >
            STATE A // INITIAL EFFORT
          </div>

          <h2
            className="text-slate-950 font-black text-center mb-16 leading-tight"
            style={{ fontSize: 68, fontFamily: "Montserrat, sans-serif" }}
          >
            SURFACE <span className="text-slate-700">RESISTANCE</span>
          </h2>

          {/* SVG Flat Rough Ground Mechanism */}
          {(() => {
            // Node moves forward slowly against high friction
            const nodeX = interpolate(frame, [200, 360], [80, 480], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const jitter = Math.sin(frame * 0.8) * 3;

            return (
              <div className="relative flex flex-col items-center justify-center my-6">
                <svg
                  width="880"
                  height="420"
                  viewBox="0 0 880 420"
                  className="overflow-visible"
                >
                  {/* Flat Ground Surface */}
                  <line
                    x1="40"
                    y1="220"
                    x2="840"
                    y2="220"
                    stroke="#cbd5e1"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />

                  {/* Surface Texture Micro-Teeth (Roughness) */}
                  {Array.from({ length: 26 }).map((_, i) => (
                    <line
                      key={i}
                      x1={70 + i * 30}
                      y1="220"
                      x2={70 + i * 30}
                      y2="235"
                      stroke="#94a3b8"
                      strokeWidth="3"
                    />
                  ))}

                  {/* Action Node fighting friction */}
                  <g transform={`translate(${nodeX}, ${220 - 32 + jitter})`}>
                    <circle r="30" fill="#0f172a" />
                    <circle r="42" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="6 6" />
                    <text
                      x="0"
                      y="-48"
                      textAnchor="middle"
                      fill="#d97706"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="800"
                      fontSize="24"
                    >
                      HIGH DRAG
                    </text>
                  </g>

                  {/* Ground Foundation Label */}
                  <text
                    x="440"
                    y="310"
                    textAnchor="middle"
                    fill="#64748b"
                    fontFamily="Montserrat, sans-serif"
                    fontWeight="800"
                    fontSize="32"
                  >
                    UNCARVED NEURAL TERRAIN
                  </text>
                </svg>

                {/* Friction Telemetry */}
                <div className="flex items-center space-x-12 mt-4">
                  <div className="text-center">
                    <div className="text-slate-700 font-mono text-xl font-semibold">FRICTION COEFFICIENT</div>
                    <div className="text-amber-600 font-mono font-black text-4xl">μ = 0.88</div>
                  </div>
                  <div className="w-[2px] h-12 bg-slate-300" />
                  <div className="text-center">
                    <div className="text-slate-700 font-mono text-xl font-semibold">ACTION DEPTH</div>
                    <div className="text-slate-900 font-mono font-black text-4xl">0.0 mm</div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          PHASE 3: LIVE FURROW FORMATION (Frames 380 → 900)
          Primary Mechanism: Live kinetic carving of a smooth channel.
          The trench visibly deepens; friction drops in real time.
          ════════════════════════════════════════════════════════════════ */}
      {frame >= 370 && frame < 910 && (
        <div
          className="absolute flex flex-col items-center w-full px-12"
          style={{
            top: 340,
            opacity: scene3Opacity,
            transform: `translateY(${interpolate(scene3Spring, [0, 1], [30, 0])}px)`,
          }}
        >
          <div
            className="text-blue-600 font-mono tracking-widest text-2xl font-bold uppercase mb-4"
            style={{ letterSpacing: "0.2em" }}
          >
            STATE B // PROGRESSIVE CARVING
          </div>

          <h2
            className="text-slate-950 font-black text-center mb-12 leading-none"
            style={{ fontSize: 72, fontFamily: "Montserrat, sans-serif" }}
          >
            CARVING THE GROOVE
          </h2>

          {(() => {
            // Trench depth increases smoothly with repetition
            const depth = interpolate(frame, [400, 850], [10, 110], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            // Friction drops live
            const currentFriction = interpolate(frame, [400, 850], [0.88, 0.08], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            // Velocity increases
            const currentVelocity = interpolate(frame, [400, 850], [1.0, 3.8], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            // Node slides along the carved contour
            const progress = interpolate(frame, [400, 850], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            const nodeX = 120 + 640 * ((progress * 3) % 1);
            const nodeY = 180 + Math.sin(((progress * 3) % 1) * Math.PI) * depth;

            return (
              <div className="relative flex flex-col items-center justify-center my-4">
                <svg
                  width="880"
                  height="460"
                  viewBox="0 0 880 460"
                  className="overflow-visible"
                >
                  {/* Flat baseline reference (original surface) */}
                  <line
                    x1="60"
                    y1="180"
                    x2="820"
                    y2="180"
                    stroke="#e2e8f0"
                    strokeWidth="4"
                    strokeDasharray="8 8"
                  />

                  {/* The Deepening Kinetic Furrow Path */}
                  <path
                    d={`M 60 180 Q 440 ${180 + depth * 2} 820 180`}
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />

                  {/* Inner Polished Track Highlight */}
                  <path
                    d={`M 140 180 Q 440 ${180 + depth * 1.7} 740 180`}
                    fill="none"
                    stroke="#93c5fd"
                    strokeWidth="4"
                    strokeDasharray="12 12"
                  />

                  {/* Action Node gliding along the trench */}
                  <g transform={`translate(${nodeX}, ${nodeY})`}>
                    <circle r="26" fill="#1e3a8a" />
                    <circle r="36" fill="none" stroke="#3b82f6" strokeWidth="3" opacity="0.6" />
                  </g>

                  {/* Trench Depth Indicator */}
                  <g transform="translate(440, 340)">
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      fill="#1e40af"
                      fontFamily="Montserrat, sans-serif"
                      fontWeight="900"
                      fontSize="32"
                    >
                      GROOVE DEPTH: {depth.toFixed(0)}%
                    </text>
                  </g>
                </svg>

                {/* Live Mechanical Readouts */}
                <div className="flex items-center space-x-12 mt-2">
                  <div className="text-center">
                    <div className="text-slate-700 font-mono text-xl font-semibold">FRICTION</div>
                    <div className="text-emerald-600 font-mono font-black text-4xl">
                      μ = {currentFriction.toFixed(2)}
                    </div>
                  </div>
                  <div className="w-[2px] h-12 bg-slate-300" />
                  <div className="text-center">
                    <div className="text-slate-700 font-mono text-xl font-semibold">FLOW VELOCITY</div>
                    <div className="text-blue-600 font-mono font-black text-4xl">
                      {currentVelocity.toFixed(1)}x
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          PHASE 4: MOMENTUM SUPERHIGHWAY (Frames 900 → 1220)
          Primary Mechanism: Resistance drops to zero.
          Effortless glide along established track.
          Quiet, grounded resolution in open space.
          ════════════════════════════════════════════════════════════════ */}
      {frame >= 890 && (
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
            STATE C // ZERO RESISTANCE
          </div>

          <h2
            className="text-slate-950 font-black text-center mb-16 leading-tight"
            style={{ fontSize: 72, fontFamily: "Montserrat, sans-serif" }}
          >
            MOMENTUM <span className="text-emerald-700">LOCK</span>
          </h2>

          {/* SVG Smooth High-Speed Horizon Track */}
          {(() => {
            const glideX = interpolate(frame, [920, 1200], [80, 800], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div className="relative flex flex-col items-center justify-center my-6">
                <svg
                  width="880"
                  height="380"
                  viewBox="0 0 880 380"
                  className="overflow-visible"
                >
                  {/* The Master Polished Channel */}
                  <line
                    x1="40"
                    y1="160"
                    x2="840"
                    y2="160"
                    stroke="#059669"
                    strokeWidth="12"
                    strokeLinecap="round"
                  />

                  {/* Aerodynamic Speed Trails */}
                  <line
                    x1="40"
                    y1="184"
                    x2="840"
                    y2="184"
                    stroke="#34d399"
                    strokeWidth="4"
                    strokeDasharray="16 16"
                  />

                  {/* Frictionless Gliding Node */}
                  <g transform={`translate(${glideX}, 160)`}>
                    <circle r="26" fill="#065f46" />
                    <circle r="38" fill="none" stroke="#10b981" strokeWidth="4" opacity="0.4" />
                  </g>

                  {/* Sovereign Grounding Label */}
                  <g transform="translate(440, 270)">
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      fill="#059669"
                      fontFamily="Montserrat, sans-serif"
                      fontWeight="900"
                      fontSize="36"
                    >
                      FRICTION ELIMINATED
                    </text>
                    <text
                      x="0"
                      y="48"
                      textAnchor="middle"
                      fill="#475569"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="700"
                      fontSize="26"
                    >
                      AUTOMATIC BEHAVIORAL HIGHWAY
                    </text>
                  </g>
                </svg>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
