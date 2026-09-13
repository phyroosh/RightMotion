/**
 * 🎬 RightMotion — Visual Concept Translation Layer — TypeScript Definitions
 * 
 * Defines schemas for Visual Mechanisms, Metaphor Depth Levels, Candidate Evaluations,
 * and the authoritative VisualConceptPlan bridging Frontier S and Frontier #0.
 */

export type VisualMechanismType =
  | "deformation"
  | "accumulation"
  | "compression"
  | "displacement"
  | "erosion"
  | "branching"
  | "propagation"
  | "transfer"
  | "collision"
  | "fragmentation"
  | "stacking"
  | "transformation"
  | "threshold_crossing"
  | "decay"
  | "normalization"
  | "adaptation"
  | "constraint"
  | "release"
  | "disappearance"
  | "amplification"
  | "resistance"
  | "reinforcement"
  | "looping"
  | "spatial_migration"
  | "environmental_mutation";

export type MetaphorDepthLevel =
  | "LEVEL_1_LITERAL"
  | "LEVEL_2_PHYSICAL_PROCESS"
  | "LEVEL_3_EXPERIENTIAL_SYSTEM";

export interface CandidateEvaluation {
  semanticClarity: number;
  memorability: number;
  originality: number;
  mobileReadability: number;
  complexityWithinBudget: number;
  frontierSynergy: number;
  antiFailureModeScore: number;
  penalties: string[];
  compositeScore: number;
}

export interface VisualConceptCandidate {
  candidateId: string;
  conceptName: string;
  primaryMechanism: VisualMechanismType | string;
  secondaryMechanism?: string | null;
  metaphorLevel: MetaphorDepthLevel | string;
  physicalDescription: string;
  causeEvent: string;
  visibleTransformation: string;
  visibleConsequence: string;
  persistentMemory: string;
  visualAbsence: string[];
  requiredFrontiers: string[];
  mappedComponents: string[];
  evaluation: CandidateEvaluation;
}

export interface VisualConceptPlan {
  topic: string;
  coreIdea: string;
  centralTransformation: string;
  primaryMechanism: VisualMechanismType | string;
  championCandidate: VisualConceptCandidate;
  alternativeCandidates: VisualConceptCandidate[];
  cause: string;
  visibleConsequence: string;
  persistentState: string;
  selectedFrontiers: string[];
  whyThisMechanism: string;
  whatIsIntentionallyNotVisualized: string[];
  inspectableReport?: string;
}
