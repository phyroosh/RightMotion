/**
 * 🎬 Frontier #7: Visual State Machines & Causal Storytelling — Type Definitions
 * 
 * Core primitives governing semantic visual states, causal dependency graphs,
 * deterministic event propagation, thresholds, and narrative memory.
 */

export type SemanticEventType =
  // Physical / Kinetic
  | "IMPACT"
  | "COLLISION"
  | "THRESHOLD_CROSSING"
  | "COMPLETION"
  | "FAILURE"
  | "TRIGGER"
  | "ARRIVAL"
  | "DISAPPEARANCE"
  | "TRANSFORMATION"
  | "ACCUMULATION"
  | "SATURATION"
  | "CONNECTION"
  | "DISCONNECTION"
  | "INTERRUPTION"
  | "REVERSAL"
  | "RELEASE"
  | "DECAY"
  | "PROPAGATION"
  | "ESCALATION"
  | "RESET"
  | "DEFORMATION"
  // Cognitive / Systems
  | "TASK_CREATED"
  | "TASK_UNFINISHED"
  | "RESOURCE_DEPLETED"
  | "ATTENTION_FRAGMENTED"
  | "SYSTEM_OVERLOAD"
  | "TASK_OFFLOADED"
  | "RESTORED";

export type ReversibilityMode =
  | "PERMANENT"
  | "REVERSIBLE"
  | "PARTIALLY_REVERSIBLE"
  | "RECOVERABLE"
  | "DECAYING";

export interface CausalEvent {
  id: string;
  type: SemanticEventType | string;
  frame: number;
  sourceNodeId: string;
  targetNodeId?: string;
  intensity?: number; // 0.0 -> 1.0+
  causeEventId?: string;
  payload?: Record<string, any>;
}

export interface RootTrigger {
  frame: number;
  targetNodeId: string;
  eventType: SemanticEventType | string;
  intensity?: number;
  payload?: Record<string, any>;
}

export interface ValueMutationSpec {
  property: string;
  operation: "set" | "add" | "multiply" | "clamp";
  value: number;
  min?: number;
  max?: number;
}

export interface NodeTransitionDefinition {
  id?: string;
  /** Condition(s) from which this transition can fire, or "*" for any */
  fromCondition?: string | string[] | "*";
  /** Event type that triggers this transition */
  triggerEventType: SemanticEventType | string;
  /** Resulting condition after transition */
  toCondition: string;
  /** Value mutations applied upon transition */
  mutations?: ValueMutationSpec[];
  /** Memory updates that persist across scenes */
  memoryUpdates?: Record<string, any>;
  /** Secondary events emitted to other nodes */
  emitSecondaryEvents?: Array<{
    targetNodeId: string;
    eventType: SemanticEventType | string;
    delayFrames?: number;
    intensity?: number;
    payload?: Record<string, any>;
  }>;
}

export interface ThresholdRule {
  id: string;
  sourceNodeId: string;
  property: string;
  operator: ">=" | "<=" | ">" | "<" | "==";
  thresholdValue: number;
  emitEvent: {
    targetNodeId?: string;
    eventType: SemanticEventType | string;
    intensity?: number;
    payload?: Record<string, any>;
  };
}

export interface CausalDependency {
  sourceNodeId: string;
  targetNodeId: string;
  propagationDelayFrames: number;
  transferRatio?: number; // e.g. 1.0 = full transfer, 0.5 = attenuated
}

export interface CausalNodeDefinition {
  id: string;
  initialCondition: string;
  initialValues?: Record<string, number>;
  reversibility?: ReversibilityMode;
  decayRate?: number; // per second rate if DECAYING
  transitions: NodeTransitionDefinition[];
}

export interface CausalGraphDefinition {
  nodes: CausalNodeDefinition[];
  thresholds?: ThresholdRule[];
  dependencies?: CausalDependency[];
}

export interface NodeStateSnapshot {
  condition: string;
  values: Record<string, number>;
  memory: Record<string, any>;
  lastEvent?: CausalEvent;
  lastTransitionFrame?: number;
}

export interface CausalTraceEntry {
  frame: number;
  nodeId: string;
  condition: string;
  event: string;
  sourceId: string;
  targetId?: string;
  consequence: string;
  memory: Record<string, any>;
}

export interface ResolvedCausalTimeline {
  totalFrames: number;
  fps: number;
  events: CausalEvent[];
  traceLog: CausalTraceEntry[];
  globalMemory: Record<string, any>;
  getStateAtFrame(nodeId: string, frame: number): NodeStateSnapshot;
  getEventsAtFrame(frame: number, windowFrames?: number): CausalEvent[];
}
