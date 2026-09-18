#!/usr/bin/env python3
"""
🧪 Unit Test Suite for RightMotion Pre-Flight Clip Validator
Location: tests/unit/test_validate_clip.py

Validates the contracts and architectural invariants of scripts/validate_clip.py:
  1. to_pascal_case conversion helper.
  2. Canonical registry audit in src/clips/registry.ts (dynamic Root.tsx integration).
  3. Word-count preservation (regression test for thumbnail hook shadowing).
  4. Obsolete 4-scene motion_plan.json check removal.
  5. Zero-meme policy violation warnings.
  6. Thumbnail plan complexity budget enforcement (textHook <= 3 words).
  7. Missing critical files detection (index.tsx, Canvas.tsx, transcript.json, voiceover.mp3).
  8. Mismatched pascalName or composition import detection.
  9. Solo vs Duo runtime policy warnings.
  10. Full validation on canonical production clip (what_you_tolerate).
"""

import json
import os
import shutil
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

import validate_clip


class TestValidateClip(unittest.TestCase):
    def test_01_to_pascal_case(self):
        """Verify snake_case / kebab-case to PascalCase conversion."""
        self.assertEqual(validate_clip.to_pascal_case("what_you_tolerate"), "WhatYouTolerate")
        self.assertEqual(validate_clip.to_pascal_case("deep_work_focus"), "DeepWorkFocus")
        self.assertEqual(validate_clip.to_pascal_case("stress-fracture-test"), "StressFractureTest")
        self.assertEqual(validate_clip.to_pascal_case("singleword"), "Singleword")

    def test_02_production_clip_canonical_pass(self):
        """Verify that a canonical production clip (what_you_tolerate) passes cleanly."""
        is_valid, errors, warnings, summary_data = validate_clip.audit_clip("what_you_tolerate", render_still=False)
        self.assertTrue(is_valid, f"what_you_tolerate should pass validation, but got errors: {errors}")
        self.assertEqual(len(errors), 0)
        self.assertEqual(summary_data["name"], "what_you_tolerate")
        self.assertEqual(summary_data["pascal_name"], "WhatYouTolerate")
        self.assertFalse(summary_data["is_duo"])
        # Expected word count from transcript is 79, duration ~30.3s
        self.assertEqual(summary_data["word_count"], 79)
        self.assertGreaterEqual(summary_data["duration_sec"], 25.0)
        self.assertLessEqual(summary_data["duration_sec"], 35.0)

    def test_03_unregistered_clip_fails_registry_check(self):
        """Verify that an unregistered clip name fails the canonical registry check."""
        fake_clip = "non_existent_unregistered_clip_99999"
        is_valid, errors, warnings, summary_data = validate_clip.audit_clip(fake_clip, render_still=False)
        self.assertFalse(is_valid)
        self.assertTrue(
            any(f"Clip '{fake_clip}' not registered in src/clips/registry.ts" in e for e in errors),
            f"Expected registry error in: {errors}"
        )

    def test_04_word_count_shadowing_regression(self):
        """
        Regression test: ensure thumbnail textHook word count does NOT overwrite
        the transcript word count in summary_data['word_count'].
        """
        # what_you_tolerate has a 2-word textHook in thumbnail_plan.json
        # and a 79-word transcript.json.
        thumb_plan_path = ROOT_DIR / "src" / "clips" / "what_you_tolerate" / "thumbnail_plan.json"
        if thumb_plan_path.exists():
            thumb_plan = json.loads(thumb_plan_path.read_text(encoding="utf-8"))
            hook_text = thumb_plan.get("chosenConcept", {}).get("textHook", "")
            hook_words = len(hook_text.split())
            self.assertEqual(hook_words, 2, "Fixture sanity check: textHook should be 2 words")

        _, _, _, summary = validate_clip.audit_clip("what_you_tolerate", render_still=False)
        self.assertEqual(summary["word_count"], 79, "word_count must remain transcript count (79), not hook count (2)")

    def test_05_obsolete_motion_plan_ignored(self):
        """
        Verify that obsolete motion_plan.json is completely ignored.
        Even if absent or having != 4 scene briefs, no error or warning is produced.
        """
        # Create a mock environment with a clip that has NO motion_plan.json
        with tempfile.TemporaryDirectory() as tmpdir:
            tmppath = Path(tmpdir)
            clip_name = "test_no_motion_plan"
            pascal_name = "TestNoMotionPlan"

            src_clip = tmppath / "src" / "clips" / clip_name
            src_clip.mkdir(parents=True)
            public_clip = tmppath / "public" / clip_name
            (public_clip / "assets").mkdir(parents=True)

            # Minimal valid files
            (src_clip / "index.tsx").write_text("export const TestComposition = () => null;")
            (src_clip / "Canvas.tsx").write_text("export const Canvas = () => <div />;")
            transcript_data = [{"word": "test", "start": 0, "end": 1000}] * 30
            # 30 words * 1000ms = 30000ms -> duration = 30.8s (within 25-35s)
            transcript_data[-1]["endMs"] = 30000
            (src_clip / "transcript.json").write_text(json.dumps(transcript_data))

            vo = public_clip / "voiceover.mp3"
            vo.write_bytes(b"0" * 2000)
            (public_clip / "assets" / "scene_illustration.png").write_bytes(b"fake_png")

            # Registry files
            reg_file = tmppath / "src" / "clips" / "registry.ts"
            reg_file.write_text(f"""
                import {{ {pascal_name}Composition }} from './{clip_name}';
                export const REGISTERED_CLIPS = [
                    {{ id: '{clip_name}', pascalName: '{pascal_name}', title: 'Test' }}
                ];
            """)
            root_file = tmppath / "src" / "Root.tsx"
            root_file.write_text("import { REGISTERED_CLIPS } from './clips/registry';")
            thumb_file = tmppath / "src" / "thumbnails" / "index.tsx"
            thumb_file.parent.mkdir(parents=True, exist_ok=True)
            thumb_file.write_text(f"export const {pascal_name}Thumbnail = () => null;")

            with patch.object(validate_clip, "ROOT_DIR", tmppath):
                is_valid, errors, warnings, summary = validate_clip.audit_clip(clip_name)

            # Assert no errors regarding motion_plan.json
            self.assertFalse(any("motion_plan" in e for e in errors))
            self.assertFalse(any("motion_plan" in w for w in warnings))
            self.assertTrue(is_valid, f"Expected valid clip without motion_plan.json, got: {errors}")

    def test_06_zero_meme_policy_warning(self):
        """Verify that usage of deprecated TacticalMemeCard/Frame triggers Zero-Memes warning."""
        with tempfile.TemporaryDirectory() as tmpdir:
            tmppath = Path(tmpdir)
            clip_name = "test_meme_clip"
            pascal_name = "TestMemeClip"

            src_clip = tmppath / "src" / "clips" / clip_name
            src_clip.mkdir(parents=True)
            public_clip = tmppath / "public" / clip_name
            (public_clip / "assets").mkdir(parents=True)

            (src_clip / "index.tsx").write_text("export const Comp = () => null;")
            (src_clip / "Canvas.tsx").write_text("export const Canvas = () => <TacticalMemeCard />;")
            transcript_data = [{"word": "test", "start": 0, "end": 1000}] * 30
            transcript_data[-1]["endMs"] = 30000
            (src_clip / "transcript.json").write_text(json.dumps(transcript_data))

            vo = public_clip / "voiceover.mp3"
            vo.write_bytes(b"0" * 2000)
            (public_clip / "assets" / "scene_illustration.png").write_bytes(b"fake_png")

            reg_file = tmppath / "src" / "clips" / "registry.ts"
            reg_file.write_text(f"""
                import {{ {pascal_name}Composition }} from './{clip_name}';
                export const REGISTERED_CLIPS = [
                    {{ id: '{clip_name}', pascalName: '{pascal_name}' }}
                ];
            """)
            (tmppath / "src" / "Root.tsx").write_text("import { REGISTERED_CLIPS } from './clips/registry';")
            thumb_file = tmppath / "src" / "thumbnails" / "index.tsx"
            thumb_file.parent.mkdir(parents=True, exist_ok=True)
            thumb_file.write_text(f"export const {pascal_name}Thumbnail = () => null;")

            with patch.object(validate_clip, "ROOT_DIR", tmppath):
                _, errors, warnings, _ = validate_clip.audit_clip(clip_name)

            self.assertTrue(
                any("TacticalMemeCard detected: Memes/stickers are deprecated" in w for w in warnings),
                f"Expected meme policy warning, got warnings: {warnings}"
            )

    def test_07_thumbnail_hook_complexity_budget(self):
        """Verify that thumbnail_plan.json textHook with > 3 words generates an error."""
        with tempfile.TemporaryDirectory() as tmpdir:
            tmppath = Path(tmpdir)
            clip_name = "test_long_hook"
            pascal_name = "TestLongHook"

            src_clip = tmppath / "src" / "clips" / clip_name
            src_clip.mkdir(parents=True)
            public_clip = tmppath / "public" / clip_name
            (public_clip / "assets").mkdir(parents=True)

            (src_clip / "index.tsx").write_text("export const Comp = () => null;")
            (src_clip / "Canvas.tsx").write_text("export const Canvas = () => null;")
            transcript_data = [{"word": "test", "start": 0, "end": 1000}] * 30
            transcript_data[-1]["endMs"] = 30000
            (src_clip / "transcript.json").write_text(json.dumps(transcript_data))

            # thumbnail plan with 4 words (exceeds 3)
            thumb_plan = {
                "thumbnailJob": "test",
                "chosenConcept": {
                    "textHook": "This Has Four Words"
                }
            }
            (src_clip / "thumbnail_plan.json").write_text(json.dumps(thumb_plan))

            vo = public_clip / "voiceover.mp3"
            vo.write_bytes(b"0" * 2000)
            (public_clip / "assets" / "scene_illustration.png").write_bytes(b"fake_png")

            reg_file = tmppath / "src" / "clips" / "registry.ts"
            reg_file.write_text(f"""
                import {{ {pascal_name}Composition }} from './{clip_name}';
                export const REGISTERED_CLIPS = [
                    {{ id: '{clip_name}', pascalName: '{pascal_name}' }}
                ];
            """)
            (tmppath / "src" / "Root.tsx").write_text("import { REGISTERED_CLIPS } from './clips/registry';")
            thumb_file = tmppath / "src" / "thumbnails" / "index.tsx"
            thumb_file.parent.mkdir(parents=True, exist_ok=True)
            thumb_file.write_text(f"export const {pascal_name}Thumbnail = () => null;")

            with patch.object(validate_clip, "ROOT_DIR", tmppath):
                is_valid, errors, _, _ = validate_clip.audit_clip(clip_name)

            self.assertFalse(is_valid)
            self.assertTrue(
                any("exceeds complexity budget" in e for e in errors),
                f"Expected complexity budget error in: {errors}"
            )

    def test_08_missing_critical_files_detected(self):
        """Verify that missing index.tsx, Canvas.tsx, transcript.json, voiceover.mp3 are flagged."""
        with tempfile.TemporaryDirectory() as tmpdir:
            tmppath = Path(tmpdir)
            clip_name = "test_empty_clip"
            pascal_name = "TestEmptyClip"

            src_clip = tmppath / "src" / "clips" / clip_name
            src_clip.mkdir(parents=True)
            public_clip = tmppath / "public" / clip_name
            public_clip.mkdir(parents=True)

            reg_file = tmppath / "src" / "clips" / "registry.ts"
            reg_file.write_text(f"""
                import {{ {pascal_name}Composition }} from './{clip_name}';
                export const REGISTERED_CLIPS = [
                    {{ id: '{clip_name}', pascalName: '{pascal_name}' }}
                ];
            """)
            (tmppath / "src" / "Root.tsx").write_text("import { REGISTERED_CLIPS } from './clips/registry';")
            thumb_file = tmppath / "src" / "thumbnails" / "index.tsx"
            thumb_file.parent.mkdir(parents=True, exist_ok=True)
            thumb_file.write_text(f"export const {pascal_name}Thumbnail = () => null;")

            with patch.object(validate_clip, "ROOT_DIR", tmppath):
                is_valid, errors, warnings, _ = validate_clip.audit_clip(clip_name)

            self.assertFalse(is_valid)
            self.assertTrue(any("Missing composition entry" in e for e in errors))
            self.assertTrue(any("Missing visual canvas" in e for e in errors))
            self.assertTrue(any("Missing transcript JSON" in e for e in errors))
            self.assertTrue(any("Missing voiceover audio" in e for e in errors))

    def test_09_mismatched_pascal_name_and_import(self):
        """Verify that mismatched pascalName and missing composition import in registry are flagged."""
        with tempfile.TemporaryDirectory() as tmpdir:
            tmppath = Path(tmpdir)
            clip_name = "test_clip_mismatch"

            src_clip = tmppath / "src" / "clips" / clip_name
            src_clip.mkdir(parents=True)
            public_clip = tmppath / "public" / clip_name
            (public_clip / "assets").mkdir(parents=True)

            (src_clip / "index.tsx").write_text("export const Comp = () => null;")
            (src_clip / "Canvas.tsx").write_text("export const Canvas = () => null;")
            transcript_data = [{"word": "test", "start": 0, "end": 1000}] * 30
            transcript_data[-1]["endMs"] = 30000
            (src_clip / "transcript.json").write_text(json.dumps(transcript_data))

            vo = public_clip / "voiceover.mp3"
            vo.write_bytes(b"0" * 2000)
            (public_clip / "assets" / "scene_illustration.png").write_bytes(b"fake_png")

            # Registry with wrong pascalName and missing import
            reg_file = tmppath / "src" / "clips" / "registry.ts"
            reg_file.write_text(f"""
                export const REGISTERED_CLIPS = [
                    {{ id: '{clip_name}', pascalName: 'WrongName' }}
                ];
            """)
            (tmppath / "src" / "Root.tsx").write_text("import { REGISTERED_CLIPS } from './clips/registry';")
            thumb_file = tmppath / "src" / "thumbnails" / "index.tsx"
            thumb_file.parent.mkdir(parents=True, exist_ok=True)
            thumb_file.write_text("export const TestClipMismatchThumbnail = () => null;")

            with patch.object(validate_clip, "ROOT_DIR", tmppath):
                is_valid, errors, _, _ = validate_clip.audit_clip(clip_name)

            self.assertFalse(is_valid)
            self.assertTrue(any("mismatched pascalName" in e for e in errors))
            self.assertTrue(any("not imported in src/clips/registry.ts" in e for e in errors))

    def test_10_validate_clip_cli_helper(self):
        """Verify the CLI wrapper validate_clip(...) returns True on valid clip."""
        success = validate_clip.validate_clip("what_you_tolerate", render_still=False, print_output=False)
        self.assertTrue(success)


if __name__ == "__main__":
    unittest.main()
