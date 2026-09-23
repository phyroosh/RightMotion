import React from "react";
import {
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CinematicIllustrationCard } from "../../components/CinematicIllustrationCard";

interface WordTimestamp {
  word: string;
  startMs: number;
  endMs: number;
  speaker?: string;
}

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🎯 RIGHTMOTION CREATIVE MISSION — STRUCTURAL_PRESSURE (BENCHMARK B)
 *
 * MANTRA: CLARITY OVER COMPLEXITY · SIMPLICITY OVER SPECTACLE · MEANING OVER DECORATION
 *
 * PRIMARY VISUAL IDEA:
 * One monolithic architectural beam supports a single unchanging weight node.
 * As continuous duration progresses (1 min -> 1 hour -> 1 day -> sustained load),
 * the beam sags progressively deeper and fractures silently under identical mass,
 * until the weight is lifted off at resolution and the beam rebounds to rest.
 *
 * HIERARCHY:
 * - PRIMARY: The monolithic deforming beam + single weight + propagating fracture.
 * - SECONDARY: Single minimal time/integrity readout (TIME UNDER LOAD).
 * - AMBIENT: Pristine luminous studio ground.
 * ═══════════════════════════════════════════════════════════════════════════════
 */
export const StructuralPressureCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── 1. HOOK SCENE (Frames 0 -> 155 @ 60fps) ───
  // Judy Presenter in Presenter.tsx exits at frame 150
  const hookOpacity = interpolate(frame, [0, 20, 140, 155], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hookScale = interpolate(frame, [0, 150], [0.96, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── 2. BEAM ENTRANCE (Frame 148+ @ 60fps) ───
  const beamEntrance = spring({
    frame: frame - 148,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // ─── 3. DURATION SPRINGS (Frame-accurate to spoken script) ───
  // Hour mark: ~frame 230 ("hold that same weight for an hour...")
  const hourSpring = spring({
    frame: frame - 230,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.8 },
  });

  // Day mark: ~frame 390 ("Hold it for a day, and your muscle gives out...")
  const daySpring = spring({
    frame: frame - 390,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.9 },
  });

  // Accumulation escalation: ~frame 720 ("Burnout is rarely caused by a catastrophic collapse...")
  const burnoutSpring = spring({
    frame: frame - 720,
    fps,
    config: { damping: 16, stiffness: 90, mass: 1.1 },
  });

  // Resolution release: ~frame 1160 ("Set the weight down before the structure breaks")
  const releaseSpring = spring({
    frame: frame - 1160,
    fps,
    config: { damping: 13, stiffness: 180, mass: 0.6 },
  });

  // Live deflection amount (px downward at midpoint)
  // Baseline 0px -> 36px -> 80px -> 145px -> Snap back to 0px
  const rawDeflection =
    hourSpring * 36 + daySpring * 44 + burnoutSpring * 65;
  const deflection = interpolate(releaseSpring, [0, 1], [rawDeflection, 0]);

  // Jitter/tremor when severely strained (frames 800 - 1160)
  const isStrained = frame >= 750 && frame < 1160;
  const tremor = isStrained ? Math.sin(frame * 0.9) * 2.5 : 0;

  // Structural integrity metric (100% -> 76% -> 44% -> 16% -> 100%)
  const rawIntegrity = Math.round(
    100 - (hourSpring * 24 + daySpring * 32 + burnoutSpring * 28)
  );
  const resolvedIntegrity = Math.round(
    interpolate(releaseSpring, [0, 1], [rawIntegrity, 100])
  );

  // Time under load readout text
  const timeReadout =
    frame < 230
      ? "00:01:00 [1 MINUTE]"
      : frame < 390
      ? "01:00:00 [1 HOUR]"
      : frame < 720
      ? "24:00:00 [24 HOURS]"
      : frame < 1160
      ? "72:00:00 [CHRONIC LOAD]"
      : "RELEASED // EQUILIBRIUM RESTORED";

  // Coordinates
  const beamY = 940;
  const leftPillarX = 140;
  const rightPillarX = 940;
  const midX = 540;
  const currentMidY = beamY + deflection + tremor;

  // Weight vertical position: rests directly on the deflected midpoint, then lifts off at resolution
  const weightBaseY = currentMidY;
  const weightLiftY = interpolate(releaseSpring, [0, 1], [0, -170]);
  const weightY = weightBaseY + weightLiftY;

  // Upper surface curve:
  const topPath = `M ${leftPillarX} ${beamY} Q ${midX} ${currentMidY} ${rightPillarX} ${beamY}`;
  // Monolithic beam path: continuous closed architectural slab
  const slabPath = `M ${leftPillarX} ${beamY} Q ${midX} ${currentMidY} ${rightPillarX} ${beamY} L ${rightPillarX} ${beamY + 42} Q ${midX} ${currentMidY + 42} ${leftPillarX} ${beamY + 42} Z`;

  // Ghost straight baseline
  const ghostTop = `M ${leftPillarX} ${beamY} L ${rightPillarX} ${beamY}`;
  const ghostBottom = `M ${leftPillarX} ${beamY + 42} L ${rightPillarX} ${beamY + 42}`;

  const isResolved = frame >= 1170;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none"
      style={{ width: 1080, height: 1920 }}
    >
      {/* ═══ 1. HOOK SCENE (Frames 0 -> 155 @ 60fps) ═══ */}
      {frame < 160 && (
        <div
          className="absolute inset-x-0 flex flex-col items-center"
          style={{
            top: 290,
            opacity: hookOpacity,
            transform: `scale(${hookScale})`,
          }}
        >
          <div className="w-[860px]">
            <CinematicIllustrationCard
              imageSrc={staticFile("structural_pressure/assets/scene_illustration.png")}
              caption="THE PHYSICS OF CAPACITY"
              title="A WEIGHT HELD TOO LONG"
              frame={frame}
              startFrame={0}
              variant="editorial"
            />
          </div>
        </div>
      )}

      {/* ═══ 2. MONOLITHIC DEFORMING BEAM (Frames 148 -> End) ═══ */}
      {frame >= 148 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{
            opacity: beamEntrance,
            transform: `scale(${interpolate(beamEntrance, [0, 1], [0.94, 1])})`,
          }}
        >
          {/* Subtle Minimal Readout (SECONDARY — exactly 1 supporting cue) */}
          <div
            className="absolute flex flex-col items-center"
            style={{ top: 460 }}
          >
            <span
              className="text-xs font-mono font-bold tracking-[0.3em] uppercase"
              style={{ color: isResolved ? "#059669" : "#64748b" }}
            >
              TIME UNDER LOAD // {timeReadout}
            </span>

            <div className="flex items-baseline gap-3 mt-3">
              <span
                className="font-mono font-black text-6xl tracking-tight"
                style={{
                  color: isResolved
                    ? "#059669"
                    : isStrained
                    ? "#dc2626"
                    : "#0f172a",
                }}
              >
                {resolvedIntegrity}%
              </span>
              <span className="text-sm font-mono font-semibold tracking-wider text-slate-400 uppercase">
                Structural Integrity
              </span>
            </div>
          </div>

          {/* Master Monolithic SVG Physical Engine */}
          <svg
            className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
            viewBox="0 0 1080 1920"
          >
            {/* Ghost Baseline: Faint memory of original undeformed plane */}
            {deflection > 12 && !isResolved && (
              <g opacity={0.45}>
                <path
                  d={ghostTop}
                  stroke="#cbd5e1"
                  strokeWidth={2}
                  strokeDasharray="6 6"
                  fill="none"
                />
                <path
                  d={ghostBottom}
                  stroke="#cbd5e1"
                  strokeWidth={2}
                  strokeDasharray="6 6"
                  fill="none"
                />
              </g>
            )}

            {/* Left Pillar */}
            <rect
              x={leftPillarX - 32}
              y={beamY - 10}
              width={42}
              height={320}
              rx={4}
              fill="#0f172a"
              stroke="#334155"
              strokeWidth={2}
            />
            {/* Right Pillar */}
            <rect
              x={rightPillarX - 10}
              y={beamY - 10}
              width={42}
              height={320}
              rx={4}
              fill="#0f172a"
              stroke="#334155"
              strokeWidth={2}
            />

            {/* Grounded Foundation Baseline */}
            <line
              x1={leftPillarX - 60}
              y1={beamY + 310}
              x2={rightPillarX + 70}
              y2={beamY + 310}
              stroke="#cbd5e1"
              strokeWidth={3}
              strokeLinecap="round"
            />

            {/* Monolithic Stone Beam Slab */}
            <path
              d={slabPath}
              fill={isResolved ? "#f8fafc" : "#1e293b"}
              stroke={
                isResolved
                  ? "#059669"
                  : isStrained
                  ? "#b91c1c"
                  : "#0f172a"
              }
              strokeWidth={isResolved ? 4 : 3}
            />

            {/* Top Surface Accent Line for high-contrast mobile edge */}
            <path
              d={topPath}
              stroke={
                isResolved
                  ? "#10b981"
                  : isStrained
                  ? "#ef4444"
                  : deflection > 25
                  ? "#f59e0b"
                  : "#38bdf8"
              }
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
            />

            {/* Micro-Cracks propagating across the strained center underside */}
            {deflection > 25 && (
              <g
                stroke={isResolved ? "#d97706" : "#ef4444"}
                strokeWidth={isResolved ? 2.5 : 2}
                strokeLinecap="round"
                fill="none"
                opacity={isResolved ? 0.85 : 0.95}
              >
                {/* Center crack */}
                <path
                  d={`M ${midX} ${currentMidY + 42} L ${midX - 12} ${
                    currentMidY + 28
                  } L ${midX + 8} ${currentMidY + 16} L ${midX - 4} ${
                    currentMidY + 4
                  }`}
                />
                {/* Secondary crack branch if deflection > 60 */}
                {deflection > 60 && (
                  <path
                    d={`M ${midX + 35} ${currentMidY + 42} L ${midX + 22} ${
                      currentMidY + 26
                    } L ${midX + 45} ${currentMidY + 14}`}
                  />
                )}
                {/* Tertiary crack branch if deflection > 100 */}
                {deflection > 100 && (
                  <path
                    d={`M ${midX - 38} ${currentMidY + 42} L ${midX - 25} ${
                      currentMidY + 22
                    } L ${midX - 40} ${currentMidY + 10}`}
                  />
                )}
              </g>
            )}

            {/* Single Modest Weight Node (Resting on center of beam) */}
            <g
              style={{
                transform: `translate(${midX}px, ${weightY}px)`,
                transition: "transform 0.1s ease-out",
              }}
            >
              {/* Upward float ring when lifted off at resolution */}
              {isResolved && (
                <circle
                  cx={0}
                  cy={-34}
                  r={55}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  opacity={0.6}
                />
              )}

              {/* Polished stone body */}
              <rect
                x={-38}
                y={-62}
                width={76}
                height={62}
                rx={10}
                fill={isResolved ? "#059669" : "#334155"}
                stroke={isResolved ? "#34d399" : "#cbd5e1"}
                strokeWidth={3}
              />
              {/* Modest center core dot */}
              <circle
                cx={0}
                cy={-31}
                r={6}
                fill={isResolved ? "#ffffff" : "#f59e0b"}
              />
              {/* Minimal weight label */}
              <text
                x={0}
                y={-72}
                textAnchor="middle"
                fontSize={16}
                fontWeight="bold"
                fontFamily="JetBrains Mono, monospace"
                fill={isResolved ? "#059669" : "#64748b"}
              >
                {isResolved ? "RELEASED" : "1.0 KG"}
              </text>
            </g>

            {/* Resolution Shockwave Pulse (Frame 1160 -> 1200) */}
            {frame >= 1160 && frame < 1205 && (
              <circle
                cx={midX}
                cy={beamY}
                r={interpolate(frame, [1160, 1200], [10, 220])}
                fill="none"
                stroke="#10b981"
                strokeWidth={interpolate(frame, [1160, 1200], [6, 1])}
                opacity={interpolate(frame, [1160, 1200], [0.9, 0])}
              />
            )}
          </svg>

          {/* Minimalist Resolution Statement */}
          {isResolved && (
            <div
              className="absolute flex flex-col items-center text-center px-12"
              style={{
                top: 1060,
                opacity: interpolate(frame, [1170, 1200], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <h3
                className="text-4xl font-extrabold tracking-tight"
                style={{ color: "#065f46" }}
              >
                Set It Down
              </h3>
              <p className="text-xl font-mono text-emerald-600 mt-2 font-medium">
                BEFORE THE STRUCTURE BREAKS
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
