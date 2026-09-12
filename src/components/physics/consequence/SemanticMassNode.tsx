import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export interface ImpulseEvent {
  /** Frame at which the impulse strikes */
  frame: number;
  /** Force magnitude along Y axis (positive = downward thud, negative = upward pop) */
  forceY?: number;
  /** Force magnitude along X axis */
  forceX?: number;
  /** Duration in frames over which impulse dissipates */
  durationFrames?: number;
}

export interface SemanticMassNodeProps {
  /** Perceived physical mass: 0.2 (featherweight) -> 1.0 (standard) -> 8.0+ (massive stone/metal) */
  mass?: number;
  /** Array of deterministic impulse strikes received by this mass */
  impulses?: ImpulseEvent[];
  /** Optional resting elevation / vertical offset (px) */
  baseY?: number;
  /** Optional resting horizontal offset (px) */
  baseX?: number;
  /** Optional base rotation (degrees) */
  baseRotateDeg?: number;
  /** Entrance frame for this element */
  enterFrame?: number;
  /** Enable subtle mass-dependent ambient drift */
  enableAmbientDrift?: boolean;
  /** Content wrapped inside the mass body */
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * ⚖️ SemanticMassNode
 * Low-level physical consequence primitive for Frontier #4.
 * 
 * Embeds physical inertia, momentum resistance, and mass-differentiated
 * impulse response directly into visual elements without a heavy simulation engine.
 * 
 * - High mass (m=8.0): High inertia, slow acceleration, deep low-frequency displacement, prolonged ground thud.
 * - Low mass (m=0.2): Snappy acceleration, high-frequency low-amplitude vibration, immediate settle.
 */
export const SemanticMassNode: React.FC<SemanticMassNodeProps> = ({
  mass = 1.0,
  impulses = [],
  baseY = 0,
  baseX = 0,
  baseRotateDeg = 0,
  enterFrame = 0,
  enableAmbientDrift = false,
  children,
  className = "",
  style = {},
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 1. Entrance Physics (Mass-dependent arrival)
  // Higher mass requires more damping and carries deeper landing overshoot
  const relEnter = Math.max(0, frame - enterFrame);
  const enterProgress = spring({
    frame: relEnter,
    fps,
    config: {
      damping: Math.max(12, 16 + mass * 1.5),
      mass: Math.max(0.4, Math.min(3.0, mass * 0.7)),
      stiffness: Math.max(70, 180 - mass * 12),
    },
  });

  const enterOffsetY = (1 - enterProgress) * (40 + mass * 10);
  const enterOpacity = Math.min(1, enterProgress * 2.2);

  // 2. Closed-Form Damped Harmonic Impulse Accumulator
  let totalImpulseDispX = 0;
  let totalImpulseDispY = 0;
  let totalSquashY = 0;

  for (const imp of impulses) {
    if (frame >= imp.frame) {
      const deltaFrames = frame - imp.frame;
      const duration = imp.durationFrames ?? Math.round(fps * (0.35 + mass * 0.1));
      
      if (deltaFrames < duration * 2.5) {
        const tSec = deltaFrames / fps;
        
        // Natural frequency inversely related to mass sqrt: omega = sqrt(k / m)
        const omega = Math.sqrt(280 / Math.max(0.2, mass));
        // Damping ratio
        const gamma = (5.5 / Math.sqrt(mass)) * 1.2;
        const decay = Math.exp(-gamma * tSec);

        // Vertical impulse response: F / (m * omega)
        const fy = imp.forceY ?? 15;
        const amplitudeY = (fy / (mass * 0.85)) * 0.6;
        const dispY = amplitudeY * decay * Math.sin(omega * tSec);
        totalImpulseDispY += dispY;

        // Horizontal impulse response
        if (imp.forceX) {
          const amplitudeX = (imp.forceX / (mass * 0.85)) * 0.6;
          const dispX = amplitudeX * decay * Math.sin(omega * tSec);
          totalImpulseDispX += dispX;
        }

        // Volumetric impact squash (sharpest at the first cycle of impact)
        if (deltaFrames < Math.round(fps * 0.25)) {
          const squashWave = Math.sin((deltaFrames / (fps * 0.25)) * Math.PI);
          const squashIntensity = Math.min(0.25, (Math.abs(fy) / 80) * Math.min(1.5, mass));
          totalSquashY += squashWave * squashIntensity;
        }
      }
    }
  }

  // 3. Optional Micro Ambient Drift (Inversely proportional to mass)
  let driftY = 0;
  if (enableAmbientDrift && frame >= enterFrame + 15) {
    const driftAmp = 3.5 / Math.sqrt(mass);
    const driftFreq = 0.45 / Math.cbrt(mass);
    driftY = Math.sin((frame / fps) * 2 * Math.PI * driftFreq) * driftAmp;
  }

  // 4. Final Coordinates & Transforms
  const finalX = baseX + totalImpulseDispX;
  const finalY = baseY + enterOffsetY + totalImpulseDispY + driftY;
  
  // Area-preserving squash and stretch
  const scaleY = Math.max(0.7, 1.0 - totalSquashY);
  const scaleX = Math.min(1.3, 1.0 + totalSquashY * 0.7);

  if (frame < enterFrame) {
    return null;
  }

  return (
    <div
      className={`relative select-none ${className}`}
      style={{
        transform: `translate3d(${finalX.toFixed(2)}px, ${finalY.toFixed(2)}px, 0px) rotate(${baseRotateDeg.toFixed(2)}deg) scale(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)})`,
        transformOrigin: "center bottom",
        opacity: enterOpacity,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
