import React from "react";
import { spring, interpolate } from "remotion";

export interface KineticFurrowProps {
  frame: number;
  fps?: number;
  startX?: number;
  endX?: number;
  y?: number;
  initialWidthPx?: number;
  carvedWidthPx?: number;
  initialColor?: string;
  carvedColor?: string;
  pass1TriggerFrame?: number;
  pass1DurationFrames?: number;
  pass2TriggerFrame?: number;
  pass2DurationFrames?: number;
  massSizePx?: number;
  massColor?: string;
  showFrictionStat?: boolean;
  statText?: string;
}

/**
 * 🎬 KineticFurrow — Pathway Wear & Low-Resistance Channel Primitive
 *
 * Demonstrates the physical etching of a habitual pathway:
 *   1. Untouched Surface: Faint, high-friction ground (f < 970).
 *   2. Pass 1 (Resistance Traversal): Labored, high-drag motion across 65 frames.
 *   3. Groove Wear Mutation: Path visibly deepens, widens, and darkens behind the mass.
 *   4. Pass 2 (Low-Resistance Glide): Second traversal shoots through the carved
 *      furrow in only 30 frames (more than 2x faster).
 *
 * Anti-Cardification Law: Zero UI cards, zero slider tracks. Pure open-canvas physics.
 */
