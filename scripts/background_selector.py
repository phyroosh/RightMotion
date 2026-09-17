#!/usr/bin/env python3
"""
🎬 RightMotion — Universal Background Selector & Creative Scoring Engine
Location: scripts/background_selector.py

The creative decision layer that scores and selects (or intentionally rejects)
candidate universal backgrounds based on script meaning, scene role,
typography requirements, foreground complexity, and narrative progression.

Core Principle:
  "No universal background is appropriate here" is a valid and often correct decision.
  The background exists to support the scene, not to decorate every frame.
"""

import argparse
import json
import os
import re
import sys
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from background_intelligence import BackgroundRegistry, REGISTRY_PATH


@dataclass
class SceneContext:
    scene_id: str
    role: str  # "hook" | "friction" | "mechanism" | "escalation" | "resolution" | "definition"
    script_text: str
    emotional_tone: str  # "cinematic" | "tense" | "reflective" | "analytical" | "calm" | "energetic"
    visual_complexity_score: float = 1.5  # From Frontier #0 budget/complexity (e.g. 1.0 to 4.5)
    has_presenter: bool = False
    presenter_position: str = "right"
    is_diagram_heavy: bool = False
    is_pure_data_metric: bool = False
    primary_text_color: str = "#ffffff"  # "#ffffff" (light) or "#090d16" (dark)
    expected_text_zone: str = "center"  # "top" | "center" | "bottom"
    previous_background_id: Optional[str] = None
    background_usage_history: List[str] = field(default_factory=list)
    is_chapter_shift: bool = False
    allow_narrative_return: bool = False


@dataclass
class CandidateScore:
    asset_id: str
    semantic_fit: float
    contrast_fit: float
    text_safe_fit: float
    presenter_fit: float
    continuity_fit: float
    composite_score: float
    reasons: List[str] = field(default_factory=list)
    penalties: List[str] = field(default_factory=list)


@dataclass
class BackgroundDecision:
    scene_id: str
    mode: str  # "universal" | "none" | "solid_ground"
    selected_asset_id: Optional[str]
    semantic_role: str
    crop_strategy: str
    crop_focal_point: List[float]
    motion: str
    motion_scale_delta: float
    opacity: float
    dimming_overlay: Optional[Dict[str, Any]]
    transition_in: Optional[Dict[str, Any]]
    transition_out: Optional[Dict[str, Any]]
    reason: str
    candidate_scores: List[Dict[str, Any]] = field(default_factory=list)
    rejected_reasons: List[str] = field(default_factory=list)


