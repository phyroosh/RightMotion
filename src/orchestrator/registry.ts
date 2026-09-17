/**
 * 🎬 Frontier #0: Creative Intelligence Orchestrator — TypeScript Capability Registry
 * 
 * Projected directly from the authoritative single source of truth:
 * src/orchestrator/frontier_manifest.json
 * 
 * DO NOT add independent frontier authorities here.
 */

import manifest from "./frontier_manifest.json";
import { ENABLE_CINEMATIC_CAMERA_V3 } from "../config/features";
import { FrontierCapability, FrontierCode } from "./types";

export const FRONTIER_MANIFEST = manifest;

function projectRegistry(): Record<FrontierCode, FrontierCapability> {
  const rawFrontiers = manifest.frontiers as Record<FrontierCode, FrontierCapability>;
  const projected: Partial<Record<FrontierCode, FrontierCapability>> = {};

  for (const [code, capability] of Object.entries(rawFrontiers) as [FrontierCode, FrontierCapability][]) {
    projected[code] = {
      ...capability,
      // Enforce dormant status for F3 unless explicitly enabled by feature flag
      status: code === "F3"
        ? (ENABLE_CINEMATIC_CAMERA_V3 ? "ACTIVE" : "DORMANT_EXPERIMENTAL")
        : capability.status,
    };
  }

  return projected as Record<FrontierCode, FrontierCapability>;
}

export const FRONTIER_REGISTRY: Record<FrontierCode, FrontierCapability> = projectRegistry();
