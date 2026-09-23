/**
 * 🎬 RightMotion Creative Brief & Shot Directive Contracts
 *
 * Defines the structured bridge between high-level story intelligence/orchestration
 * and the AI coding agent's bespoke Canvas.tsx composition.
 */

export type CreativeConfidence = "REQUIRED" | "RECOMMENDED" | "OPTIONAL";

export type VisualDensity = "LOW" | "MEDIUM" | "HIGH";

export type PacingMode =
  | "HOLD"       // Deliberate quiet hold or pregnant pause to absorb insight
  | "OBSERVE"    // Neutral steady observation of an established state
  | "BUILD"      // Rising tension, accumulating elements, increasing density
  | "ACCELERATE" // Rapid progression, fast cuts or progressive micro-beats
  | "IMPACT"     // Decisive moment of collision, strike, fracture, or epiphany
  | "RELEASE";   // Post-impact resolution, consequence settling, decompression

export interface EmotionalArcSegment {
  segmentId: string;
  role: "hook" | "setup" | "contradiction" | "mechanism" | "escalation" | "reveal" | "resolution" | string;
  startFrame: number;
  endFrame: number;
  emotion: string;
  intensity: number; // 0.0 to 1.0
  attentionSpike: boolean;
}

export interface StoryIntelligenceSummary {
  coreIdea: string;
  centralClaim: string;
  viewerPromise: string;
  narrativeArc: string;
}

export interface VisualConceptSummary {
  conceptName: string;
  primaryMechanism: string;
  centralTransformation: string;
  physicalDescription: string;
  visibleTransformation: string;
  visibleConsequence: string;
  persistentState: string;
  whyThisMechanism: string;
  intentionallyNotVisualized: string[];
  metaphorDepth: "LITERAL" | "PHYSICAL_PROCESS" | "EXPERIENTIAL_SYSTEM" | string;
}

export interface ShotDirective {
  shotId: string;
  frameRange: [number, number]; // [startFrame, endFrame]
  
  /** Narrative intent - WHAT idea the viewer is receiving */
  narrativePurpose: string;
  
  /** Visual objective - WHAT physical event or visual state the viewer should SEE */
  visualObjective: string;
  
  /**
   * Primary Visual Idea: Exactly ONE dominant visual event understandable in one sentence.
   * e.g. "Each distraction adds another weight to the character."
   */
  primaryVisualIdea: string;
  
  /** At most a small amount of supporting information (subtle environmental cue, label, etc.) */
  secondaryVisualSupport?: string;
  
  /**
   * Visual Focus Hierarchy:
   * PRIMARY: Exactly ONE dominant target.
   * SECONDARY: At most one supporting detail.
   * BACKGROUND: Context only; must never become another subject.
   */
  visualFocus: {
    primary: string;
    secondary?: string;
    backgroundRole: string;
  };
  
  /**
   * Visual Density Budget:
   * LOW (default): explanations, setup, emotional moments, holds, reflection.
   * MEDIUM: mechanisms, accumulation, escalating systems.
   * HIGH: strictly reserved for momentary impact/climax/reveal.
   */
  visualDensity: VisualDensity;
  
  /**
   * Component Budget:
   * Default: 1. Maximum recommended: 2.
   * suggestedComponents are MUTUALLY OPTIONAL candidates, NOT ingredients.
   */
  componentBudget?: number;
  
  /** Tactical advice on what NOT to add (e.g. "Do not add secondary meters or cards") */
  simplificationDirective?: string;
  
  /** Emotional state to convey in this interval */
  emotionalState: string;
  
  /** Pacing / editorial behavior mode */
  pacingMode: PacingMode;
  
  /** Visual subject of the shot */
  subject: string;
  
  /** Visual question this shot poses before answering */
  visualQuestion?: string;
  
  /** Primary mechanism suggestion with confidence */
  visualMechanism?: {
    type: string;
    confidence: CreativeConfidence;
  };
  
  /**
   * Suggested component candidates (MUTUALLY OPTIONAL).
   * Do NOT use all of them. Prefer the smallest number of visual systems capable of communicating the shot.
   */
  suggestedComponents?: Array<{
    component: string;
    confidence: CreativeConfidence;
    reason: string;
    importPath?: string;
    visualComplexity?: "LOW" | "MEDIUM" | "HIGH";
    bestUse?: "single_subject" | "supporting_system" | "complex_sequence";
  }>;
  
  /** Composition guidance */
  composition?: {
    mode?: "open_canvas" | "asymmetric" | "split" | "centered_minimalism" | "layered_depth" | "spatial_chamber" | string;
    focalPoint?: string;
    confidence: CreativeConfidence;
  };
  
  /** Camera motion intent */
  camera?: {
    mode: "static" | "push_in" | "pull_out" | "lateral_pan" | "handheld_drift" | "rack_focus" | string;
    movement?: string;
    confidence: CreativeConfidence;
  };
  
  /** Transition into the next shot and narrative motivation */
  transitionToNext?: {
    type: "hard_cut" | "morph" | "scale_through" | "collapse" | "fade_hold" | "match_cut" | "spatial_whip" | string;
    motivation: string;
  };
  
  /** Sound design cues tied to shot events */
  soundCues?: Array<{
    type: "click" | "whoosh_fast" | "whoosh_deep" | "whoosh_sparkle" | "impact_hit" | "piano_hit" | "whoosh_cinematic" | "marker_scribble" | "tape_snap";
    frame: number;
    purpose: string;
  }>;
  
  /** Caption system behavior hint */
  captionBehavior?: {
    visibility: "normal" | "reduced" | "hidden";
    emphasisWords?: string[];
    reason?: string;
  };
  
  /** Visual continuity: elements that persist from earlier or carry into later shots */
  continuity?: {
    preserveElements?: string[];
    inheritFromShot?: string;
    persistentTrace?: string;
  };
  
  /**
   * The 5 Core Visual State Questions:
   * Mandatory check ensuring every shot has intentional visual change or deliberate hold.
   */
  stateChange: {
    whatExistsAtBeginning: string;
    whatHappens: string;
    whatVisiblyChanges: string;
    whatExistsAtEnd: string;
    whyChangeMatters: string;
  };
}

export interface VisualLanguageDirectives {
  activeFrontiers: string[];
  forbiddenPatterns: string[];
  referenceClips?: string[];
  groundColor: string;
  accentColor: string;
}

export interface CreativeBriefAssets {
  illustration?: string;
  problemCutout?: { id: string; path: string };
  solutionCutout?: { id: string; path: string };
}

/**
 * Master Creative Brief
 * Emitted as `src/clips/<name>/creative_brief.json` during clip creation.
 */
export interface CreativeBrief {
  version: "1.0.0";
  clipId: string;
  topic: string;
  niche: string;
  fps: number;
  totalFrames: number;
  
  story: StoryIntelligenceSummary;
  emotionalArc: {
    overall: string;
    segments: EmotionalArcSegment[];
  };
  visualConcept: VisualConceptSummary;
  shots: ShotDirective[];
  visualLanguage: VisualLanguageDirectives;
  assets: CreativeBriefAssets;
  
  /** Mandatory agent contract instructions */
  agentContract: {
    instructions: string;
    confidenceHierarchy: string;
    fiveQuestionsRule: string;
    visualHierarchy: string;
    componentRestraint: string;
    minimalityPass: string;
  };
}
