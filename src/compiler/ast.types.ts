/**
 * 🎬 RightMotion — Motion AST (Visual Abstract Syntax Tree)
 * Location: src/compiler/ast.types.ts
 *
 * Intermediate representation bridging Creative Orchestration (Frontier #0)
 * and Remotion Canvas generation. Represents physical visual entities, forces,
 * state mutations, causal couplings, and narrative memory traces.
 *
 * Architectural Invariants:
 * 1. Physical Behavior Over UI Layout (Anti-Cardification).
 * 2. Semantic Intent Preservation (Every node preserves "why").
 * 3. Open Extensibility (Custom geometries, forces, and mutations).
 */

export interface MotionStageAST {
  version: "1.0.0" | string;
  clipId: string;
  fps: number;
  totalFrames: number;
  environment: StageEnvironment;
  persistentWorldMemory: PersistentTrace[];
  scenes: MotionSceneAST[];
}

export interface StageEnvironment {
  groundColor: string; // e.g. "#f8fafc" or "#030712"
  lightingTheme:
    | "clean_studio_radial"
    | "deep_atmospheric_dark"
    | "stark_monochrome"
    | string;
  gridTexture: boolean;
  safeBounds: {
    top: number;    // e.g. 280 (clears top mobile UI)
    bottom: number; // e.g. 1340 (clears captions)
    left: number;   // e.g. 80
    right: number;  // e.g. 1000 (clears interaction rail)
  };
}

export interface MotionSceneAST {
  sceneId: string;
  role:
    | "hook"
    | "friction"
    | "mechanism"
    | "escalation"
    | "resolution"
    | string;
  startFrame: number;
  endFrame: number;
  narrativeGoal: string; // Semantic statement: what the viewer must understand
  actors: MotionActor[];
  forces: PhysicalForce[];
  mutations: SpatialMutation[];
  causalCouplings: CausalCoupling[];
  annotations: StageAnnotation[];
}

// -------------------------------------------------------------
// 1. EXTENSIBLE ACTORS & GEOMETRIES
// -------------------------------------------------------------

export interface MotionActor {
  id: string;
  semanticRole: string;        // e.g. "the_sovereign_standard", "unexamined_burden"
  narrativeImportance: "HERO" | "SECONDARY" | "ENVIRONMENTAL";
  geometry: ActorGeometry;
  visualStyle: ActorVisualStyle;
  resolvedLayout: ResolvedLayout;
  zIndex: number;
  isPersistent: boolean;       // If true, survives scene reset into subsequent scenes
}

export type ContinuousBoundaryGeometry = {
  type: "continuous_boundary";
  orientation: "horizontal" | "vertical";
  lengthPx: number;
  thicknessPx: number;
  initialBaselineY: number;
};

export type ConduitPathwayGeometry = {
  type: "conduit_pathway";
  start: [number, number];
  end: [number, number];
  curvature: number;
  widthPx: number;
};

export type MonolithicFoundationGeometry = {
  type: "monolithic_foundation";
  widthPx: number;
  heightPx: number;
};

export type FulcrumBeamGeometry = {
  type: "fulcrum_beam";
  lengthPx: number;
  thicknessPx: number;
  pivotOffsetRatio?: number;
};

export type PhysicalMassGeometry = {
  type: "physical_mass";
  shape: "circle" | "slab" | "polygon" | string;
  dimensionPx: [number, number];
  massKg: number;
};

export type SemanticCutoutGeometry = {
  type: "semantic_cutout";
  assetPath: string;
  widthPx: number;
  heightPx: number;
};

export type PresenterHostGeometry = {
  type: "presenter_host";
  pose: string;
  baseHeightPx: number;
  position: "right" | "center" | "intimate_intro" | string;
};

export type PhysicalDocumentGeometry = {
  type: "physical_document";
  widthPx: number;
  heightPx: number;
  material: "paper" | "slate_slab" | "digital_screen" | string;
};

export type CustomActorGeometry = {
  type: "custom_geometry";
  geometryName: string;
  parameters: Record<string, any>;
};

export type ActorGeometry =
  | ContinuousBoundaryGeometry
  | ConduitPathwayGeometry
  | MonolithicFoundationGeometry
  | FulcrumBeamGeometry
  | PhysicalMassGeometry
  | SemanticCutoutGeometry
  | PresenterHostGeometry
  | PhysicalDocumentGeometry
  | CustomActorGeometry
  | { type: string; [key: string]: any };

