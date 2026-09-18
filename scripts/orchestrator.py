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

from dataclasses import asdict
from orchestrator_registry import FRONTIER_REGISTRY
from visual_concept import VisualConceptTranslator, VisualConceptPlan
from background_selector import BackgroundSelector, SceneContext
from validate_motion_ast import validate_motion_ast
from geometry_resolver import GeometryResolver

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
        self.background_selector = BackgroundSelector()

    def analyze_script_pillars(
        self, script: str, transcript: Optional[List[Dict[str, Any]]] = None, fps: int = 60, story_model: Optional[Any] = None
    ) -> List[Dict[str, Any]]:
        """Divide script into 3 standard pillars: Hook/Problem, Logic/Mechanism, Solution/Shift."""
        cleaned_text = re.sub(r"\{\s*[^}]+\s*\}", "", script).strip()
        sentences = [s.strip() for s in re.split(r"(?<=[.?!])\s+", cleaned_text) if s.strip()]

        if not sentences:
            sentences = ["The core friction.", "The underlying mechanism.", "The decisive shift."]

        # If story_model with segments is available, map segments to 3 pillars
        segments = getattr(story_model, "segments", None) if story_model else None
        if segments and len(segments) >= 2:
            p1_s = []
            p2_s = []
            p3_s = []
            for seg in segments:
                s_text = seg.narrationText if hasattr(seg, "narrationText") else seg.get("narrationText", "")
                s_role = seg.role if hasattr(seg, "role") else seg.get("role", "")
                if s_role in ["hook", "setup"]:
                    p1_s.append(s_text)
                elif s_role in ["mechanism", "escalation", "contradiction"]:
                    p2_s.append(s_text)
                else:
                    p3_s.append(s_text)
            if not p1_s:
                p1_s = [sentences[0]]
            if not p2_s:
                p2_s = [sentences[1]] if len(sentences) > 1 else p1_s
            if not p3_s:
                p3_s = [sentences[-1]]
        else:
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
            last_end = transcript[-1].get("end", 30.0)
            total_duration_sec = last_end / 1000.0 if last_end > 300 else float(last_end)
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

    def infer_scene_intent(
        self,
        pillar: Dict[str, Any],
        topic: str,
        fps: int = 60,
        story_model: Optional[Any] = None,
        visual_concept: Optional[Any] = None,
    ) -> Dict[str, Any]:
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
            elif any(k in text for k in ["drain", "task", "tab", "fatigue", "bandwidth", "accumulate", "erode"]):
                tone = "claustrophobic_pressure"
                metaphor = "accumulating_erosion"
                approach = "asymmetric_editorial"
            elif any(k in text for k in ["chamber", "world", "room", "door", "compartment", "stage", "architecture", "foundation"]):
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

        core_idea = (
            story_model.story.coreIdea
            if story_model and hasattr(story_model, "story")
            else pillar["narrationText"][:90] + ("..." if len(pillar["narrationText"]) > 90 else "")
        )
        visual_question = (
            story_model.story.viewerQuestion
            if story_model and hasattr(story_model, "story") and pillar["sceneId"] == "scene_1_hook"
            else f"What physical consequence illustrates '{core_idea[:45]}' before words finish?"
        )

        intent_res = {
            "sceneId": pillar["sceneId"],
            "startFrame": pillar["startFrame"],
            "endFrame": pillar["endFrame"],
            "durationSeconds": duration_sec,
            "narrationText": pillar["narrationText"],
            "coreIdea": core_idea,
            "emotionalTone": tone,
            "viewerReaction": f"Experience clear physical resonance with {topic}",
            "visualQuestion": visual_question,
            "dominantMetaphor": metaphor,
            "compositionApproach": approach,
        }
        if visual_concept and hasattr(visual_concept, "championCandidate"):
            intent_res["visualMechanism"] = visual_concept.primaryMechanism
            intent_res["visualConceptCandidate"] = visual_concept.championCandidate.conceptName
            intent_res["centralTransformation"] = visual_concept.centralTransformation
        return intent_res

    def evaluate_capabilities(
        self,
        intent: Dict[str, Any],
        prev_plan: Optional[Dict[str, Any]] = None,
        story_model: Optional[Any] = None,
        visual_concept: Optional[Any] = None,
        prev_background_id: Optional[str] = None,
        background_history: Optional[List[str]] = None,
        niche: str = "self_improvement",
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
            if "F_UBG" not in forced_frontiers:
                rejected.append({
                    "frontierCode": "F_UBG",
                    "reason": "Pure metric comparison requires centered minimalism and zero background texture.",
                })
            return active, rejected, {
                "level": "LOW",
                "calculatedScore": 1.0,
                "maxScoreAllowed": budget_cap,
            }

        # -------------------------------------------------------------
        # STEP 3: Metaphor & Frontier S Signal-Driven Candidate Generation
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

        # F7: Causal State Machines & Narrative Memory
        narration_lower = intent["narrationText"].lower()
        if any(w in narration_lower for w in ["task", "tab", "loop", "accumulate", "consequence", "drain", "system", "strain", "cause"]):
            candidates.add("F7")
        elif metaphor in ["compression_under_load", "brittle_rupture", "accumulating_erosion"]:
            candidates.add("F7")

        # Ingest Frontier S non-binding capability signals if present
        if story_model and hasattr(story_model, "frontierSignals"):
            sig_map = story_model.frontierSignals.signals if hasattr(story_model.frontierSignals, "signals") else story_model.frontierSignals.get("signals", {})
            if sig_map.get("F7", {}).get("signal") in ["HIGH", "VERY_HIGH"]:
                candidates.add("F7")
            if sig_map.get("F6", {}).get("signal") in ["HIGH", "VERY_HIGH"] and scene_id in ["scene_2_logic", "scene_3_solution"]:
                candidates.add("F6")
            if sig_map.get("F4", {}).get("signal") == "HIGH":
                candidates.add("F4")
            if sig_map.get("F2", {}).get("signal") in ["HIGH", "VERY_HIGH"]:
                candidates.add("F2")
            if sig_map.get("F1", {}).get("signal") == "HIGH" and scene_id != "scene_1_hook":
                candidates.add("F1")
            if sig_map.get("F5", {}).get("signal") == "HIGH":
                candidates.add("F5")

        # Ingest Visual Concept Translation required frontiers
        if visual_concept and hasattr(visual_concept, "championCandidate"):
            # The visual mechanism primarily drives scene_2_logic and applicable escalation/solution
            if scene_id == "scene_2_logic" or (scene_id == "scene_3_solution" and tone != "sudden_epiphany"):
                for req_f in visual_concept.championCandidate.requiredFrontiers:
                    if req_f != "F_BASE" and req_f not in disabled_frontiers:
                        candidates.add(req_f)

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

        # Rule 4.4: Defer heavy physical mechanisms (F4, F7) from Scene 1 Hook to Scene 2
        if scene_id == "scene_1_hook":
            for f in ["F4", "F7"]:
                if f in candidates and f not in forced_frontiers:
                    candidates.remove(f)
                    rejected.append({
                        "frontierCode": f,
                        "reason": f"{self.registry[f]['name']} deferred to Scene 2 Logic; Scene 1 Hook requires immediate presenter intimacy and hero illustration staging.",
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

            elif f_code == "F7":
                f7_components = ["CausalWorld", "CausalNode", "ThresholdReactor", "useNodeState"]
                if visual_concept and hasattr(visual_concept, "championCandidate"):
                    for mc in visual_concept.championCandidate.mappedComponents:
                        if mc not in f7_components:
                            f7_components.append(mc)
                active.append({
                    "frontierCode": "F7",
                    "capabilityConcept": "causal_state_machine_with_narrative_memory",
                    "intensity": "MEDIUM",
                    "scope": "SCENE_LEVEL",
                    "reason": "Discrete state transitions and narrative memory tracking cause-and-effect across frames.",
                    "mappedComponents": f7_components,
                })

        # -------------------------------------------------------------
        # STEP 5.5: Universal Background Intelligence (F_UBG)
        # -------------------------------------------------------------
        if "F_UBG" in disabled_frontiers:
            rejected.append({
                "frontierCode": "F_UBG",
                "reason": "Explicitly disabled by human override.",
            })
        else:
            is_cinematic_or_tense = (
                tone in ["claustrophobic_pressure", "cognitive_dissonance", "sudden_epiphany"]
                or any(k in intent["narrationText"].lower() for k in ["dark", "room", "shadow", "trap", "fail", "lose", "losing", "pressure", "environment", "willpower", "collapse", "burden"])
            )
            primary_text_color = "#ffffff" if (is_cinematic_or_tense or niche in ["finance", "health"]) else "#090d16"
            scene_role = (
                "hook" if scene_id == "scene_1_hook"
                else "mechanism" if scene_id == "scene_2_logic"
                else "resolution"
            )
            scene_tone = (
                "tense" if tone == "claustrophobic_pressure"
                else "cinematic" if is_cinematic_or_tense
                else "analytical" if tone == "analytical_clarity"
                else "reflective"
            )

            scene_ctx = SceneContext(
                scene_id=scene_id,
                role=scene_role,
                script_text=intent["narrationText"],
                emotional_tone=scene_tone,
                visual_complexity_score=1.5,
                has_presenter=(scene_id == "scene_1_hook"),
                is_diagram_heavy=False,
                is_pure_data_metric=False,
                primary_text_color=primary_text_color,
                expected_text_zone="center",
                previous_background_id=prev_background_id,
                background_usage_history=background_history or [],
            )

            bg_decision = self.background_selector.evaluate_scene(scene_ctx)

            if bg_decision.mode == "universal":
                active.append({
                    "frontierCode": "F_UBG",
                    "capabilityConcept": "universal_physical_background",
                    "intensity": "MEDIUM",
                    "scope": "SCENE_LEVEL",
                    "reason": bg_decision.reason,
                    "mappedComponents": ["UniversalBackground"],
                    "decision": asdict(bg_decision),
                })
            else:
                rejected.append({
                    "frontierCode": "F_UBG",
                    "reason": bg_decision.reason,
                    "decision": asdict(bg_decision),
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
            champion_reqs = set(visual_concept.championCandidate.requiredFrontiers) if visual_concept and hasattr(visual_concept, "championCandidate") else set()
            non_forced = [a for a in active if a["frontierCode"] not in forced_frontiers and a["frontierCode"] != "F_BASE" and a["frontierCode"] != "F_UBG"]
            # Prune non-champion frontiers first, then by lower importance
            non_forced.sort(key=lambda a: (
                1 if a["frontierCode"] in champion_reqs else 0,
                self.registry[a["frontierCode"]]["complexity_weight"] * INTENSITY_MULTIPLIERS.get(a["intensity"], 1.0)
            ))
            if non_forced:
                pruned = non_forced[0] # lowest priority candidate
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
        self,
        clip_name: str,
        topic: str,
        script: str,
        transcript: Optional[List[Dict[str, Any]]] = None,
        fps: int = 60,
        story_model: Optional[Any] = None,
    ) -> Dict[str, Any]:
        """Generate full VideoCreativePlan for all scenes."""
        if story_model is None:
            try:
                from script_intelligence import ScriptIntelligence
                intel = ScriptIntelligence()
                story_model = intel.analyze_topic_or_script(topic=topic, script=script)
            except Exception:
                story_model = None

        # Visual Concept Translation Layer
        try:
            vc_translator = VisualConceptTranslator()
            visual_concept = vc_translator.translate(topic=topic, script=script, story_model=story_model)
        except Exception:
            visual_concept = None

        pillars = self.analyze_script_pillars(script, transcript, fps, story_model=story_model)
        scene_plans = []
        total_score = 0.0

        prev_plan = None
        background_history: List[str] = []
        prev_background_id: Optional[str] = None
        for pillar in pillars:
            intent = self.infer_scene_intent(pillar, topic, fps, story_model=story_model, visual_concept=visual_concept)
            active, rejected, budget = self.evaluate_capabilities(
                intent,
                prev_plan,
                story_model=story_model,
                visual_concept=visual_concept,
                prev_background_id=prev_background_id,
                background_history=background_history,
            )
            total_score += budget["calculatedScore"]

            # Extract UBG decision and backgroundIntent
            ubg_entry = next((a for a in active if a.get("frontierCode") == "F_UBG"), None)
            if not ubg_entry:
                ubg_entry = next((r for r in rejected if r.get("frontierCode") == "F_UBG"), None)

            bg_dec = ubg_entry.get("decision") if ubg_entry else None

            if bg_dec and bg_dec.get("mode") == "universal":
                bg_intent = {
                    "mode": "universal",
                    "assetId": bg_dec["selected_asset_id"],
                    "semanticRole": bg_dec["semantic_role"],
                    "cropStrategy": bg_dec["crop_strategy"],
                    "cropFocalPoint": bg_dec["crop_focal_point"],
                    "motion": bg_dec["motion"],
                    "motionScaleDelta": bg_dec.get("motion_scale_delta", 1.04),
                    "opacity": bg_dec.get("opacity", 1.0),
                    "dimmingOverlay": bg_dec.get("dimming_overlay"),
                    "transitionIn": bg_dec.get("transition_in"),
                    "transitionOut": bg_dec.get("transition_out"),
                    "reason": bg_dec["reason"],
                }
                if bg_dec.get("selected_asset_id"):
                    background_history.append(bg_dec["selected_asset_id"])
                    prev_background_id = bg_dec["selected_asset_id"]
            else:
                bg_intent = {
                    "mode": "none",
                    "semanticRole": "clarity_canvas",
                    "cropStrategy": "center_focal",
                    "cropFocalPoint": [0.5, 0.5],
                    "motion": "static",
                    "motionScaleDelta": 1.0,
                    "opacity": 1.0,
                    "reason": bg_dec.get("reason", "Background suppressed for clean foundation canvas.") if bg_dec else "Default clean ground canvas.",
                }

            primary_visual = "Editorial Hero Card + Judy Grounded Close-up" if pillar["sceneId"] == "scene_1_hook" else (
                f"Physical {intent['dominantMetaphor'].replace('_', ' ').title()} Anchor"
            )

            plan_entry = {
                "sceneId": pillar["sceneId"],
                "intent": intent,
                "backgroundDecision": bg_dec,
                "backgroundIntent": bg_intent,
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

        plan_res = {
            "clipName": clip_name,
            "topic": topic,
            "totalFrames": total_frames,
            "fps": fps,
            "overallComplexityRating": overall_rating,
            "storyModel": story_model.to_dict() if hasattr(story_model, "to_dict") else story_model,
            "scenePlans": scene_plans,
        }
        if visual_concept:
            plan_res["visualConcept"] = visual_concept.to_dict()
        return plan_res

    def compile_motion_ast(
        self, plan: Dict[str, Any], transcript: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Compile a VideoCreativePlan into a fully valid MotionStageAST.
        Guarantees:
        - Structural schema integrity
        - SafeBounds adherence (x: 80-1000, y: 280-1340)
        - SceneBackgroundIntent representation per scene
        - Semantic roles and narrative goals preservation
        """
        clip_name = plan["clipName"]
        fps = plan.get("fps", 60)
        total_frames = plan["totalFrames"]
        scene_plans = plan["scenePlans"]
        niche = plan.get("niche", "self_improvement")

        bg_reg_path = ROOT_DIR / "public" / "assets" / "universal_backgrounds" / "registry.json"
        bg_reg = {}
        if bg_reg_path.exists():
            try:
                with open(bg_reg_path, "r", encoding="utf-8") as f:
                    bg_reg = json.load(f)
            except Exception:
                pass

        ground_color = "#030712" if (niche in ["finance", "health"]) else "#f8fafc"
        lighting_theme = "deep_atmospheric_dark" if (niche in ["finance", "health"]) else "clean_studio_radial"

        ast_scenes = []
        persistent_traces = []

        # Extract Visual Concept Translation champion candidate
        vc = plan.get("visualConcept", {})
        champ = vc.get("championCandidate", {})
        primary_mech = (vc.get("primaryMechanism") or champ.get("primaryMechanism") or "").lower()
        cause_event = vc.get("cause") or champ.get("causeEvent") or "Action triggers systemic physical reaction"
        vis_trans = vc.get("centralTransformation") or champ.get("visibleTransformation") or "State A transitions visibly into State B"
        vis_conseq = vc.get("visibleConsequence") or champ.get("visibleConsequence") or "New equilibrium established"

        for sp in scene_plans:
            sc_id = sp["sceneId"]
            intent = sp["intent"]
            s_role = "hook" if sc_id == "scene_1_hook" else "mechanism" if sc_id == "scene_2_logic" else "resolution"
            narrative_goal = intent["coreIdea"]
            if len(narrative_goal.strip()) < 10:
                narrative_goal = f"Deliver {intent['emotionalTone']} lesson: {intent['narrationText'][:60]}"

            bg_intent = sp.get("backgroundIntent") or {}
            bg_asset_id = bg_intent.get("assetId", "")
            bg_info = bg_reg.get(bg_asset_id, {})
            bg_tone = bg_info.get("tone")
            if bg_tone == "dark" or any(k in bg_asset_id.lower() for k in ["dark", "obsidian", "black", "navy", "shadow"]):
                scene_has_dark_bg = True
            elif bg_tone == "bright" or any(k in bg_asset_id.lower() for k in ["paper", "white", "bright", "light"]):
                scene_has_dark_bg = False
            else:
                scene_has_dark_bg = (niche in ["finance", "health"])

            raw_actors = []
            forces = []
            mutations = []
            causal_couplings = []

            def _format_headline(text: str, max_chars: int = 54) -> str:
                cleaned = text.split(".")[0].strip()
                if len(cleaned) <= max_chars:
                    return cleaned.upper()
                words = cleaned.split()
                chosen = []
                curr_len = 0
                for w in words:
                    if curr_len + len(w) + 1 > max_chars:
                        break
                    chosen.append(w)
                    curr_len += len(w) + 1
                return " ".join(chosen).upper() if chosen else cleaned[:max_chars].upper()

            raw_annotations = [{
                "annotationId": f"{sc_id}_headline",
                "text": _format_headline(intent["narrationText"]),
                "fontSizePx": 68,
                "color": "#ffffff" if scene_has_dark_bg else "#090d16",
            }]

            if sc_id == "scene_1_hook":
                ill_rel = f"{clip_name}/assets/scene_illustration.png"
                ill_full = ROOT_DIR / "public" / clip_name / "assets" / "scene_illustration.png"
                if not ill_full.exists():
                    alt_full = ROOT_DIR / "public" / clip_name / "scene_illustration.png"
                    if alt_full.exists():
                        ill_rel = f"{clip_name}/scene_illustration.png"
                    else:
                        p_meta = plan.get("semanticAssets", {}).get("problemCutout", {})
                        ill_rel = p_meta.get("path", "assets/psychology/tangled_confusion_chaos.png")

                raw_actors.append({
                    "id": f"{clip_name}_hero_illustration",
                    "semanticRole": "hook_curiosity_anchor",
                    "narrativeImportance": "HERO",
                    "assetPath": ill_rel,
                    "geometry": {
                        "type": "semantic_cutout",
                        "assetPath": ill_rel,
                        "widthPx": 760,
                        "heightPx": 480,
                    },
                })
            else:
                # Compile First-Class Physical Mechanism from Visual Concept
                # Prevents collapsing into empty cards / generic cutout
                trigger_f = intent["startFrame"] + min(30, max(10, round((intent["endFrame"] - intent["startFrame"]) * 0.25)))

                if any(m in primary_mech for m in ["displacement", "normalization", "threshold_crossing", "boundary"]):
                    actor_id = f"{sc_id}_standard_boundary"
                    raw_actors.append({
                        "id": actor_id,
                        "semanticRole": "the_sovereign_standard",
                        "narrativeImportance": "HERO",
                        "geometry": {
                            "type": "continuous_boundary",
                            "orientation": "horizontal",
                            "lengthPx": 840,
                            "thicknessPx": 6,
                            "initialBaselineY": 620,
                        },
                    })
                    forces.append({
                        "forceId": f"{sc_id}_concession_impulse",
                        "targetActorId": actor_id,
                        "type": "point_impulse",
                        "triggerFrame": trigger_f,
                        "durationFrames": 45,
                        "magnitude": 180.0,
                        "directionDeg": 90.0,
                        "timingCurve": "viscoelastic_relax",
                        "semanticCause": cause_event,
                    })
                    mem_trace = {
                        "traceId": f"{sc_id}_ghost_baseline",
                        "originatingActorId": actor_id,
                        "originatingSceneId": sc_id,
                        "appearance": "dashed_ghost_line",
                        "coordinates": {"y": 620, "startX": 120, "endX": 960},
                        "opacity": 0.35,
                        "persistsUntilEnd": True,
                        "semanticMeaning": "Visual memory of original uncompromised standard",
                    }
                    mutations.append({
                        "mutationId": f"{sc_id}_boundary_sag",
                        "actorId": actor_id,
                        "type": "viscoelastic_sag",
                        "triggerFrame": trigger_f,
                        "durationFrames": 45,
                        "stateBefore": "UNCOMPROMISED_TAUT",
                        "stateAfter": "DEFLECTED_SETTLED",
                        "physicalRationale": vis_trans,
                        "parameters": {"initialY": 620, "settledY": 800, "overshootPx": 45},
                        "createsMemoryTrace": mem_trace,
                    })
                    causal_couplings.append({
                        "couplingId": f"{sc_id}_impulse_coupling",
                        "sourceEvent": {"actorId": f"{sc_id}_headline", "stateChange": "IMPULSE_STRIKE", "frame": trigger_f},
                        "propagationDelayFrames": 0,
                        "targetReaction": {"actorId": actor_id, "resultingMutationId": f"{sc_id}_boundary_sag"},
                        "physicalLaw": "Compromise impulse physically recalibrates baseline standard downward",
                    })
                    persistent_traces.append(mem_trace)

                elif any(m in primary_mech for m in ["erosion", "resistance", "reinforcement", "furrow"]):
                    actor_id = f"{sc_id}_action_pathway"
                    raw_actors.append({
                        "id": actor_id,
                        "semanticRole": "neural_action_pathway",
                        "narrativeImportance": "HERO",
                        "geometry": {
                            "type": "conduit_pathway",
                            "start": [140, 800],
                            "end": [940, 800],
                            "curvature": 0,
                            "widthPx": 14,
                        },
                    })
                    forces.append({
                        "forceId": f"{sc_id}_friction_drag",
                        "targetActorId": actor_id,
                        "type": "continuous_drag",
                        "triggerFrame": trigger_f,
                        "durationFrames": 55,
                        "magnitude": 0.85,
                        "directionDeg": 0.0,
                        "timingCurve": "linear_continuous",
                        "semanticCause": cause_event,
                    })
                    mem_trace = {
                        "traceId": f"{sc_id}_worn_furrow_trace",
                        "originatingActorId": actor_id,
                        "originatingSceneId": sc_id,
                        "appearance": "worn_furrow",
                        "coordinates": {"y": 800, "startX": 140, "endX": 940, "widthPx": 14},
                        "opacity": 0.45,
                        "persistsUntilEnd": True,
                        "semanticMeaning": "Etched furrow permanently stamped into terrain",
                    }
                    mutations.append({
                        "mutationId": f"{sc_id}_groove_wear",
                        "actorId": actor_id,
                        "type": "groove_wear",
                        "triggerFrame": trigger_f,
                        "durationFrames": 55,
                        "stateBefore": "HIGH_FRICTION_UNTOUCHED",
                        "stateAfter": "LOW_FRICTION_CARVED",
                        "physicalRationale": vis_trans,
                        "parameters": {"initialWidthPx": 4, "carvedWidthPx": 14, "frictionDelta": -0.5},
                        "createsMemoryTrace": mem_trace,
                    })
                    causal_couplings.append({
                        "couplingId": f"{sc_id}_furrow_coupling",
                        "sourceEvent": {"actorId": actor_id, "stateChange": "PASS1_COMPLETE", "frame": trigger_f + 55},
                        "propagationDelayFrames": 15,
                        "targetReaction": {"actorId": actor_id, "resultingMutationId": f"{sc_id}_groove_wear"},
                        "physicalLaw": "First traversal erodes path, enabling frictionless glide for subsequent repetition",
                    })
                    persistent_traces.append(mem_trace)

                elif any(m in primary_mech for m in ["deformation", "fragmentation", "compression", "rupture", "fracture"]):
                    actor_id = f"{sc_id}_bedrock_foundation"
                    raw_actors.append({
                        "id": actor_id,
                        "semanticRole": "structural_bedrock",
                        "narrativeImportance": "HERO",
                        "geometry": {
                            "type": "monolithic_foundation",
                            "widthPx": 840,
                            "heightPx": 420,
                        },
                    })
                    forces.append({
                        "forceId": f"{sc_id}_compressive_load",
                        "targetActorId": actor_id,
                        "type": "compressive_load",
                        "triggerFrame": trigger_f,
                        "durationFrames": 45,
                        "magnitude": 1.0,
                        "directionDeg": 90.0,
                        "timingCurve": "spring_heavy",
                        "semanticCause": cause_event,
                    })
                    cleave_f = trigger_f + 40
                    mem_trace = {
                        "traceId": f"{sc_id}_fracture_chasm_trace",
                        "originatingActorId": actor_id,
                        "originatingSceneId": sc_id,
                        "appearance": "fracture_chasm",
                        "coordinates": {"widthPx": 840, "heightPx": 420},
                        "opacity": 0.5,
                        "persistsUntilEnd": True,
                        "semanticMeaning": "Permanent structural fracture chasm",
                    }
                    mutations.append({
                        "mutationId": f"{sc_id}_brittle_cleavage",
                        "actorId": actor_id,
                        "type": "brittle_cleavage",
                        "triggerFrame": cleave_f,
                        "durationFrames": 15,
                        "stateBefore": "PRISTINE_EQUILIBRIUM",
                        "stateAfter": "CATASTROPHIC_FRACTURE",
                        "physicalRationale": vis_trans,
                        "parameters": {"shatterFrame": cleave_f, "crackCount": 8},
                        "createsMemoryTrace": mem_trace,
                    })
                    causal_couplings.append({
                        "couplingId": f"{sc_id}_rupture_coupling",
                        "sourceEvent": {"actorId": actor_id, "stateChange": "LOAD_EXCEEDED", "frame": cleave_f},
                        "propagationDelayFrames": 0,
                        "targetReaction": {"actorId": actor_id, "resultingMutationId": f"{sc_id}_brittle_cleavage"},
                        "physicalLaw": "Load beyond yield point triggers immediate brittle rupture",
                    })
                    persistent_traces.append(mem_trace)

                else:
                    # Equilibrium Fulcrum Beam / Balance Physics
                    actor_id = f"{sc_id}_fulcrum_beam"
                    raw_actors.append({
                        "id": actor_id,
                        "semanticRole": "systemic_equilibrium_beam",
                        "narrativeImportance": "HERO",
                        "geometry": {
                            "type": "fulcrum_beam",
                            "lengthPx": 820,
                            "thicknessPx": 12,
                        },
                    })
                    forces.append({
                        "forceId": f"{sc_id}_mass_torque",
                        "targetActorId": actor_id,
                        "type": "torque_moment",
                        "triggerFrame": trigger_f,
                        "durationFrames": 35,
                        "magnitude": 14.0,
                        "directionDeg": 45.0,
                        "timingCurve": "spring_snappy",
                        "semanticCause": cause_event,
                    })
                    mutations.append({
                        "mutationId": f"{sc_id}_torque_tilt",
                        "actorId": actor_id,
                        "type": "torque_tilt",
                        "triggerFrame": trigger_f,
                        "durationFrames": 35,
                        "stateBefore": "BALANCED_HORIZONTAL",
                        "stateAfter": "DEFLECTED_TILT",
                        "physicalRationale": "Torque moment causes beam to tilt and settle into dynamic angle",
                        "parameters": {"angleDeg": 14},
                    })
                    causal_couplings.append({
                        "couplingId": f"{sc_id}_torque_coupling",
                        "sourceEvent": {"actorId": f"{sc_id}_headline", "stateChange": "DEMAND_APPLIED", "frame": trigger_f},
                        "propagationDelayFrames": 0,
                        "targetReaction": {"actorId": actor_id, "resultingMutationId": f"{sc_id}_torque_tilt"},
                        "physicalLaw": "Load arrival tilts systemic fulcrum balance",
                    })

            resolved_bounds, comp_metrics = GeometryResolver.resolve_scene_layout(
                scene_id=sc_id,
                role=s_role,
                dominant_metaphor=intent.get("dominantMetaphor", "spatial_friction"),
                actors_data=raw_actors,
                annotations_data=raw_annotations,
                has_presenter=(sc_id == "scene_1_hook"),
            )

            actors = []
            for rb in resolved_bounds:
                if rb.id.endswith("_headline") or rb.id.endswith("_consequence_label"):
                    continue
                if rb.id.endswith("_presenter_host"):
                    # Presenter host is mounted natively by Presenter.tsx (GlossyJudyIntro)
                    continue
                matched_raw = next((ra for ra in raw_actors if ra["id"] == rb.id), None)
                geom = matched_raw.get("geometry") if matched_raw else None
                if not geom:
                    asset_path = (
                        matched_raw.get("assetPath", "assets/psychology/hyperrealistic_3d_glowing_brain.png")
                        if matched_raw
                        else "assets/psychology/hyperrealistic_3d_glowing_brain.png"
                    )
                    geom = {
                        "type": "semantic_cutout",
                        "assetPath": asset_path,
                        "widthPx": int(rb.width),
                        "heightPx": int(rb.height),
                    }
                actors.append({
                    "id": rb.id,
                    "semanticRole": rb.semantic_role,
                    "narrativeImportance": "HERO" if rb.importance in ["HERO", "CRITICAL"] else "SECONDARY",
                    "geometry": geom,
                    "visualStyle": {
                        "strokeColor": "#ffffff" if scene_has_dark_bg else "#090d16",
                        "opacity": 1.0,
                    },
                    "resolvedLayout": {
                        "x": int(rb.x),
                        "y": int(rb.y),
                        "width": int(rb.width),
                        "height": int(rb.height),
                        "originAnchor": "center",
                        "semanticPlacement": "dominant_center",
                    },
                    "zIndex": 10,
                    "isPersistent": False,
                })

            annotations = []
            for rb in resolved_bounds:
                if rb.id.endswith("_headline"):
                    annotations.append({
                        "annotationId": rb.id,
                        "text": rb.text_content or _format_headline(intent["narrationText"]),
                        "font": "Montserrat Black",
                        "fontSizePx": int(rb.font_size_px or 68),
                        "color": "#ffffff" if scene_has_dark_bg else "#090d16",
                        "role": "hook_slam" if sc_id == "scene_1_hook" else "thesis_statement",
                        "staticPlacement": {
                            "x": int(rb.x),
                            "y": int(rb.y),
                        },
                        "startFrame": intent["startFrame"],
                        "durationFrames": intent["endFrame"] - intent["startFrame"],
                        "inAnimation": "scale_pop",
                    })
                elif rb.id.endswith("_consequence_label"):
                    annotations.append({
                        "annotationId": rb.id,
                        "text": vis_conseq.upper()[:45],
                        "font": "JetBrains Mono Bold",
                        "fontSizePx": 38,
                        "color": "#ffffff" if scene_has_dark_bg else "#090d16",
                        "role": "action_verb",
                        "staticPlacement": {
                            "x": int(rb.x),
                            "y": int(rb.y),
                        },
                        "startFrame": intent["startFrame"] + 35,
                        "durationFrames": intent["endFrame"] - (intent["startFrame"] + 35),
                        "inAnimation": "fade_down",
                    })

            ast_scenes.append({
                "sceneId": sc_id,
                "role": s_role,
                "startFrame": intent["startFrame"],
                "endFrame": intent["endFrame"],
                "narrativeGoal": narrative_goal,
                "backgroundIntent": bg_intent,
                "actors": actors,
                "forces": forces,
                "mutations": mutations,
                "causalCouplings": causal_couplings,
                "annotations": annotations,
                "compositionMetrics": {
                    "occupiedWidthPct": comp_metrics.occupied_width_pct,
                    "occupiedHeightPct": comp_metrics.occupied_height_pct,
                    "occupiedAreaPct": comp_metrics.occupied_area_pct,
                    "bottomDeadZonePx": comp_metrics.bottom_dead_zone_px,
                    "semanticDensityScore": comp_metrics.semantic_density_score,
                    "densityStatus": comp_metrics.density_status,
                },
            })

        default_bg_intent = scene_plans[0].get("backgroundIntent") if scene_plans else None

        motion_ast = {
            "version": "1.0.0",
            "clipId": clip_name,
            "fps": fps,
            "totalFrames": total_frames,
            "environment": {
                "groundColor": ground_color,
                "lightingTheme": lighting_theme,
                "gridTexture": not (niche in ["finance", "health"]),
                "safeBounds": {
                    "top": 280,
                    "bottom": 1340,
                    "left": 80,
                    "right": 1000,
                },
                "defaultBackgroundIntent": default_bg_intent,
            },
            "persistentWorldMemory": persistent_traces,
            "scenes": ast_scenes,
        }

        val_result = validate_motion_ast(motion_ast)
        if not val_result.is_valid:
            err_msgs = [f"[{e.code}] {e.path}: {e.message}" for e in val_result.errors]
            raise ValueError(f"Compiled MotionStageAST failed semantic validation:\n" + "\n".join(err_msgs))

        return motion_ast

    def format_plan_summary(self, plan: Dict[str, Any]) -> str:
        """Format the creative plan into a crisp, readable executive markdown summary."""
        lines = []
        lines.append(f"# 🎬 Frontier #0 Creative Plan: {plan['clipName']}")
        lines.append(f"**Topic**: \"{plan['topic']}\" | **Rating**: `{plan['overallComplexityRating']}` | **Frames**: {plan['totalFrames']} (60 FPS)\n")

        if "visualConcept" in plan:
            vc = plan["visualConcept"]
            champ = vc.get("championCandidate", {})
            lines.append(f"### 💡 Visual Concept Translation: **{champ.get('conceptName', 'Primary Concept')}**")
            lines.append(f"- **Primary Mechanism**: `{vc.get('primaryMechanism', '').upper()}` ({champ.get('metaphorLevel', '')})")
            lines.append(f"- **Central Transformation**: *{vc.get('centralTransformation', '')}*")
            lines.append(f"- **Cause → Consequence**: *{vc.get('cause', '')}* ➔ *{vc.get('visibleConsequence', '')}*")
            lines.append(f"- **Persistent State**: *{vc.get('persistentState', '')}*\n")

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
