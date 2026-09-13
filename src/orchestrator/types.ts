/**
 * 🎬 Frontier #0: Creative Intelligence Orchestrator — Type Definitions
 * 
 * Decision-making layer defining scene intent, capability registry,
 * complexity budgets, and scene-level creative plans.
 */

export type FrontierCode =
  | "F_BASE"
  | "F0"
  | "F1"
  | "F2"
  | "F3"
  | "F4"
  | "F5"
  | "F6"
  | "F7";

export type FrontierStatus =
  | "ACTIVE"
  | "DORMANT_EXPERIMENTAL"
  | "DEPRECATED";

export type PerformanceCost = "ZERO" | "LOW" | "MEDIUM" | "HIGH";
export type MobileRisk = "LOW" | "MEDIUM" | "HIGH";
export type CapabilityIntensity = "LOW" | "MEDIUM" | "HIGH";
export type CapabilityScope = "SCENE_LEVEL" | "EVENT_LEVEL";
export type ComplexityLevel = "LOW" | "MEDIUM" | "HIGH";

export interface FrontierCapability {
  id: string;
  code: FrontierCode;
  name: string;
  status: FrontierStatus;
  purpose: string;
  creativeStrengths: string[];
  bestUseSituations: string[];
  antiUseSituations: string[];
  dependencies: string[];
  exportedComponents: string[];
  performanceCost: PerformanceCost;
  complexityWeight: number; // 0.0 -> 3.0
  mobileRisk: MobileRisk;
  synergisticWith: FrontierCode[];
  conflictsWith: FrontierCode[];
  defaultIntensity: CapabilityIntensity;
}

export type EmotionalTone =
  | "cognitive_dissonance"
  | "claustrophobic_pressure"
  | "sudden_epiphany"
  | "stoic_resolution"
  | "analytical_clarity"
  | "quiet_restraint";

export type DominantMetaphor =
  | "compression_under_load"
  | "opposing_forces_balance"
  | "brittle_rupture"
  | "spatial_chambers"
  | "divergent_branching"
  | "pure_data_calibration"
  | "accumulating_erosion"
  | "sovereign_clarity"
  | "none";

export type CompositionApproach =
  | "centered_minimalism"
  | "asymmetric_editorial"
  | "physical_diorama"
  | "split_contrast"
  | "continuous_world_chamber";

export interface SceneIntent {
  sceneId: string;
  startFrame: number;
  endFrame: number;
  durationSeconds: number;
  narrationText: string;
  coreIdea: string;
  emotionalTone: EmotionalTone;
  viewerReaction: string;
  visualQuestion: string;
  dominantMetaphor: DominantMetaphor;
  compositionApproach: CompositionApproach;
}

export interface CapabilitySelection {
  frontierCode: FrontierCode;
  capabilityConcept: string;
  intensity: CapabilityIntensity;
  scope: CapabilityScope;
  eventWindow?: { startFrame: number; endFrame: number };
  reason: string;
  mappedComponents: string[];
}

export interface CapabilityRejection {
  frontierCode: FrontierCode;
  reason: string;
}

export interface SceneComplexityBudget {
  level: ComplexityLevel;
  calculatedScore: number;
  maxScoreAllowed: number;
}

export interface SceneCapabilityPlan {
  sceneId: string;
  intent: SceneIntent;
  complexityBudget: SceneComplexityBudget;
  activeCapabilities: CapabilitySelection[];
  rejectedCapabilities: CapabilityRejection[];
  primaryVisual: string;
  secondarySupport: string;
  mobileConstraints: string[];
  performanceNotes: string[];
}

export interface VideoCreativePlan {
  clipName: string;
  topic: string;
  totalFrames: number;
  fps: number;
  overallComplexityRating: "RESTRAINED" | "BALANCED" | "INTENSE";
  scenePlans: SceneCapabilityPlan[];
}

export interface CreativeOverride {
  global?: {
    disabledFrontiers?: FrontierCode[];
    forceFrontiers?: FrontierCode[];
    maxComplexityLevel?: ComplexityLevel;
    forceAllowDormantF3?: boolean;
  };
  scenes?: Record<
    string,
    {
      forceActive?: FrontierCode[];
      forceDisabled?: FrontierCode[];
      intensityOverride?: Partial<Record<FrontierCode, CapabilityIntensity>>;
      overrideReason?: string;
    }
  >;
}
