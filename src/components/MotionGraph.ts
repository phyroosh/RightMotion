import { Easing } from "remotion";

/**
 * ═════════════════════════════════════════════════════════════════════════════
 *  🎬 PRO MOTION GRAPH & SPEED CURVE ENGINE (CapCut & After Effects Grade)
 * ═════════════════════════════════════════════════════════════════════════════
 * Professional video editors never animate linearly.
 * In After Effects and CapCut, the secret to "buttery smooth" animations
 * is the Speed Graph — explosive initial velocity with steep deceleration
 * into an asymptotic, rock-solid settled state.
 */

export const MotionCurves = {
  /**
   * 1. THE SIGNATURE CAPCUT / APPLE SNAP (Explosive Deceleration)
   * 85% velocity in the first 20% of the movement, then silky smooth glide.
   * Ideal for: Card entrances, topic badges, UI reveals.
   */
  snapSettle: Easing.bezier(0.16, 1.0, 0.3, 1.0),

  /**
   * 2. WHIP PAN / KINETIC PUNCH (Extreme Asymmetric Decel)
   * Super steep start, snapping into place with zero overshoot.
   * Ideal for: Scene switches, high-energy hooks, quick cutouts.
   */
  whipSnap: Easing.bezier(0.05, 0.9, 0.1, 1.0),

  /**
   * 3. ANTICIPATION (Back-In Windup)
   * Pulls backward slightly (-4%) before rocketing forward.
   * Ideal for: Punch-in props, attention-grabbing warnings.
   */
  anticipate: Easing.bezier(0.36, 0, 0.66, -0.2),

  /**
   * 4. OVERSHOOT RELEASE (Back-Out Snappy)
   * Launches forward past 100% (to ~104%), then settles back.
   * Ideal for: Badge pop-ins, sticker stamps, emoji reactions.
   */
  overshootOut: Easing.bezier(0.34, 1.56, 0.64, 1.0),

  /**
   * 5. SMOOTH GLIDE (Organic Ease In-Out)
   * Symmetrical ease for long, elegant transitions.
   * Ideal for: Presenter slow zoom, camera pans, backdrop orbs.
   */
  smoothGlide: Easing.bezier(0.45, 0, 0.55, 1.0),

  /**
   * 6. OUTRO QUICK DISMISS (Fast Exit)
   * Accelerates smoothly out of view without lingering.
   * Ideal for: Scene exits, card dismissals, fading badges.
   */
  quickDismiss: Easing.bezier(0.7, 0, 0.84, 0),
};

/**
 * Evaluates a normalized progress (0 to 1) for an animation given frame,
 * startFrame, and durationFrames with a chosen MotionCurve.
 */
export function evaluateCurve(
  frame: number,
  startFrame: number,
  durationFrames: number,
  curve: (t: number) => number = MotionCurves.snapSettle
): number {
  if (frame <= startFrame) return 0;
  if (frame >= startFrame + durationFrames) return 1;
  const t = (frame - startFrame) / durationFrames;
  return curve(Math.min(1, Math.max(0, t)));
}

/**
 * Calculates instantaneous velocity between current and previous frame.
 * Used for dynamic motion blur simulation and squash & stretch!
 */
export function calculateVelocity(
  frame: number,
  startFrame: number,
  durationFrames: number,
  curve: (t: number) => number = MotionCurves.snapSettle
): number {
  const current = evaluateCurve(frame, startFrame, durationFrames, curve);
  const prev = evaluateCurve(frame - 1, startFrame, durationFrames, curve);
  return Math.abs(current - prev);
}

/**
 * Physics-calibrated mass-spring-damper presets for Remotion
 */
export const MotionSprings = {
  /** Snappy and tight: zero wobble, instant settle */
  appleTight: { damping: 20, stiffness: 95, mass: 0.85 },
  /** Bouncy and energetic: slight natural rebound */
  bouncyPop: { damping: 14, stiffness: 120, mass: 0.8 },
  /** Heavy and authoritative: documentary-style weight */
  heavyImpact: { damping: 24, stiffness: 80, mass: 1.2 },
  /** Delicate and responsive: for micro chips and pills */
  microChip: { damping: 18, stiffness: 130, mass: 0.6 },
};
