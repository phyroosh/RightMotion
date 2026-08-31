import registryJson from "../../public/assets/registry.json";

export type CutoutCategory = "psychology" | "burnout" | "devices" | "relationships" | "habits";

export interface CutoutMetadata {
  id: string;
  filename: string;
  category: CutoutCategory;
  path: string;
  title: string;
  description: string;
  tone: string;
  recommendedSfx: "click" | "impact_hit" | "whoosh_fast" | "whoosh_deep" | "whoosh_sparkle" | "whoosh_cinematic";
  keywords: string[];
  width: number;
  height: number;
}

export const CUTOUT_REGISTRY: Record<string, CutoutMetadata> = registryJson as any;

export type CutoutAssetId = keyof typeof registryJson;

export const getCutoutMeta = (id: string): CutoutMetadata | undefined => {
  return CUTOUT_REGISTRY[id];
};

export const getCutoutPath = (id: string): string => {
  const meta = CUTOUT_REGISTRY[id];
  return meta ? meta.path : `assets/psychology/${id}.png`;
};

export const searchCutouts = (query: string): CutoutMetadata[] => {
  const q = query.toLowerCase();
  return Object.values(CUTOUT_REGISTRY).filter((item) =>
    item.id.toLowerCase().includes(q) ||
    item.title.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q) ||
    item.keywords.some((k) => k.toLowerCase().includes(q))
  );
};
