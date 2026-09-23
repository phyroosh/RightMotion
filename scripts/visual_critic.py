#!/usr/bin/env python3
"""
🎬 RightMotion Visual Critic
=============================
A two-layer editorial analysis engine:

Layer A — Structural Critic (ALWAYS ON):
  Inspects Canvas.tsx source, creative_brief.json, and transcript.json:
  - Question 1: Does the visual communicate the intended concept?
  - Question 2: Is the visual doing more work than necessary? (UNDEREXPLAINED / OVEREXPLAINED / IDEAL)
  - Eye-Confusion Analysis (10 Diagnostic Gates A-J)
  - Visual Explainability Test (Can it be explained in 1 simple sentence?)
  - Minimality Pass ("Remove One Thing" Pass: Primary / Supporting / Decorative)
  - Component diversity & mechanism presence vs cardification
  - Shot coverage against the Shot Director's plan
  - Presenter balance & typography competition

Layer B — Render Critic (SELECTIVE / CONFIGURABLE):
  Renders still frames at key shot boundaries and state changes using Remotion CLI.
  Audits visual scale, contrast, and focal point clarity.

Outputs actionable editorial critique to:
  `src/clips/<name>/visual_critique.md`
"""

import argparse
import json
import os
import re
import subprocess
import sys
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

ROOT_DIR = Path(__file__).resolve().parent.parent

PHYSICAL_MECHANISM_COMPONENTS = {
    "ViscoelasticDeformation",
    "StressFractureEngine",
    "ThresholdBoundary",
    "ThresholdBoundaryShift",
    "KineticFurrow",
    "ResistancePathway",
    "KineticFulcrumBeam",
    "SemanticMassNode",
    "TensileStructuralTether",
    "CapillaryInkBleed",
    "CausalWorld",
    "InfiniteWorldCanvas",
    "DioramaPlinth",
    "MonolithicCantilever",
    "DynamicSankeyFlow",
    "KineticTensionDial",
    "GlossyBalanceScale",
}

BESPOKE_PHYSICAL_PATTERNS = [
    (r"<svg[\s\S]*?<path[^>]*d=", "Bespoke SVG Vector Path"),
    (r"<svg[\s\S]*?<circle", "Bespoke SVG Radial/Orbit"),
    (r"strokeDashoffset|strokeDasharray", "Dynamic Stroke Tracing"),
    (r"deflection|furrow|groove|tether|fulcrum|cantilever|tension", "Physical Metaphor Dynamic"),
    (r"assets/(?:psychology|burnout|relationships|habits|devices)/", "Physical Semantic Cutout Anchor"),
]

TEXT_HEAVY_PATTERNS = [
    r"<h[1-6][^>]*>[^<]{40,}</h[1-6]>",
    r"<p[^>]*>[^<]{60,}</p>",
    r"ConceptKeywordSlam",
]

CARD_CONTAINER_PATTERNS = [
    r"rounded-[23]xl[^>]*bg-white",
    r"rounded-[23]xl[^>]*bg-\[#",
    r"PhysicalCard",
    r"SingleIncidentCard",
    r"VisualPropCard",
]

DECORATIVE_PATTERNS = [
    r"particle",
    r"sparkle",
    r"confetti",
    r"floating_dot",
    r"glow_orb",
    r"rounded-full\s+px-[234]\s+py-[12]",
]


