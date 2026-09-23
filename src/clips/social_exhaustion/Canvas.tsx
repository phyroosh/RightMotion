import React from "react";
import { interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  🎬 RIGHTMOTION CREATIVE MISSION — SocialExhaustionCanvas
 * ║  Topic: "The Weight of Constant Masking"
 * ║  Primary Visual Mechanism: SPATIAL PERIMETER CONTRACTION & EXPANSION
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
 * 📖 CANONICAL BRIEF: Read src/clips/social_exhaustion/creative_brief.json
 *
 * 🛑 MINIMALIST EDITORIAL LAWS:
 *    1. Visual Hierarchy: Exactly one focal subject (the spatial perimeter).
 *    2. Law of No Unmotivated Cardification: Open canvas spatial tension only.
 *    3. Motion Communicates Meaning: Perimeter shrinks = social masking tax; perimeter expands = restorative solitude.
 */
export const SocialExhaustionCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ═══ NARRATIVE PHASES (from transcript.json timing) ═══
  // Phase 1 (Hook):          0 → 200   ("You don't leave tired... you leave exhausted holding a mask")
  // Phase 2 (External Load): 200 → 460 ("When you perform... natural perimeter contracts under pressure")
  // Phase 3 (Compression):   460 → 910 ("Perimeter shrinks inward, walls thin... cognitive reserve depleted")
  // Phase 4 (Restoration):   910 → 1338("Solitude isn't hiding... boundary finally expands to full size")

  // --- Spring Dynamics ---
  const hookSpring = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const scene2Spring = spring({ frame: Math.max(0, frame - 200), fps, config: { damping: 14, stiffness: 110 } });
  const scene3Spring = spring({ frame: Math.max(0, frame - 460), fps, config: { damping: 15, stiffness: 100 } });
  const scene4Spring = spring({ frame: Math.max(0, frame - 910), fps, config: { damping: 13, stiffness: 90 } });

  // --- Phase Visibility Crossfades ---
  const hookOpacity = interpolate(frame, [0, 20, 175, 200], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scene2Opacity = interpolate(frame, [200, 230, 435, 460], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scene3Opacity = interpolate(frame, [460, 490, 885, 910], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const scene4Opacity = interpolate(frame, [910, 940, 1310, 1338], [0, 1, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      className="absolute inset-0 flex flex-col items-center select-none pointer-events-none"
      style={{ width: 1080, height: 1920 }}
    >
      {/* ════════════════════════════════════════════════════════════════
          PHASE 1: HOOK & HERO ILLUSTRATION (Frames 0 → 200)
          Narrative Motivation: Hero card introduces the protected aura bubble.
          ════════════════════════════════════════════════════════════════ */}
      {frame < 210 && (
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
            EMOTIONAL TAXONOMY // 03
          </div>

          {/* Hero Headline */}
          <h1
            className="text-slate-950 font-black text-center leading-[1.08] mb-8"
            style={{ fontSize: 78, fontFamily: "Montserrat, sans-serif" }}
          >
            TIRED <br />
            <span className="text-indigo-600">VS EXHAUSTED</span>
          </h1>

          {/* Motivated Hero Illustration Card */}
          <div
            className="w-full max-w-[820px] rounded-3xl overflow-hidden border-[3px] border-slate-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.18)] bg-white"
            style={{ aspectRatio: "16 / 9" }}
          >
            <img
              src={staticFile("social_exhaustion/assets/scene_illustration.png")}
              alt="Social Exhaustion Hero Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          PHASE 2: EXTERNAL COMPRESSIVE PRESSURE (Frames 200 → 460)
          Open canvas spatial mechanism: Ambient pressure vectors closing in.
          ════════════════════════════════════════════════════════════════ */}
      {frame >= 195 && frame < 470 && (
        <div
          className="absolute flex flex-col items-center w-full px-12"
          style={{
            top: 340,
            opacity: scene2Opacity,
            transform: `translateY(${interpolate(scene2Spring, [0, 1], [30, 0])}px)`,
          }}
        >
          <div
            className="text-indigo-600 font-mono tracking-widest text-2xl font-bold uppercase mb-4"
            style={{ letterSpacing: "0.2em" }}
          >
            SOCIAL PRESSURE DYNAMIC
          </div>

          <h2
            className="text-slate-950 font-black text-center mb-16 leading-tight"
            style={{ fontSize: 68, fontFamily: "Montserrat, sans-serif" }}
          >
            PERFORMANCE <span className="text-slate-700">STRAIN</span>
          </h2>

          {/* SVG Spatial Caliper Mechanism */}
          {(() => {
            const vectorInward = interpolate(frame, [220, 420], [0, 70], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div className="relative flex flex-col items-center justify-center my-6">
                <svg
                  width="880"
                  height="460"
                  viewBox="-440 -230 880 460"
                  className="overflow-visible"
                >
                  {/* Outer unconstrained baseline guide */}
                  <circle
                    r="220"
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="4"
                    strokeDasharray="10 10"
                  />

                  {/* Contracting Personal Perimeter */}
                  <circle
                    r={220 - vectorInward}
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="8"
                  />

                  {/* Central Sovereign Subject */}
                  <circle r="34" fill="#0f172a" />
                  <circle r="46" fill="none" stroke="#6366f1" strokeWidth="3" opacity="0.5" />

                  {/* Inward Inward Pressure Arrows */}
                  <g transform={`translate(${-(280 - vectorInward)}, 0)`}>
                    <line x1="-40" y1="0" x2="0" y2="0" stroke="#f43f5e" strokeWidth="6" />
                    <polygon points="0,0 -16,-10 -16,10" fill="#f43f5e" />
                  </g>
                  <g transform={`translate(${280 - vectorInward}, 0)`}>
                    <line x1="40" y1="0" x2="0" y2="0" stroke="#f43f5e" strokeWidth="6" />
                    <polygon points="0,0 16,-10 16,10" fill="#f43f5e" />
                  </g>
                  <g transform={`translate(0, ${-(280 - vectorInward)})`}>
                    <line x1="0" y1="-40" x2="0" y2="0" stroke="#f43f5e" strokeWidth="6" />
                    <polygon points="0,0 -10,-16 10,-16" fill="#f43f5e" />
                  </g>
                  <g transform={`translate(0, ${280 - vectorInward})`}>
                    <line x1="0" y1="40" x2="0" y2="0" stroke="#f43f5e" strokeWidth="6" />
                    <polygon points="0,0 -10,16 10,16" fill="#f43f5e" />
                  </g>
                </svg>

                {/* Status Annotation */}
                <div className="text-center mt-6">
                  <div className="text-slate-700 font-mono text-xl font-semibold">SOVEREIGN FIELD</div>
                  <div className="text-indigo-600 font-mono font-black text-4xl">CONTRACTING</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          PHASE 3: COMPRESSION & WALL THINNING (Frames 460 → 910)
          Primary Mechanism: Boundary shrinks down to minimal threshold;
          walls thin under cognitive drain.
          ════════════════════════════════════════════════════════════════ */}
      {frame >= 450 && frame < 920 && (
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
            CRITICAL CONVERGENCE
          </div>

          <h2
            className="text-slate-950 font-black text-center mb-12 leading-none"
            style={{ fontSize: 72, fontFamily: "Montserrat, sans-serif" }}
          >
            WALLS THINNING
          </h2>

          {(() => {
            // Radius compresses from 220 down to 105
            const radius = interpolate(frame, [480, 860], [200, 105], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            // Wall thickness thins from 8px down to 3px
            const wallStroke = interpolate(frame, [480, 860], [8, 3], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            // Drain percentage increases
            const drainPercent = interpolate(frame, [480, 860], [30, 95], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            const jitter = Math.sin(frame * 0.4) * 2;

            return (
              <div className="relative flex flex-col items-center justify-center my-4">
                <svg
                  width="880"
                  height="460"
                  viewBox="-440 -230 880 460"
                  className="overflow-visible"
                >
                  {/* Ghost Baseline: The lost sovereign perimeter */}
                  <circle
                    r="240"
                    fill="none"
                    stroke="#cbd5e1"
                    strokeWidth="3"
                    strokeDasharray="8 8"
                    opacity="0.7"
                  />
                  <text
                    x="0"
                    y="-255"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="700"
                    fontSize="22"
                  >
                    ORIGINAL BOUNDARY
                  </text>

                  {/* Severely compressed boundary */}
                  <circle
                    r={radius + jitter}
                    fill="rgba(244, 63, 94, 0.06)"
                    stroke="#e11d48"
                    strokeWidth={wallStroke}
                  />

                  {/* Central Character Node */}
                  <circle r="32" fill="#0f172a" />
                  <text
                    x="0"
                    y="8"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="900"
                    fontSize="22"
                  >
                    SELF
                  </text>

                  {/* Inward compression markers */}
                  <circle
                    r={radius + 36}
                    fill="none"
                    stroke="#fca5a5"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    opacity="0.6"
                  />
                </svg>

                {/* Mechanical Telemetry */}
                <div className="flex items-center space-x-12 mt-2">
                  <div className="text-center">
                    <div className="text-slate-700 font-mono text-xl font-semibold">PERIMETER</div>
                    <div className="text-rose-600 font-mono font-black text-4xl">
                      -{Math.round((1 - radius / 240) * 100)}%
                    </div>
                  </div>
                  <div className="w-[2px] h-12 bg-slate-300" />
                  <div className="text-center">
                    <div className="text-slate-700 font-mono text-xl font-semibold">COGNITIVE DRAIN</div>
                    <div className="text-slate-900 font-mono font-black text-4xl">
                      {drainPercent.toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════
          PHASE 4: SOVEREIGN EXPANSION (Frames 910 → 1338)
          Primary Mechanism: Boundary expands effortlessly back to full capacity.
          Solitude restores the natural perimeter. Generous negative space.
          ════════════════════════════════════════════════════════════════ */}
      {frame >= 900 && (
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
            SOLITUDE RESTORATION
          </div>

          <h2
            className="text-slate-950 font-black text-center mb-16 leading-tight"
            style={{ fontSize: 72, fontFamily: "Montserrat, sans-serif" }}
          >
            NATURAL <span className="text-emerald-700">EXPANSION</span>
          </h2>

          {/* SVG Generous Expansive Boundary */}
          {(() => {
            const expandRadius = interpolate(frame, [930, 1180], [105, 300], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            const auraOpacity = interpolate(frame, [930, 1180], [0.1, 0.45], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div className="relative flex flex-col items-center justify-center my-6">
                <svg
                  width="880"
                  height="440"
                  viewBox="-440 -220 880 440"
                  className="overflow-visible"
                >
                  {/* Expansive Sovereign Perimeter */}
                  <circle
                    r={expandRadius}
                    fill="rgba(16, 185, 129, 0.05)"
                    stroke="#059669"
                    strokeWidth="10"
                  />

                  {/* Breathing Aura Rim */}
                  <circle
                    r={expandRadius + 24}
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="4"
                    strokeDasharray="14 14"
                    opacity={auraOpacity}
                  />

                  {/* Peaceful Central Self */}
                  <circle r="36" fill="#065f46" />
                  <circle r="52" fill="none" stroke="#10b981" strokeWidth="4" opacity="0.4" />
                  <text
                    x="0"
                    y="10"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="900"
                    fontSize="24"
                  >
                    CALM
                  </text>

                  {/* Sovereign Grounding Readout */}
                  <g transform={`translate(0, ${expandRadius + 60})`}>
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      fill="#059669"
                      fontFamily="Montserrat, sans-serif"
                      fontWeight="900"
                      fontSize="36"
                    >
                      FULL CAPACITY RESTORED
                    </text>
                    <text
                      x="0"
                      y="44"
                      textAnchor="middle"
                      fill="#475569"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="700"
                      fontSize="24"
                    >
                      SOVEREIGN BREATHING ROOM
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
