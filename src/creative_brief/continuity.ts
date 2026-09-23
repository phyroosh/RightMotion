/**
 * 🎬 RightMotion Editorial Continuity & Semantic Transitions
 *
 * Defines contracts and utilities for tracking persistent physical traces,
 * cumulative damage, environmental memory, and story-motivated transitions
 * across shot boundaries.
 *
 * Law of Persistent World Memory:
 * Irreversible mutations (scars, deflections, worn furrows, permanent marks)
 * must leave ghost traces or permanent physical memory across subsequent scenes.
 */

export type TransitionSemanticType =
  | "contradiction"        // Sharp cognitive shock / abrupt reality check
  | "causal_propagation"   // Action in Shot A triggers consequence in Shot B
  | "epiphany_release"     // Sudden breakthrough, cleavage, or release of tension
  | "recalibration"        // Settling into a new, re-anchored baseline state
  | "deepening_chamber"    // Camera travels deeper into the underlying anatomy/mechanism
  | "reflective_hold";     // Quiet space allowing the previous insight to resonate

export interface TransitionMotivation {
  fromShotId: string;
  toShotId: string;
  semanticType: TransitionSemanticType;
  narrativeReason: string;
  recommendedTechnique: "hard_cut" | "scale_through" | "morph" | "collapse" | "fade_hold" | "match_cut";
}

export interface PersistentActorState {
  actorId: string;
  visualProperty: string;
  initialValue: number | string;
  currentValue: number | string;
  isIrreversible: boolean;
  mutationHistory: Array<{
    frame: number;
    event: string;
    value: number | string;
  }>;
}

export interface EnvironmentalMemory {
  /** Offset of the recalibrated horizontal baseline datum */
  baselineOffset?: number;
  /** Accumulated strain/fracture width in pixels */
  fractureChasmDepth?: number;
  /** Number of passes worn into the resistance furrow */
  groovePassCount?: number;
  /** Opacity of the persistent ghost trace line (0.0 to 1.0) */
  ghostTraceOpacity?: number;
  /** Persistent spatial camera coordinates in infinite world */
  cameraWorldOrigin?: [number, number];
}

export interface VisualWorldTimeline {
  clipId: string;
  activeActors: Map<string, PersistentActorState>;
  environmentalMemory: EnvironmentalMemory;
  transitions: TransitionMotivation[];
}

/**
 * Creates an empty visual world state for tracking continuity across shots.
 */
export function createVisualWorldTimeline(clipId: string): VisualWorldTimeline {
  return {
    clipId,
    activeActors: new Map(),
    environmentalMemory: {},
    transitions: [],
  };
}

/**
 * Records an irreversible physical mutation into environmental memory.
 */
export function recordWorldMutation(
  timeline: VisualWorldTimeline,
  mutation: Partial<EnvironmentalMemory>
): VisualWorldTimeline {
  return {
    ...timeline,
    environmentalMemory: {
      ...timeline.environmentalMemory,
      ...mutation,
    },
  };
}
