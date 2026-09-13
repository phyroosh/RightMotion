#!/usr/bin/env node
/**
 * 🧪 Test Suite for Frontier #7 Visual State Machines & Causal Engine
 * Tests state transitions, threshold crossings, memory persistence, and determinism.
 */

import { resolveCausalGraph } from "../src/causal/resolver";
import { CausalGraphDefinition, RootTrigger } from "../src/causal/types";

let totalTests = 0;
let passedTests = 0;

function assert(condition: boolean, testName: string, details?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${testName}`);
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    if (details) console.error(`     Details: ${details}`);
  }
}

console.log("======================================================================");
console.log("🎬 RUNNING FRONTIER #7 CAUSAL ENGINE TEST HARNESS");
console.log("======================================================================");

// -------------------------------------------------------------
// Test 1: Node State Initialization
// -------------------------------------------------------------
console.log("\n[Test 1] Node Initialization");
const simpleGraph: CausalGraphDefinition = {
  nodes: [
    {
      id: "structure",
      initialCondition: "STABLE",
      initialValues: { load: 0, integrity: 100 },
      transitions: [],
    },
  ],
};

const timeline1 = resolveCausalGraph(simpleGraph, [], 600, 60);
const s0 = timeline1.getStateAtFrame("structure", 0);
const s100 = timeline1.getStateAtFrame("structure", 100);

assert(s0.condition === "STABLE", "Initial condition is STABLE at frame 0");
assert(s0.values.integrity === 100, "Initial integrity is 100 at frame 0");
assert(s100.condition === "STABLE", "Condition remains STABLE at frame 100 with no triggers");

// -------------------------------------------------------------
// Test 2: Valid Discrete Transitions & Value Mutations
// -------------------------------------------------------------
console.log("\n[Test 2] State Transitions & Value Mutations");
const transitionGraph: CausalGraphDefinition = {
  nodes: [
    {
      id: "beam",
      initialCondition: "STABLE",
      initialValues: { stress: 0.1 },
      transitions: [
        {
          fromCondition: "STABLE",
          triggerEventType: "LOAD_APPLIED",
          toCondition: "STRAINED",
          mutations: [{ property: "stress", operation: "add", value: 0.5 }],
        },
        {
          fromCondition: "STRAINED",
          triggerEventType: "IMPACT",
          toCondition: "CRITICAL",
          mutations: [{ property: "stress", operation: "set", value: 0.95 }],
        },
      ],
    },
  ],
};

const triggers2: RootTrigger[] = [
  { frame: 120, targetNodeId: "beam", eventType: "LOAD_APPLIED" },
  { frame: 240, targetNodeId: "beam", eventType: "IMPACT" },
];

const timeline2 = resolveCausalGraph(transitionGraph, triggers2, 600, 60);

const beforeLoad = timeline2.getStateAtFrame("beam", 119);
const afterLoad = timeline2.getStateAtFrame("beam", 121);
const afterImpact = timeline2.getStateAtFrame("beam", 245);

assert(beforeLoad.condition === "STABLE", "Condition before frame 120 is STABLE");
assert(afterLoad.condition === "STRAINED", "Transitioned to STRAINED at frame 120");
assert(Math.abs(afterLoad.values.stress - 0.6) < 0.001, "Stress increased to 0.6 after LOAD_APPLIED");
assert(afterImpact.condition === "CRITICAL", "Transitioned to CRITICAL at frame 240");
assert(afterImpact.values.stress === 0.95, "Stress set to 0.95 after IMPACT");

// -------------------------------------------------------------
// Test 3: Threshold Crossing & Automatic Event Generation
// -------------------------------------------------------------
console.log("\n[Test 3] Threshold Crossing & Secondary Events");
const thresholdGraph: CausalGraphDefinition = {
  nodes: [
    {
      id: "reservoir",
      initialCondition: "NOMINAL",
      initialValues: { volume: 50 },
      transitions: [
        {
          fromCondition: "*",
          triggerEventType: "FILL",
          toCondition: "FILLING",
          mutations: [{ property: "volume", operation: "add", value: 40 }],
        },
        {
          fromCondition: "*",
          triggerEventType: "OVERFLOW_DETECTED",
          toCondition: "SPILLING",
          memoryUpdates: { overflowOccurred: true },
        },
      ],
    },
  ],
  thresholds: [
    {
      id: "overflow_alarm",
      sourceNodeId: "reservoir",
      property: "volume",
      operator: ">=",
      thresholdValue: 80,
      emitEvent: {
        targetNodeId: "reservoir",
        eventType: "OVERFLOW_DETECTED",
      },
    },
  ],
};

const triggers3: RootTrigger[] = [
  { frame: 100, targetNodeId: "reservoir", eventType: "FILL" },
];

const timeline3 = resolveCausalGraph(thresholdGraph, triggers3, 600, 60);

const stateBeforeThreshold = timeline3.getStateAtFrame("reservoir", 99);
const stateAfterFill = timeline3.getStateAtFrame("reservoir", 100);
const stateAfterThreshold = timeline3.getStateAtFrame("reservoir", 102);

assert(stateBeforeThreshold.condition === "NOMINAL", "Pre-fill state is NOMINAL");
assert(stateAfterFill.values.volume === 90, "Fill increases volume to 90 (crossing threshold 80)");
assert(stateAfterThreshold.condition === "SPILLING", "Threshold triggered OVERFLOW_DETECTED and state became SPILLING");
assert(timeline3.globalMemory.overflowOccurred === true, "Memory recorded overflowOccurred");

// -------------------------------------------------------------
// Test 4: Cross-Scene Narrative Memory Persistence
// -------------------------------------------------------------
console.log("\n[Test 4] Narrative Memory Persistence");
const memoryGraph: CausalGraphDefinition = {
  nodes: [
    {
      id: "material",
      initialCondition: "INTACT",
      transitions: [
        {
          triggerEventType: "FRACTURE",
          toCondition: "PERMANENTLY_DAMAGED",
          memoryUpdates: { scarPattern: "radial_cleavage_03", structuralLoss: 0.65 },
        },
      ],
    },
  ],
};

const triggers4: RootTrigger[] = [
  { frame: 180, targetNodeId: "material", eventType: "FRACTURE" },
];

const timeline4 = resolveCausalGraph(memoryGraph, triggers4, 1200, 60);

const stateScene1 = timeline4.getStateAtFrame("material", 100);
const stateScene2 = timeline4.getStateAtFrame("material", 300);
const stateScene3 = timeline4.getStateAtFrame("material", 1100);

assert(stateScene1.memory.scarPattern === undefined, "Scene 1 (f:100): No memory before fracture");
assert(stateScene2.memory.scarPattern === "radial_cleavage_03", "Scene 2 (f:300): Memory of scar persisted");
assert(stateScene3.memory.scarPattern === "radial_cleavage_03", "Scene 3 (f:1100): Memory persists late into video");
assert(stateScene3.condition === "PERMANENTLY_DAMAGED", "State does not experience reset amnesia");

// -------------------------------------------------------------
// Test 5: Secondary Event Propagation & Attenuation
// -------------------------------------------------------------
console.log("\n[Test 5] Causal Propagation & Secondary Delays");
const propGraph: CausalGraphDefinition = {
  nodes: [
    {
      id: "domino_A",
      initialCondition: "UPRIGHT",
      transitions: [
        {
          triggerEventType: "PUSH",
          toCondition: "FALLEN",
          emitSecondaryEvents: [
            {
              targetNodeId: "domino_B",
              eventType: "STRIKE",
              delayFrames: 15,
            },
          ],
        },
      ],
    },
    {
      id: "domino_B",
      initialCondition: "UPRIGHT",
      transitions: [
        {
          triggerEventType: "STRIKE",
          toCondition: "FALLEN",
        },
      ],
    },
  ],
};

const triggers5: RootTrigger[] = [
  { frame: 50, targetNodeId: "domino_A", eventType: "PUSH" },
];

const timeline5 = resolveCausalGraph(propGraph, triggers5, 300, 60);

const aAfterPush = timeline5.getStateAtFrame("domino_A", 52);
const bBeforeStrike = timeline5.getStateAtFrame("domino_B", 60);
const bAfterStrike = timeline5.getStateAtFrame("domino_B", 66);

assert(aAfterPush.condition === "FALLEN", "Domino A fell at frame 50");
assert(bBeforeStrike.condition === "UPRIGHT", "Domino B still upright at frame 60 during propagation delay");
assert(bAfterStrike.condition === "FALLEN", "Domino B fell at frame 65 (50 + 15 frames delay)");

// -------------------------------------------------------------
// Test 6: Deterministic Replay (Bit-for-Bit Identity)
// -------------------------------------------------------------
console.log("\n[Test 6] Deterministic Replay");
const timelineA = resolveCausalGraph(propGraph, triggers5, 300, 60);
const timelineB = resolveCausalGraph(propGraph, triggers5, 300, 60);

const traceA = JSON.stringify(timelineA.traceLog);
const traceB = JSON.stringify(timelineB.traceLog);

assert(traceA === traceB, "Causal trace log is bit-for-bit identical across runs");
assert(timelineA.events.length === timelineB.events.length, "Event counts are identical");

console.log("======================================================================");
console.log(`TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log("======================================================================");

if (passedTests !== totalTests) {
  process.exit(1);
}