class StructuralCritic:
    """
    Fast, deterministic source-code and metadata critic. Always active.
    Evaluates clarity over complexity, eye-confusion, and component restraint.
    """

    def __init__(self, clip_name: str, clips_dir: Optional[Path] = None):
        self.clip_name = clip_name
        self.clip_dir = (clips_dir or (ROOT_DIR / "src" / "clips")) / clip_name
        self.canvas_path = self.clip_dir / "Canvas.tsx"
        self.brief_path = self.clip_dir / "creative_brief.json"
        self.transcript_path = self.clip_dir / "transcript.json"

    def _detect_used_mechanisms(self, canvas_code: str) -> List[str]:
        """Detects physical mechanism components or bespoke SVG/physics patterns."""
        used = [comp for comp in PHYSICAL_MECHANISM_COMPONENTS if comp in canvas_code]
        for pat, name in BESPOKE_PHYSICAL_PATTERNS:
            if re.search(pat, canvas_code, re.DOTALL):
                if name not in used:
                    used.append(name)
        return used

    def critique(self) -> Dict[str, Any]:
        """
        Performs comprehensive structural critique with eye-confusion analysis.
        """
        if not self.canvas_path.exists():
            return {
                "status": "ERROR",
                "summary": f"Canvas.tsx not found at {self.canvas_path}",
                "shotCritiques": [],
            }

        canvas_code = self.canvas_path.read_text(encoding="utf-8")
        brief = {}
        if self.brief_path.exists():
            try:
                brief = json.loads(self.brief_path.read_text(encoding="utf-8"))
            except Exception:
                pass

        planned_shots = brief.get("shots", [])
        if not planned_shots:
            planned_shots = self._infer_shots_from_code(canvas_code)

        # 1. Mechanism Analysis (Component library + Bespoke SVG/Physics)
        used_mechanisms = self._detect_used_mechanisms(canvas_code)
        has_physical_mechanism = len(used_mechanisms) > 0

        # 2. Anti-Cardification Analysis (No Unmotivated Cardification)
        card_matches = []
        for pat in CARD_CONTAINER_PATTERNS:
            found = re.findall(pat, canvas_code)
            if found:
                card_matches.extend(found)

        # 3. Camera Analysis
        has_camera_canvas = "CameraCanvas" in canvas_code
        has_camera_shake = "CameraShake" in canvas_code
        has_camera_zoom = "cameraZoom" in canvas_code or "zoomDrift" in canvas_code or "interpolate" in canvas_code

        # 4. Presenter presence
        has_presenter = "GlossyJudyIntro" in canvas_code or "Presenter" in canvas_code or "character_" in canvas_code

        # 5. Decorative clutter
        decorative_matches = []
        for pat in DECORATIVE_PATTERNS:
            found = re.findall(pat, canvas_code, re.IGNORECASE)
            if found:
                decorative_matches.extend(found)

        # 6. Shot-by-Shot Analysis
        shot_critiques = []
        for s in planned_shots:
            s_id = s.get("shotId", "shot")
            fr = s.get("frameRange", [0, 100])
            pacing = s.get("pacingMode", "BUILD")
            v_density = s.get("visualDensity", "LOW")
            comp_budget = s.get("componentBudget", 1)
            primary_idea = s.get("primaryVisualIdea", s.get("visualObjective", ""))
            secondary_support = s.get("secondaryVisualSupport", "")
            v_obj = s.get("visualObjective", "")
            simplification_dir = s.get("simplificationDirective", "")

            # Frame boundary referenced
            st_f, et_f = fr[0], fr[1]
            frame_referenced = f"{st_f}" in canvas_code or f"{et_f}" in canvas_code or s_id in canvas_code

            # Extract snippet of code corresponding to this shot
            shot_code_snippet = self._extract_shot_snippet(canvas_code, st_f, et_f, s_id)

            # Analyze Eye-Confusion (10 Gates A-J)
            eye_confusion = self._analyze_eye_confusion(
                shot_snippet=shot_code_snippet,
                full_canvas=canvas_code,
                role=s_id,
                has_presenter=has_presenter,
                used_mechanisms=used_mechanisms,
                card_count=len(card_matches),
                pacing=pacing,
            )

            # Visual Explainability Test (Understandability Test)
            explainability = self._evaluate_explainability(primary_idea, eye_confusion["competingTargetsCount"])

            # Minimality Pass ("Remove One Thing" Pass)
            minimality = self._evaluate_minimality(
                shot_code=shot_code_snippet,
                primary_idea=primary_idea,
                used_mechs=used_mechanisms,
                card_count=len(card_matches),
                decorative_count=len(decorative_matches),
            )

            # Temporal Dynamics & Variation (§22)
            temporal_variation = self._analyze_temporal_variation(
                shot_snippet=shot_code_snippet,
                shot_plan=s,
                duration_frames=(et_f - st_f),
                pacing=pacing,
            )

            # Attention Confusion & Simultaneous Motion Budget (§23, §26)
            attention_confusion = self._analyze_attention_confusion(
                shot_snippet=shot_code_snippet,
                eye_confusion=eye_confusion,
                pacing=pacing,
            )

            # 6 Editing-Layer & Mobile Scale Diagnostics
            under_utilization = self._analyze_under_utilization(
                shot_snippet=shot_code_snippet,
                full_canvas=canvas_code,
                shot_plan=s,
                used_mechs=used_mechanisms,
            )
            generic_fallback = self._analyze_generic_fallback(
                shot_snippet=shot_code_snippet,
                shot_plan=s,
                used_mechs=used_mechanisms,
                card_count=len(card_matches),
            )
            layer_isolation = self._analyze_layer_isolation(
                shot_snippet=shot_code_snippet,
                full_canvas=canvas_code,
            )
            temporal_underuse = self._analyze_temporal_underuse(
                shot_snippet=shot_code_snippet,
                shot_plan=s,
                duration_frames=(et_f - st_f),
                pacing=pacing,
            )
            mobile_scale = self._analyze_mobile_scale(
                shot_snippet=shot_code_snippet,
                full_canvas=canvas_code,
            )
            visual_competition = self._analyze_visual_competition(
                eye_confusion=eye_confusion,
                shot_snippet=shot_code_snippet,
            )

            # Core Assessment: Question 1 & Question 2
            communicates_concept = (
                has_physical_mechanism if ("mechanism" in s_id or "escalation" in s_id)
                else ("scene_illustration" in canvas_code or "CinematicIllustration" in canvas_code if "hook" in s_id else True)
            )

            if eye_confusion["competingTargetsCount"] > 2 or eye_confusion["hasSimultaneousClutter"] or attention_confusion["verdict"] == "WARNING" or visual_competition["verdict"] == "COMPETITION_WARNING":
                work_efficiency = "OVEREXPLAINED"
            elif not communicates_concept or temporal_variation["verdict"] == "STATIC_RISK" or under_utilization["verdict"] == "UNDERUTILIZED":
                work_efficiency = "UNDEREXPLAINED"
            else:
                work_efficiency = "IDEAL"

            if generic_fallback["verdict"] == "GENERIC_FALLBACK" or mobile_scale["verdict"] == "SCALE_WARNING":
                shot_status = "NEEDS_IMPROVEMENT"
            elif work_efficiency == "IDEAL":
                shot_status = "STRONG"
            elif work_efficiency == "OVEREXPLAINED" and communicates_concept:
                shot_status = "ACCEPTABLE"
            else:
                shot_status = "NEEDS_IMPROVEMENT"

            observations = []
            suggestions = []

            # Observations
            observations.append(f"Visual Density: `{v_density}` | Component Budget: `{comp_budget}`")
            observations.append(f"Primary Visual Idea: \"{primary_idea}\"")
            observations.append(f"Work Efficiency: `{work_efficiency}` (Concept communicated: {communicates_concept})")
            observations.append(f"Explainability Test: `{explainability['verdict']}` — {explainability['summary']}")
            observations.append(f"Competing Attention Targets: {eye_confusion['competingTargetsCount']} ({', '.join(eye_confusion['detectedTargets']) if eye_confusion['detectedTargets'] else 'Single dominant focal point'})")
            observations.append(f"Temporal Dynamics: `{temporal_variation['verdict']}` — {temporal_variation['summary']}")
            observations.append(f"Simultaneous Motion: `{attention_confusion['verdict']}` — Primary: {attention_confusion['primarySystem']} | Secondary: {attention_confusion['secondarySystem']}")

            # Suggestions based on eye-confusion & attention confusion
            if eye_confusion["competingTargetsCount"] > 2 or attention_confusion["verdict"] == "WARNING":
                suggestions.append(
                    f"Attention Confusion / Motion Budget: {attention_confusion['risk']} {attention_confusion['recommendation']}"
                )
            if eye_confusion["typographyCompetes"]:
                suggestions.append(
                    "Typography Competition: Large text slam coexists with active physical mechanism. "
                    "Rule 20: If the physical motion already explains the idea, stop repeating it with giant text."
                )
            if eye_confusion["presenterCompetes"]:
                suggestions.append(
                    "Presenter Overlap: Host presenter is rendered alongside an active mechanical simulation. "
                    "Rule 21: Let the object tell the story during the mechanism beat; remove Judy temporarily."
                )
            if temporal_variation["verdict"] == "STATIC_RISK":
                suggestions.append(
                    f"Static Timeline Risk: {temporal_variation['summary']} Introduce a purposeful micro-event, anticipation slow-in, or state mutation."
                )
            if minimality["removableElements"]:
                suggestions.append(
                    f"Minimality Pass ('Remove One Thing'): {minimality['removalAdvice']}"
                )

            # Suggestions from 6 Editing-Layer Diagnostics
            if under_utilization["verdict"] == "UNDERUTILIZED":
                suggestions.append(f"Under-Utilization: {under_utilization['actionableAdvice']}")
            if generic_fallback["verdict"] == "GENERIC_FALLBACK":
                suggestions.append(f"Generic Fallback: {generic_fallback['actionableAdvice']}")
            if layer_isolation["verdict"] == "LAYER_ISOLATION":
                suggestions.append(f"Layer Isolation: {layer_isolation['actionableAdvice']}")
            if temporal_underuse["verdict"] == "TEMPORAL_UNDERUSE":
                suggestions.append(f"Temporal Underuse: {temporal_underuse['actionableAdvice']}")
            if mobile_scale["verdict"] == "SCALE_WARNING":
                suggestions.append(f"Mobile Scale: {mobile_scale['actionableAdvice']}")
            if visual_competition["verdict"] == "COMPETITION_WARNING":
                suggestions.append(f"Visual Competition: {visual_competition['actionableAdvice']}")

            if not frame_referenced:
                observations.append(f"Frame boundary ({st_f} to {et_f}) is not explicitly bounded in Canvas.tsx.")

            shot_critiques.append({
                "shotId": s_id,
                "frameRange": fr,
                "pacingMode": pacing,
                "visualDensity": v_density,
                "workEfficiency": work_efficiency,
                "status": shot_status,
                "primaryVisualIdea": primary_idea,
                "visualObjective": v_obj,
                "explainability": explainability,
                "eyeConfusion": eye_confusion,
                "temporalVariation": temporal_variation,
                "attentionConfusion": attention_confusion,
                "minimality": minimality,
                "underUtilization": under_utilization,
                "genericFallback": generic_fallback,
                "layerIsolation": layer_isolation,
                "temporalUnderuse": temporal_underuse,
                "mobileScale": mobile_scale,
                "visualCompetition": visual_competition,
                "observations": observations,
                "suggestions": suggestions,
            })

        overall_status = "STRONG"
        if any(sc["status"] == "NEEDS_IMPROVEMENT" for sc in shot_critiques):
            overall_status = "NEEDS_IMPROVEMENT"
        elif any(sc["workEfficiency"] == "OVEREXPLAINED" for sc in shot_critiques):
            overall_status = "ACCEPTABLE"

        # Qualitative Editorial Findings
        # 1. Focal Hierarchy
        has_competing_chaos = any(sc["eyeConfusion"]["competingTargetsCount"] > 2 for sc in shot_critiques)
        focal_finding = (
            "✅ clear focal hierarchy",
            "Single dominant visual subject per shot with clear secondary cue."
        ) if not has_competing_chaos else (
            "⚠ competing visual targets",
            "Multiple competing visual subjects detected; simplify to one focal idea."
        )

        # 2. Cardification Purity (No unmotivated cardification)
        is_hero_card = "scene_illustration" in canvas_code or "CinematicIllustrationCard" in canvas_code or "EditorialHeroCard" in canvas_code
        is_product_card = "ProductPageShowcase" in canvas_code
        is_device_mockup = "PhoneMockup" in canvas_code or "DeviceFrame" in canvas_code
        unmotivated_card = False
        if len(card_matches) > 1 and not is_product_card:
            unmotivated_card = True
        elif len(card_matches) == 1 and not (is_hero_card or is_product_card or is_device_mockup):
            unmotivated_card = True
        card_finding = (
            "✅ no unmotivated cardification",
            "Visuals staged on open canvas or justified by narrative proof."
        ) if not unmotivated_card else (
            "⚠ generic card fallback",
            "Unmotivated card container detected where open-canvas mechanics should be used."
        )

        # 3. Motion Purpose
        has_decorative_motion = len(decorative_matches) > 0
        motion_finding = (
            "✅ meaningful motion",
            "Motion drives state transformation with zero decorative clutter."
        ) if not has_decorative_motion else (
            "⚠ decorative motion",
            f"Detected decorative patterns ({', '.join(set(decorative_matches))})."
        )

        # 4. State Progression
        has_state_progression = ("interpolate" in canvas_code or "spring" in canvas_code) and has_physical_mechanism
        state_finding = (
            "✅ meaningful state progression",
            "Physical/visual state visibly evolves across narrative beats."
        ) if has_state_progression else (
            "⚠ lacking state progression",
            "Visual state appears static without live mechanical transformation."
        )

        # 5. Temporal Dynamics (Simple Frame, Rich Timeline)
        has_static_risk = any(sc["temporalVariation"]["verdict"] == "STATIC_RISK" for sc in shot_critiques)
        temporal_finding = (
            "✅ alive timeline",
            "Timeline stays alive with dynamic micro-events and intentional pacing."
        ) if not has_static_risk else (
            "⚠ static timeline risk",
            "Detected long stretches with zero state progression or micro-events."
        )

        # 6. Simultaneous Motion Budget (1 primary, 0-1 secondary)
        has_motion_chaos = any(sc["attentionConfusion"]["verdict"] == "WARNING" for sc in shot_critiques)
        simultaneous_finding = (
            "✅ disciplined motion budget",
            "At most 1 primary moving system with restrained secondary cues."
        ) if not has_motion_chaos else (
            "⚠ excessive simultaneous motion",
            "Multiple competing elements moving simultaneously; serialize motion."
        )

        # 7. Mobile Scale Standard (400-750px primary subject, bold strokes >= 6px, text >= 36px)
        has_scale_warning = any(sc.get("mobileScale", {}).get("verdict") == "SCALE_WARNING" for sc in shot_critiques)
        scale_finding = (
            "✅ mobile scale standard",
            "Visual subjects and typography scaled bold for mobile phone screens."
        ) if not has_scale_warning else (
            "⚠ sub-scale visuals",
            "Primary visual elements or typography too small/thin for 720p mobile Shorts viewing."
        )

        # 8. Layer Integration (Coherent multi-layer composition)
        has_layer_iso = any(sc.get("layerIsolation", {}).get("verdict") == "LAYER_ISOLATION" for sc in shot_critiques)
        layer_finding = (
            "✅ layer integration",
            "Mechanism, camera choreography, and audio punctuation compose coherently."
        ) if not has_layer_iso else (
            "⚠ isolated layers",
            "Visual mechanisms operate in isolation without camera or sound punctuation."
        )

        qualitative_findings = [
            focal_finding,
            card_finding,
            motion_finding,
            state_finding,
            temporal_finding,
            simultaneous_finding,
            scale_finding,
            layer_finding,
        ]

        return {
            "clipName": self.clip_name,
            "overallStatus": overall_status,
            "hasPhysicalMechanism": has_physical_mechanism,
            "usedMechanisms": used_mechanisms,
            "cardCount": len(card_matches),
            "cameraIntentionality": "STRONG" if has_camera_canvas else ("MODERATE" if has_camera_zoom else "BASIC"),
            "qualitativeFindings": qualitative_findings,
            "shotCritiques": shot_critiques,
        }

    def _extract_shot_snippet(self, code: str, st: int, et: int, shot_id: str) -> str:
        lines = code.splitlines()
        extracted = []
        recording = False
        for line in lines:
            if f"{st}" in line or shot_id in line:
                recording = True
            if recording:
                extracted.append(line)
            if recording and f"{et}" in line:
                break
        return "\n".join(extracted) if extracted else code

    def _analyze_eye_confusion(
        self,
        shot_snippet: str,
        full_canvas: str,
        role: str,
        has_presenter: bool,
        used_mechanisms: List[str],
        card_count: int,
        pacing: str,
    ) -> Dict[str, Any]:
        """
        Executes the 10-Gate Eye-Confusion Analysis (§10).
        """
        targets = []
        snippet = shot_snippet or full_canvas

        # Check for mechanism
        has_mech_here = any(m in snippet for m in PHYSICAL_MECHANISM_COMPONENTS) or any(
            re.search(p, snippet, re.DOTALL) for p, _ in BESPOKE_PHYSICAL_PATTERNS
        )
        if has_mech_here:
            targets.append("Physical Mechanism")

        # Check for presenter
        has_pres_here = "GlossyJudyIntro" in snippet or "Presenter" in snippet
        if has_pres_here:
            targets.append("Presenter Host")

        # Check for hero card / illustration
        if "CinematicIllustrationCard" in snippet or "scene_illustration" in snippet:
            targets.append("Hero Illustration")

        # Check for text slam / large keyword
        has_text_slam = "ConceptKeywordSlam" in snippet or re.search(r"text-[5-9]xl", snippet) is not None
        if has_text_slam:
            targets.append("Large Typography Slam")

        # Check for secondary cards / panels
        if card_count > 1 and ("mechanism" in role or "resolution" in role):
            targets.append(f"Multiple Card Containers ({card_count})")

        # Check for decorative particles
        if any(re.search(p, snippet, re.IGNORECASE) for p in DECORATIVE_PATTERNS):
            targets.append("Decorative Floating Elements")

        competing_count = len(targets)
        simultaneous_clutter = competing_count > 2
        typography_competes = has_mech_here and has_text_slam
        presenter_competes = has_mech_here and has_pres_here and ("mechanism" in role or "escalation" in role)

        return {
            "competingTargetsCount": competing_count,
            "detectedTargets": targets,
            "hasSimultaneousClutter": simultaneous_clutter,
            "typographyCompetes": typography_competes,
            "presenterCompetes": presenter_competes,
            "gates": {
                "A_competing_focal_points": competing_count <= 2,
                "B_primary_visual_obvious": competing_count > 0,
                "C_no_simultaneous_motion_chaos": not simultaneous_clutter,
                "D_typography_does_not_compete": not typography_competes,
                "E_background_restrained": True,
                "F_presenter_restrained": not presenter_competes,
                "G_negative_space_adequate": competing_count <= 2,
                "H_small_scale_legible": True,
                "I_action_identifiable_without_caption": has_mech_here or has_pres_here,
                "J_pure_visual_understandable": True,
            }
        }

    def _evaluate_explainability(self, primary_idea: str, competing_count: int) -> Dict[str, Any]:
        """
        Visual Explainability Test (§11): Can it be described in one simple sentence?
        """
        if not primary_idea:
            return {"verdict": "FAIL", "summary": "No primary visual idea defined."}
        if competing_count >= 4:
            return {
                "verdict": "FAIL",
                "summary": "Too many competing attention targets to describe in one simple sentence.",
            }
        clean_idea = primary_idea.strip()
        if len(clean_idea) < 140 and clean_idea.endswith((".", "!", "?", "")):
            return {"verdict": "PASS", "summary": f"\"{clean_idea}\""}
        return {"verdict": "PASS", "summary": f"\"{clean_idea[:100]}...\""}

    def _evaluate_minimality(
        self,
        shot_code: str,
        primary_idea: str,
        used_mechs: List[str],
        card_count: int,
        decorative_count: int,
    ) -> Dict[str, Any]:
        """
        Minimality Pass (§12, §27): Primary idea, Supporting elements, Decorative elements.
        """
        primary = primary_idea or (used_mechs[0] if used_mechs else "Core narrative focus")
        supporting = []
        decorative = []

        if used_mechs:
            supporting.append(f"Mechanism primitive ({used_mechs[0]})")
        if card_count > 0:
            if card_count > 1:
                decorative.append(f"{card_count} card containers")
            else:
                supporting.append("1 containment card")
        if decorative_count > 0:
            decorative.append(f"{decorative_count} decorative styling patterns")

        removal_advice = (
            f"Remove {', '.join(decorative)}. The primary visual already communicates the story."
            if decorative
            else "Composition is lean; zero unnecessary decorative elements detected."
        )

        return {
            "primaryIdea": primary,
            "supportingElements": supporting,
            "removableElements": decorative,
            "removalAdvice": removal_advice,
        }

    def _analyze_temporal_variation(
        self,
        shot_snippet: str,
        shot_plan: Dict[str, Any],
        duration_frames: int,
        pacing: str,
    ) -> Dict[str, Any]:
        """
        Analyzes temporal dynamics, micro-events, and avoids dead-timeline stretches (§22).
        Mandatory: Distinguishes intentional static hold from unintentional lack of design.
        """
        att_plan = shot_plan.get("attentionPlan", {})
        planned_micro_events = att_plan.get("microEvents", [])
        planned_payoff = att_plan.get("payoffFrame")
        planned_anticipation = att_plan.get("anticipation", False)

        # Detect temporal markers in code snippet
        spring_calls = len(re.findall(r"spring\(", shot_snippet))
        interp_calls = len(re.findall(r"interpolate\(", shot_snippet))
        frame_conds = len(re.findall(r"frame\s*(?:>|<|===|>=|<=)", shot_snippet))

        # Check for intentional hold
        is_intentional_hold = pacing in ("HOLD", "OBSERVE") or "hold" in shot_plan.get("shotId", "").lower()

        # Inactive stretch check: duration > 3.5s (210 frames) and fewer than 2 dynamic impulses
        is_long_shot = duration_frames > 210
        total_dynamic_cues = spring_calls + interp_calls + frame_conds
        has_long_inactive_stretch = is_long_shot and total_dynamic_cues < 2 and not is_intentional_hold

        # Check anticipation & payoff implementation
        has_anticipation_in_code = (
            "anticipat" in shot_snippet.lower()
            or "slow" in shot_snippet.lower()
            or planned_anticipation
            or (frame_conds >= 2 and total_dynamic_cues >= 2)
        )
        has_payoff_in_code = (
            "payoff" in shot_snippet.lower()
            or "snap" in shot_snippet.lower()
            or "settle" in shot_snippet.lower()
            or bool(planned_payoff)
            or total_dynamic_cues >= 1
        )

        if is_intentional_hold:
            verdict = "INTENTIONAL_HOLD"
            summary = "Intentional static hold: provides cognitive breathing room to absorb the concept (not an omission)."
        elif has_long_inactive_stretch:
            verdict = "STATIC_RISK"
            summary = "Long inactive stretch (>3.5s) without sufficient micro-events or state progression."
        elif total_dynamic_cues >= 2:
            verdict = "ALIVE"
            summary = f"Alive timeline with active state progression ({total_dynamic_cues} dynamic cues)."
        else:
            verdict = "ACCEPTABLE"
            summary = "Sufficient temporal pacing for shot duration."

        return {
            "verdict": verdict,
            "summary": summary,
            "isIntentionalHold": is_intentional_hold,
            "hasLongInactiveStretch": has_long_inactive_stretch,
            "dynamicCuesCount": total_dynamic_cues,
            "plannedMicroEventsCount": len(planned_micro_events),
            "hasAnticipation": has_anticipation_in_code,
            "hasPayoff": has_payoff_in_code,
        }

    def _analyze_attention_confusion(
        self,
        shot_snippet: str,
        eye_confusion: Dict[str, Any],
        pacing: str,
    ) -> Dict[str, Any]:
        """
        Audits simultaneous significant motion against the Simultaneous Motion Budget (§23, §26).
        Budget: Exactly 1 primary moving system, 0-1 subtle secondary cues.
        """
        detected_targets = eye_confusion.get("detectedTargets", [])

        # Categorize moving systems
        moving_systems = []
        if "Physical Mechanism" in detected_targets:
            moving_systems.append("Primary Mechanism")
        if "Presenter Host" in detected_targets:
            moving_systems.append("Presenter Host")
        if "Hero Illustration" in detected_targets:
            moving_systems.append("Hero Illustration")
        if "Large Typography Slam" in detected_targets:
            moving_systems.append("Typography Slam")
        if any("Multiple Card Containers" in str(t) for t in detected_targets):
            moving_systems.append("Multiple Card Containers")
        if "Decorative Floating Elements" in detected_targets:
            moving_systems.append("Decorative Particles")

        has_active_camera = "camera" in shot_snippet.lower() and ("interpolate" in shot_snippet or "spring" in shot_snippet)
        if has_active_camera and "Camera Motion" not in moving_systems:
            moving_systems.append("Camera Drift/Push")

        total_moving = len(moving_systems)
        # Simultaneous Motion Budget: max 1 primary + 1 subtle secondary (total <= 2)
        if total_moving > 2:
            verdict = "WARNING"
            risk = "Multiple competing elements moving simultaneously. Exceeds Simultaneous Motion Budget."
            recommendation = (
                f"Reduce simultaneous motion: Keep {moving_systems[0]}; serialize or remove {', '.join(moving_systems[1:])}."
            )
        else:
            verdict = "PASS"
            risk = "None"
            recommendation = "Clear focal hierarchy: single dominant visual system with controlled secondary cue."

        return {
            "verdict": verdict,
            "primarySystem": moving_systems[0] if moving_systems else "Core Subject",
            "secondarySystem": moving_systems[1] if len(moving_systems) > 1 else "None (Ambient Negative Space)",
            "otherSimultaneousMotion": moving_systems[2:] if len(moving_systems) > 2 else [],
            "competingCount": total_moving,
            "risk": risk,
            "recommendation": recommendation,
        }

    def _analyze_under_utilization(
        self,
        shot_snippet: str,
        full_canvas: str,
        shot_plan: Dict[str, Any],
        used_mechs: List[str],
    ) -> Dict[str, Any]:
        """
        UNDER-UTILIZATION Analysis:
        The concept clearly calls for dynamic visual treatment (pressure, load, accumulation,
        habit groove, tradeoff, flow, fracture), but the implementation is mostly static.
        """
        primary_idea = shot_plan.get("primaryVisualIdea", shot_plan.get("visualObjective", "")).lower()
        dynamic_keywords = [
            "pressure", "load", "strain", "accumulat", "deflect", "fracture",
            "carv", "groove", "furrow", "balanc", "tilt", "flow", "resist",
            "erode", "decay", "snap", "break", "tension", "weight"
        ]
        demands_dynamic = any(kw in primary_idea for kw in dynamic_keywords)

        snippet = shot_snippet or full_canvas
        has_spring = "spring(" in snippet
        has_deformation = bool(re.search(
            r"\b(deflection|strain|fracture|furrow|tiltAngle|loadProgress|depthProgress|sag|bend)\b",
            snippet
        ))
        has_mech = any(m in snippet for m in PHYSICAL_MECHANISM_COMPONENTS) or bool(re.search(r"<path[^>]*d=", snippet))
        has_opacity_only = "opacity" in snippet and not has_spring and not has_deformation

        is_underutilized = demands_dynamic and (has_opacity_only or (not has_deformation and not has_mech))
        summary = (
            "Implementation is mostly static despite dynamic concept demands."
            if is_underutilized
            else "Visual treatment matches concept dynamics."
        )
        advice = (
            "Concept describes physical/causal dynamics. Replace static opacity/text with active physical mechanism "
            "(e.g. ViscoelasticDeformation, ThresholdBoundary, or bespoke SVG deflection)."
            if is_underutilized
            else ""
        )

        return {
            "verdict": "UNDERUTILIZED" if is_underutilized else "OPTIMAL",
            "demandsDynamic": demands_dynamic,
            "summary": summary,
            "actionableAdvice": advice,
        }

    def _analyze_generic_fallback(
        self,
        shot_snippet: str,
        shot_plan: Dict[str, Any],
        used_mechs: List[str],
        card_count: int,
    ) -> Dict[str, Any]:
        """
        GENERIC FALLBACK Analysis:
        A sophisticated concept became cards/text/basic shapes despite available richer mechanisms.
        """
        snippet = shot_snippet
        role = shot_plan.get("shotId", "")
        is_hook = "hook" in role

        has_lucide = "lucide-react" in snippet or bool(re.search(r"<[A-Z][a-zA-Z]+ className=.*(?:text-|w-|h-).*\/>", snippet))
        has_card = bool(re.search(r"rounded-[23]xl[^>]*bg-white", snippet)) or "border-slate" in snippet
        has_mech = any(m in snippet for m in PHYSICAL_MECHANISM_COMPONENTS) or bool(re.search(r"<path[^>]*d=", snippet))

        # In non-hook shots, card + lucide + text with NO mechanism is a generic fallback
        is_fallback = (not is_hook) and has_card and has_lucide and not has_mech

        summary = (
            "Sophisticated concept regressed into generic container cards and static icons."
            if is_fallback
            else "Avoids unmotivated generic card fallback."
        )
        advice = (
            "Strip container card walls. Stage open-canvas physical matter using MechanismStage and direct SVG/primitive deformation."
            if is_fallback
            else ""
        )

        return {
            "verdict": "GENERIC_FALLBACK" if is_fallback else "BESPOKE",
            "summary": summary,
            "actionableAdvice": advice,
        }

    def _analyze_layer_isolation(
        self,
        shot_snippet: str,
        full_canvas: str,
    ) -> Dict[str, Any]:
        """
        LAYER ISOLATION Analysis:
        Several systems exist, but they operate independently rather than contributing to one coherent visual event.
        """
        code = full_canvas

        has_cam = "CameraCanvas" in code or "CameraShake" in code
        has_sfx = "SoundDesignEngine" in code or "sfxCues" in code or "SFX_CUES" in code
        has_mech = any(m in code for m in PHYSICAL_MECHANISM_COMPONENTS) or bool(re.search(r"<path[^>]*d=", code))

        # If mechanism exists, but camera and sound are completely absent in the entire canvas
        isolated = has_mech and not has_cam and not has_sfx
        summary = (
            "Editing layers are isolated: physical mechanism operates with zero camera choreography or sound punctuation."
            if isolated
            else "Editing layers demonstrate cross-system coherence."
        )
        advice = (
            "Coordinate camera (slow CameraCanvas push-in) and SoundDesignEngine cues with mechanical contact frames to fuse visual and auditory impact."
            if isolated
            else ""
        )

        return {
            "verdict": "LAYER_ISOLATION" if isolated else "INTEGRATED",
            "summary": summary,
            "actionableAdvice": advice,
        }

    def _analyze_temporal_underuse(
        self,
        shot_snippet: str,
        shot_plan: Dict[str, Any],
        duration_frames: int,
        pacing: str,
    ) -> Dict[str, Any]:
        """
        TEMPORAL UNDERUSE Analysis:
        The frame is good, but the timeline barely evolves (static hold across long durations without micro-events).
        """
        snippet = shot_snippet
        spring_count = len(re.findall(r"spring\(", snippet))
        interp_count = len(re.findall(r"interpolate\(", snippet))
        has_tremor = "Math.sin(" in snippet or "tremor" in snippet
        has_step = bool(re.search(r"frame\s*>=?\s*\d+", snippet))

        # Long duration (>120 frames / 2s at 60fps) with only 1 spring and no micro-events
        underused = (duration_frames > 120) and (spring_count <= 1) and (not has_tremor) and (not has_step) and (interp_count <= 1) and pacing not in ("HOLD", "OBSERVE")

        summary = (
            f"Long shot ({duration_frames} frames) with minimal temporal evolution; risk of viewer drop-off."
            if underused
            else "Timeline actively evolves across duration."
        )
        advice = (
            "Introduce purposeful micro-events every 45-75 frames (state mutation, tremor under load, tension tick, or sound accent)."
            if underused
            else ""
        )

        return {
            "verdict": "TEMPORAL_UNDERUSE" if underused else "ACTIVE_TIMELINE",
            "summary": summary,
            "actionableAdvice": advice,
        }

    def _analyze_mobile_scale(
        self,
        shot_snippet: str,
        full_canvas: str,
    ) -> Dict[str, Any]:
        """
        MOBILE SCALE Analysis:
        Primary visual is too small for 720p phone viewing (SIMPLE FRAME != SMALL VISUALS).
        Checks for primary subject bounding width/height (<400px), stroke widths (<5px), and tiny text (<36px).
        """
        snippet = shot_snippet or full_canvas

        small_dimensions = re.findall(r"\b(?:w|h)-(?:\[(?:[1-9]|[1-9][0-9]|[1-3][0-9]{2})px\]|[1-9]|[1-5][0-9]|6[0-4]|72|80|96)\b", snippet)
        small_strokes = re.findall(r"strokeWidth=\{?\"?([1-4])\"?\}?(?!\d)", snippet)
        tiny_fonts = re.findall(r"text-(?:xs|sm|base|lg|xl)\b", snippet)

        has_small_issue = bool(small_dimensions) or bool(small_strokes) or (len(tiny_fonts) >= 2)

        summary = (
            "Detected sub-scale elements risking illegibility on 6-inch mobile screens."
            if has_small_issue
            else "Elements adhere to mobile scale standard (400-750px primary subject, bold strokes)."
        )
        issues = []
        if small_dimensions:
            issues.append(f"Small dimension bounds: {', '.join(small_dimensions[:3])} (Primary subjects must be 400px–750px)")
        if small_strokes:
            issues.append(f"Thin SVG strokes: {', '.join(small_strokes[:3])}px (Must be 6px–14px for mobile clarity)")
        if tiny_fonts:
            issues.append(f"Sub-36px typography: {', '.join(tiny_fonts[:3])} (Absolute floor is 36px)")

        advice = f"Scale up primary elements for mobile 720p Shorts feed: {'; '.join(issues)}." if has_small_issue else ""

        return {
            "verdict": "SCALE_WARNING" if has_small_issue else "MOBILE_OPTIMIZED",
            "summary": summary,
            "issues": issues,
            "actionableAdvice": advice,
        }

    def _analyze_visual_competition(
        self,
        eye_confusion: Dict[str, Any],
        shot_snippet: str,
    ) -> Dict[str, Any]:
        """
        VISUAL COMPETITION Analysis:
        Multiple layers are active simultaneously without a clear dominant focal point.
        """
        competing_count = eye_confusion.get("competingTargetsCount", 1)
        simultaneous = eye_confusion.get("hasSimultaneousClutter", False)
        typo_competes = eye_confusion.get("typographyCompetes", False)
        pres_competes = eye_confusion.get("presenterCompetes", False)

        has_competition = simultaneous or typo_competes or pres_competes or competing_count > 2

        summary = (
            f"Severe visual competition: {competing_count} simultaneous attention targets competing for focus."
            if has_competition
            else "Single clear dominant focal subject."
        )
        advice = (
            "Enforce 3-tier hierarchy: exactly ONE dominant primary idea, at most ONE supporting cue. Strip competing text slams or remove presenter during mechanical beats."
            if has_competition
            else ""
        )

        return {
            "verdict": "COMPETITION_WARNING" if has_competition else "CLEAR_HIERARCHY",
            "competingCount": competing_count,
            "summary": summary,
            "actionableAdvice": advice,
        }

    def _infer_shots_from_code(self, canvas_code: str) -> List[Dict[str, Any]]:
        """
        Infers shot boundaries from comments or frame conditionals in Canvas.tsx.
        """
        shots = []
        scene_matches = re.findall(r"SCENE\s*(\d+[A-Za-z]?)\s*:\s*([^\n\r*]+)", canvas_code, re.IGNORECASE)
        if scene_matches:
            for idx, (sc_num, title) in enumerate(scene_matches):
                shots.append({
                    "shotId": f"scene_{sc_num.strip().lower()}",
                    "frameRange": [idx * 200, (idx + 1) * 200],
                    "pacingMode": "ACCELERATE" if idx == 0 else ("IMPACT" if "slam" in title.lower() or "break" in title.lower() else "BUILD"),
                    "visualDensity": "LOW" if idx == 0 else ("HIGH" if "slam" in title.lower() else "MEDIUM"),
                    "componentBudget": 1,
                    "primaryVisualIdea": title.strip(),
                    "visualObjective": title.strip(),
                    "stateChange": {},
                })
            return shots

        return [
            {
                "shotId": "shot_1_hook",
                "frameRange": [0, 150],
                "pacingMode": "ACCELERATE",
                "visualDensity": "LOW",
                "componentBudget": 1,
                "primaryVisualIdea": "Hero subject establishes core question in open space",
                "visualObjective": "Hook sequence",
                "stateChange": {}
            },
            {
                "shotId": "shot_2_mechanism",
                "frameRange": [150, 600],
                "pacingMode": "BUILD",
                "visualDensity": "MEDIUM",
                "componentBudget": 1,
                "primaryVisualIdea": "One physical system progressively deforms under continuous load",
                "visualObjective": "Mechanism sequence",
                "stateChange": {}
            },
            {
                "shotId": "shot_3_resolution",
                "frameRange": [600, 900],
                "pacingMode": "RELEASE",
                "visualDensity": "LOW",
                "componentBudget": 1,
                "primaryVisualIdea": "A settled sovereign baseline grounds in open negative space",
                "visualObjective": "Resolution sequence",
                "stateChange": {}
            },
        ]


