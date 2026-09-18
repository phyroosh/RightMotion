import React from "react";
import { MotionStagePlayer } from "../../compiler";
import motionAst from "./motion_ast.json";
import { WordTimestamp } from "../../types";

interface CanvasProps {
  transcript: WordTimestamp[];
}

/**
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  🎬 CANONICAL MOTION AST CANVAS — TheMomentumTrapCanvas
 * ║  Topic: "The Momentum Trap"
 * ║  Primary Mechanism: THRESHOLD CROSSING
 * ║  Niche background: #f8fafc (light studio)
 * ╚══════════════════════════════════════════════════════════════════╝
 *
 * ════════════════════════════════════════════════════════════
 * PRODUCTION PIPELINE TRACE
 * ════════════════════════════════════════════════════════════
 *  script → S (story_model.json) → VCT → F0 (creative_plan.json) → Motion AST (motion_ast.json) → MotionStagePlayer
 *
 *  Concept:                 Threshold Boundary Recalibration
 *  Primary Mechanism:       THRESHOLD CROSSING
 *  Central Transformation:  OBSERVATION -> INFORMED_ACTION
 *  Physical Description:    A solid standard line shifts position when challenged, demonstrating the live transition from strict rule to optional baseline.
 *  Cause Event:             Challenging the standard alters systemic boundary
 *  Visible Consequence:     Altered baseline governs subsequent choices
 *  Persistent State:        Ghost trace of original line remains visible
 *
 * ════════════════════════════════════════════════════════════
 * SCENE PLAN  (60 FPS, safe zone: y 280 → 1340px, x 80 → 1000px)
 * ════════════════════════════════════════════════════════════
 *  HOOK        frames 0 → 434  (7.2s)
 *    Narration:  "Notice how you wait to feel ready before you begin. You believe action requires motivation, but neurology proves the exact opposite."
 *    Frontiers:  F_BASE only
 *
 *  MECHANISM   frames 434 → 1230  (13.3s)
 *    Narration:  "When you wait for emotional comfort, you train your neural circuitry to require a dopamine bribe before moving. Every hesitation wears a deeper groove of avoidance, turning temporary friction into a permanent standard. The friction is not a stop sign. It is the physical toll of entry."
 *    Frontiers:  F6 (dramatic_breath_hold_freeze), F7 (causal_state_machine_with_narrative_memo)
 *
 *  RESOLUTION  frames 1230 → 1464  (3.9s)
 *    Narration:  "Move first, and the neurochemistry follows."
 *    Frontiers:  F7 (causal_state_machine_with_narrative_memo)
 *
 * Controlled escape hatches (sceneOverrides / actorOverrides) are preserved below
 * for bespoke fine-tuning, while ensuring Motion AST remains the canonical creative
 * and physical execution authority.
 */
export const TheMomentumTrapCanvas: React.FC<CanvasProps> = () => {
  return (
    <MotionStagePlayer
      ast={motionAst as any}
      // Controlled escape hatches:
      // sceneOverrides={{
      //   "scene_1_hook": (scene, frame) => { /* bespoke scene override */ },
      // }}
      // actorOverrides={{
      //   "the_momentum_trap_hero_illustration": (actor, scene, frame) => { /* bespoke actor override */ },
      // }}
    />
  );
};
