import React from "react";

export interface TacticalMemeCardProps {
  memeId: string;
  startFrame: number;
  durationFrames?: number;
  playbackRate?: number;
  hudLabel?: string;
  theme?: "apple_studio" | "dark_obsidian" | "cyber_cyan";
  position?: "top" | "center";
  scale?: number;
  className?: string;
}

/**
 * TacticalMemeCard (Legacy Compatibility Stub)
 * Memes have been decommissioned under the Zero-Memes policy.
 * This stub returns null so legacy clips compile and render without runtime crashes or asset dependencies.
 */
export const TacticalMemeCard: React.FC<TacticalMemeCardProps> = () => null;

export { TacticalMemeFrame } from "./TacticalMemeFrame";
