/**
 * 🎬 RightMotion — Frontier S: Script Intelligence TypeScript Definitions
 * 
 * Defines the complete schema for the NormalizedStoryModel consumed by
 * Frontier #0 (Orchestrator), Frontier T (Thumbnail Intelligence),
 * Platform Safe Area Validation, and Remotion Canvas components.
 */

export interface StoryMeta {
  sourceType: "user_script" | "topic_generated";
  originalInput: string;
  topic: string;
  channel: string;
  mode: "A" | "B";
  isDuo: boolean;
  wordCount: number;
  intelligenceVersion: string;
  contentHash: string;
}

export interface CoreStory {
  coreIdea: string;
  centralClaim: string;
  viewerPromise: string;
  viewerQuestion: string;
  narrativeArchitecture: string;
}

export type NarrativeRole =
  | "hook"
  | "setup"
  | "contradiction"
  | "mechanism"
  | "escalation"
  | "reveal"
  | "resolution";

export interface NarrativeSegment {
  segmentId: string;
  role: NarrativeRole;
  narrationText: string;
  sentenceIndices: number[];
  coreMeaning: string;
  visualQuestion: string;
  semanticWeight: "CRITICAL" | "IMPORTANT" | "SUPPORTING";
}

export interface ClaimItem {
  statement: string;
  type: "central" | "supporting" | "causal" | "psychological" | "rhetorical" | "analogy" | "definition" | "conclusion";
}

export interface EvidenceItem {
  type: "study" | "named_concept" | "mechanism" | "analogy" | "anecdote" | "none";
  reference: string;
  isVerifiable: boolean;
}

export interface MisconceptionItem {
  presumed: string;
  actual: string;
  revealLocation: string;
}

export interface ClaimsAndEvidence {
  claims: ClaimItem[];
  evidence: EvidenceItem[];
  misconceptions: MisconceptionItem[];
}

export interface CausalNode {
  id: string;
  initialCondition: string;
  reversibility: "PERMANENT" | "REVERSIBLE" | "PARTIALLY_REVERSIBLE" | "RECOVERABLE" | "DECAYING";
}

export interface CausalChain {
  cause: string;
  mechanism: string;
  event: string;
  consequence: string;
  resultingState: string;
}

export interface ThresholdEvent {
  source: string;
  condition: string;
  consequence: string;
}

export interface CausalGraph {
  nodes: CausalNode[];
  chains: CausalChain[];
  thresholds: ThresholdEvent[];
}

export interface StateModel {
  initialState: string;
  intermediateStates: string[];
  finalState: string;
  dynamics: "accumulation" | "rupture" | "equilibrium" | "dissipation" | "transformation";
}

export interface TemporalModel {
  pacing: "accelerating" | "steady_build" | "sudden_snap" | "cyclic_loop";
  hasRepetition: boolean;
  repetitionNature: string;
  breathHoldWindow: {
    suggested: boolean;
    narrativeAnchor: string;
    approximateTimestampSec?: number;
    durationFrames?: number;
    rationale?: string;
  };
}

export interface EmotionalTrajectoryEntry {
  segmentId: string;
  emotion: string;
  attentionSpike: boolean;
}

export interface EmphasisMap {
  primary: string[];
  secondary: string[];
}

export interface VisualOpportunity {
  segmentId: string;
  opportunityType:
    | "transformation"
    | "accumulation"
    | "contrast"
    | "reveal"
    | "threshold"
    | "constraint"
    | "branching"
    | "collision"
    | "connection"
    | "persistence";
  physicalDescription: string;
  rationale: string;
}

export interface VisualAbsence {
  textSpan: string;
  recommendedTreatment: "spoken_only" | "atmospheric_drift" | "supporting_label" | "transitional";
  reason: string;
}

export interface SemanticImportance {
  critical: string[];
  important: string[];
  supporting: string[];
  decorative: string[];
}

export interface SceneCandidate {
  candidateId: string;
  suggestedBoundary: string;
  narrativeFunction: string;
  dominantVisualAnchor: string;
}

export interface ThumbnailSignals {
  coreCuriosity: string;
  visualContradiction: string;
  mostMemorableTransformation: string;
  textHookCandidates: string[];
  recommendedArchetype: string;
}

export interface FrontierSignalEntry {
  signal: "LOW" | "MEDIUM" | "HIGH" | "VERY_HIGH" | "DORMANT_DISABLED";
  rationale: string;
}

export interface FrontierSignals {
  signals: Record<string, FrontierSignalEntry>;
}

export interface Diagnostics {
  hygieneValid: boolean;
  issues: string[];
  unsupportedClaims: string[];
  structuralNotes: string[];
}

export interface NormalizedStoryModel {
  meta: StoryMeta;
  story: CoreStory;
  segments: NarrativeSegment[];
  entitiesAndConcepts: {
    concepts: string[];
    entities: string[];
    persistentObjects: string[];
  };
  claimsAndEvidence: ClaimsAndEvidence;
  causalGraph: CausalGraph;
  stateModel: StateModel;
  temporalModel: TemporalModel;
  emotionalTrajectory: EmotionalTrajectoryEntry[];
  emphasisMap: EmphasisMap;
  visualOpportunities: VisualOpportunity[];
  visualAbsence: VisualAbsence[];
  semanticImportance: SemanticImportance;
  sceneCandidates: SceneCandidate[];
  thumbnailSignals: ThumbnailSignals;
  frontierSignals: FrontierSignals;
  diagnostics: Diagnostics;
}
