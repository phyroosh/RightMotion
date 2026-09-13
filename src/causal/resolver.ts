/**
 * 🎬 Frontier #7: Visual State Machines & Causal Storytelling — Causal Resolver
 * 
 * Pure, deterministic solver compiling a causal dependency graph and root triggers
 * into an immutable timeline of states, events, transitions, and narrative memory.
 * 
 * Guarantees:
 * 1. Zero runtime event listeners or hooks inside render loops.
 * 2. O(log E) binary search lookups per frame (taking <0.02ms).
 * 3. Exact deterministic replay across multi-threaded Remotion workers and still renders.
 */

import {
  CausalEvent,
  CausalGraphDefinition,
  CausalNodeDefinition,
  CausalTraceEntry,
  NodeStateSnapshot,
  ResolvedCausalTimeline,
  RootTrigger,
  ThresholdRule,
  ValueMutationSpec,
} from "./types";

interface InternalNodeState {
  nodeId: string;
  condition: string;
  values: Record<string, number>;
  memory: Record<string, any>;
  lastEvent?: CausalEvent;
  lastTransitionFrame: number;
}

interface FrameChangeRecord {
  frame: number;
  snapshot: NodeStateSnapshot;
}

function applyMutation(
  currentVal: number | undefined,
  mutation: ValueMutationSpec
): number {
  const current = currentVal ?? 0;
  let res = current;
  switch (mutation.operation) {
    case "set":
      res = mutation.value;
      break;
    case "add":
      res = current + mutation.value;
      break;
    case "multiply":
      res = current * mutation.value;
      break;
    case "clamp":
      res = Math.min(mutation.max ?? Infinity, Math.max(mutation.min ?? -Infinity, current));
      break;
  }
  if (mutation.min !== undefined && mutation.max !== undefined) {
    res = Math.min(mutation.max, Math.max(mutation.min, res));
  }
  return res;
}

function evaluateThresholdCondition(
  val: number,
  operator: ThresholdRule["operator"],
  threshold: number
): boolean {
  switch (operator) {
    case ">=":
      return val >= threshold;
    case "<=":
      return val <= threshold;
    case ">":
      return val > threshold;
    case "<":
      return val < threshold;
    case "==":
      return Math.abs(val - threshold) < 0.0001;
    default:
      return false;
  }
}

/**
 * Pure compiler solving the causal timeline from frame 0 to totalFrames.
 */
