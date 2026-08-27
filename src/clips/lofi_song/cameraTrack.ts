import { CameraKeyframe } from "../../components/CameraCanvas";

/**
 * 2.5D After Effects Camera Movement Track for Lofi Music Video
 * Smooth cinematic glides, subtle rotational tilts, and emotional zoom-ins.
 */
export const LOFI_CAMERA_TRACK: CameraKeyframe[] = [
  // 0s - 13s: Intro Ambience (Center slow breath)
  { timeMs: 0, x: 960, y: 540, zoom: 1.0, rotate: 0 },
  { timeMs: 13000, x: 960, y: 540, zoom: 1.03, rotate: 0.2 },

  // 13s - 38s: Stanzas 1 - 3 (Gentle float)
  { timeMs: 26000, x: 960, y: 535, zoom: 1.05, rotate: -0.3 },
  { timeMs: 38800, x: 960, y: 535, zoom: 1.06, rotate: 0.2 },

  // 38.8s - 72.8s: Stanza 4 & Chorus (Subtle push-in for musical build)
  { timeMs: 50800, x: 960, y: 530, zoom: 1.08, rotate: -0.4 },
  { timeMs: 72800, x: 960, y: 535, zoom: 1.05, rotate: 0.3 },

  // 75.3s - 97s: Bridge & Philosophy
  { timeMs: 82600, x: 960, y: 530, zoom: 1.07, rotate: -0.2 },
  { timeMs: 97000, x: 960, y: 525, zoom: 1.09, rotate: 0.3 },

  // 97s - 130.86s: Outro & Fade
  { timeMs: 111750, x: 960, y: 535, zoom: 1.05, rotate: -0.2 },
  { timeMs: 118400, x: 960, y: 540, zoom: 1.02, rotate: 0.1 },
  { timeMs: 130860, x: 960, y: 540, zoom: 1.0, rotate: 0 },
];
