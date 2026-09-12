#!/usr/bin/env python3
"""
🎬 Frontier #0: Creative Intelligence Orchestrator
============================================================
The foundational decision-making layer determining:
  WHICH CREATIVE CAPABILITIES SHOULD BE USED
  IN WHICH SCENE
  FOR WHICH REASON
  AND AT WHAT INTENSITY.

Core Principle:
  CAPABILITY != REQUIREMENT.
  "DO NOTHING SPECIAL" is a VALID and often CORRECT decision.
"""

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from orchestrator_registry import FRONTIER_REGISTRY

# Maximum allowed complexity scores per scene role
BUDGET_CAPS = {
    "scene_1_hook": 2.5,
    "scene_2_logic": 4.5,
    "scene_3_solution": 3.0,
}

INTENSITY_MULTIPLIERS = {
    "LOW": 0.5,
    "MEDIUM": 1.0,
    "HIGH": 1.5,
}

class CreativeOrchestrator:
    def __init__(self, overrides: Optional[Dict[str, Any]] = None):
        self.registry = FRONTIER_REGISTRY
        self.overrides = overrides or {}

    def analyze_script_pillars(
        self, script: str, transcript: Optional[List[Dict[str, Any]]] = None, fps: int = 60
    ) -> List[Dict[str, Any]]:
        """Divide script into 3 standard pillars: Hook/Problem, Logic/Mechanism, Solution/Shift."""
        cleaned_text = re.sub(r"\{\s*[^}]+\s*\}", "", script).strip()
        sentences = [s.strip() for s in re.split(r"(?<=[.?!])\s+", cleaned_text) if s.strip()]

        if not sentences:
            sentences = ["The core friction.", "The underlying mechanism.", "The decisive shift."]

        total_sentences = len(sentences)
        if total_sentences == 1:
            p1_s = [sentences[0]]
            p2_s = [sentences[0]]
            p3_s = [sentences[0]]
        elif total_sentences == 2:
            p1_s = [sentences[0]]
            p2_s = [sentences[1]]
            p3_s = [sentences[1]]
        elif total_sentences == 3:
            p1_s = [sentences[0]]
            p2_s = [sentences[1]]
            p3_s = [sentences[2]]
        else:
            # 3-pillar partition
            idx1 = max(1, round(total_sentences * 0.28))
            idx2 = max(idx1 + 1, round(total_sentences * 0.72))
            p1_s = sentences[:idx1]
            p2_s = sentences[idx1:idx2]
            p3_s = sentences[idx2:]

        # Calculate frame ranges
        if transcript and len(transcript) > 0:
            total_duration_sec = transcript[-1].get("end", 30.0)
            total_frames = round(total_duration_sec * fps)
            s2_start = round(total_frames * 0.28)
            s3_start = round(total_frames * 0.72)
        else:
            total_frames = 30 * fps
            s2_start = round(total_frames * 0.28)
            s3_start = round(total_frames * 0.72)

        return [
            {
                "sceneId": "scene_1_hook",
                "startFrame": 0,
                "endFrame": s2_start,
                "narrationText": " ".join(p1_s),
                "role": "hook_problem",
            },
            {
                "sceneId": "scene_2_logic",
                "startFrame": s2_start,
                "endFrame": s3_start,
                "narrationText": " ".join(p2_s),
                "role": "logic_mechanism",
            },
            {
                "sceneId": "scene_3_solution",
                "startFrame": s3_start,
                "endFrame": total_frames,
                "narrationText": " ".join(p3_s),
                "role": "solution_shift",
            },
        ]

    def infer_scene_intent(self, pillar: Dict[str, Any], topic: str, fps: int = 60) -> Dict[str, Any]:
        """Infer the narrative, psychological, and physical intent of a scene."""
        text = pillar["narrationText"].lower()
        role = pillar["role"]
        duration_sec = round((pillar["endFrame"] - pillar["startFrame"]) / fps, 2)

        # 1. Emotional Tone & Core Metaphor Inference
        if role == "hook_problem":
            if any(k in text for k in ["pressure", "burden", "overload", "weigh", "heavy", "force"]):
                tone = "claustrophobic_pressure"
                metaphor = "compression_under_load"
                approach = "asymmetric_editorial"
            elif any(k in text for k in ["balance", "cost", "trade", "against", "versus", "pull"]):
                tone = "cognitive_dissonance"
                metaphor = "opposing_forces_balance"
                approach = "split_contrast"
            elif any(k in text for k in ["data", "percent", "number", "stat", "hours", "days", "study"]):
                tone = "analytical_clarity"
                metaphor = "pure_data_calibration"
                approach = "centered_minimalism"
            elif any(k in text for k in ["room", "door", "path", "compartment", "loop", "travel", "journey"]):
                tone = "analytical_clarity"
                metaphor = "spatial_chambers"
                approach = "continuous_world_chamber"
            else:
                tone = "cognitive_dissonance"
                metaphor = "sovereign_clarity"
                approach = "centered_minimalism"

        elif role == "logic_mechanism":
            if any(k in text for k in ["break", "crack", "snap", "rupture", "fail", "fracture", "limit"]):
                tone = "claustrophobic_pressure"
                metaphor = "brittle_rupture"
                approach = "asymmetric_editorial"
            elif any(k in text for k in ["pressure", "compress", "stretch", "deform", "tension", "squeeze"]):
                tone = "claustrophobic_pressure"
                metaphor = "compression_under_load"
                approach = "physical_diorama"
            elif any(k in text for k in ["balance", "fulcrum", "tilt", "counterweight", "leverage", "equal"]):
                tone = "analytical_clarity"
                metaphor = "opposing_forces_balance"
                approach = "physical_diorama"
            elif any(k in text for k in ["chamber", "world", "loop", "stage", "architecture", "foundation"]):
                tone = "analytical_clarity"
                metaphor = "spatial_chambers"
                approach = "continuous_world_chamber"
            elif any(k in text for k in ["hours", "percent", "rate", "number", "deficit", "measure"]):
                tone = "analytical_clarity"
                metaphor = "pure_data_calibration"
                approach = "centered_minimalism"
            else:
                tone = "analytical_clarity"
                metaphor = "divergent_branching"
                approach = "asymmetric_editorial"

        else: # solution_shift
            if any(k in text for k in ["freeze", "sudden", "stop", "moment", "realize", "truth", "clarity"]):
                tone = "sudden_epiphany"
                metaphor = "sovereign_clarity"
                approach = "centered_minimalism"
            elif any(k in text for k in ["build", "foundation", "bedrock", "ground", "cantilever", "structure"]):
                tone = "stoic_resolution"
                metaphor = "sovereign_clarity"
                approach = "physical_diorama"
            else:
                tone = "stoic_resolution"
                metaphor = "sovereign_clarity"
                approach = "centered_minimalism"

        core_idea = pillar["narrationText"][:90] + ("..." if len(pillar["narrationText"]) > 90 else "")

        return {
            "sceneId": pillar["sceneId"],
            "startFrame": pillar["startFrame"],
            "endFrame": pillar["endFrame"],
            "durationSeconds": duration_sec,
            "narrationText": pillar["narrationText"],
            "coreIdea": core_idea,
            "emotionalTone": tone,
            "viewerReaction": f"Experience clear physical resonance with {topic}",
            "visualQuestion": f"What physical consequence illustrates '{core_idea[:45]}' before words finish?",
            "dominantMetaphor": metaphor,
            "compositionApproach": approach,
        }

    def evaluate_capabilities(
        self, intent: Dict[str, Any], prev_plan: Optional[Dict[str, Any]] = None
    ) -> Tuple[List[Dict[str, Any]], List[Dict[str, Any]], Dict[str, Any]]:
        """
        Multi-dimensional capability selection adhering to:
        1. Minimum Sufficient Capability Set.
        2. No shallow keyword classifier.
        3. Strict guardrails against F3 (Dormant).
        4. Conflict & Redundancy resolution.
        5. Complexity budgeting.
        """
        scene_id = intent["sceneId"]
        duration_frames = intent["endFrame"] - intent["startFrame"]
        metaphor = intent["dominantMetaphor"]
        tone = intent["emotionalTone"]
        approach = intent["compositionApproach"]
        budget_cap = BUDGET_CAPS.get(scene_id, 3.5)

        # Global and Scene Overrides
        global_overrides = self.overrides.get("global", {})
        scene_overrides = self.overrides.get("scenes", {}).get(scene_id, {})
        disabled_frontiers = set(global_overrides.get("disabledFrontiers", []))
        disabled_frontiers.update(scene_overrides.get("forceDisabled", []))
        forced_frontiers = set(global_overrides.get("forceFrontiers", []))
        forced_frontiers.update(scene_overrides.get("forceActive", []))
        allow_dormant_f3 = global_overrides.get("forceAllowDormantF3", False)

        active: List[Dict[str, Any]] = []
        rejected: List[Dict[str, Any]] = []

        # -------------------------------------------------------------
        # STEP 1: Guardrail against F3 (Dormant / Experimental)
        # -------------------------------------------------------------
        if "F3" not in disabled_frontiers and not allow_dormant_f3:
            rejected.append({
                "frontierCode": "F3",
                "reason": "F3 is DORMANT_EXPERIMENTAL in features.ts. Optical rack focus and depth stratification are disabled. Replaced by high-contrast 2.5D layered composition.",
            })

        # -------------------------------------------------------------
        # STEP 2: Minimum Sufficient Set / "DO NOTHING SPECIAL" Test
        # -------------------------------------------------------------
        # Always include F_BASE
        active.append({
            "frontierCode": "F_BASE",
            "capabilityConcept": "progressive_kinetic_choreography",
            "intensity": "HIGH",
            "scope": "SCENE_LEVEL",
            "reason": "Baseline high-contrast typographic hierarchy and semantic cutout delivery.",
            "mappedComponents": ["AnimatedSlashStrike", "KineticHighlighter", "CinematicIllustrationCard"],
        })

        if metaphor == "pure_data_calibration":
            # Pure data/metric contrast: DO NOTHING SPECIAL is mathematically superior!
            for code in ["F1", "F2", "F4", "F5", "F6"]:
                if code not in forced_frontiers:
                    rejected.append({
                        "frontierCode": code,
                        "reason": f"Pure metric comparison requires centered minimalism and zero physics clutter. {self.registry[code]['name']} is unnecessary.",
                    })
            return active, rejected, {
                "level": "LOW",
                "calculatedScore": 1.0,
                "maxScoreAllowed": budget_cap,
            }

        # -------------------------------------------------------------
        # STEP 3: Metaphor-Driven Candidate Generation
        # -------------------------------------------------------------
        candidates = set()

        if metaphor in ["compression_under_load", "brittle_rupture", "accumulating_erosion"]:
            candidates.add("F2")

        if metaphor == "opposing_forces_balance":
            candidates.add("F4")
            if tone == "claustrophobic_pressure":
                candidates.add("F2") # Subtle pad compression

        if metaphor == "spatial_chambers" or approach == "continuous_world_chamber":
            candidates.add("F1")
            candidates.add("F5")

        if tone == "sudden_epiphany":
            candidates.add("F6")

        # Add forced frontiers
        for f in forced_frontiers:
            if f != "F_BASE":
                candidates.add(f)

        # Remove explicitly disabled frontiers
        for f in list(candidates):
            if f in disabled_frontiers:
                candidates.remove(f)
                rejected.append({
                    "frontierCode": f,
                    "reason": f"Explicitly disabled by human override.",
                })

        # -------------------------------------------------------------
        # STEP 4: Conflict Resolution & Redundancy Pruning
        # -------------------------------------------------------------
        # Rule 4.1: Short scene ban (<60 frames)
        if duration_frames < 60:
            for f in ["F1", "F5"]:
                if f in candidates and f not in forced_frontiers:
                    candidates.remove(f)
                    rejected.append({
                        "frontierCode": f,
                        "reason": f"Scene duration ({duration_frames} frames) is too short to establish spatial world or diorama.",
                    })

        # Rule 4.2: Conflict between F4 and F5 (No dual heavies)
        if "F4" in candidates and "F5" in candidates:
            if metaphor == "opposing_forces_balance" and "F5" not in forced_frontiers:
                candidates.remove("F5")
                rejected.append({
                    "frontierCode": "F5",
                    "reason": "F4 KineticFulcrumBeam provides the physical ground and balance mechanics; F5 diorama plinths add visual clutter.",
                })
            elif "F4" not in forced_frontiers:
                candidates.remove("F4")
                rejected.append({
                    "frontierCode": "F4",
                    "reason": "F5 diorama structure already satisfies containment; F4 kinetic physics is redundant.",
                })

        # Rule 4.3: Prevent F1 in Scene 1 Hook unless explicitly multi-scene
        if scene_id == "scene_1_hook" and "F1" in candidates and "F1" not in forced_frontiers:
            candidates.remove("F1")
            rejected.append({
                "frontierCode": "F1",
                "reason": "Scene 1 Hook requires immediate presenter intimacy and static illustration grounding (Rule 0 / Rule 4); continuous camera translation dilutes opening personal connection.",
            })

        # -------------------------------------------------------------
        # STEP 5: Add Candidates to Active with Specific Concept & Intensity
        # -------------------------------------------------------------
        for f_code in sorted(list(candidates)):
            if f_code == "F2":
                if metaphor == "brittle_rupture":
                    active.append({
                        "frontierCode": "F2",
                        "capabilityConcept": "brittle_stress_fracture_rupture",
                        "intensity": "HIGH",
                        "scope": "EVENT_LEVEL",
                        "eventWindow": {
                            "startFrame": intent["startFrame"] + round(duration_frames * 0.6),
                            "endFrame": intent["endFrame"],
                        },
                        "reason": "Physical rupture at threshold makes the breaking point visceral on screen.",
                        "mappedComponents": ["StressFractureEngine"],
                    })
                elif metaphor == "compression_under_load":
                    active.append({
                        "frontierCode": "F2",
                        "capabilityConcept": "viscoelastic_compressive_strain",
                        "intensity": "MEDIUM",
                        "scope": "SCENE_LEVEL",
                        "reason": "Material strain and lateral bulging visually communicate accumulating unacknowledged burden.",
                        "mappedComponents": ["ViscoelasticDeformation", "OpticallyStableText"],
                    })
                else:
                    active.append({
                        "frontierCode": "F2",
                        "capabilityConcept": "capillary_ink_absorption",
                        "intensity": "LOW",
                        "scope": "EVENT_LEVEL",
                        "reason": "Permanent debossed inscription reinforces irreversible decision.",
                        "mappedComponents": ["CapillaryInkBleed"],
                    })

            elif f_code == "F4":
                active.append({
                    "frontierCode": "F4",
                    "capabilityConcept": "closed_form_fulcrum_torque_balance",
                    "intensity": "HIGH" if metaphor == "opposing_forces_balance" else "MEDIUM",
                    "scope": "SCENE_LEVEL",
                    "reason": "Action-to-consequence propagation: load arrival directly tilts systemic balance.",
                    "mappedComponents": ["KineticFulcrumBeam", "SemanticMassNode", "TensileStructuralTether"],
                })

            elif f_code == "F1":
                active.append({
                    "frontierCode": "F1",
                    "capabilityConcept": "persistent_spatial_coordinate_flight",
                    "intensity": "MEDIUM",
                    "scope": "SCENE_LEVEL",
                    "reason": "Continuous spatial kinematics journeying between cognitive concept chambers.",
                    "mappedComponents": ["InfiniteWorldCanvas", "WorldEntity"],
                })

            elif f_code == "F5":
                active.append({
                    "frontierCode": "F5",
                    "capabilityConcept": "architectural_diorama_grounding",
                    "intensity": "LOW",
                    "scope": "SCENE_LEVEL",
                    "reason": "Architectural plinth creates spatial ground plane preventing severed/floating elements.",
                    "mappedComponents": ["DioramaPlinth", "BedrockFoundation"],
                })

            elif f_code == "F6":
                active.append({
                    "frontierCode": "F6",
                    "capabilityConcept": "dramatic_breath_hold_freeze",
                    "intensity": "HIGH",
                    "scope": "EVENT_LEVEL",
                    "eventWindow": {
                        "startFrame": intent["startFrame"] + 15,
                        "endFrame": intent["startFrame"] + 35,
                    },
                    "reason": "18-frame micro-freeze halting visual drift right before the cognitive epiphany.",
                    "mappedComponents": ["WorldCameraBreathHold", "timeSine"],
                })

        # -------------------------------------------------------------
        # STEP 6: Complexity Budget Scoring & Pruning
        # -------------------------------------------------------------
        score = 1.0 # Baseline F_BASE
        for act in active:
            code = act["frontierCode"]
            if code != "F_BASE":
                weight = self.registry[code]["complexity_weight"]
                mult = INTENSITY_MULTIPLIERS.get(act["intensity"], 1.0)
                score += weight * mult

        # If score exceeds budget, prune lowest-priority non-forced capability
        if score > budget_cap:
            # Sort active non-forced items by complexity weight descending
            non_forced = [a for a in active if a["frontierCode"] not in forced_frontiers and a["frontierCode"] != "F_BASE"]
            if non_forced:
                pruned = non_forced[-1] # lowest priority candidate
                active.remove(pruned)
                p_code = pruned["frontierCode"]
                rejected.append({
                    "frontierCode": p_code,
                    "reason": f"Exceeded scene complexity budget cap ({score:.1f} > {budget_cap:.1f}). Pruned to prevent effect soup.",
                })
                # Recalculate score
                score -= self.registry[p_code]["complexity_weight"] * INTENSITY_MULTIPLIERS.get(pruned["intensity"], 1.0)

        # Log remaining rejected frontiers
        active_codes = {a["frontierCode"] for a in active}
        rejected_codes = {r["frontierCode"] for r in rejected}
        for code, meta in self.registry.items():
            if code not in active_codes and code not in rejected_codes and code not in ["F0"]:
                rejected.append({
                    "frontierCode": code,
                    "reason": f"{meta['name']} is unnecessary for '{metaphor}' metaphor.",
                })

        complexity_level = "LOW" if score <= 2.0 else ("MEDIUM" if score <= 3.5 else "HIGH")

        return active, rejected, {
            "level": complexity_level,
            "calculatedScore": round(score, 2),
            "maxScoreAllowed": budget_cap,
        }

    def generate_plan(
        self, clip_name: str, topic: str, script: str, transcript: Optional[List[Dict[str, Any]]] = None, fps: int = 60
    ) -> Dict[str, Any]:
        """Generate full VideoCreativePlan for all scenes."""
        pillars = self.analyze_script_pillars(script, transcript, fps)
        scene_plans = []
        total_score = 0.0

        prev_plan = None
        for pillar in pillars:
            intent = self.infer_scene_intent(pillar, topic, fps)
            active, rejected, budget = self.evaluate_capabilities(intent, prev_plan)
            total_score += budget["calculatedScore"]

            primary_visual = "Editorial Hero Card + Judy Grounded Close-up" if pillar["sceneId"] == "scene_1_hook" else (
                f"Physical {intent['dominantMetaphor'].replace('_', ' ').title()} Anchor"
            )

            plan_entry = {
                "sceneId": pillar["sceneId"],
                "intent": intent,
                "complexityBudget": budget,
                "activeCapabilities": active,
                "rejectedCapabilities": rejected,
                "primaryVisual": primary_visual,
                "secondarySupport": "Ambient studio radial lighting + deep contrast drop-shadows",
                "mobileConstraints": [
                    "Platform Safe zone: y: 280px to 1340px (clearing top 0-240px nav, avoiding top 6% legacy hazard)",
                    "Captions safe zone: top 73% to top 81% (zero overlap)",
                    "Right engagement rail clearance: max-width 880px (clearing x: 910-1080px)",
                    "Typography minimum: 56px for headlines, 36px for labels",
                    "Cutouts scaled to 400–750px; 7:1 contrast floor",
                    "Zero micro-particles or sub-pixel wireframes (<2.5px)",
                ],
                "performanceNotes": [
                    "100% CPU SwiftShader mandate: no GPU/CUDA assumptions",
                    "Deterministic spring physics and closed-form torque (zero physics engine stalls)",
                ],
            }
            scene_plans.append(plan_entry)
            prev_plan = plan_entry

        avg_score = total_score / len(scene_plans)
        overall_rating = "RESTRAINED" if avg_score <= 2.0 else ("BALANCED" if avg_score <= 3.2 else "INTENSE")

        total_frames = pillars[-1]["endFrame"]

        return {
            "clipName": clip_name,
            "topic": topic,
            "totalFrames": total_frames,
            "fps": fps,
            "overallComplexityRating": overall_rating,
            "scenePlans": scene_plans,
        }

    def format_plan_summary(self, plan: Dict[str, Any]) -> str:
        """Format the creative plan into a crisp, readable executive markdown summary."""
        lines = []
        lines.append(f"# 🎬 Frontier #0 Creative Plan: {plan['clipName']}")
        lines.append(f"**Topic**: \"{plan['topic']}\" | **Rating**: `{plan['overallComplexityRating']}` | **Frames**: {plan['totalFrames']} (60 FPS)\n")

        for sp in plan["scenePlans"]:
            sc_id = sp["sceneId"].upper()
            intent = sp["intent"]
            budget = sp["complexityBudget"]
            lines.append(f"---")
            lines.append(f"### 📍 {sc_id} (Frames {intent['startFrame']} → {intent['endFrame']}, ~{intent['durationSeconds']}s)")
            lines.append(f"- **Narration**: *\"{intent['narrationText']}\"*")
            lines.append(f"- **Core Metaphor**: `{intent['dominantMetaphor']}` | **Tone**: `{intent['emotionalTone']}`")
            lines.append(f"- **Complexity Budget**: `{budget['level']}` (Score: {budget['calculatedScore']} / {budget['maxScoreAllowed']})")
            lines.append(f"- **Primary Visual**: {sp['primaryVisual']}")
            lines.append("\n**Active Capabilities (Minimum Sufficient Set):**")
            for act in sp["activeCapabilities"]:
                components_str = ", ".join(act["mappedComponents"])
                lines.append(f"  - **{act['frontierCode']}** [{act['intensity']}] — *{act['capabilityConcept']}* ({components_str})")
                lines.append(f"    ↳ *Reason*: {act['reason']}")

            lines.append("\n**Rejected Capabilities (Preventing Effect Soup):**")
            for rej in sp["rejectedCapabilities"]:
                lines.append(f"  - **{rej['frontierCode']}**: {rej['reason']}")
            lines.append("")

        return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="RightMotion Frontier #0 Creative Intelligence Orchestrator")
    parser.add_argument("--name", type=str, default="sample_clip", help="Clip name identifier")
    parser.add_argument("--topic", type=str, required=True, help="Topic of the clip")
    parser.add_argument("--script", type=str, required=True, help="Voiceover script text")
    parser.add_argument("--fps", type=int, default=60, help="Frames per second (default: 60)")
    parser.add_argument("--output", type=str, default="", help="Path to save creative_plan.json")
    parser.add_argument("--disable-frontier", action="append", default=[], help="Disable specific frontier (e.g. --disable-frontier F5)")
    parser.add_argument("--force-frontier", action="append", default=[], help="Force enable frontier (e.g. --force-frontier F2)")
    parser.add_argument("--allow-f3", action="store_true", help="Allow dormant Frontier #3")
    args = parser.parse_args()

    overrides = {
        "global": {
            "disabledFrontiers": args.disable_frontier,
            "forceFrontiers": args.force_frontier,
            "forceAllowDormantF3": args.allow_f3,
        }
    }

    orchestrator = CreativeOrchestrator(overrides=overrides)
    plan = orchestrator.generate_plan(
        clip_name=args.name,
        topic=args.topic,
        script=args.script,
        fps=args.fps,
    )

    summary_md = orchestrator.format_plan_summary(plan)
    print(summary_md)

    if args.output:
        out_path = Path(args.output)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(json.dumps(plan, indent=2), encoding="utf-8")
        print(f"\n✅ Creative Plan saved to: {out_path}")

if __name__ == "__main__":
    main()