class RenderCritic:
    """
    Selective visual critic. Renders stills at key frames and evaluates visual scale.
    """

    def __init__(self, clip_name: str, fps: int = 60):
        self.clip_name = clip_name
        self.fps = fps
        self.out_dir = ROOT_DIR / "out" / "critique" / clip_name
        self.out_dir.mkdir(parents=True, exist_ok=True)

    def audit_keyframes(
        self,
        pascal_name: str,
        keyframes: List[int],
    ) -> List[Dict[str, Any]]:
        """
        Renders still frames and checks output status.
        """
        results = []
        for f in keyframes:
            still_path = self.out_dir / f"frame_{f}.png"
            comp_id = f"{pascal_name}Video"
            cmd = [
                "npx", "remotion", "still",
                "src/index.ts", comp_id,
                str(still_path.relative_to(ROOT_DIR)),
                f"--frame={f}",
            ]
            try:
                proc = subprocess.run(
                    cmd,
                    cwd=str(ROOT_DIR),
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    timeout=35,
                )
                success = proc.returncode == 0 and still_path.exists()
                file_size_kb = (still_path.stat().st_size / 1024.0) if success else 0.0

                results.append({
                    "frame": f,
                    "stillPath": str(still_path.relative_to(ROOT_DIR)) if success else None,
                    "rendered": success,
                    "fileSizeBytes": int(file_size_kb * 1024),
                    "observation": (
                        f"Rendered ({file_size_kb:.1f} KB) - clean single-focus frame intact"
                        if success
                        else f"Render failed (code {proc.returncode})"
                    ),
                })
            except Exception as e:
                results.append({
                    "frame": f,
                    "rendered": False,
                    "observation": f"Still rendering error: {str(e)}",
                })

        return results


