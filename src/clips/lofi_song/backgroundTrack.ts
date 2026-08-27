import { SolidColorKeyframe } from "../../components/SolidBackground";

/**
 * Solid Lofi Red Color Transitions across the 130.86s song.
 * Pure high-contrast solid shades of Midnight Crimson, Wine, and Deep Rose Charcoal.
 */
export const LOFI_BACKGROUND_TRACK: SolidColorKeyframe[] = [
  // 0s - 26s: Intro & Night City -> Midnight Crimson Velvet
  { timeMs: 0, color: "#140508", theme: "dark" },

  // 26s - 50s: Dialogue & Eye Weather -> Deep Wine Charcoal
  { timeMs: 26000, color: "#1c060c", theme: "dark" },

  // 50s - 77s: Bheegi Shaam & Rain Window -> Deep Rose Obsidian
  { timeMs: 50000, color: "#240912", theme: "dark" },

  // 77s - 105s: "Tum Bolti Rehna" Heartbeat Peak -> Midnight Warm Crimson
  { timeMs: 77000, color: "#2b0a14", theme: "dark" },

  // 105s - 130.86s: Philosophy & Memory Outro -> Midnight Crimson Velvet
  { timeMs: 105000, color: "#140508", theme: "dark" },
];