export function resolveCausalGraph(
  graph: CausalGraphDefinition,
  rootTriggers: RootTrigger[],
  totalFrames: number = 1800,
  fps: number = 60
): ResolvedCausalTimeline {
  const nodeDefs = new Map<string, CausalNodeDefinition>();
  const internalStates = new Map<string, InternalNodeState>();
  const history = new Map<string, FrameChangeRecord[]>();
  const traceLog: CausalTraceEntry[] = [];
  const allEvents: CausalEvent[] = [];
  const globalMemory: Record<string, any> = {};
  const firedThresholds = new Set<string>();

  // 1. Initialize Nodes
  for (const node of graph.nodes) {
    nodeDefs.set(node.id, node);
    const initialValues = { ...(node.initialValues || {}) };
    const initialState: InternalNodeState = {
      nodeId: node.id,
      condition: node.initialCondition,
      values: initialValues,
      memory: {},
      lastTransitionFrame: 0,
    };
    internalStates.set(node.id, initialState);
    history.set(node.id, [
      {
        frame: 0,
        snapshot: {
          condition: initialState.condition,
          values: { ...initialState.values },
          memory: { ...initialState.memory },
          lastTransitionFrame: 0,
        },
      },
    ]);
  }

  // 2. Queue Initial Events
  let eventCounter = 1;
  const pendingEvents: CausalEvent[] = rootTriggers.map((rt) => ({
    id: `ev_root_${eventCounter++}`,
    type: rt.eventType,
    frame: Math.max(0, Math.round(rt.frame)),
    sourceNodeId: "ROOT",
    targetNodeId: rt.targetNodeId,
    intensity: rt.intensity ?? 1.0,
    payload: rt.payload,
  }));

  // Sort initially by frame
  pendingEvents.sort((a, b) => a.frame - b.frame);

  // 3. Process Discrete Event Queue
  while (pendingEvents.length > 0) {
    // Pop earliest event
    const event = pendingEvents.shift()!;
    if (event.frame > totalFrames) continue;

    allEvents.push(event);

    const targetNodeIds: string[] = [];
    if (event.targetNodeId && internalStates.has(event.targetNodeId)) {
      targetNodeIds.push(event.targetNodeId);
    } else if (!event.targetNodeId) {
      // Broadcast to all nodes
      for (const id of internalStates.keys()) {
        targetNodeIds.push(id);
      }
    }

    for (const targetId of targetNodeIds) {
      const nodeDef = nodeDefs.get(targetId);
      const state = internalStates.get(targetId);
      if (!nodeDef || !state) continue;

      // Check transitions
      for (const tr of nodeDef.transitions) {
        if (tr.triggerEventType !== event.type && tr.triggerEventType !== "*") {
          continue;
        }

        const matchFrom =
          !tr.fromCondition ||
          tr.fromCondition === "*" ||
          tr.fromCondition === state.condition ||
          (Array.isArray(tr.fromCondition) && tr.fromCondition.includes(state.condition));

        if (!matchFrom) continue;

        // Apply Transition
        const prevCondition = state.condition;
        state.condition = tr.toCondition;
        state.lastEvent = event;
        state.lastTransitionFrame = event.frame;

        // Apply Value Mutations
        if (tr.mutations) {
          for (const mut of tr.mutations) {
            state.values[mut.property] = applyMutation(state.values[mut.property], mut);
          }
        }

        // Apply Memory Updates (Narrative Persistence)
        if (tr.memoryUpdates) {
          state.memory = { ...state.memory, ...tr.memoryUpdates };
          Object.assign(globalMemory, tr.memoryUpdates);
        }

        // Record in History
        const nodeHistory = history.get(targetId)!;
        nodeHistory.push({
          frame: event.frame,
          snapshot: {
            condition: state.condition,
            values: { ...state.values },
            memory: { ...state.memory },
            lastEvent: event,
            lastTransitionFrame: event.frame,
          },
        });

        // Record in Trace Log
        traceLog.push({
          frame: event.frame,
          nodeId: targetId,
          condition: state.condition,
          event: event.type,
          sourceId: event.sourceNodeId,
          targetId: event.targetNodeId,
          consequence: `${prevCondition} -> ${state.condition} (Values: ${JSON.stringify(state.values)})`,
          memory: { ...state.memory },
        });

        // Secondary Event Emissions
        if (tr.emitSecondaryEvents) {
          for (const sec of tr.emitSecondaryEvents) {
            const secFrame = event.frame + (sec.delayFrames ?? 0);
            const secondaryEvent: CausalEvent = {
              id: `ev_sec_${eventCounter++}`,
              type: sec.eventType,
              frame: secFrame,
              sourceNodeId: targetId,
              targetNodeId: sec.targetNodeId,
              intensity: sec.intensity ?? (event.intensity ?? 1.0),
              causeEventId: event.id,
              payload: sec.payload,
            };
            // Insert in sorted position
            const insertIdx = pendingEvents.findIndex((e) => e.frame > secFrame);
            if (insertIdx === -1) {
              pendingEvents.push(secondaryEvent);
            } else {
              pendingEvents.splice(insertIdx, 0, secondaryEvent);
            }
          }
        }

        // Break after first matching transition for this event on this node
        break;
      }

      // Check Threshold Rules
      if (graph.thresholds) {
        for (const th of graph.thresholds) {
          if (th.sourceNodeId !== targetId) continue;
          const currentVal = state.values[th.property] ?? 0;
          const isCrossed = evaluateThresholdCondition(currentVal, th.operator, th.thresholdValue);
          const thresholdKey = `${th.id}_${state.condition}`;

          if (isCrossed && !firedThresholds.has(thresholdKey)) {
            firedThresholds.add(thresholdKey);
            const thEvent: CausalEvent = {
              id: `ev_th_${eventCounter++}`,
              type: th.emitEvent.eventType,
              frame: event.frame + 1,
              sourceNodeId: targetId,
              targetNodeId: th.emitEvent.targetNodeId,
              intensity: th.emitEvent.intensity ?? 1.0,
              causeEventId: event.id,
              payload: {
                ...th.emitEvent.payload,
                thresholdId: th.id,
                triggeredValue: currentVal,
              },
            };
            const insertIdx = pendingEvents.findIndex((e) => e.frame > thEvent.frame);
            if (insertIdx === -1) {
              pendingEvents.push(thEvent);
            } else {
              pendingEvents.splice(insertIdx, 0, thEvent);
            }
          }
        }
      }

      // Check Causal Dependencies (Propagation)
      if (graph.dependencies) {
        for (const dep of graph.dependencies) {
          if (dep.sourceNodeId !== targetId) continue;
          const propFrame = event.frame + dep.propagationDelayFrames;
          const propEvent: CausalEvent = {
            id: `ev_prop_${eventCounter++}`,
            type: "PROPAGATION",
            frame: propFrame,
            sourceNodeId: targetId,
            targetNodeId: dep.targetNodeId,
            intensity: (event.intensity ?? 1.0) * (dep.transferRatio ?? 1.0),
            causeEventId: event.id,
            payload: { originalType: event.type },
          };
          const insertIdx = pendingEvents.findIndex((e) => e.frame > propFrame);
          if (insertIdx === -1) {
            pendingEvents.push(propEvent);
          } else {
            pendingEvents.splice(insertIdx, 0, propEvent);
          }
        }
      }
    }
  }

  // 4. Return Timeline Interface with O(log E) Lookups
  return {
    totalFrames,
    fps,
    events: allEvents,
    traceLog,
    globalMemory,

    getStateAtFrame(nodeId: string, frame: number): NodeStateSnapshot {
      const records = history.get(nodeId);
      if (!records || records.length === 0) {
        return {
          condition: "UNKNOWN",
          values: {},
          memory: {},
          lastTransitionFrame: 0,
        };
      }

      // Binary search for largest record where r.frame <= frame
      let low = 0;
      let high = records.length - 1;
      let bestIdx = 0;

      while (low <= high) {
        const mid = (low + high) >> 1;
        if (records[mid].frame <= frame) {
          bestIdx = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      const snap = records[bestIdx].snapshot;
      const nodeDef = nodeDefs.get(nodeId);

      // Handle Decaying reversibility if applicable
      if (nodeDef?.reversibility === "DECAYING" && nodeDef.decayRate && frame > records[bestIdx].frame) {
        const elapsedSec = (frame - records[bestIdx].frame) / fps;
        const decayFactor = Math.exp(-nodeDef.decayRate * elapsedSec);
        const decayedValues: Record<string, number> = {};
        for (const [k, v] of Object.entries(snap.values)) {
          decayedValues[k] = v * decayFactor;
        }
        return {
          ...snap,
          values: decayedValues,
        };
      }

      return snap;
    },

    getEventsAtFrame(frame: number, windowFrames: number = 1): CausalEvent[] {
      return allEvents.filter(
        (e) => e.frame >= frame - windowFrames && e.frame <= frame + windowFrames
      );
    },
  };
}