export const KineticFurrow: React.FC<KineticFurrowProps> = ({
  frame,
  fps = 60,
  startX = 140,
  endX = 940,
  y = 800,
  initialWidthPx = 4,
  carvedWidthPx = 14,
  initialColor = "#cbd5e1",
  carvedColor = "#090d16",
  pass1TriggerFrame = 970,
  pass1DurationFrames = 65,
  pass2TriggerFrame = 1070,
  pass2DurationFrames = 30,
  massSizePx = 32,
  massColor = "#f43f5e",
  showFrictionStat = true,
  statText = "-50% FRICTION",
}) => {
  const totalDistance = endX - startX;

  // --- PASS 1: High Resistance & Groove Carving ---
  const isBeforePass1 = frame < pass1TriggerFrame;
  const pass1EndFrame = pass1TriggerFrame + pass1DurationFrames;
  const isDuringPass1 = frame >= pass1TriggerFrame && frame <= pass1EndFrame;
  const isAfterPass1 = frame > pass1EndFrame;

  // Progress of pass 1 (0 to 1 with drag resistance)
  const pass1Progress = isBeforePass1
    ? 0
    : isDuringPass1
    ? interpolate(
        frame,
        [pass1TriggerFrame, pass1EndFrame],
        [0, 1],
        { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
      )
    : 1;

  // Mass X position during Pass 1
  const pass1MassX = startX + totalDistance * pass1Progress;

  // Furrow wear progression: the furrow carves progressively as pass 1 sweeps across
  const carvedExtentX = isBeforePass1
    ? startX
    : isDuringPass1
    ? pass1MassX
    : endX;

  // --- PASS 2: Swift Low-Resistance Glide ---
  const isBeforePass2 = frame < pass2TriggerFrame;
  const pass2EndFrame = pass2TriggerFrame + pass2DurationFrames;
  const isDuringPass2 = frame >= pass2TriggerFrame && frame <= pass2EndFrame;
  const isAfterPass2 = frame > pass2EndFrame;

  // Pass 2 uses snappy spring dynamics (no friction drag)
  const pass2Progress = isBeforePass2
    ? 0
    : spring({
        frame: frame - pass2TriggerFrame,
        fps,
        config: { damping: 15, stiffness: 130, mass: 0.5 },
      });

  const pass2MassX = startX + totalDistance * Math.min(1.0, pass2Progress);

  // Active Mass selection:
  // Show mass during Pass 1, disappear momentarily, then reappear for swift Pass 2
  let showMass = false;
  let activeMassX = startX;
  let activeMassScale = 1.0;
  let activeMassGlow = false;

  if (isDuringPass1) {
    showMass = true;
    activeMassX = pass1MassX;
    // Micro-vibration due to friction resistance during pass 1
    const resistanceJitter = Math.sin(frame * 1.8) * 1.5;
    activeMassX += resistanceJitter;
  } else if (frame > pass1EndFrame && frame < pass2TriggerFrame) {
    // Mass reset at origin for pass 2
    showMass = frame >= pass2TriggerFrame - 15;
    activeMassX = startX;
    activeMassScale = interpolate(frame, [pass2TriggerFrame - 15, pass2TriggerFrame], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  } else if (isDuringPass2 || isAfterPass2) {
    showMass = true;
    activeMassX = pass2MassX;
    activeMassGlow = true;
  }

  // Secondary Annotation Animation (-50% Friction)
  const annotationProgress = isBeforePass2
    ? 0
    : spring({
        frame: frame - pass2TriggerFrame,
        fps,
        config: { damping: 12, stiffness: 140, mass: 0.6 },
      });

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Furrow depth shadow */}
          <filter id="furrow-trench" x="-10%" y="-100%" width="120%" height="300%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#090d16" floodOpacity="0.25" />
          </filter>
          {/* Kinetic mass glow for rapid glide */}
          <filter id="mass-speed-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#f43f5e" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* 1. Untouched Surface Track (Faint, high friction baseline) */}
        <line
          x1={startX}
          y1={y}
          x2={endX}
          y2={y}
          stroke={initialColor}
          strokeWidth={initialWidthPx}
          strokeLinecap="round"
        />

        {/* Track Origin & Destination Marker Pits */}
        <circle cx={startX} cy={y} r={6} fill={initialColor} />
        <circle cx={endX} cy={y} r={6} fill={initialColor} />

        {/* 2. Etched Furrow (Deepened low-resistance groove carved by repetition) */}
        {carvedExtentX > startX && (
          <g>
            {/* Outer trench indentation */}
            <line
              x1={startX}
              y1={y}
              x2={carvedExtentX}
              y2={y}
              stroke={carvedColor}
              strokeWidth={carvedWidthPx}
              strokeLinecap="round"
              style={{
                filter: "drop-shadow(0px 4px 6px rgba(9, 13, 22, 0.25))",
              }}
            />
            {/* Inner low-friction polished core */}
            <line
              x1={startX}
              y1={y}
              x2={carvedExtentX}
              y2={y}
              stroke="#ffffff"
              strokeWidth={Math.max(2, carvedWidthPx * 0.28)}
              strokeLinecap="round"
              opacity="0.85"
            />
          </g>
        )}

        {/* 3. Drag / Resistance Particles during Pass 1 */}
        {isDuringPass1 && (
          <g opacity={0.65}>
            <circle cx={activeMassX - 22} cy={y - 8} r={3} fill="#94a3b8" />
            <circle cx={activeMassX - 36} cy={y + 6} r={2} fill="#cbd5e1" />
            <circle cx={activeMassX - 48} cy={y - 4} r={1.5} fill="#e2e8f0" />
          </g>
        )}

        {/* 4. Speed Streamers during Pass 2 (Visual manifestation of velocity) */}
        {isDuringPass2 && (
          <g opacity={0.75}>
            <line
              x1={activeMassX - 60}
              y1={y}
              x2={activeMassX - 10}
              y2={y}
              stroke="#f43f5e"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1={activeMassX - 100}
              y1={y - 6}
              x2={activeMassX - 35}
              y2={y - 6}
              stroke="#f43f5e"
              strokeWidth="2"
              opacity="0.5"
            />
            <line
              x1={activeMassX - 80}
              y1={y + 6}
              x2={activeMassX - 25}
              y2={y + 6}
              stroke="#f43f5e"
              strokeWidth="2"
              opacity="0.5"
            />
          </g>
        )}

        {/* 5. The Kinetic Mass (Action Entity traversing the stage) */}
        {showMass && (
          <circle
            cx={activeMassX}
            cy={y}
            r={(massSizePx / 2) * activeMassScale}
            fill={massColor}
            filter={activeMassGlow ? "url(#mass-speed-glow)" : undefined}
          />
        )}
      </svg>

      {/* 6. Physical Annotation Labels */}
      {/* Label indicating initial resistance during active pass 1 */}
      {frame >= pass1TriggerFrame && frame <= pass1EndFrame && (
        <div
          className="absolute font-mono text-[22px] font-bold text-slate-500 uppercase tracking-widest"
          style={{
            left: startX,
            top: y - 50,
          }}
        >
          [PASS 1: HIGH FRICTION TRAVERSAL]
        </div>
      )}

      {/* Label indicating carved furrow */}
      {isAfterPass1 && (
        <div
          className="absolute font-mono text-[20px] font-extrabold text-slate-900 uppercase tracking-wider"
          style={{
            left: startX,
            top: y + 26,
          }}
        >
          ETCHED PATHWAY // DEEPENED GROOVE
        </div>
      )}

      {/* Pop-up Secondary Metric: -50% Friction (Reinforces visible speedup) */}
      {showFrictionStat && annotationProgress > 0 && (
        <div
          className="absolute flex items-center gap-2"
          style={{
            left: (startX + endX) / 2 - 120,
            top: y - 90,
            transform: `scale(${annotationProgress})`,
            opacity: Math.min(1, annotationProgress * 1.5),
          }}
        >
          <span className="font-mono text-[42px] font-black text-rose-500 tracking-tight drop-shadow-sm">
            {statText}
          </span>
        </div>
      )}
    </div>
  );
};
