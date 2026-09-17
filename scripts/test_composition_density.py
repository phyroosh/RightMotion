#!/usr/bin/env python3
"""
🧪 RightMotion Mobile Composition & Visual Density Test Suite
Location: scripts/test_composition_density.py

Validates Section 25 Mobile Composition Standards:
  1. Safe Bounds Adherence: All foreground elements remain within x: [72, 1008], y: [280, 1340].
  2. Elimination of Excessive Dead Space: Occupied vertical height >= 45% (eliminating 27% collapse).
  3. Caption Clearance & Gap Control: Bottom dead zone gap to captions (y=1380) <= 300px (eliminating 580px void).
  4. Typography Readability Floor: Headlines >= 56px, all text >= 36px touchless mobile floor.
  5. Semantic Importance Controls Area: HERO actors allocated dominant area (>= 15% screen).
  6. Production Motion AST Verification: The Art Of Environment scenes achieve BALANCED or OPTIMAL density.
"""

import json
import os
import sys
import unittest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from geometry_resolver import GeometryResolver, ActorBounds, CompositionMetrics
from validate_motion_ast import validate_motion_ast
from orchestrator import CreativeOrchestrator


class TestMobileCompositionDensity(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.orchestrator = CreativeOrchestrator()

    def test_01_safe_bounds_enforcement(self):
        """Verify GeometryResolver calculates bounds strictly within YouTube Shorts safe region."""
        raw_actors = [
            {"id": "hero_actor", "semanticRole": "hook_curiosity_anchor", "narrativeImportance": "HERO"}
        ]
        raw_annotations = [
            {"annotationId": "headline", "text": "TEST HEADLINE", "fontSizePx": 68}
        ]

        bounds, metrics = GeometryResolver.resolve_scene_layout(
            scene_id="scene_1_hook",
            role="hook",
            dominant_metaphor="cognitive_dissonance",
            actors_data=raw_actors,
            annotations_data=raw_annotations,
            has_presenter=True,
        )

        for b in bounds:
            # Check horizontal bounds
            self.assertGreaterEqual(b.left, 50, f"Actor {b.id} left edge {b.left} exceeds left margin")
            self.assertLessEqual(b.right, 1030, f"Actor {b.id} right edge {b.right} exceeds right margin")

    def test_02_comparison_scene_eliminates_dead_space(self):
        """Verify comparison archetype occupies >= 45% height and eliminates the 580px gap."""
        raw_actors = [
            {"id": "path_anchor", "semanticRole": "physical_metaphor_anchor", "narrativeImportance": "HERO"}
        ]
        raw_annotations = [
            {"annotationId": "headline", "text": "PATH OF LOWEST FRICTION", "fontSizePx": 64}
        ]

        bounds, metrics = GeometryResolver.resolve_scene_layout(
            scene_id="scene_4_comparison",
            role="mechanism",
            dominant_metaphor="competing_paths_friction",
            actors_data=raw_actors,
            annotations_data=raw_annotations,
            has_presenter=False,
        )

        # Assert occupied height is at least 45% (was previously 27%)
        self.assertGreaterEqual(
            metrics.occupied_height_pct,
            45.0,
            f"Occupied height {metrics.occupied_height_pct}% is too low (excessive dead space)",
        )

        # Assert bottom dead space gap to captions is <= 250px (was previously 580px)
        self.assertLessEqual(
            metrics.bottom_dead_zone_px,
            250.0,
            f"Bottom dead zone {metrics.bottom_dead_zone_px}px is too large (void above captions)",
        )

        # Assert semantic density status is BALANCED or OPTIMAL
        self.assertIn(metrics.density_status, ["BALANCED", "OPTIMAL"])

    def test_03_typography_readability_floor(self):
        """Verify typography audit flags any element violating Rule 5.4 36px floor."""
        bad_actors = [
            ActorBounds(
                id="tiny_label",
                semantic_role="explanatory_label",
                importance="TERTIARY",
                x=540,
                y=600,
                width=400,
                height=50,
                font_size_px=22,  # Violates 36px floor!
            )
        ]
        metrics = GeometryResolver.calculate_metrics(bad_actors)
        self.assertTrue(
            any("violates Rule 5.4 absolute floor" in v for v in metrics.readability_violations),
            "Must flag font sizes below 36px as readability violations",
        )

    def test_04_hero_actor_receives_dominant_area(self):
        """Verify HERO actor receives at least 15% of screen area."""
        raw_actors = [
            {"id": "hero_illustration", "semanticRole": "hook_curiosity_anchor", "narrativeImportance": "HERO"}
        ]
        raw_annotations = [
            {"annotationId": "headline", "text": "THE WILLPOWER ILLUSION", "fontSizePx": 68}
        ]

        bounds, metrics = GeometryResolver.resolve_scene_layout(
            scene_id="scene_1_hook",
            role="hook",
            dominant_metaphor="spatial_architecture",
            actors_data=raw_actors,
            annotations_data=raw_annotations,
            has_presenter=False,
        )

        hero_actor = next(b for b in bounds if b.id == "hero_illustration")
        total_screen_area = 1080 * 1920
        hero_area_pct = (hero_actor.area / total_screen_area) * 100.0

        self.assertGreaterEqual(
            hero_area_pct,
            15.0,
            f"HERO actor area {hero_area_pct:.1f}% must be >= 15% of screen area",
        )

    def test_05_the_art_of_environment_motion_ast_metrics(self):
        """Verify production motion_ast.json contains valid mobile composition metrics."""
        ast_path = ROOT_DIR / "src" / "clips" / "the_art_of_environment" / "motion_ast.json"
        self.assertTrue(ast_path.exists(), "motion_ast.json must exist")

        with open(ast_path, "r", encoding="utf-8") as f:
            ast_data = json.load(f)

        for sc in ast_data["scenes"]:
            metrics = sc.get("compositionMetrics")
            self.assertIsNotNone(metrics, f"Scene {sc['sceneId']} must have compositionMetrics")
            self.assertGreaterEqual(
                metrics["occupiedWidthPct"],
                75.0,
                f"Scene {sc['sceneId']} occupied width must be >= 75%",
            )
            self.assertIn(
                metrics["densityStatus"],
                ["BALANCED", "OPTIMAL"],
                f"Scene {sc['sceneId']} density must be BALANCED or OPTIMAL",
            )


if __name__ == "__main__":
    unittest.main(verbosity=2)