export interface ActorVisualStyle {
  strokeColor: string;
  fillColor?: string;
  strokeWidth?: number;
  dropShadow?: string;
  opacity: number;
  materialTexture?:
    | "matte_solid"
    | "etched_metal"
    | "brittle_glass"
    | "paper_grain"
    | string;
}

export interface ResolvedLayout {
  x: number;
  y: number;
  width: number;
  height: number;
  originAnchor: "center" | "top_left" | "bottom_center" | string;
  semanticPlacement:
    | "dominant_center"
    | "ground_plane"
    | "elevated_threshold"
    | "lateral_balance"
    | string;
}

// -------------------------------------------------------------
// 2. EXTENSIBLE PHYSICAL FORCES
// -------------------------------------------------------------

export type PhysicalForceType =
  | "point_impulse"
  | "compressive_load"
  | "continuous_drag"
  | "torque_moment"
  | "shearing_strike"
  | "custom_force"
  | string;

export interface PhysicalForce {
  forceId: string;
  targetActorId: string;
  type: PhysicalForceType;
  triggerFrame: number;
  durationFrames: number;
  magnitude: number;
  directionDeg: number; // 0=right, 90=down, 180=left, 270=up
  timingCurve:
    | "spring_snappy"
    | "spring_heavy"
    | "instant_impact"
    | "linear_continuous"
    | "viscoelastic_relax"
    | string;
  semanticCause: string; // WHY this force acts (e.g. Spoken concession exerts downward torque)
  customParameters?: Record<string, any>;
}

// -------------------------------------------------------------
// 3. EXTENSIBLE MUTATIONS & STATE TRANSFORMATIONS
// -------------------------------------------------------------

export type SpatialMutationType =
  | "viscoelastic_sag"
  | "groove_wear"
  | "brittle_cleavage"
  | "tensile_thinning"
  | "torque_tilt"
  | "marker_slash"
  | "coordinate_displacement"
  | "custom_mutation"
  | string;

export interface SpatialMutation {
  mutationId: string;
  actorId: string;
  type: SpatialMutationType;
  triggerFrame: number;
  durationFrames: number;
  stateBefore: string;       // Qualitative condition before mutation
  stateAfter: string;        // Qualitative condition after mutation
  physicalRationale: string; // Physical explanation of why mutation occurred
  parameters: Record<string, any>;
  createsMemoryTrace?: PersistentTrace;
}

// -------------------------------------------------------------
// 4. CAUSAL COUPLING & NARRATIVE MEMORY
// -------------------------------------------------------------

export interface CausalCoupling {
  couplingId: string;
  sourceEvent: {
    actorId: string;
    stateChange: string;
    frame: number;
  };
  propagationDelayFrames: number;
  targetReaction: {
    actorId: string;
    triggeredForceId?: string;
    resultingMutationId?: string;
  };
  physicalLaw: string; // e.g. "Carved furrow reduces mechanical friction for subsequent passage"
}

export interface PersistentTrace {
  traceId: string;
  originatingActorId: string;
  originatingSceneId: string;
  appearance:
    | "dashed_ghost_line"
    | "fracture_chasm"
    | "worn_furrow"
    | "stamped_bedrock"
    | "custom_trace"
    | string;
  coordinates: Record<string, any>;
  opacity: number;
  persistsUntilEnd: boolean;
  semanticMeaning: string; // Narrative/psychological meaning of this visual memory
}

// -------------------------------------------------------------
// 5. SECONDARY ANNOTATIONS & KINETIC TYPOGRAPHY
// -------------------------------------------------------------

export interface StageAnnotation {
  annotationId: string;
  text: string;
  font: "Montserrat Black" | "Montserrat Bold" | "JetBrains Mono Bold" | string;
  fontSizePx: number;
  color: string;
  role:
    | "hook_slam"
    | "attached_state_label"
    | "action_verb"
    | "decisive_takeaway"
    | string;
  attachedToActorId?: string; // If present, moves with actor
  staticPlacement?: { x: number; y: number };
  startFrame: number;
  durationFrames: number;
  inAnimation: "scale_pop" | "fade_down" | "slam_with_shake" | string;
}
