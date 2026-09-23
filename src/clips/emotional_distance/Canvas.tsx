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
 * 🎯 RIGHTMOTION CREATIVE MISSION — EMOTIONAL_DISTANCE (BENCHMARK C)
 *
 * MANTRA: CLARITY OVER COMPLEXITY · SIMPLICITY OVER SPECTACLE · MEANING OVER DECORATION
 *
 * PRIMARY VISUAL IDEA:
 * One spatial relationship across generous negative space: A solitary node
 * attempts to tether to a distant cluster, but as internal emotional distance
 * expands, the tether snaps, the solitary node drifts into peaceful solitude,
 * and transforms into grounded emerald self-sovereignty.
 *
 * HIERARCHY:
 * - PRIMARY: The expanding spatial relationship (solitary node drifting away from cluster).
 * - SECONDARY: Single minimal distance measurement (EMOTIONAL DISTANCE // PX).
 * - AMBIENT: Pristine luminous studio ground with generous negative space.
 * ═══════════════════════════════════════════════════════════════════════════════
 */
export const EmotionalDistanceCanvas: React.FC<CanvasProps> = () => {
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

  // ─── 2. SPATIAL FIELD ENTRANCE (Frame 148+ @ 60fps) ───
  const fieldEntrance = spring({
    frame: frame - 148,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // ─── 3. SPATIAL DYNAMICS SPRINGS ───
  // Tether stretch & perform: ~frame 480 ("laugh at the jokes, nod in conversations...")
  const performSpring = spring({
    frame: frame - 480,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
  });

  // Expansion & Snap: ~frame 780 ("internally, the emotional distance is expanding...")
  const expansionSpring = spring({
    frame: frame - 780,
    fps,
    config: { damping: 16, stiffness: 85, mass: 1.2 },
  });

  // Resolution Sovereignty: ~frame 1200 ("Authentic connection begins when you stop performing")
  const resolutionSpring = spring({
    frame: frame - 1200,
    fps,
    config: { damping: 14, stiffness: 160, mass: 0.7 },
  });

  // Positions along the horizontal field (y = 960)
  // Group cluster center: starts at x = 740, drifts right to x = 860 during expansion
  const groupCenterX = interpolate(expansionSpring, [0, 1], [740, 860]);
  // Solitary focal node ("YOU"): starts at x = 400, drifts left into negative space to x = 240
  const focalNodeX = interpolate(expansionSpring, [0, 1], [400, 240]);
  const centerY = 960;

  // Calculated spatial gap (px)
  const rawGap = Math.round(groupCenterX - focalNodeX);
  const isSnapped = frame >= 820;
  const isResolved = frame >= 1210;

  // Tension flicker on the tether before snapping
  const tetherTension =
    performSpring > 0 && !isSnapped
      ? Math.sin(frame * 0.8) * 4 * performSpring
      : 0;

  // Color of the solitary focal node
  const focalColor = isResolved
    ? "#059669"
    : isSnapped
    ? "#0284c7"
    : "#f59e0b";

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
              imageSrc={staticFile("emotional_distance/assets/scene_illustration.png")}
              caption="THE PARADOX OF LONELINESS"
              title="ALONE IN A CROWD"
              frame={frame}
              startFrame={0}
              variant="editorial"
            />
          </div>
        </div>
      )}

      {/* ═══ 2. SPATIAL NEGATIVE SPACE FIELD (Frames 148 -> End) ═══ */}
      {frame >= 148 && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{
            opacity: fieldEntrance,
            transform: `scale(${interpolate(fieldEntrance, [0, 1], [0.94, 1])})`,
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
              {isResolved
                ? "STATE // AUTONOMOUS PEACE"
                : isSnapped
                ? "STATE // EMOTIONAL DISTANCE EXPANDING"
                : "STATE // SUPERFICIAL SYNCHRONY"}
            </span>

            <div className="flex items-baseline gap-3 mt-3">
              <span
                className="font-mono font-black text-6xl tracking-tight"
                style={{
                  color: isResolved
                    ? "#059669"
                    : isSnapped
                    ? "#0f172a"
                    : "#d97706",
                }}
              >
                {rawGap} PX
              </span>
              <span className="text-sm font-mono font-semibold tracking-wider text-slate-400 uppercase">
                Perceived Distance
              </span>
            </div>
          </div>

          {/* Master SVG Spatial Stage */}
          <svg
            className="absolute inset-0 w-full h-full overflow-visible pointer-events-none"
            viewBox="0 0 1080 1920"
          >
            {/* Dimension Caliper Line spanning the negative space */}
            <g opacity={0.6}>
              <line
                x1={focalNodeX}
                y1={centerY - 130}
                x2={groupCenterX}
                y2={centerY - 130}
                stroke="#cbd5e1"
                strokeWidth={2}
                strokeDasharray="6 6"
              />
              <line
                x1={focalNodeX}
                y1={centerY - 145}
                x2={focalNodeX}
                y2={centerY - 115}
                stroke="#94a3b8"
                strokeWidth={2}
              />
              <line
                x1={groupCenterX}
                y1={centerY - 145}
                x2={groupCenterX}
                y2={centerY - 115}
                stroke="#94a3b8"
                strokeWidth={2}
              />
            </g>

            {/* PERFORMING TETHER (Before snap) */}
            {!isSnapped && (
              <line
                x1={focalNodeX + 24}
                y1={centerY + tetherTension}
                x2={groupCenterX - 55}
                y2={centerY}
                stroke="#f59e0b"
                strokeWidth={3}
                strokeDasharray={performSpring > 0.5 ? "8 6" : "none"}
                strokeLinecap="round"
              />
            )}

            {/* SNAP SHOCKWAVE (Frames 815 -> 845) */}
            {frame >= 815 && frame < 850 && (
              <circle
                cx={(focalNodeX + groupCenterX) / 2}
                cy={centerY}
                r={interpolate(frame, [815, 845], [5, 90])}
                fill="none"
                stroke="#ef4444"
                strokeWidth={interpolate(frame, [815, 845], [4, 0.5])}
                opacity={interpolate(frame, [815, 845], [0.9, 0])}
              />
            )}

            {/* ═══ THE SOCIAL CLUSTER (Right Side) ═══ */}
            <g
              style={{
                transform: `translate(${groupCenterX}px, ${centerY}px)`,
              }}
            >
              {/* Cluster interconnections */}
              <line
                x1={-35}
                y1={-30}
                x2={20}
                y2={-45}
                stroke="#cbd5e1"
                strokeWidth={2}
              />
              <line
                x1={20}
                y1={-45}
                x2={40}
                y2={25}
                stroke="#cbd5e1"
                strokeWidth={2}
              />
              <line
                x1={40}
                y1={25}
                x2={-25}
                y2={40}
                stroke="#cbd5e1"
                strokeWidth={2}
              />
              <line
                x1={-25}
                y1={40}
                x2={-35}
                y2={-30}
                stroke="#cbd5e1"
                strokeWidth={2}
              />

              {/* Node 1 */}
              <circle
                cx={-35}
                cy={-30}
                r={16}
                fill="#64748b"
                stroke="#ffffff"
                strokeWidth={3}
              />
              {/* Node 2 */}
              <circle
                cx={20}
                cy={-45}
                r={18}
                fill="#475569"
                stroke="#ffffff"
                strokeWidth={3}
              />
              {/* Node 3 */}
              <circle
                cx={40}
                cy={25}
                r={16}
                fill="#64748b"
                stroke="#ffffff"
                strokeWidth={3}
              />
              {/* Node 4 */}
              <circle
                cx={-25}
                cy={40}
                r={15}
                fill="#94a3b8"
                stroke="#ffffff"
                strokeWidth={3}
              />

              {/* Cluster Label */}
              <text
                x={0}
                y={80}
                textAnchor="middle"
                fontSize={13}
                fontFamily="JetBrains Mono, monospace"
                fontWeight="bold"
                fill="#94a3b8"
                letterSpacing="0.2em"
              >
                THE CROWD
              </text>
            </g>

            {/* ═══ THE SOLITARY FOCAL NODE (Left Side / "YOU") ═══ */}
            <g
              style={{
                transform: `translate(${focalNodeX}px, ${centerY}px)`,
              }}
            >
              {/* Expanding calm aura upon resolution */}
              {isResolved && (
                <circle
                  cx={0}
                  cy={0}
                  r={interpolate(frame, [1210, 1260], [24, 75])}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  opacity={0.7}
                />
              )}

              {/* Stillness aura in solitude */}
              {isSnapped && !isResolved && (
                <circle
                  cx={0}
                  cy={0}
                  r={38}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  opacity={0.5}
                />
              )}

              {/* Core focal circle */}
              <circle
                cx={0}
                cy={0}
                r={24}
                fill={focalColor}
                stroke="#ffffff"
                strokeWidth={4}
              />
              <circle cx={0} cy={0} r={7} fill="#ffffff" />

              {/* Node Label */}
              <text
                x={0}
                y={60}
                textAnchor="middle"
                fontSize={15}
                fontFamily="Montserrat, sans-serif"
                fontWeight="bold"
                fill={focalColor}
                letterSpacing="0.1em"
              >
                {isResolved ? "SOVEREIGN" : "YOU"}
              </text>
            </g>

            {/* Resolution Sovereign Pulse (Frame 1205 -> 1245) */}
            {frame >= 1205 && frame < 1250 && (
              <circle
                cx={focalNodeX}
                cy={centerY}
                r={interpolate(frame, [1205, 1245], [10, 180])}
                fill="none"
                stroke="#10b981"
                strokeWidth={interpolate(frame, [1205, 1245], [5, 1])}
                opacity={interpolate(frame, [1205, 1245], [0.9, 0])}
              />
            )}
          </svg>

          {/* Minimalist Resolution Statement */}
          {isResolved && (
            <div
              className="absolute flex flex-col items-center text-center px-12"
              style={{
                top: 1140,
                opacity: interpolate(frame, [1215, 1245], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <h3
                className="text-4xl font-extrabold tracking-tight"
                style={{ color: "#065f46" }}
              >
                Stop Performing
              </h3>
              <p className="text-xl font-mono text-emerald-600 mt-2 font-medium">
                AUTHENTIC CONNECTION BEGINS
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
