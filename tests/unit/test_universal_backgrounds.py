#!/usr/bin/env python3
"""
🧪 Test Suite for RightMotion Universal Background Intelligence
Location: scripts/test_universal_backgrounds.py

Comprehensive test suite covering:
  - UBG-001 through UBG-020 (Discovery, security, analysis, scoring, AST, rendering)
  - Creative Regression Cases A through G (Narrative scenarios)
"""

import copy
import json
import os
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

import numpy as np
from PIL import Image

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from background_intelligence import (
    BackgroundAnalyzer,
    BackgroundRegistry,
    sanitize_and_validate_path,
    compute_file_hash,
    SUPPORTED_EXTENSIONS,
)
from background_selector import (
    BackgroundSelector,
    SceneContext,
    BackgroundDecision,
)
from validate_motion_ast import validate_motion_ast


class TestUniversalBackgroundIntelligence(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.fixture_ast_path = ROOT_DIR / "scripts" / "fixtures" / "small_compromises_ast.json"
        with open(cls.fixture_ast_path, "r", encoding="utf-8") as f:
            cls.canonical_ast = json.load(f)

    def setUp(self):
        # Create an isolated temporary background directory and cache for mutation tests
        self.test_dir = tempfile.mkdtemp(prefix="rightmotion_ubg_test_")
        self.bg_dir = Path(self.test_dir) / "backgrounds"
        self.bg_dir.mkdir(parents=True, exist_ok=True)
        self.cache_file = Path(self.test_dir) / "cache.json"
        self.registry_file = Path(self.test_dir) / "registry.json"
        self.registry = BackgroundRegistry(
            bg_dir=self.bg_dir,
            cache_file=self.cache_file,
            registry_path=self.registry_file,
        )

    def tearDown(self):
        shutil.rmtree(self.test_dir, ignore_errors=True)

    def _create_sample_image(self, name: str, size=(600, 1000), color=(30, 30, 35)):
        arr = np.full((size[1], size[0], 3), color, dtype=np.uint8)
        img = Image.fromarray(arr)
        path = self.bg_dir / name
        img.save(path)
        return path

    # -------------------------------------------------------------------------
    # UBG-001: Discover new background
    # -------------------------------------------------------------------------
    def test_ubg_001_discover_new_background(self):
        self._create_sample_image("dark_texture_01.jpg", color=(20, 20, 20))
        entries = self.registry.scan()
        self.assertIn("dark_texture_01", entries)
        self.assertEqual(entries["dark_texture_01"]["filename"], "dark_texture_01.jpg")
        self.assertEqual(entries["dark_texture_01"]["status"], "READY")

    # -------------------------------------------------------------------------
    # UBG-002: Ignore unsupported file
    # -------------------------------------------------------------------------
    def test_ubg_002_ignore_unsupported_file(self):
        unsupported = self.bg_dir / "notes.txt"
        unsupported.write_text("Hello world", encoding="utf-8")
        exe_file = self.bg_dir / "malware.exe"
        exe_file.write_bytes(b"\x00\x01\x02")
        entries = self.registry.scan()
        self.assertNotIn("notes", entries)
        self.assertNotIn("malware", entries)

    # -------------------------------------------------------------------------
    # UBG-003: Generate metadata
    # -------------------------------------------------------------------------
    def test_ubg_003_generate_metadata(self):
        self._create_sample_image("sample_dark.png", size=(720, 1280), color=(15, 18, 24))
        entries = self.registry.scan()
        meta = entries["sample_dark"]
        self.assertEqual(meta["width"], 720)
        self.assertEqual(meta["height"], 1280)
        self.assertEqual(meta["tone"], "dark")
        self.assertIn("textCompatibility", meta)
        self.assertIn("textSafeRegions", meta)
        self.assertIn("motionSuitability", meta)

    # -------------------------------------------------------------------------
    # UBG-004: Cache metadata
    # -------------------------------------------------------------------------
    def test_ubg_004_cache_metadata(self):
        self._create_sample_image("cache_test.jpg")
        self.registry.scan()
        self.assertTrue(self.cache_file.exists())
        with open(self.cache_file, "r", encoding="utf-8") as f:
            cache = json.load(f)
        self.assertIn("cache_test", cache)
        self.assertIn("analysis", cache["cache_test"])

    # -------------------------------------------------------------------------
    # UBG-005: Detect modified background
    # -------------------------------------------------------------------------
    def test_ubg_005_detect_modified_background(self):
        img_path = self._create_sample_image("mod_test.png", color=(10, 10, 10))
        self.registry.scan()
        h1 = self.registry.cache["mod_test"]["analysis"]["hash"]

        # Modify image content
        arr = np.full((1000, 600, 3), (250, 250, 250), dtype=np.uint8)
        Image.fromarray(arr).save(img_path)
        # Scan again
        entries = self.registry.scan()
        h2 = entries["mod_test"]["hash"]
        self.assertNotEqual(h1, h2)
        self.assertEqual(entries["mod_test"]["tone"], "bright")

    # -------------------------------------------------------------------------
    # UBG-006: Detect deleted background
    # -------------------------------------------------------------------------
    def test_ubg_006_detect_deleted_background(self):
        img_path = self._create_sample_image("to_delete.png")
        self.registry.scan()
        self.assertIn("to_delete", self.registry.registry_path.read_text(encoding="utf-8"))

        img_path.unlink()
        entries = self.registry.scan()
        self.assertNotIn("to_delete", entries)

    # -------------------------------------------------------------------------
    # UBG-007: Reject path traversal
    # -------------------------------------------------------------------------
    def test_ubg_007_reject_path_traversal(self):
        evil_path = Path("../../etc/passwd")
        self.assertFalse(sanitize_and_validate_path(evil_path, self.bg_dir))
        bad_chars = Path(self.bg_dir / "test;rm -rf.jpg")
        self.assertFalse(sanitize_and_validate_path(bad_chars, self.bg_dir))

    # -------------------------------------------------------------------------
    # UBG-008: Correctly score dark textured background
    # -------------------------------------------------------------------------
    def test_ubg_008_correctly_score_dark_textured_background(self):
        # Use real library
        selector = BackgroundSelector()
        ctx = SceneContext(
            scene_id="cinematic_intro",
            role="hook",
            script_text="The subtle friction in daily decision making.",
            emotional_tone="cinematic",
            primary_text_color="#ffffff",
        )
        decision = selector.evaluate_scene(ctx)
        self.assertEqual(decision.mode, "universal")
        self.assertEqual(decision.selected_asset_id, "dark_matte_spotlight_01")
        self.assertEqual(decision.semantic_role, "cinematic_surface")

    # -------------------------------------------------------------------------
    # UBG-009: Correctly identify text-safe candidate
    # -------------------------------------------------------------------------
    def test_ubg_009_correctly_identify_text_safe_candidate(self):
        selector = BackgroundSelector()
        ctx = SceneContext(
            scene_id="text_scene",
            role="definition",
            script_text="The standard you accept.",
            emotional_tone="reflective",
            expected_text_zone="center",
            primary_text_color="#ffffff",
        )
        decision = selector.evaluate_scene(ctx)
        self.assertEqual(decision.mode, "universal")
        top_score = decision.candidate_scores[0]
        self.assertGreaterEqual(top_score["text_safe_fit"], 0.8)

    # -------------------------------------------------------------------------
    # UBG-010: Correctly reject visually incompatible background
    # -------------------------------------------------------------------------
    def test_ubg_010_correctly_reject_visually_incompatible_background(self):
        selector = BackgroundSelector()
        # Dark text colliding with dark background
        ctx = SceneContext(
            scene_id="black_text_scene",
            role="mechanism",
            script_text="Data definition",
            emotional_tone="calm",
            primary_text_color="#090d16",  # Dark text
            visual_complexity_score=1.5,
        )
        decision = selector.evaluate_scene(ctx)
        # Should pick paper_warm_tactile_02 (bright ground) over dark_matte_spotlight_01
        self.assertEqual(decision.selected_asset_id, "paper_warm_tactile_02")

    # -------------------------------------------------------------------------
    # UBG-011: No-background option works
    # -------------------------------------------------------------------------
    def test_ubg_011_no_background_option_works(self):
        selector = BackgroundSelector()
        ctx = SceneContext(
            scene_id="pure_diagram",
            role="mechanism",
            script_text="Neurotransmitter synaptic cleft diagram",
            emotional_tone="analytical",
            is_diagram_heavy=True,
        )
        decision = selector.evaluate_scene(ctx)
        self.assertEqual(decision.mode, "none")
        self.assertIsNone(decision.selected_asset_id)
        self.assertIn("diagram", decision.reason.lower())

    # -------------------------------------------------------------------------
    # UBG-012: Multiple backgrounds can appear in one video
    # -------------------------------------------------------------------------
    def test_ubg_012_multiple_backgrounds_can_appear_in_one_video(self):
        selector = BackgroundSelector()
        ctx1 = SceneContext(
            scene_id="scene_1",
            role="hook",
            script_text="Opening tension",
            emotional_tone="cinematic",
            primary_text_color="#ffffff",
        )
        dec1 = selector.evaluate_scene(ctx1)

        ctx2 = SceneContext(
            scene_id="scene_2",
            role="mechanism",
            script_text="Editorial explanation on paper",
            emotional_tone="editorial",
            primary_text_color="#090d16",
            previous_background_id=dec1.selected_asset_id,
            is_chapter_shift=True,
        )
        dec2 = selector.evaluate_scene(ctx2)

        self.assertNotEqual(dec1.selected_asset_id, dec2.selected_asset_id)
        self.assertEqual(dec1.selected_asset_id, "dark_matte_spotlight_01")
        self.assertEqual(dec2.selected_asset_id, "paper_warm_tactile_02")

    # -------------------------------------------------------------------------
    # UBG-013: Same background reuse penalty works
    # -------------------------------------------------------------------------
    def test_ubg_013_same_background_reuse_penalty_works(self):
        selector = BackgroundSelector()
        ctx = SceneContext(
            scene_id="scene_repeated",
            role="mechanism",
            script_text="Editorial explanation",
            emotional_tone="calm",
            previous_background_id="dark_matte_spotlight_01",
            background_usage_history=["dark_matte_spotlight_01", "dark_matte_spotlight_01"],
            is_chapter_shift=True,
        )
        decision = selector.evaluate_scene(ctx)
        dark_cand = next(c for c in decision.candidate_scores if c["asset_id"] == "dark_matte_spotlight_01")
        self.assertLessEqual(dark_cand["continuity_fit"], 0.4)

    # -------------------------------------------------------------------------
    # UBG-014: Intentional background return remains possible
    # -------------------------------------------------------------------------
    def test_ubg_014_intentional_background_return_remains_possible(self):
        selector = BackgroundSelector()
        ctx = SceneContext(
            scene_id="scene_resolution",
            role="resolution",
            script_text="Returning to the foundational question.",
            emotional_tone="cinematic",
            primary_text_color="#ffffff",
            previous_background_id="paper_warm_tactile_02",
            background_usage_history=["dark_matte_spotlight_01", "paper_warm_tactile_02"],
            allow_narrative_return=True,
        )
        decision = selector.evaluate_scene(ctx)
        dark_cand = next(c for c in decision.candidate_scores if c["asset_id"] == "dark_matte_spotlight_01")
        self.assertEqual(dark_cand["continuity_fit"], 1.0)
        self.assertEqual(decision.selected_asset_id, "dark_matte_spotlight_01")

    # -------------------------------------------------------------------------
    # UBG-015: 9:16 crop preserves focal region
    # -------------------------------------------------------------------------
    def test_ubg_015_9_16_crop_preserves_focal_region(self):
        selector = BackgroundSelector()
        ctx = SceneContext(
            scene_id="top_focal",
            role="hook",
            script_text="Focusing on the lighting pool.",
            emotional_tone="cinematic",
            expected_text_zone="bottom",
        )
        decision = selector.evaluate_scene(ctx)
        self.assertEqual(decision.crop_strategy, "top_weighted")

    # -------------------------------------------------------------------------
    # UBG-016: Background does not obscure presenter
    # -------------------------------------------------------------------------
    def test_ubg_016_background_does_not_obscure_presenter(self):
        selector = BackgroundSelector()
        ctx = SceneContext(
            scene_id="presenter_scene",
            role="hook",
            script_text="Judy introduces the core lesson.",
            emotional_tone="cinematic",
            has_presenter=True,
            primary_text_color="#ffffff",
        )
        decision = selector.evaluate_scene(ctx)
        top_cand = decision.candidate_scores[0]
        self.assertEqual(top_cand["presenter_fit"], 1.0)

    # -------------------------------------------------------------------------
    # UBG-017: Background does not destroy typography contrast
    # -------------------------------------------------------------------------
    def test_ubg_017_background_does_not_destroy_typography_contrast(self):
        selector = BackgroundSelector()
        ctx = SceneContext(
            scene_id="light_text_scene",
            role="hook",
            script_text="White text headline",
            emotional_tone="cinematic",
            primary_text_color="#ffffff",
        )
        decision = selector.evaluate_scene(ctx)
        dark_cand = next(c for c in decision.candidate_scores if c["asset_id"] == "dark_matte_spotlight_01")
        self.assertEqual(dark_cand["contrast_fit"], 1.0)

    # -------------------------------------------------------------------------
    # UBG-018: Background transition can be represented in Motion AST
    # -------------------------------------------------------------------------
    def test_ubg_018_background_transition_can_be_represented_in_motion_ast(self):
        ast = copy.deepcopy(self.canonical_ast)
        # Add backgroundIntent to scene 0
        ast["scenes"][0]["backgroundIntent"] = {
            "mode": "universal",
            "assetId": "dark_matte_spotlight_01",
            "semanticRole": "cinematic_surface",
            "cropStrategy": "center_focal",
            "motion": "slow_zoom_in",
            "opacity": 1.0,
            "transitionIn": {
                "type": "fade",
                "durationFrames": 15,
            },
            "transitionOut": {
                "type": "dissolve",
                "durationFrames": 15,
            },
            "reason": "Cinematic dark spotlight provides high contrast stage for headline",
        }
        res = validate_motion_ast(ast)
        self.assertTrue(res.is_valid, f"AST failed validation: {[e.message for e in res.errors]}")

    # -------------------------------------------------------------------------
    # UBG-019: Background asset survives agent-generated video pipeline
    # -------------------------------------------------------------------------
    def test_ubg_019_background_asset_survives_pipeline(self):
        # Verify TypeScript definitions and registry match
        reg_file = ROOT_DIR / "public" / "assets" / "universal_backgrounds" / "registry.json"
        self.assertTrue(reg_file.exists())
        with open(reg_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        self.assertIn("dark_matte_spotlight_01", data)
        self.assertTrue((ROOT_DIR / "public" / data["dark_matte_spotlight_01"]["path"]).exists())

    # -------------------------------------------------------------------------
    # UBG-020: Render proof succeeds
    # -------------------------------------------------------------------------
    def test_ubg_020_render_proof_succeeds(self):
        proof_still = ROOT_DIR / "out" / "ubg_proof_scene1.png"
        self.assertTrue(proof_still.exists(), "Render proof out/ubg_proof_scene1.png must exist")
        self.assertGreater(proof_still.stat().st_size, 50000)

    # -------------------------------------------------------------------------
    # CREATIVE REGRESSION CASES A THROUGH G
    # -------------------------------------------------------------------------
    def test_creative_regression_case_a_dark_cinematic(self):
        """Case A: Dark cinematic script selects dark universal background."""
        selector = BackgroundSelector()
        ctx = SceneContext(
            scene_id="case_a",
            role="hook",
            script_text="The subtle collapse of willpower under sustained pressure.",
            emotional_tone="cinematic",
            primary_text_color="#ffffff",
        )
        decision = selector.evaluate_scene(ctx)
        self.assertEqual(decision.mode, "universal")
        self.assertEqual(decision.selected_asset_id, "dark_matte_spotlight_01")

    def test_creative_regression_case_b_educational_diagram(self):
        """Case B: Educational diagram scene suppresses background to preserve clarity."""
        selector = BackgroundSelector()
        ctx = SceneContext(
            scene_id="case_b",
            role="mechanism",
            script_text="Examine the cellular feedback loop.",
            emotional_tone="analytical",
            is_diagram_heavy=True,
        )
        decision = selector.evaluate_scene(ctx)
        self.assertEqual(decision.mode, "none")
        self.assertIn("diagram", decision.reason.lower())

    def test_creative_regression_case_c_presenter_scene(self):
        """Case C: Presenter scene ensures sharp separation for Judy."""
        selector = BackgroundSelector()
        ctx = SceneContext(
            scene_id="case_c",
            role="hook",
            script_text="Host speaks directly to camera.",
            emotional_tone="cinematic",
            has_presenter=True,
            primary_text_color="#ffffff",
        )
        decision = selector.evaluate_scene(ctx)
        self.assertEqual(decision.mode, "universal")
        self.assertGreaterEqual(decision.candidate_scores[0]["presenter_fit"], 0.9)

    def test_creative_regression_case_d_material_transformation(self):
        """Case D: Material transformation selects tactile surface."""
        selector = BackgroundSelector()
        ctx = SceneContext(
            scene_id="case_d",
            role="mechanism",
            script_text="The physical fiber of memory etched over time.",
            emotional_tone="editorial",
            primary_text_color="#090d16",
        )
        decision = selector.evaluate_scene(ctx)
        self.assertEqual(decision.mode, "universal")
        self.assertEqual(decision.selected_asset_id, "paper_warm_tactile_02")
        self.assertEqual(decision.semantic_role, "tactile_stage")

    def test_creative_regression_case_e_multi_chapter(self):
        """Case E: Multi-chapter narrative shifts backgrounds across scenes."""
        selector = BackgroundSelector()
        d1 = selector.evaluate_scene(
            SceneContext("ch1", "hook", "Chapter 1: The Dark Origin", "cinematic", primary_text_color="#ffffff")
        )
        d2 = selector.evaluate_scene(
            SceneContext(
                "ch2",
                "mechanism",
                "Chapter 2: The Written Code",
                "editorial",
                primary_text_color="#090d16",
                previous_background_id=d1.selected_asset_id,
                is_chapter_shift=True,
            )
        )
        self.assertNotEqual(d1.selected_asset_id, d2.selected_asset_id)

    def test_creative_regression_case_f_minimal_typography(self):
        """Case F: Minimal typography scene uses background as atmospheric stage."""
        selector = BackgroundSelector()
        ctx = SceneContext(
            scene_id="case_f",
            role="hook",
            script_text="SILENCE.",
            emotional_tone="reflective",
            primary_text_color="#ffffff",
            visual_complexity_score=1.0,
        )
        decision = selector.evaluate_scene(ctx)
        self.assertEqual(decision.mode, "universal")
        self.assertIn("spotlight", decision.selected_asset_id)

    def test_creative_regression_case_g_high_density_visual_mechanism(self):
        """Case G: High-density visual mechanism suppresses background."""
        selector = BackgroundSelector()
        ctx = SceneContext(
            scene_id="case_g",
            role="mechanism",
            script_text="Multiple counterweights colliding under stress.",
            emotional_tone="tense",
            visual_complexity_score=3.8,  # Exceeds 3.2 threshold
        )
        decision = selector.evaluate_scene(ctx)
        self.assertEqual(decision.mode, "none")
        self.assertIn("visual complexity is high", decision.reason.lower())


if __name__ == "__main__":
    unittest.main()
