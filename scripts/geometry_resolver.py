#!/usr/bin/env python3
"""
📐 RightMotion — Geometry Resolver & Mobile Composition Engine
Location: scripts/geometry_resolver.py

Translates semantic narrative importance, scene roles, and content complexity
into mobile-first 9:16 layout geometries that eliminate accidental dead space,
prevent desktop card-stack leaks, and guarantee touchless readability at 480p.

LAW: PLATFORM UI IS PART OF THE COMPOSITIONAL ENVIRONMENT.
Safe Text/Graphics Region: x: [72, 1008] (width: 936px), y: [280, 1340] (height: 1060px)
Captions Region: y: [1380, 1560] (height: 180px)
Platform UI Hazard: y: [0, 230] (Top Nav), y: [1560, 1920] (Bottom Channel UI)
"""

import math
from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Tuple


@dataclass
class ActorBounds:
    id: str
    semantic_role: str
    importance: str  # "HERO" | "CRITICAL" | "SECONDARY" | "TERTIARY" | "DECORATIVE"
    x: float
    y: float
    width: float
    height: float
    origin_anchor: str = "center"  # "center" | "top_left"
    font_size_px: Optional[float] = None
    text_content: Optional[str] = None

    @property
    def left(self) -> float:
        return self.x - self.width / 2.0 if self.origin_anchor == "center" else self.x

    @property
    def right(self) -> float:
        return self.x + self.width / 2.0 if self.origin_anchor == "center" else self.x + self.width

    @property
    def top(self) -> float:
        return self.y - self.height / 2.0 if self.origin_anchor == "center" else self.y

    @property
    def bottom(self) -> float:
        return self.y + self.height / 2.0 if self.origin_anchor == "center" else self.y + self.height

    @property
    def area(self) -> float:
        return max(0.0, self.width) * max(0.0, self.height)


@dataclass
class CompositionMetrics:
    canvas_width: int
    canvas_height: int
    safe_top: int
    safe_bottom: int
    safe_left: int
    safe_right: int
    occupied_x_min: float
    occupied_x_max: float
    occupied_y_min: float
    occupied_y_max: float
    occupied_width: float
    occupied_height: float
    occupied_width_pct: float
    occupied_height_pct: float
    occupied_area_pct: float
    top_dead_zone_px: float
    bottom_dead_zone_px: float  # Gap between content bottom and caption bar (y=1380)
    semantic_density_score: float
    density_status: str  # "OPTIMAL" | "BALANCED" | "LOW_DENSITY_WARNING" | "OVERCROWDED"
    readability_violations: List[str]
    warnings: List[str]


