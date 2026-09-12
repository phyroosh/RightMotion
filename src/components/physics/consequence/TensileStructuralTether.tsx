import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface TensileStructuralTetherProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  restLength: number;
  /** Frame at which the cable snaps under critical tensile yield */
  snapFrame?: number;
  /** Frame when high-frequency vibration begins */
  vibrationStartFrame?: number;
  vibrationIntensity?: number;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 🪢 TensileStructuralTether
 * Structural constraint cable for Frontier #4.
 * 
 * Computes instantaneous mechanical strain:
 *   ε = (Length(t) - RestLength) / RestLength
 * 
 * Modes:
 * 1. SLACK: Gentle catenary sag when L < L0.
 * 2. TAUT: Precision straight cable thinning under Poisson contraction,
 *    vibrating at high acoustic frequency under strain.
 * 3. RUPTURE / SNAP: At snapFrame, fractures at critical threshold,
 *    splitting into two whipping, recoiling strands with elastic energy release.
 */
export const TensileStructuralTether: React.FC<TensileStructuralTetherProps> = ({
  startX,
  startY,
  endX,
  endY,
  restLength,
  snapFrame,
  vibrationStartFrame,
  vibrationIntensity = 4.0,
  label = "TENSILE STRUCTURAL TETHER",
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const dx = endX - startX;
  const dy = endY - startY;
  const currentDist = Math.sqrt(dx * dx + dy * dy);
  const strain = Math.max(0, (currentDist - restLength) / restLength);

  const isSnapped = snapFrame !== undefined && frame >= snapFrame;
  const relSnap = isSnapped ? frame - snapFrame! : 0;

  // 1. Recoil springs for snapped strands
  const snapSpring = spring({
    frame: relSnap,
    fps,
    config: { damping: 10, mass: 0.5, stiffness: 220 },
  });

  // 2. High-Frequency Strain Vibration (Transverse Standing Wave)
  let strainVibration = 0;
  if (!isSnapped && vibrationStartFrame !== undefined && frame >= vibrationStartFrame) {
    const relVib = frame - vibrationStartFrame;
    // Fast frequency (28 Hz), amplitude scaled by strain
    const freqHz = 28;
    strainVibration = Math.sin((relVib / fps) * 2 * Math.PI * freqHz) * vibrationIntensity * (0.4 + strain * 2.0);
  }

  // 3. Normal Vector for Transverse Vibration
  const lengthSafe = Math.max(1, currentDist);
  const normX = -dy / lengthSafe;
  const normY = dx / lengthSafe;

  // Midpoint with vibration displacement
  const midX = (startX + endX) / 2 + normX * strainVibration;
  const midY = (startY + endY) / 2 + normY * strainVibration;

  // 4. Color & Thickness Dynamics under strain
  // Color shifts: Sky Blue (#0284c7) -> Amber (#f59e0b) -> Critical Red (#ef4444)
  const tetherColor = interpolate(strain, [0, 0.15, 0.35], [0, 1, 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const strokeColor = tetherColor < 1 ? "#0284c7" : tetherColor < 1.8 ? "#f59e0b" : "#ef4444";
  const cableThickness = Math.max(1.8, 3.5 * (1 - strain * 0.45));

  // Compute bounding box for SVG
  const minX = Math.min(startX, endX, midX) - 60;
  const minY = Math.min(startY, endY, midY) - 60;
  const maxX = Math.max(startX, endX, midX) + 60;
  const maxY = Math.max(startY, endY, midY) + 60;
  const svgWidth = Math.max(100, maxX - minX);
  const svgHeight = Math.max(100, maxY - minY);

  // SVG local coordinates
  const sX = startX - minX;
  const sY = startY - minY;
  const eX = endX - minX;
  const eY = endY - minY;
  const mX = midX - minX;
  const mY = midY - minY;

  return (
    <div
      className={`absolute pointer-events-none select-none ${className}`}
      style={{
        left: `${minX}px`,
        top: `${minY}px`,
        width: `${svgWidth}px`,
        height: `${svgHeight}px`,
        ...style,
      }}
    >
      <svg width={svgWidth} height={svgHeight} className="overflow-visible">
        {/* Drop shadow filter for cable depth */}
        <defs>
          <filter id="cableGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(0,0,0,0.25)" />
          </filter>
        </defs>

        {/* ══════════════════════════════════════════════════════════ */}
        {/* INTACT TAUT / SLACK CABLE                                 */}
        {/* ══════════════════════════════════════════════════════════ */}
        {!isSnapped && (
          <g filter="url(#cableGlow)">
            {/* Outer high-contrast casing */}
            <path
              d={`M ${sX} ${sY} Q ${mX} ${mY} ${eX} ${eY}`}
              stroke="#090d16"
              strokeWidth={cableThickness + 2.5}
              fill="none"
              strokeLinecap="round"
            />
            {/* Inner dynamic core */}
            <path
              d={`M ${sX} ${sY} Q ${mX} ${mY} ${eX} ${eY}`}
              stroke={strokeColor}
              strokeWidth={cableThickness}
              fill="none"
              strokeLinecap="round"
            />

            {/* Ceiling Anchor Bracket Pin */}
            <circle cx={sX} cy={sY} r={6} fill="#090d16" stroke="#ffffff" strokeWidth="2" />
            {/* Beam Anchor Eyelet */}
            <circle cx={eX} cy={eY} r={5} fill={strokeColor} stroke="#090d16" strokeWidth="2" />
          </g>
        )}

        {/* ══════════════════════════════════════════════════════════ */}
        {/* RUPTURED / SNAPPED STATE (Two Whipping Recoiling Strands)  */}
        {/* ══════════════════════════════════════════════════════════ */}
        {isSnapped && (
          <g>
            {/* 1. Flash burst at rupture center for first 15 frames */}
            {relSnap < 16 && (
              <g>
                <circle
                  cx={mX}
                  cy={mY}
                  r={interpolate(snapSpring, [0, 1], [6, 42])}
                  fill="#fef08a"
                  opacity={interpolate(relSnap, [0, 4, 15], [0, 1, 0])}
                  filter="blur(4px)"
                />
                <circle
                  cx={mX}
                  cy={mY}
                  r={interpolate(snapSpring, [0, 1], [2, 20])}
                  fill="#ffffff"
                  opacity={interpolate(relSnap, [0, 3, 14], [0, 1, 0])}
                />
              </g>
            )}

            {/* 2. Top Strand Whipping Back to Ceiling */}
            {(() => {
              const recoilX = interpolate(snapSpring, [0, 1], [mX, sX + (mX - sX) * 0.25 - 28]);
              const recoilY = interpolate(snapSpring, [0, 1], [mY, sY + (mY - sY) * 0.25 - 15]);
              return (
                <path
                  d={`M ${sX} ${sY} Q ${sX - 25 * snapSpring} ${sY + (recoilY - sY) * 0.5} ${recoilX} ${recoilY}`}
                  stroke="#ef4444"
                  strokeWidth={cableThickness * 1.2}
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })()}

            {/* 3. Bottom Strand Whipping Down to Beam */}
            {(() => {
              const recoilX = interpolate(snapSpring, [0, 1], [mX, eX - (eX - mX) * 0.25 + 32]);
              const recoilY = interpolate(snapSpring, [0, 1], [mY, eY - (eY - mY) * 0.25 + 20]);
              return (
                <path
                  d={`M ${eX} ${eY} Q ${eX + 30 * snapSpring} ${eY - (eY - recoilY) * 0.5} ${recoilX} ${recoilY}`}
                  stroke="#ef4444"
                  strokeWidth={cableThickness * 1.2}
                  fill="none"
                  strokeLinecap="round"
                />
              );
            })()}

            {/* Anchor pins remain firmly attached */}
            <circle cx={sX} cy={sY} r={6} fill="#090d16" stroke="#ffffff" strokeWidth="2" />
            <circle cx={eX} cy={eY} r={5} fill="#ef4444" stroke="#090d16" strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* Real-time Telemetry Tag */}
      {!isSnapped && strain > 0.05 && (
        <div
          className="absolute px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-2"
          style={{
            left: `${mX + 18}px`,
            top: `${mY - 12}px`,
          }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: strokeColor }} />
          <span>STRAIN: {(strain * 100).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
};
