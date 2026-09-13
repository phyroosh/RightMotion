import React, { createContext, useContext, useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { resolveCausalGraph } from "./resolver";
import {
  CausalEvent,
  CausalGraphDefinition,
  NodeStateSnapshot,
  ResolvedCausalTimeline,
  RootTrigger,
} from "./types";

interface CausalContextValue {
  timeline: ResolvedCausalTimeline;
  currentFrame: number;
  fps: number;
  globalMemory: Record<string, any>;
}

const CausalContext = createContext<CausalContextValue | null>(null);

export interface CausalWorldProps {
  graph: CausalGraphDefinition;
  rootTriggers: RootTrigger[];
  totalFrames?: number;
  children: React.ReactNode;
}

/**
 * 🌐 CausalWorld
 * Top-level provider for Frontier #7 Visual State Machines & Causal Storytelling.
 * Pre-resolves the causal timeline deterministically at mount.
 */
export const CausalWorld: React.FC<CausalWorldProps> = ({
  graph,
  rootTriggers,
  totalFrames: customTotalFrames,
  children,
}) => {
  const currentFrame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const totalFrames = customTotalFrames ?? durationInFrames;

  const timeline = useMemo(() => {
    return resolveCausalGraph(graph, rootTriggers, totalFrames, fps);
  }, [graph, rootTriggers, totalFrames, fps]);

  const value = useMemo<CausalContextValue>(
    () => ({
      timeline,
      currentFrame,
      fps,
      globalMemory: timeline.globalMemory,
    }),
    [timeline, currentFrame, fps]
  );

  return <CausalContext.Provider value={value}>{children}</CausalContext.Provider>;
};

/**
 * Hook to access the resolved causal world and global narrative memory.
 */
export const useCausalWorld = (): CausalContextValue => {
  const ctx = useContext(CausalContext);
  if (!ctx) {
    throw new Error("useCausalWorld must be used within a <CausalWorld> provider.");
  }
  return ctx;
};

export interface ActiveNodeState extends NodeStateSnapshot {
  framesSinceTransition: number;
  secondsSinceTransition: number;
}

/**
 * Hook to read the state of any causal node at the current frame.
 */
export const useNodeState = (nodeId: string): ActiveNodeState => {
  const { timeline, currentFrame, fps } = useCausalWorld();
  const snap = timeline.getStateAtFrame(nodeId, currentFrame);

  const lastTrans = snap.lastTransitionFrame ?? 0;
  const framesSince = Math.max(0, currentFrame - lastTrans);
  const secondsSince = framesSince / fps;

  return {
    ...snap,
    framesSinceTransition: framesSince,
    secondsSinceTransition: secondsSince,
  };
};

/**
 * Hook to get events active in the vicinity of the current frame.
 */
export const useCausalEvents = (windowFrames: number = 2): CausalEvent[] => {
  const { timeline, currentFrame } = useCausalWorld();
  return timeline.getEventsAtFrame(currentFrame, windowFrames);
};

export interface DerivedConsequence {
  /** Normalized strain or load (0.0 to 1.0+) */
  intensity: number;
  /** Is the element currently in an active threshold / alert state */
  isCritical: boolean;
  /** High-impact shockwave progress (0.0 to 1.0) for 15 frames following an event */
  shockwaveProgress: number;
  /** Persistent memory markers */
  memory: Record<string, any>;
}

/**
 * Hook deriving physical and visual consequence metrics from node state.
 */
export const useCausalConsequence = (
  nodeId: string,
  primaryValueProp: string = "load"
): DerivedConsequence => {
  const state = useNodeState(nodeId);
  const intensity = state.values[primaryValueProp] ?? 0;
  const isCritical =
    state.condition.toUpperCase().includes("CRITICAL") ||
    state.condition.toUpperCase().includes("STRAINED") ||
    state.condition.toUpperCase().includes("FAILED") ||
    intensity >= 0.75;

  let shockwave = 0;
  if (state.lastTransitionFrame !== undefined && state.framesSinceTransition < 15) {
    shockwave = 1 - state.framesSinceTransition / 15;
  }

  return {
    intensity,
    isCritical,
    shockwaveProgress: shockwave,
    memory: state.memory,
  };
};