class GeometryResolver:
    """Authoritative geometry computation engine for mobile 9:16 compositions."""

    # YouTube Shorts Safe Zone Boundaries
    CANVAS_WIDTH = 1080
    CANVAS_HEIGHT = 1920
    SAFE_TOP = 280
    SAFE_BOTTOM = 1340  # Directly above kinetic captions (1380)
    SAFE_LEFT = 72
    SAFE_RIGHT = 1008
    SAFE_WIDTH = SAFE_RIGHT - SAFE_LEFT  # 936px
    SAFE_HEIGHT = SAFE_BOTTOM - SAFE_TOP  # 1060px

    CAPTIONS_START_Y = 1380

    # Rule 5.4 Typography Constraints
    MIN_HEADLINE_SIZE = 56
    MIN_BODY_SIZE = 36
    MIN_METRIC_SIZE = 56
    ABSOLUTE_FONT_FLOOR = 36

    @classmethod
    def resolve_scene_layout(
        cls,
        scene_id: str,
        role: str,
        dominant_metaphor: str,
        actors_data: List[Dict[str, Any]],
        annotations_data: List[Dict[str, Any]],
        has_presenter: bool = False,
    ) -> Tuple[List[ActorBounds], CompositionMetrics]:
        """
        Computes dynamic mobile-first bounds distributing content across the 9:16 canvas.
        Eliminates the single cramped desktop box and prevents huge voids.
        """
        resolved_actors: List[ActorBounds] = []

        is_hook = role == "hook" or scene_id == "scene_1_hook"

        has_actors = bool(actors_data)
        has_physical_actor = any(
            (
                act.get("geometry", {}).get("type") in [
                    "continuous_boundary",
                    "conduit_pathway",
                    "monolithic_foundation",
                    "fulcrum_beam",
                    "physical_mass",
                ]
                if isinstance(act.get("geometry"), dict)
                else False
            )
            or act.get("semanticRole") in [
                "the_sovereign_standard",
                "neural_action_pathway",
                "structural_bedrock",
                "systemic_equilibrium_beam",
                "physical_mechanism_anchor",
            ]
            for act in actors_data
        )

        # Anti-Cardification Law: If physical mechanisms exist, or defined actors are supplied,
        # open-stage physical staging is mandatory (ZERO synthetic cards).
        is_physical_mechanism = has_physical_actor or (
            has_actors and not any(k in dominant_metaphor.lower() for k in ["comparison", "protocol"])
        )

        is_comparison = (
            (not is_physical_mechanism)
            and any(
                k in dominant_metaphor.lower()
                for k in ["comparison", "competing_paths", "divergence", "choice"]
            )
        )
        is_protocol = (
            (not is_physical_mechanism)
            and (not is_comparison)
            and ("protocol" in dominant_metaphor.lower())
        )

        # Archetype 1: Hook with bespoke illustration & presenter grounding
        if is_hook:
            # Headline at top safe zone
            for ann in annotations_data:
                resolved_actors.append(
                    ActorBounds(
                        id=ann.get("annotationId", f"{scene_id}_headline"),
                        semantic_role="scene_headline",
                        importance="CRITICAL",
                        x=540,
                        y=340,
                        width=cls.SAFE_WIDTH,
                        height=100,
                        origin_anchor="center",
                        font_size_px=ann.get("fontSizePx", 68),
                        text_content=ann.get("text", ""),
                    )
                )

            # Hero illustration card occupies prominent center region
            for act in actors_data:
                resolved_actors.append(
                    ActorBounds(
                        id=act["id"],
                        semantic_role=act.get("semanticRole", "hook_curiosity_anchor"),
                        importance="HERO",
                        x=540 if not has_presenter else 460,
                        y=660,
                        width=920 if not has_presenter else 760,
                        height=480,
                        origin_anchor="center",
                    )
                )

            # Grounded Presenter Host (Rule 4 & Law of Presenter Grounding)
            if has_presenter:
                resolved_actors.append(
                    ActorBounds(
                        id=f"{scene_id}_presenter_host",
                        semantic_role="presenter_host",
                        importance="SECONDARY",
                        x=760,
                        y=1320,
                        width=540,
                        height=1200,
                        origin_anchor="center",
                    )
                )

        # Archetype 2: Split System Comparison (e.g. High Friction vs Low Friction)
        elif is_comparison:
            # Headline
            y_cursor = 330
            for ann in annotations_data:
                resolved_actors.append(
                    ActorBounds(
                        id=ann.get("annotationId", f"{scene_id}_headline"),
                        semantic_role="comparison_header",
                        importance="CRITICAL",
                        x=540,
                        y=y_cursor,
                        width=cls.SAFE_WIDTH,
                        height=90,
                        origin_anchor="center",
                        font_size_px=ann.get("fontSizePx", 64),
                        text_content=ann.get("text", ""),
                    )
                )
            y_cursor += 120

            # Two substantial comparative stages filling the vertical safe window
            path_a_h = 240
            path_a_y = y_cursor + path_a_h / 2.0
            resolved_actors.append(
                ActorBounds(
                    id=f"{scene_id}_path_a",
                    semantic_role="competing_path_a",
                    importance="IMPORTANT",
                    x=540,
                    y=path_a_y,
                    width=920,
                    height=path_a_h,
                    origin_anchor="center",
                )
            )

            y_cursor += path_a_h + 30
            path_b_h = 280
            path_b_y = y_cursor + path_b_h / 2.0
            resolved_actors.append(
                ActorBounds(
                    id=f"{scene_id}_path_b",
                    semantic_role="competing_path_b",
                    importance="CRITICAL",
                    x=540,
                    y=path_b_y,
                    width=920,
                    height=path_b_h,
                    origin_anchor="center",
                )
            )

            # Decisive Takeaway Card anchored directly above captions
            takeaway_h = 100
            takeaway_y = cls.SAFE_BOTTOM - takeaway_h / 2.0 - 15  # y ~ 1275
            resolved_actors.append(
                ActorBounds(
                    id=f"{scene_id}_takeaway",
                    semantic_role="sovereign_takeaway",
                    importance="CRITICAL",
                    x=540,
                    y=takeaway_y,
                    width=920,
                    height=takeaway_h,
                    origin_anchor="center",
                )
            )

        # Archetype 3: Sequential Protocol / Operational Resolution
        elif is_protocol:
            y_cursor = 330
            for ann in annotations_data:
                resolved_actors.append(
                    ActorBounds(
                        id=ann.get("annotationId", f"{scene_id}_headline"),
                        semantic_role="protocol_header",
                        importance="CRITICAL",
                        x=540,
                        y=y_cursor,
                        width=cls.SAFE_WIDTH,
                        height=90,
                        origin_anchor="center",
                        font_size_px=ann.get("fontSizePx", 64),
                        text_content=ann.get("text", ""),
                    )
                )

            # Strike card
            y_cursor += 120
            strike_h = 160
            resolved_actors.append(
                ActorBounds(
                    id=f"{scene_id}_obsolete_paradigm",
                    semantic_role="negated_premise",
                    importance="IMPORTANT",
                    x=540,
                    y=y_cursor + strike_h / 2.0,
                    width=920,
                    height=strike_h,
                    origin_anchor="center",
                )
            )

            # Rule 1
            y_cursor += strike_h + 24
            r1_h = 170
            resolved_actors.append(
                ActorBounds(
                    id=f"{scene_id}_rule_1",
                    semantic_role="protocol_rule_1",
                    importance="IMPORTANT",
                    x=540,
                    y=y_cursor + r1_h / 2.0,
                    width=920,
                    height=r1_h,
                    origin_anchor="center",
                )
            )

            # Rule 2
            y_cursor += r1_h + 24
            r2_h = 190
            resolved_actors.append(
                ActorBounds(
                    id=f"{scene_id}_rule_2",
                    semantic_role="protocol_rule_2",
                    importance="CRITICAL",
                    x=540,
                    y=y_cursor + r2_h / 2.0,
                    width=920,
                    height=r2_h,
                    origin_anchor="center",
                )
            )

            # Sovereign Conclusion Card anchored at bottom safe zone
            takeaway_h = 90
            resolved_actors.append(
                ActorBounds(
                    id=f"{scene_id}_closing_law",
                    semantic_role="sovereign_takeaway",
                    importance="CRITICAL",
                    x=540,
                    y=cls.SAFE_BOTTOM - takeaway_h / 2.0 - 15,
                    width=920,
                    height=takeaway_h,
                    origin_anchor="center",
                )
            )

        # Archetype 4: Open-Stage Physical Mechanism (Anti-Cardification: ZERO CARDS)
        else:
            y_cursor = 330
            for ann in annotations_data:
                resolved_actors.append(
                    ActorBounds(
                        id=ann.get("annotationId", f"{scene_id}_headline"),
                        semantic_role="mechanism_header",
                        importance="CRITICAL",
                        x=540,
                        y=y_cursor,
                        width=cls.SAFE_WIDTH,
                        height=90,
                        origin_anchor="center",
                        font_size_px=ann.get("fontSizePx", 64),
                        text_content=ann.get("text", ""),
                    )
                )

            # Check if actors represent a first-class physical mechanism
            for act in actors_data:
                geom = act.get("geometry", {})
                geom_type = geom.get("type", "") if isinstance(geom, dict) else ""
                s_role = act.get("semanticRole", "physical_mechanism_anchor")
                
                # Physical mechanisms (boundary, furrow, foundation, fulcrum, mass)
                # span the generous central staging area (no card container walls)
                is_physical = geom_type in [
                    "continuous_boundary",
                    "conduit_pathway",
                    "monolithic_foundation",
                    "fulcrum_beam",
                    "physical_mass",
                ] or s_role in [
                    "the_sovereign_standard",
                    "neural_action_pathway",
                    "structural_bedrock",
                    "systemic_equilibrium_beam",
                ]

                actor_w = int(geom.get("widthPx", 880)) if is_physical else 720
                actor_h = int(geom.get("heightPx", 480)) if is_physical else 420
                actor_y = 740

                resolved_actors.append(
                    ActorBounds(
                        id=act["id"],
                        semantic_role=s_role,
                        importance="HERO",
                        x=540,
                        y=actor_y,
                        width=actor_w,
                        height=actor_h,
                        origin_anchor="center",
                    )
                )

            # Consequence / Action state label directly attached at bottom safe zone (NOT inside a card)
            consequence_h = 80
            resolved_actors.append(
                ActorBounds(
                    id=f"{scene_id}_consequence_label",
                    semantic_role="state_consequence_label",
                    importance="IMPORTANT",
                    x=540,
                    y=min(1250, cls.SAFE_BOTTOM - consequence_h / 2.0 - 15),
                    width=880,
                    height=consequence_h,
                    origin_anchor="center",
                )
            )

        metrics = cls.calculate_metrics(resolved_actors)
        return resolved_actors, metrics

    @classmethod
    def calculate_metrics(cls, actors: List[ActorBounds]) -> CompositionMetrics:
        """Computes authoritative bounding box metrics, dead zones, and semantic density."""
        if not actors:
            return CompositionMetrics(
                canvas_width=cls.CANVAS_WIDTH,
                canvas_height=cls.CANVAS_HEIGHT,
                safe_top=cls.SAFE_TOP,
                safe_bottom=cls.SAFE_BOTTOM,
                safe_left=cls.SAFE_LEFT,
                safe_right=cls.SAFE_RIGHT,
                occupied_x_min=0,
                occupied_x_max=0,
                occupied_y_min=0,
                occupied_y_max=0,
                occupied_width=0,
                occupied_height=0,
                occupied_width_pct=0,
                occupied_height_pct=0,
                occupied_area_pct=0,
                top_dead_zone_px=cls.SAFE_TOP,
                bottom_dead_zone_px=cls.CANVAS_HEIGHT - cls.SAFE_BOTTOM,
                semantic_density_score=0.0,
                density_status="LOW_DENSITY_WARNING",
                readability_violations=["No actors in scene"],
                warnings=["Empty scene layout"],
            )

        x_min = min(a.left for a in actors)
        x_max = max(a.right for a in actors)
        y_min = min(a.top for a in actors)
        y_max = max(a.bottom for a in actors)

        occ_w = max(0.0, x_max - x_min)
        occ_h = max(0.0, y_max - y_min)

        total_canvas_area = cls.CANVAS_WIDTH * cls.CANVAS_HEIGHT
        occ_area = occ_w * occ_h

        occ_w_pct = round((occ_w / cls.CANVAS_WIDTH) * 100.0, 1)
        occ_h_pct = round((occ_h / cls.CANVAS_HEIGHT) * 100.0, 1)
        occ_area_pct = round((occ_area / total_canvas_area) * 100.0, 1)

        top_dead_zone = round(max(0.0, y_min), 1)
        # Bottom dead zone is specifically the gap between content bottom and kinetic captions at 1380
        bottom_dead_zone = round(max(0.0, cls.CAPTIONS_START_Y - y_max), 1)

        # Semantic density considers actor importance weighting
        importance_weights = {
            "HERO": 1.5,
            "CRITICAL": 1.2,
            "IMPORTANT": 1.0,
            "SECONDARY": 0.8,
            "TERTIARY": 0.5,
            "DECORATIVE": 0.2,
        }
        def _get_weight(act: ActorBounds) -> float:
            if act.semantic_role == "presenter_host":
                return 0.25
            return importance_weights.get(act.importance, 1.0)

        weighted_area = sum(a.area * _get_weight(a) for a in actors)
        safe_zone_area = cls.SAFE_WIDTH * cls.SAFE_HEIGHT
        density_score = round(min(1.0, weighted_area / safe_zone_area), 2)

        warnings: List[str] = []
        readability_violations: List[str] = []

        if occ_h_pct < 45.0:
            warnings.append(
                f"Low occupied height ({occ_h_pct}% < 45%). Content clusters into cramped region, causing excessive dead space."
            )

        if bottom_dead_zone > 300.0:
            warnings.append(
                f"Excessive bottom dead space ({bottom_dead_zone}px > 300px). Content terminates prematurely above caption bar."
            )

        for a in actors:
            if a.font_size_px is not None:
                if a.semantic_role in ["scene_headline", "hook_slam", "thesis_statement"]:
                    if a.font_size_px < cls.MIN_HEADLINE_SIZE:
                        readability_violations.append(
                            f"Headline '{a.id}' fontSize {a.font_size_px}px < minimum {cls.MIN_HEADLINE_SIZE}px"
                        )
                elif a.font_size_px < cls.ABSOLUTE_FONT_FLOOR:
                    readability_violations.append(
                        f"Actor '{a.id}' fontSize {a.font_size_px}px violates Rule 5.4 absolute floor ({cls.ABSOLUTE_FONT_FLOOR}px)"
                    )

        if density_score < 0.35:
            density_status = "LOW_DENSITY_WARNING"
        elif density_score <= 0.92:
            density_status = "OPTIMAL" if density_score >= 0.50 else "BALANCED"
        else:
            density_status = "OVERCROWDED"

        return CompositionMetrics(
            canvas_width=cls.CANVAS_WIDTH,
            canvas_height=cls.CANVAS_HEIGHT,
            safe_top=cls.SAFE_TOP,
            safe_bottom=cls.SAFE_BOTTOM,
            safe_left=cls.SAFE_LEFT,
            safe_right=cls.SAFE_RIGHT,
            occupied_x_min=round(x_min, 1),
            occupied_x_max=round(x_max, 1),
            occupied_y_min=round(y_min, 1),
            occupied_y_max=round(y_max, 1),
            occupied_width=round(occ_w, 1),
            occupied_height=round(occ_h, 1),
            occupied_width_pct=occ_w_pct,
            occupied_height_pct=occ_h_pct,
            occupied_area_pct=occ_area_pct,
            top_dead_zone_px=top_dead_zone,
            bottom_dead_zone_px=bottom_dead_zone,
            semantic_density_score=density_score,
            density_status=density_status,
            readability_violations=readability_violations,
            warnings=warnings,
        )

    @classmethod
    def format_diagnostic_report(cls, scene_id: str, metrics: CompositionMetrics, actors: List[ActorBounds]) -> str:
        """Formats the official RightMotion Section 25 Mobile Composition QA report."""
        status_icon = "✅" if metrics.density_status in ["OPTIMAL", "BALANCED"] and not metrics.warnings else "⚠️"
        lines = [
            "-" * 70,
            f"🎬 MOBILE COMPOSITION AUDIT — {scene_id.upper()} {status_icon}",
            "-" * 70,
            f"Canvas: {metrics.canvas_width}x{metrics.canvas_height} (9:16 Vertical)",
            f"Occupied Bounds: x = [{metrics.occupied_x_min} .. {metrics.occupied_x_max}], y = [{metrics.occupied_y_min} .. {metrics.occupied_y_max}]",
            f"Occupied: {metrics.occupied_width_pct}% Width | {metrics.occupied_height_pct}% Height | {metrics.occupied_area_pct}% Screen Area",
            f"Vertical Dead Space: Top = {int(metrics.top_dead_zone_px)}px | Bottom Gap to Captions = {int(metrics.bottom_dead_zone_px)}px",
            f"Semantic Density Score: {metrics.semantic_density_score} ({metrics.density_status})",
            "",
            "Visual Actors Distribution:",
        ]

        for a in actors:
            pct_screen = round((a.area / (metrics.canvas_width * metrics.canvas_height)) * 100.0, 1)
            f_str = f" | Font: {int(a.font_size_px)}px" if a.font_size_px else ""
            lines.append(
                f"  • [{a.importance:8s}] {a.id:<26s} | {int(a.width)}x{int(a.height)} at ({int(a.x)}, {int(a.y)}) | Area: {pct_screen}%{f_str}"
            )

        if metrics.warnings:
            lines.append("")
            lines.append("Warnings:")
            for w in metrics.warnings:
                lines.append(f"  ⚠️ {w}")

        if metrics.readability_violations:
            lines.append("")
            lines.append("Readability Violations:")
            for rv in metrics.readability_violations:
                lines.append(f"  ❌ {rv}")

        lines.append("-" * 70)
        return "\n".join(lines)
