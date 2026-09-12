import { WorldCameraImpact, WorldWaypoint } from "../components/camera3d/InfiniteWorldCanvas";

/**
 * ⏱️ Temporal Utilities for FPS-Independent RightMotion Engine
 * Normalizes all semantic timing, oscillations, and frame counts to real-time units.
 */

/** Converts real-time seconds to frame count at specified FPS */
export const secToFrames = (seconds: number, fps: number): number => {
  return Math.round(seconds * fps);
};

/** Converts milliseconds to frame count at specified FPS */
export const msToFrames = (ms: number, fps: number): number => {
  return Math.round((ms / 1000) * fps);
};

/** Converts frame count at specified FPS to real-time seconds */
export const framesToSec = (frame: number, fps: number): number => {
  return frame / fps;
};

/**
 * Real-time harmonic sinusoidal oscillator.
 * Guarantees identical oscillation frequency in Hertz regardless of composition FPS.
 *
 * @param frame Current frame number
 * @param fps Current composition frames per second
 * @param frequencyHz Oscillation cycles per second (Hertz)
 * @param phaseOffset Phase offset in radians (default: 0)
 */
export const timeSine = (
  frame: number,
  fps: number,
  frequencyHz: number,
  phaseOffset: number = 0
): number => {
  const timeInSec = frame / fps;
  return Math.sin(timeInSec * 2 * Math.PI * frequencyHz + phaseOffset);
};

/**
 * Real-time harmonic cosine oscillator.
 *
 * @param frame Current frame number
 * @param fps Current composition frames per second
 * @param frequencyHz Oscillation cycles per second (Hertz)
 * @param phaseOffset Phase offset in radians (default: 0)
 */
export const timeCos = (
  frame: number,
  fps: number,
  frequencyHz: number,
  phaseOffset: number = 0
): number => {
  const timeInSec = frame / fps;
  return Math.cos(timeInSec * 2 * Math.PI * frequencyHz + phaseOffset);
};

/**
 * Scales an array of WorldWaypoints from a source FPS (e.g. 30) to target FPS (e.g. 60).
 * Preserves exact real-time seconds for all waypoint arrivals, holds, and transitions.
 */
export const scaleWaypointsToFps = (
  waypoints: WorldWaypoint[],
  sourceFps: number,
  targetFps: number
): WorldWaypoint[] => {
  const ratio = targetFps / sourceFps;
  return waypoints.map((wp) => ({
    ...wp,
    frame: Math.round(wp.frame * ratio),
    durationFrames: wp.durationFrames !== undefined ? Math.round(wp.durationFrames * ratio) : undefined,
  }));
};

/**
 * Scales an array of WorldCameraImpacts from source FPS to target FPS.
 */
export const scaleImpactsToFps = (
  impacts: WorldCameraImpact[],
  sourceFps: number,
  targetFps: number
): WorldCameraImpact[] => {
  const ratio = targetFps / sourceFps;
  return impacts.map((imp) => ({
    ...imp,
    frame: Math.round(imp.frame * ratio),
    durationFrames: imp.durationFrames !== undefined ? Math.round(imp.durationFrames * ratio) : undefined,
  }));
};