class BackgroundSelector:
    def __init__(self, registry: Optional[BackgroundRegistry] = None):
        self.registry = registry or BackgroundRegistry()

    def evaluate_scene(self, context: SceneContext) -> BackgroundDecision:
        assets = self.registry.scan()
        if not assets:
            return BackgroundDecision(
                scene_id=context.scene_id,
                mode="none",
                selected_asset_id=None,
                semantic_role="none",
                crop_strategy="center",
                crop_focal_point=[0.5, 0.5],
                motion="static",
                motion_scale_delta=1.0,
                opacity=1.0,
                dimming_overlay=None,
                transition_in=None,
                transition_out=None,
                reason="No universal background assets available in library.",
            )

        # 1. Hard Rejection Guardrails (Anti-Clutter / Cognitive Clarity Law)
        # Diagram-heavy or pure data/metrics scenes demand clean canvas
        if context.is_diagram_heavy or context.is_pure_data_metric:
            return BackgroundDecision(
                scene_id=context.scene_id,
                mode="none",
                selected_asset_id=None,
                semantic_role="clarity_canvas",
                crop_strategy="center",
                crop_focal_point=[0.5, 0.5],
                motion="static",
                motion_scale_delta=1.0,
                opacity=1.0,
                dimming_overlay=None,
                transition_in={"type": "dissolve", "durationFrames": 12},
                transition_out=None,
                reason="Scene contains high-density educational diagrams or metrics. Background suppressed to preserve razor-sharp legibility.",
                rejected_reasons=[
                    f"Background suppressed: scene is marked is_diagram_heavy={context.is_diagram_heavy} or is_pure_data_metric={context.is_pure_data_metric}."
                ],
            )

        # High foreground complexity threshold (>= 3.2 means heavy physical forces / multi-object mechanics)
        if context.visual_complexity_score >= 3.2:
            return BackgroundDecision(
                scene_id=context.scene_id,
                mode="none",
                selected_asset_id=None,
                semantic_role="clarity_canvas",
                crop_strategy="center",
                crop_focal_point=[0.5, 0.5],
                motion="static",
                motion_scale_delta=1.0,
                opacity=1.0,
                dimming_overlay=None,
                transition_in={"type": "dissolve", "durationFrames": 12},
                transition_out=None,
                reason=f"Foreground visual complexity is high ({context.visual_complexity_score:.1f} >= 3.2). Background suppressed to avoid sensory overload.",
                rejected_reasons=["High foreground complexity budget cap exceeded."],
            )

        # 2. Score Candidates
        candidate_scores: List[CandidateScore] = []
        for asset_id, meta in assets.items():
            if meta.get("status") != "READY":
                continue

            score = self._score_candidate(meta, context)
            candidate_scores.append(score)

        candidate_scores.sort(key=lambda s: s.composite_score, reverse=True)

        # 3. Decision Threshold
        MIN_SELECTION_THRESHOLD = 0.62
        if not candidate_scores or candidate_scores[0].composite_score < MIN_SELECTION_THRESHOLD:
            best_score = candidate_scores[0].composite_score if candidate_scores else 0.0
            return BackgroundDecision(
                scene_id=context.scene_id,
                mode="none",
                selected_asset_id=None,
                semantic_role="neutral_stage",
                crop_strategy="center",
                crop_focal_point=[0.5, 0.5],
                motion="static",
                motion_scale_delta=1.0,
                opacity=1.0,
                dimming_overlay=None,
                transition_in=None,
                transition_out=None,
                reason=f"No candidate background met the minimum quality threshold ({best_score:.2f} < {MIN_SELECTION_THRESHOLD}). Plain stage preferred.",
                candidate_scores=[asdict(s) for s in candidate_scores],
                rejected_reasons=[f"Top score {best_score:.2f} below threshold {MIN_SELECTION_THRESHOLD}."],
            )

        winner = candidate_scores[0]
        win_meta = assets[winner.asset_id]

        # 4. Resolve Motion, Cropping & Dimming
        # Determine semantic role based on winner and scene role
        if win_meta.get("material") == "matte_surface":
            semantic_role = "cinematic_surface"
        elif win_meta.get("material") == "paper":
            semantic_role = "tactile_stage"
        elif win_meta.get("material") == "concrete":
            semantic_role = "brutalist_foundation"
        else:
            semantic_role = "atmospheric_depth"

        # Crop strategy
        focal_center = win_meta.get("focalCenter", [0.5, 0.5])
        if context.expected_text_zone == "top" and focal_center[1] > 0.55:
            crop_strategy = "bottom_weighted"
        elif context.expected_text_zone == "bottom" and focal_center[1] < 0.45:
            crop_strategy = "top_weighted"
        else:
            crop_strategy = "center_focal"

        # Subtle motion
        if context.emotional_tone in ["cinematic", "reflective"]:
            motion = "slow_zoom_in"
            motion_delta = 1.04
        elif context.role == "hook":
            motion = "subtle_drift"
            motion_delta = 1.03
        else:
            motion = "static"
            motion_delta = 1.0

        # Dimming / tinting if text contrast needs subtle reinforcement
        dimming = None
        if win_meta.get("tone") == "dark" and win_meta.get("brightness", 0.1) > 0.18:
            dimming = {"color": "rgba(3, 7, 18, 0.45)", "blurPx": 0}
        elif win_meta.get("tone") == "bright" and context.primary_text_color.startswith("#0"):
            dimming = None

        # Transitions
        if context.previous_background_id and context.previous_background_id != winner.asset_id:
            transition_in = {"type": "dissolve", "durationFrames": 16}
        elif context.role == "hook":
            transition_in = {"type": "fade", "durationFrames": 10}
        else:
            transition_in = None

        transition_out = None

        # Format explanation
        reasons_str = "; ".join(winner.reasons)
        full_reason = f"Selected '{winner.asset_id}' ({win_meta.get('material')}, {win_meta.get('tone')}) with score {winner.composite_score:.2f}. {reasons_str}"

        return BackgroundDecision(
            scene_id=context.scene_id,
            mode="universal",
            selected_asset_id=winner.asset_id,
            semantic_role=semantic_role,
            crop_strategy=crop_strategy,
            crop_focal_point=focal_center,
            motion=motion,
            motion_scale_delta=motion_delta,
            opacity=1.0,
            dimming_overlay=dimming,
            transition_in=transition_in,
            transition_out=transition_out,
            reason=full_reason,
            candidate_scores=[asdict(s) for s in candidate_scores],
            rejected_reasons=[
                f"Rejected {s.asset_id} (score {s.composite_score:.2f}): {', '.join(s.penalties)}"
                for s in candidate_scores[1:4]
                if s.penalties
            ],
        )

    def _score_candidate(self, meta: Dict[str, Any], context: SceneContext) -> CandidateScore:
        reasons = []
        penalties = []

        # A. Semantic & Mood Fit (weight: 0.30)
        tone = meta.get("tone", "neutral")
        moods = set(meta.get("moods", []))
        semantic_fit = 0.5

        if context.emotional_tone in ["cinematic", "reflective", "tense"]:
            if tone == "dark":
                semantic_fit = 0.95
                reasons.append("Dark tone aligns with cinematic/reflective narrative")
            elif tone == "neutral":
                semantic_fit = 0.65
            else:
                semantic_fit = 0.25
                penalties.append("Bright tone clashes with cinematic/reflective scene")
        elif context.emotional_tone in ["calm", "editorial"]:
            if "editorial" in moods or "calm" in moods or tone == "neutral":
                semantic_fit = 0.90
                reasons.append("Editorial/calm tone matches scene mood")
            else:
                semantic_fit = 0.60
        else:
            semantic_fit = 0.70

        # B. Contrast Fit (weight: 0.25)
        contrast_fit = 0.5
        brightness = meta.get("brightness", 0.5)
        is_light_text = context.primary_text_color.lower() in ["#ffffff", "#f8fafc", "#fff", "white"]

        if is_light_text:
            if brightness < 0.22:
                contrast_fit = 1.0
                reasons.append("Deep black/dark ground guarantees >7:1 white text contrast")
            elif brightness < 0.40:
                contrast_fit = 0.75
            else:
                contrast_fit = 0.10
                penalties.append("Bright ground causes critical contrast collision with light text")
        else:
            # Dark text
            if brightness > 0.75:
                contrast_fit = 1.0
                reasons.append("Clean bright ground guarantees >7:1 dark text contrast")
            elif brightness > 0.55:
                contrast_fit = 0.70
            else:
                contrast_fit = 0.10
                penalties.append("Dark ground clashes with dark typography")

        # C. Text-Safe Region Alignment (weight: 0.20)
        text_safe_fit = 0.5
        safe_regions = meta.get("textSafeRegions", {})
        zone_key = f"safe{context.expected_text_zone.capitalize()}"
        if safe_regions.get(zone_key, True):
            text_safe_fit = 0.95
            reasons.append(f"Clear text-safe zone verified at {context.expected_text_zone}")
        else:
            text_safe_fit = 0.30
            penalties.append(f"Visual clutter detected in expected text zone ({context.expected_text_zone})")

        # D. Presenter Fit (weight: 0.15)
        presenter_fit = 0.7
        if context.has_presenter:
            if meta.get("presenterCompatibility") == "excellent":
                presenter_fit = 1.0
                reasons.append("High presenter edge separation (no silhouette washout)")
            elif meta.get("presenterCompatibility") == "poor":
                presenter_fit = 0.2
                penalties.append("Presenter edge separation poor")
            else:
                presenter_fit = 0.7

        # E. Continuity & Repetition (weight: 0.10)
        continuity_fit = 0.8
        asset_id = meta.get("id")
        usage_count = context.background_usage_history.count(asset_id)

        # Immediate repetition penalty
        if context.previous_background_id == asset_id:
            if context.is_chapter_shift:
                continuity_fit = 0.3
                penalties.append("Chapter shift demands environmental variation; same background penalized")
            else:
                continuity_fit = 0.7  # Acceptable scene-to-scene continuity
        else:
            # Intentional narrative return bonus
            if usage_count >= 1 and context.allow_narrative_return and context.role in ["resolution", "takeaway"]:
                continuity_fit = 1.0
                reasons.append("Intentional narrative return: echoes opening environment at resolution")
            elif usage_count >= 2:
                continuity_fit = 0.2
                penalties.append(f"Asset already used {usage_count} times in clip; heavy reuse penalty applied")
            else:
                continuity_fit = 0.9

        # Calculate composite score
        composite = (
            semantic_fit * 0.30
            + contrast_fit * 0.25
            + text_safe_fit * 0.20
            + presenter_fit * 0.15
            + continuity_fit * 0.10
        )

        return CandidateScore(
            asset_id=asset_id,
            semantic_fit=round(semantic_fit, 3),
            contrast_fit=round(contrast_fit, 3),
            text_safe_fit=round(text_safe_fit, 3),
            presenter_fit=round(presenter_fit, 3),
            continuity_fit=round(continuity_fit, 3),
            composite_score=round(composite, 3),
            reasons=reasons,
            penalties=penalties,
        )


def main():
    parser = argparse.ArgumentParser(description="Test background selection against a scene context")
    parser.add_argument("--role", default="hook", help="Scene role (hook, friction, mechanism, resolution)")
    parser.add_argument("--tone", default="cinematic", help="Scene emotional tone")
    parser.add_argument("--complexity", type=float, default=1.5, help="Visual complexity score")
    parser.add_argument("--presenter", action="store_true", help="Scene includes presenter")
    parser.add_argument("--diagram", action="store_true", help="Scene is diagram heavy")
    args = parser.parse_args()

    ctx = SceneContext(
        scene_id="test_scene",
        role=args.role,
        script_text="The invisible friction that drains your focus.",
        emotional_tone=args.tone,
        visual_complexity_score=args.complexity,
        has_presenter=args.presenter,
        is_diagram_heavy=args.diagram,
        primary_text_color="#ffffff",
        expected_text_zone="center",
    )

    selector = BackgroundSelector()
    decision = selector.evaluate_scene(ctx)
    print(json.dumps(asdict(decision), indent=2))


if __name__ == "__main__":
    main()
