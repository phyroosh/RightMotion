import React from "react";

export interface StickerMeta {
  id: string;
  name: string;
  file: string;
  archetype: string;
  genz_slang: string;
  viewer_instant_feeling: string;
  situational_triggers: string[];
  default_badge: string;
  default_tilt: number;
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center-right" | "center-left";
}

export const STICKERS: Record<string, StickerMeta> = {};

export interface MemeStickerOverlayProps {
  stickerId: string;
  startFrame: number;
  durationFrames?: number;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center-right" | "center-left";
  badgeText?: string;
  size?: number;
  customX?: number;
  customY?: number;
  tiltDeg?: number;
}

/**
 * MemeStickerOverlay (Legacy Compatibility Stub)
 * Memes have been decommissioned under the Zero-Memes policy.
 * This stub returns null so legacy clips compile and render without runtime crashes or asset dependencies.
 */
export const MemeStickerOverlay: React.FC<MemeStickerOverlayProps> = () => null;
