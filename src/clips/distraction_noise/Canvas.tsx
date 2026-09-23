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
 * 🎯 RIGHTMOTION CREATIVE MISSION — DISTRACTION_NOISE (BENCHMARK A)
 *
 * MANTRA: CLARITY OVER COMPLEXITY · SIMPLICITY OVER SPECTACLE · MEANING OVER DECORATION
 *
 * PRIMARY VISUAL IDEA:
 * One single horizontal attention beam deflects progressively downward as small
 * interruptions drop onto it, turning from effortless flow into heavy strain,
 * then cleanly snaps straight into emerald clarity upon single-tasking resolution.
 *
 * HIERARCHY:
 * - PRIMARY: The live deforming attention beam + dropping load nodes.
 * - SECONDARY: Single minimal metric readout (FOCUS CAPACITY %).
 * - AMBIENT: Pristine luminous studio ground.
 * ═══════════════════════════════════════════════════════════════════════════════
 */
export const DistractionNoiseCanvas: React.FC<CanvasProps> = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ─── HOOK TRANSITION (Frames 0 -> 150 @ 60fps) ───
  // Coordinated with Judy Presenter in Presenter.tsx (exits at frame 150)
  const hookOpacity = interpolate(frame, [0, 20, 136, 150], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const hookScale = interpolate(frame, [0, 150], [0.96, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ─── CONDUIT ENTRANCE (Frame 146+ @ 60fps) ───
  const conduitEntrance = spring({
    frame: frame - 146,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // ─── LIVE ACCUMULATION PHYSICS (Frames 150 -> 1350 @ 60fps) ───
  // Interruption 1: ~frame 370 ("interruption leaves an invisible residue...")
  const drop1 = spring({
    frame: frame - 370,
    fps,
    config: { damping: 13, stiffness: 140, mass: 0.7 },
  });

  // Interruption 2: ~frame 490 ("One notification adds a tiny weight")
  const drop2 = spring({
    frame: frame - 490,
    fps,
    config: { damping: 13, stiffness: 130, mass: 0.8 },
  });

  // Interruption 3: ~frame 630 ("Another leaves a fog")
  const drop3 = spring({
    frame: frame - 630,
    fps,
    config: { damping: 12, stiffness: 120, mass: 0.9 },
  });

  // Escalation: ~frame 840 ("fighting through a wall of cognitive static")
  const heavyStrain = spring({
    frame: frame - 840,
    fps,
    config: { damping: 15, stiffness: 95, mass: 1.1 },
  });

  // Resolution Snap: ~frame 1010 ("Single tasking is not a discipline hack...")
  const snapResolution = spring({
    frame: frame - 1010,
    fps,
    config: { damping: 14, stiffness: 220, mass: 0.5 },
  });

  // Calculate live deflection (px downward at midpoint)
  // Baseline 0px -> 38px -> 80px -> 125px -> 175px -> Snap to 0px
  const rawDeflection =
    drop1 * 40 + drop2 * 42 + drop3 * 45 + heavyStrain * 50;
  const deflection = interpolate(snapResolution, [0, 1], [rawDeflection, 0]);

  // Flow capacity metric (100% down to 24%, snaps back to 100%)
  const rawCapacity = Math.round(
    100 - (drop1 * 22 + drop2 * 24 + drop3 * 22 + heavyStrain * 18)
  );
  const resolvedCapacity = Math.round(
    interpolate(snapResolution, [0, 1], [rawCapacity, 100])
  );

  // State checks
  const isResolved = frame >= 1015;
  const isSeverelyStrained = frame >= 800 && !isResolved;
  const beamColor = isResolved
    ? "#059669"
    : isSeverelyStrained
    ? "#e11d48"
    : deflection > 50
    ? "#d97706"
    : "#0284c7";

  // Pulse flowing across the beam: speed drops under load, accelerates on resolution
  const pulseSpeed = isResolved
    ? 2.2
    : interpolate(deflection, [0, 180], [1.0, 0.15]);
  const pulseX = ((frame * 9 * pulseSpeed) % 860) + 110;

  // Center coordinates of the canvas
  const beamY = 920;
  const beamStartX = 120;
  const beamEndX = 960;
  const beamMidX = 540;
  const currentMidY = beamY + deflection;

  // Path of the curved beam under physical point load
  const beamPath = `M ${beamStartX} ${beamY} Q ${beamMidX} ${currentMidY} ${beamEndX} ${beamY}`;
  const ghostPath = `M ${beamStartX} ${beamY} L ${beamEndX} ${beamY}`;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none"
      style={{ width: 1080, height: 1920 }}
    >
      {/* ═══ 1. HOOK SCENE (Frames 0 -> 150 @ 60fps) ═══ */}
      {frame < 155 && (
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
              imageSrc={staticFile("distraction_noise/assets/scene_illustration.png")}
              caption="COGNITIVE COST"
              title="A 5-SECOND DISTRACTION"
              frame={frame}
              startFrame={0}
              variant="editorial"
            />
          </div>
        </div>
      )}

      {/* ═══ 2. PHYSICAL ATTENTION CONDUIT (Frames 146 -> End) ═══ */}
      {frame >= 146 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{
            opacity: conduitEntrance,
            transform: `scale(${interpolate(conduitEntrance, [0, 1], [0.94, 1])})`,
          }}
        >
          {/* Subtle Minimal Readout (SECONDARY — exactly 1 supporting cue) */}
          <div
            className="absolute flex flex-col items-center"
            style={{ top: 580 }}
          >
            <span
              className="text-xs font-mono font-bold tracking-[0.3em] uppercase"
              style={{ color: isResolved ? "#059669" : "#64748b" }}
            >
              {isResolved
                ? "STATE // OPTIMAL COHERENCE"
                : isSeverelyStrained
                ? "STATE // HIGH FRICTION DEGRADATION"
                : "STATE // ATTENTION CONDUIT"}
            </span>

            <div className="flex items-baseline gap-3 mt-3">
              <span
                className="font-mono font-black text-6xl tracking-tight transition-colors"
                style={{ color: isResolved ? "#059669" : "#0f172a" }}
              >
                {resolvedCapacity}%
              </span>
              <span className="text-sm font-mono font-semibold tracking-wider text-slate-400 uppercase">
                Focus Capacity
              </span>
            </div>
          </div>

          {/* Master Physical SVG Engine */}
          <svg
            className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
            viewBox="0 0 1080 1920"
          >
            <defs>
              <filter
                id="beam-glow"
                x="-20%"
                y="-50%"
                width="140%"
                height="200%"
              >
                <feGaussianBlur
                  stdDeviation={isResolved ? 12 : 7}
                  result="coloredBlur"
                />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Ghost Baseline: faint persistent memory of the unstrained line */}
            {deflection > 10 && !isResolved && (
              <path
                d={ghostPath}
                stroke="#cbd5e1"
                strokeWidth={2}
                strokeDasharray="8 8"
                fill="none"
                opacity={0.65}
              />
            )}

            {/* Anchors at the left and right margins */}
            <circle
              cx={beamStartX}
              cy={beamY}
              r={7}
              fill="#0f172a"
              stroke="#ffffff"
              strokeWidth={2}
            />
            <circle
              cx={beamEndX}
              cy={beamY}
              r={7}
              fill="#0f172a"
              stroke="#ffffff"
              strokeWidth={2}
            />

            {/* Active Physical Conduit Curve */}
            <path
              d={beamPath}
              stroke={beamColor}
              strokeWidth={isResolved ? 8 : 6}
              strokeLinecap="round"
              fill="none"
              style={{
                transition: "stroke 0.2s ease",
              }}
            />

            {/* Traveling Focus Pulse (Flow particle) */}
            <circle
              cx={pulseX}
              cy={interpolate(
                pulseX,
                [beamStartX, beamMidX, beamEndX],
                [beamY, currentMidY, beamY]
              )}
              r={isResolved ? 10 : 7}
              fill={isResolved ? "#059669" : "#0284c7"}
              stroke="#ffffff"
              strokeWidth={2.5}
            />

            {/* LIVE INTERRUPTION LOADS DROPPING ONTO THE BEAM */}
            {/* Weight 1: Drops at frame 370 */}
            {drop1 > 0 && !isResolved && (
              <g
                style={{
                  opacity: interpolate(drop1, [0, 0.3], [0, 1]),
                  transform: `translate(${beamMidX - 70}px, ${
                    beamY + (drop1 - 1) * 220 + deflection * 0.75
                  }px)`,
                }}
              >
                <rect
                  x={-18}
                  y={-30}
                  width={36}
                  height={30}
                  rx={6}
                  fill="#ef4444"
                  stroke="#991b1b"
                  strokeWidth={2}
                />
                <circle cx={0} cy={-15} r={4} fill="#ffffff" />
              </g>
            )}

            {/* Weight 2: Drops at frame 490 */}
            {drop2 > 0 && !isResolved && (
              <g
                style={{
                  opacity: interpolate(drop2, [0, 0.3], [0, 1]),
                  transform: `translate(${beamMidX + 65}px, ${
                    beamY + (drop2 - 1) * 240 + deflection * 0.8
                  }px)`,
                }}
              >
                <rect
                  x={-18}
                  y={-30}
                  width={36}
                  height={30}
                  rx={6}
                  fill="#f43f5e"
                  stroke="#9f1239"
                  strokeWidth={2}
                />
                <circle cx={0} cy={-15} r={4} fill="#ffffff" />
              </g>
            )}

            {/* Weight 3: Drops at frame 630 */}
            {drop3 > 0 && !isResolved && (
              <g
                style={{
                  opacity: interpolate(drop3, [0, 0.3], [0, 1]),
                  transform: `translate(${beamMidX}px, ${
                    beamY + (drop3 - 1) * 260 + deflection
                  }px)`,
                }}
              >
                <rect
                  x={-24}
                  y={-40}
                  width={48}
                  height={40}
                  rx={8}
                  fill="#e11d48"
                  stroke="#881337"
                  strokeWidth={2.5}
                />
                <circle cx={0} cy={-20} r={5} fill="#ffffff" />
              </g>
            )}

            {/* Escalation Strain Field (Frame 840 -> 1010) */}
            {isSeverelyStrained && (
              <g
                style={{
                  opacity: interpolate(heavyStrain, [0, 1], [0, 0.45]),
                }}
              >
                <ellipse
                  cx={beamMidX}
                  cy={currentMidY}
                  rx={170}
                  ry={55}
                  fill="none"
                  stroke="#e11d48"
                  strokeWidth={1.5}
                  strokeDasharray="4 6"
                />
              </g>
            )}

            {/* Resolution Slash & Flash at frame 1010 */}
            {frame >= 1010 && frame < 1050 && (
              <circle
                cx={beamMidX}
                cy={beamY}
                r={interpolate(frame, [1010, 1045], [20, 260])}
                fill="none"
                stroke="#10b981"
                strokeWidth={interpolate(frame, [1010, 1045], [8, 1])}
                opacity={interpolate(frame, [1010, 1045], [0.9, 0])}
              />
            )}
          </svg>

          {/* Minimalist Resolution Statement */}
          {isResolved && (
            <div
              className="absolute flex flex-col items-center text-center px-12"
              style={{
                top: 1050,
                opacity: interpolate(frame, [1020, 1045], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <h3
                className="text-4xl font-extrabold tracking-tight"
                style={{ color: "#065f46" }}
              >
                Zero Context Switching
              </h3>
              <p className="text-xl font-mono text-emerald-600 mt-2 font-medium">
                PROTECTING MENTAL CLARITY
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
