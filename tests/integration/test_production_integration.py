#!/usr/bin/env python3
"""
🧪 RightMotion Production Integration Test Suite
Location: scripts/test_production_integration.py

Verifies end-to-end production integration of Universal Background Intelligence:
  1. CreativeOrchestrator invokes BackgroundSelector for all scenes.
  2. Frontier capability F_UBG is preserved against budget pruning.
  3. Motion AST is strictly generated, validated, and serialized to motion_ast.json.
  4. scaffold_clip_files dynamically emits Background.tsx using UniversalBackground.
  5. The real production clip (The Art Of Environment) has valid AST, correct assetId,
     and dynamic Background.tsx integration.
"""

import json
import os
import sys
import unittest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from orchestrator import CreativeOrchestrator
from validate_motion_ast import validate_motion_ast
from background_intelligence import BackgroundRegistry
from background_selector import BackgroundSelector


class TestProductionUniversalBackgroundIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.orchestrator = CreativeOrchestrator()

    def test_01_orchestrator_initializes_background_selector(self):
        """Verify orchestrator embeds BackgroundSelector and discovers ready assets."""
        self.assertIsNotNone(self.orchestrator.background_selector)
        self.assertIsInstance(self.orchestrator.background_selector, BackgroundSelector)
        assets = self.orchestrator.background_selector.registry.scan()
        self.assertGreater(len(assets), 0, "Universal background registry must have ready assets")
        self.assertIn("dark_matte_spotlight_01", assets)

    def test_02_dark_introspective_script_selects_dark_spotlight(self):
        """Verify that a dark introspective script evaluates and selects dark_matte_spotlight_01."""
        clip_name = "test_env_clip"
        topic = "The Art Of Environment: Why You Keep Losing to Your Room"
        script = (
            "You blame your willpower for every bad habit, but you are not fighting your impulses. "
            "You are fighting your room. Every object in your visual field sends an unconscious micro-demand "
            "to your nervous system. A phone on your desk silently drains cognitive bandwidth even when "
            "face down. Your brain takes the path of lowest spatial friction every single time."
        )
        plan = self.orchestrator.generate_plan(clip_name, topic, script)
        
        # Verify F_UBG is selected in at least one scene
        all_active_codes = []
        for sp in plan["scenePlans"]:
            all_active_codes.extend([c["frontierCode"] for c in sp["activeCapabilities"]])
        self.assertIn("F_UBG", all_active_codes, "F_UBG must be retained in active scene capabilities")
        
        # Verify hook scene has dark_matte_spotlight_01
        hook_plan = plan["scenePlans"][0]
        self.assertEqual(hook_plan["backgroundIntent"]["mode"], "universal")
        self.assertEqual(hook_plan["backgroundIntent"]["assetId"], "dark_matte_spotlight_01")

    def test_03_motion_ast_compilation_and_schema_validation(self):
        """Verify orchestrator compiles valid Motion AST conforming to schema."""
        clip_name = "test_env_clip"
        topic = "The Art Of Environment: Why You Keep Losing to Your Room"
        script = (
            "You blame your willpower for every bad habit, but you are not fighting your impulses. "
            "You are fighting your room. Every object in your visual field sends an unconscious micro-demand "
            "to your nervous system. A phone on your desk silently drains cognitive bandwidth even when "
            "face down. Your brain takes the path of lowest spatial friction every single time."
        )
        plan = self.orchestrator.generate_plan(clip_name, topic, script)
        
        # Mock transcript
        words = script.split()
        transcript = [
            {"word": w, "start": i * 0.3, "end": (i + 1) * 0.3, "confidence": 0.99}
            for i, w in enumerate(words)
        ]
        
        ast = self.orchestrator.compile_motion_ast(plan, transcript)
        
        # Schema validation
        result = validate_motion_ast(ast)
        self.assertTrue(result.is_valid, f"Compiled Motion AST failed schema validation: {[e.message for e in result.errors]}")
        
        # Verify backgroundIntent
        self.assertIn("environment", ast)
        self.assertIn("defaultBackgroundIntent", ast["environment"])
        self.assertEqual(ast["environment"]["defaultBackgroundIntent"]["mode"], "universal")
        self.assertEqual(ast["environment"]["defaultBackgroundIntent"]["assetId"], "dark_matte_spotlight_01")

    def test_04_the_art_of_environment_production_artifacts(self):
        """Verify the real production artifacts for The Art Of Environment clip."""
        clip_dir = ROOT_DIR / "src" / "clips" / "the_art_of_environment"
        self.assertTrue(clip_dir.exists(), "Clip directory must exist")
        
        ast_path = clip_dir / "motion_ast.json"
        self.assertTrue(ast_path.exists(), "motion_ast.json must exist in clip directory")
        
        with open(ast_path, "r", encoding="utf-8") as f:
            ast_data = json.load(f)
            
        result = validate_motion_ast(ast_data)
        self.assertTrue(result.is_valid, f"The Art Of Environment motion_ast.json invalid: {[e.message for e in result.errors]}")
        
        # Verify background intent in scenes
        hook_intent = ast_data["scenes"][0].get("backgroundIntent")
        self.assertIsNotNone(hook_intent, "Scene 1 hook must contain backgroundIntent")
        self.assertEqual(hook_intent["assetId"], "dark_matte_spotlight_01")
        
        # Verify Background.tsx
        bg_tsx_path = clip_dir / "Background.tsx"
        self.assertTrue(bg_tsx_path.exists(), "Background.tsx must exist")
        bg_content = bg_tsx_path.read_text(encoding="utf-8")
        
        self.assertIn("UniversalBackground", bg_content, "Background.tsx must render UniversalBackground")
        self.assertIn('assetId="dark_matte_spotlight_01"', bg_content)
        self.assertNotIn("ArchitecturalDraftingCanvas", bg_content, "Must not use legacy hardcoded canvas")

    def test_05_f_ubg_not_pruned_by_budget(self):
        """Verify that F_UBG is explicitly exempted from complexity budget pruning."""
        clip_name = "complex_clip"
        topic = "A Complex Topic with Maximum Effects"
        script = (
            "We trigger multiple heavy capabilities simultaneously to test whether F_UBG "
            "is erroneously pruned when the complexity budget is exceeded."
        )
        plan = self.orchestrator.generate_plan(clip_name, topic, script)
        
        # Ensure F_UBG survived pruning in scenes where it was chosen
        all_active_codes = []
        for sp in plan["scenePlans"]:
            all_active_codes.extend([c["frontierCode"] for c in sp["activeCapabilities"]])
        self.assertIn("F_UBG", all_active_codes, "F_UBG must never be pruned as an effect")


if __name__ == "__main__":
    unittest.main(verbosity=2)
