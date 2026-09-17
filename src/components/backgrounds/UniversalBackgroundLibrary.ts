/**
 * 🎬 RightMotion — Universal Background Library
 * Location: src/components/backgrounds/UniversalBackgroundLibrary.ts
 *
 * Provides typed TypeScript bindings to the Universal Backgrounds registry.
 */

import bgRegistryJson from "../../../public/assets/universal_backgrounds/registry.json";

export interface UniversalBackgroundMetadata {
  id: string;
  filename: string;
  path: string;
  width: number;
  height: number;
  aspectRatio: number;
  format: string;
  fileSize: number;
  hash: string;
  tone: "dark" | "neutral" | "bright" | string;
  colorTemp: "warm" | "cool" | "neutral" | string;
  isMonochrome: boolean;
  saturation: number;
  brightness: number;
  contrast: number;
  textureStrength: "subtle" | "medium" | "high" | string;
  edgeDensity: number;
  visualComplexity: "low" | "medium" | "high" | string;
  entropy: number;
  material: string;
  moods: string[];
  visualDensity: "empty" | "sparse" | "medium" | "dense" | string;
  textCompatibility: "excellent" | "good" | "poor" | string;
  presenterCompatibility: "excellent" | "good" | "poor" | string;
  graphicCompatibility: "excellent" | "good" | "poor" | string;
  textSafeRegions: {
    safeTop: boolean;
    safeCenter: boolean;
    safeBottom: boolean;
    safeLeft: boolean;
    safeRight: boolean;
  };
  focalCenter: [number, number];
  safeCropModes: string[];
  motionSuitability: string[];
  transitionSuitability: string[];
  lowResWarning?: boolean;
  status: "READY" | "ANALYSIS_FAILED" | string;
}

export const UNIVERSAL_BACKGROUND_REGISTRY: Record<string, UniversalBackgroundMetadata> =
  bgRegistryJson as any;

export type UniversalBackgroundId = keyof typeof bgRegistryJson | string;

export const getUniversalBackgroundMeta = (
  id: string
): UniversalBackgroundMetadata | undefined => {
  return UNIVERSAL_BACKGROUND_REGISTRY[id];
};

export const getUniversalBackgroundPath = (id: string): string => {
  const meta = UNIVERSAL_BACKGROUND_REGISTRY[id];
  if (meta && meta.path) {
    return meta.path;
  }
  return `assets/universal_backgrounds/${id}.jpg`;
};

export const listUniversalBackgrounds = (): UniversalBackgroundMetadata[] => {
  return Object.values(UNIVERSAL_BACKGROUND_REGISTRY);
};
