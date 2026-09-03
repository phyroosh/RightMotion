import { SpringConfig } from "remotion";

/**
 * ═════════════════════════════════════════════════════════════════════════════
 *  ⚛️ PHYSICS SPRINGS & HARMONIC OSCILLATOR PRESETS
 * ═════════════════════════════════════════════════════════════════════════════
 * Mathematically tuned spring parameters for realistic mass, elasticity,
 * momentum transfer, and secondary motion.
 */

export interface PhysicsPreset {
  config: SpringConfig;
  description: string;
}

export const PhysicsSprings: Record<
  "heavyImpact" | "elasticSettle" | "pendulumGravity" | "squashStretch" | "fluidTelemetry" | "snappyUI",
  Partial<SpringConfig>
> = {
  /**
   * 1. HEAVY IMPACT (Finance / Metallic / High-Torque)
   * High stiffness with quick damping. Crushes into place with zero mushiness.
   */
  heavyImpact: {
    mass: 0.65,
    stiffness: 240,
    damping: 22,
  },

  /**
   * 2. ELASTIC SETTLE (Tactile Cardstock / Badges / Mascots)
   * Lower damping, bouncy secondary reaction with 2-3 decaying oscillations.
   */
  elasticSettle: {
    mass: 1.1,
    stiffness: 150,
    damping: 11,
  },

  /**
   * 3. PENDULUM GRAVITY (Taped Cards / Hanging Badges / Pinned Notes)
   * Heavy mass, low stiffness for realistic gravity-driven sway.
   */
  pendulumGravity: {
    mass: 1.6,
    stiffness: 85,
    damping: 8,
  },

  /**
   * 4. SQUASH & STRETCH (Impact Volumetric Deformation)
   * Sharp compression on landing, followed by rapid elastic restoration.
   */
  squashStretch: {
    mass: 0.75,
    stiffness: 190,
    damping: 13,
  },

  /**
   * 5. FLUID TELEMETRY (BioMatrix / Cellular HUD / Living Organisms)
   * Gentle, buoyant, organic elasticity that feels alive.
   */
  fluidTelemetry: {
    mass: 1.35,
    stiffness: 110,
    damping: 13,
  },

  /**
   * 6. SNAPPY UI (Apple Keynote Grade)
   * High velocity initial drive, silky smooth deceleration curve.
   */
  snappyUI: {
    mass: 0.85,
    stiffness: 175,
    damping: 18,
  },
};

/**
 * Calculates a decaying harmonic wobble angle (in degrees)
 * Formula: θ(t) = A * cos(ω * t) * e^(-γ * t)
 */
export function calcDecayingWobble(
  relFrame: number,
  fps: number,
  initialAmplitudeDeg: number = 8,
  frequencyHz: number = 4.5,
  decayRate: number = 5.5
): number {
  if (relFrame < 0) return 0;
  const t = relFrame / fps;
  const decay = Math.exp(-decayRate * t);
  if (decay < 0.002) return 0;
  return initialAmplitudeDeg * Math.cos(2 * Math.PI * frequencyHz * t) * decay;
}

/**
 * Calculates volumetric squash and stretch factors (scaleX, scaleY)
 * Preserves visual area: scaleX * scaleY ≈ 1.0
 */
export function calcSquashStretchFactors(
  relFrame: number,
  fps: number,
  maxSquash: number = 0.16, // 16% compression
  decayRate: number = 6.0
): { scaleX: number; scaleY: number } {
  if (relFrame < 0) return { scaleX: 1.0, scaleY: 1.0 };
  const t = relFrame / fps;
  const decay = Math.exp(-decayRate * t);
  if (decay < 0.002) return { scaleX: 1.0, scaleY: 1.0 };

  // Oscillation: first frame compresses Y and expands X, then bounces past 1.0
  const wave = Math.sin(2 * Math.PI * 5.0 * t) * decay;
  const squashFactor = maxSquash * wave;

  return {
    scaleX: 1.0 + squashFactor,
    scaleY: 1.0 - squashFactor * 0.9,
  };
}

/**
 * Calculates subtle ambient micro-buoyancy (harmonic floating drift)
 */
export function calcHarmonicDrift(
  frame: number,
  fps: number,
  amplitudePx: number = 3.5,
  frequencyHz: number = 0.45,
  phaseRad: number = 0
): { translateY: number; rotateDeg: number } {
  const t = frame / fps;
  const translateY = Math.sin(2 * Math.PI * frequencyHz * t + phaseRad) * amplitudePx;
  const rotateDeg = Math.cos(2 * Math.PI * (frequencyHz * 0.8) * t + phaseRad) * (amplitudePx * 0.15);
  return { translateY, rotateDeg };
}