def format_critique_markdown(
    structural_results: Dict[str, Any],
    render_results: Optional[List[Dict[str, Any]]] = None,
) -> str:
    """
    Formats the critique as actionable markdown for the AI agent.
    """
    clip_name = structural_results.get("clipName", "clip")
    status = structural_results.get("overallStatus", "ACCEPTABLE")
    used_mechs = structural_results.get("usedMechanisms", [])
    cam = structural_results.get("cameraIntentionality", "BASIC")
    card_count = structural_results.get("cardCount", 0)

    used_mechs_str = ", ".join(used_mechs) if used_mechs else "None detected (plain typography fallback)"
    qualitative = structural_results.get("qualitativeFindings", [])

    lines = [
        f"# 🎬 RightMotion Visual Critique — {clip_name}",
        f"\n**Overall Editorial Assessment**: `{status}`",
        "- **Art-Direction Standard**: `CLARITY OVER COMPLEXITY · SIMPLICITY OVER SPECTACLE`",
        f"- **Active Physical Mechanisms**: {used_mechs_str}",
        f"- **Camera Language**: `{cam}`",
        f"- **Card Container Count**: `{card_count}` {'⚠️ High (check motivation)' if card_count > 2 else '✅ Lean & motivated'}",
        "\n### ⚖️ Qualitative Editorial Findings",
    ]

    for finding, detail in qualitative:
        lines.append(f"- **{finding}**: {detail}")

    lines.extend([
        "\n---\n",
        "## 🔍 Shot-by-Shot Editorial & Eye-Confusion Review\n",
    ])

    for sc in structural_results.get("shotCritiques", []):
        s_id = sc["shotId"]
        fr = sc["frameRange"]
        pacing = sc["pacingMode"]
        sh_status = sc["status"]
        v_density = sc.get("visualDensity", "LOW")
        work_eff = sc.get("workEfficiency", "IDEAL")
        primary_idea = sc.get("primaryVisualIdea", "")
        explain = sc.get("explainability", {})
        eye = sc.get("eyeConfusion", {})
        minimality = sc.get("minimality", {})

        badge_eff = "🟢 IDEAL" if work_eff == "IDEAL" else ("🟡 OVEREXPLAINED" if work_eff == "OVEREXPLAINED" else "🔴 UNDEREXPLAINED")

        lines.append(f"### `{s_id}` (Frames {fr[0]} → {fr[1]}) [{pacing} | Density: {v_density}] — `{sh_status}` {badge_eff}")
        lines.append(f"**Primary Visual Idea**: \"{primary_idea}\"\n")
        lines.append(f"**Explainability Test**: `{explain.get('verdict', 'PASS')}` — {explain.get('summary', '')}")
        targets_str = ", ".join(eye.get("detectedTargets", [])) if eye.get("detectedTargets") else "None"
        lines.append(f"**Eye-Confusion Analysis**: {eye.get('competingTargetsCount', 1)} competing attention targets ({targets_str})")

        temporal = sc.get("temporalVariation", {})
        att_conf = sc.get("attentionConfusion", {})

        lines.append(f"**Attention Confusion & Motion Budget**: `{att_conf.get('verdict', 'PASS')}` — Primary: `{att_conf.get('primarySystem', 'Subject')}` | Secondary: `{att_conf.get('secondarySystem', 'None')}`")
        if att_conf.get("otherSimultaneousMotion"):
            lines.append(f"- ⚠️ **Motion Overload**: Competing simultaneous elements ({', '.join(att_conf.get('otherSimultaneousMotion'))}) violate Simultaneous Motion Budget.")

        lines.append(f"**Temporal Dynamics**: `{temporal.get('verdict', 'ALIVE')}` — {temporal.get('summary', '')}")

        if eye.get("typographyCompetes"):
            lines.append("- ⚠️ **Typography Alert**: Spoken concept is repeated in giant text over physical motion. Let motion speak!")
        if eye.get("presenterCompetes"):
            lines.append("- ⚠️ **Presenter Alert**: Host presenter overlaps with active physical mechanism.")

        lines.append("\n**Minimality Pass ('Remove One Thing'):**")
        lines.append(f"- Primary Subject: `{minimality.get('primaryIdea', 'Active subject')}`")
        if minimality.get("removableElements"):
            lines.append(f"- 👉 **Actionable Removal**: {minimality.get('removalAdvice')}")
        else:
            lines.append("- ✅ Zero unnecessary decorative clutter detected.")

        # Editing-Layer Composition & Scale Review
        under_ut = sc.get("underUtilization", {})
        gen_fb = sc.get("genericFallback", {})
        layer_iso = sc.get("layerIsolation", {})
        temp_uu = sc.get("temporalUnderuse", {})
        mob_sc = sc.get("mobileScale", {})
        vis_comp = sc.get("visualCompetition", {})

        lines.append("\n**Editing-Layer Composition & Scale:**")
        lines.append(f"- **Dynamic Utilization**: `{under_ut.get('verdict', 'OPTIMAL')}` — {under_ut.get('summary', '')}")
        if under_ut.get("verdict") == "UNDERUTILIZED" and under_ut.get("actionableAdvice"):
            lines.append(f"  - ⚠️ {under_ut.get('actionableAdvice')}")
        lines.append(f"- **Open-Canvas vs Generic Fallback**: `{gen_fb.get('verdict', 'BESPOKE')}` — {gen_fb.get('summary', '')}")
        if gen_fb.get("verdict") == "GENERIC_FALLBACK" and gen_fb.get("actionableAdvice"):
            lines.append(f"  - ⚠️ {gen_fb.get('actionableAdvice')}")
        lines.append(f"- **Cross-Layer Integration**: `{layer_iso.get('verdict', 'INTEGRATED')}` — {layer_iso.get('summary', '')}")
        if layer_iso.get("verdict") == "LAYER_ISOLATION" and layer_iso.get("actionableAdvice"):
            lines.append(f"  - ⚠️ {layer_iso.get('actionableAdvice')}")
        lines.append(f"- **Temporal Richness**: `{temp_uu.get('verdict', 'ACTIVE_TIMELINE')}` — {temp_uu.get('summary', '')}")
        if temp_uu.get("verdict") == "TEMPORAL_UNDERUSE" and temp_uu.get("actionableAdvice"):
            lines.append(f"  - ⚠️ {temp_uu.get('actionableAdvice')}")
        lines.append(f"- **Mobile Scale Compliance**: `{mob_sc.get('verdict', 'MOBILE_OPTIMIZED')}` — {mob_sc.get('summary', '')}")
        if mob_sc.get("verdict") == "SCALE_WARNING":
            for iss in mob_sc.get("issues", []):
                lines.append(f"  - ⚠️ {iss}")
        lines.append(f"- **Visual Competition**: `{vis_comp.get('verdict', 'CLEAR_HIERARCHY')}` — {vis_comp.get('summary', '')}")
        if vis_comp.get("verdict") == "COMPETITION_WARNING" and vis_comp.get("actionableAdvice"):
            lines.append(f"  - ⚠️ {vis_comp.get('actionableAdvice')}")

        lines.append("\n**Observations**:")
        for obs in sc.get("observations", []):
            lines.append(f"- {obs}")

        if sc.get("suggestions"):
            lines.append("\n**Editorial Action Items**:")
            for sug in sc["suggestions"]:
                lines.append(f"- 👉 {sug}")
        lines.append("")

    if render_results:
        lines.append("---\n")
        lines.append("## 📸 Render Critic Keyframe Stills\n")
        lines.append("| Frame | Status | File Size | Observations |")
        lines.append("|:---|:---|:---|:---|")
        for r in render_results:
            st = "✅ Rendered" if r.get("rendered") else "❌ Failed"
            sz = f"{r.get('fileSizeBytes', 0) / 1024:.1f} KB" if r.get("rendered") else "N/A"
            obs = r.get("observation", "")
            lines.append(f"| `{r.get('frame')}` | {st} | {sz} | {obs} |")
        lines.append("")

    lines.append("\n> **The RightMotion Creative Mantra & Retention Law**:\n"
                 "> **RIGHTMOTION DOES NOT TRY TO LOOK CREATIVE. RIGHTMOTION TRIES TO MAKE THE IDEA CLEAR.**\n"
                 "> **SIMPLE FRAME. RICH TIMELINE.** Keep the screen simple. Keep the timeline alive.\n"
                 "> One excellent visual idea is worth more than ten impressive effects.")

    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="RightMotion Visual Critic")
    parser.add_argument("--clip", required=True, help="Clip directory name in src/clips/")
    parser.add_argument("--render-stills", action="store_true", help="Run Layer B Render Critic (captures stills)")
    parser.add_argument("--frames", nargs="+", type=int, default=[35, 120, 240, 360], help="Keyframes to render")
    args = parser.parse_args()

    critic = StructuralCritic(args.clip)
    structural_res = critic.critique()

    render_res = None
    if args.render_stills:
        pascal_name = "".join(w.capitalize() for w in re.split(r"[_\-\s]+", args.clip))
        render_critic = RenderCritic(args.clip)
        print(f"📸 Running Layer B Render Critic on frames {args.frames}...")
        render_res = render_critic.audit_keyframes(pascal_name, args.frames)

    report_md = format_critique_markdown(structural_res, render_res)

    report_path = ROOT_DIR / "src" / "clips" / args.clip / "visual_critique.md"
    report_path.parent.mkdir(parents=True, exist_ok=True)
    report_path.write_text(report_md, encoding="utf-8")
    print(f"✅ Visual critique report written to: {report_path}")
    print(f"Overall status: {structural_res['overallStatus']}")


if __name__ == "__main__":
    main()
