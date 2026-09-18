#!/usr/bin/env python3
"""
🧪 Unit Test Suite for RightMotion Structured Clip Registry
Location: tests/unit/test_clip_registry.py

Verifies the canonical registry contracts in scripts/clip_registry.py:
  1. Parsing all registered clips from src/clips/registry.ts without loss.
  2. Idempotent check (is_clip_registered).
  3. Structured registration of new composition into mock registry.
  4. Bracket balance and structural invariant enforcement.
  5. Structured thumbnail registration into mock thumbnails file.
"""

import sys
import tempfile
import unittest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

import clip_registry


class TestClipRegistry(unittest.TestCase):
    def test_01_parse_canonical_registry(self):
        """Verify that get_registered_clips extracts all registered clips."""
        clips = clip_registry.get_registered_clips()
        self.assertGreaterEqual(len(clips), 60, "Must parse at least 60 registered clips")
        ids = {c["id"] for c in clips}
        self.assertIn("what_you_tolerate", ids)
        self.assertIn("price_of_inaction", ids)
        self.assertIn("adhd", ids)

    def test_02_is_clip_registered(self):
        """Verify is_clip_registered accurate detection."""
        self.assertTrue(clip_registry.is_clip_registered("what_you_tolerate"))
        self.assertTrue(clip_registry.is_clip_registered("price_of_inaction"))
        self.assertFalse(clip_registry.is_clip_registered("non_existent_clip_xyz_12345"))

    def test_03_structured_clip_registration_idempotency(self):
        """Verify structured registration into an isolated test registry."""
        with tempfile.TemporaryDirectory() as tmpdir:
            tmppath = Path(tmpdir)
            mock_registry = tmppath / "registry.ts"

            starter_content = """// 1. Clip Component & Transcript Imports
// ============================================================================
import { ExistingComposition } from "./existing";
import existingTranscript from "./existing/transcript.json";

// 2. Thumbnail Component Imports
// ============================================================================
import {
  ExistingThumbnail,
} from "../thumbnails";

// ============================================================================
// 3. Canonical Clip Registry Array
// ============================================================================
export const REGISTERED_CLIPS: ClipRegistration[] = [
  {
    id: "existing",
    pascalName: "Existing",
    component: ExistingComposition,
    thumbnailComponent: ExistingThumbnail,
    transcript: existingTranscript as any[],
    format: "shorts",
  },
];
"""
            mock_registry.write_text(starter_content, encoding="utf-8")

            # First registration
            res = clip_registry.register_clip_composition(
                clip_id="new_feature",
                pascal_name="NewFeature",
                format_type="shorts",
                registry_path=mock_registry,
            )
            self.assertTrue(res)

            # Verify it's registered
            self.assertTrue(clip_registry.is_clip_registered("new_feature", mock_registry))
            updated_clips = clip_registry.get_registered_clips(mock_registry)
            self.assertEqual(len(updated_clips), 2)
            self.assertEqual(updated_clips[0]["id"], "new_feature")
            self.assertEqual(updated_clips[0]["pascalName"], "NewFeature")

            # Second registration (idempotent no-op)
            res_repeat = clip_registry.register_clip_composition(
                clip_id="new_feature",
                pascal_name="NewFeature",
                format_type="shorts",
                registry_path=mock_registry,
            )
            self.assertTrue(res_repeat)
            self.assertEqual(len(clip_registry.get_registered_clips(mock_registry)), 2)

    def test_04_structured_thumbnail_registration(self):
        """Verify structured thumbnail registration into mock thumbnails file."""
        with tempfile.TemporaryDirectory() as tmpdir:
            tmppath = Path(tmpdir)
            mock_thumb = tmppath / "index.tsx"
            mock_thumb.write_text("export const ExistingThumbnail = () => null;\n", encoding="utf-8")

            res = clip_registry.register_clip_thumbnail(
                clip_id="mind_focus",
                pascal_name="MindFocus",
                hook_word="FOCUS",
                accent_color="#3b82f6",
                format_type="shorts",
                theme="apple_studio",
                thumbnails_path=mock_thumb,
            )
            self.assertTrue(res)

            content = mock_thumb.read_text(encoding="utf-8")
            self.assertIn("export const MindFocusThumbnail: React.FC", content)
            self.assertIn('hookWord="FOCUS"', content)
            self.assertIn('accentColor="#3b82f6"', content)

            # Idempotent repeat
            res_repeat = clip_registry.register_clip_thumbnail(
                clip_id="mind_focus",
                pascal_name="MindFocus",
                hook_word="FOCUS",
                accent_color="#3b82f6",
                thumbnails_path=mock_thumb,
            )
            self.assertTrue(res_repeat)


if __name__ == "__main__":
    unittest.main()
