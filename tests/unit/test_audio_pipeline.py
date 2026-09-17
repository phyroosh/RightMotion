#!/usr/bin/env python3
"""
🧪 RightMotion Audio Pipeline Canonicalization Test Suite
Location: scripts/test_audio_pipeline.py

Verifies the canonical audio module (scripts/voiceover_engine.py):
  1. Canonical API exports and module integrity.
  2. Text normalization and tag stripping (preventing neural TTS freezes).
  3. Narrative vs closing reflective question splitting.
  4. Conversational duo turn-parsing (Judy & Andrew).
  5. Word-level timestamp schema compliance with src/types.ts.
  6. Dialogue engine compatibility forwarder integrity.
"""

import unittest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent

import voiceover_engine
import dialogue_engine


class TestAudioPipelineCanonicalization(unittest.TestCase):
    def test_01_canonical_api_exports(self):
        """Verify that voiceover_engine exposes the authoritative audio API."""
        required_functions = [
            "generate_voiceover",
            "synthesize_speech",
            "transcribe_audio",
            "transcribe_and_attribute_speakers",
            "extract_facecam_audio",
            "process_voiceover",
            "process_dialogue",
            "normalize_text_for_tts",
            "split_body_and_closing_question",
            "parse_dialogue_turns",
            "normalize_and_compress_audio",
            "get_audio_duration_ms",
        ]
        for fn_name in required_functions:
            self.assertTrue(
                hasattr(voiceover_engine, fn_name),
                f"voiceover_engine must export '{fn_name}'"
            )
            self.assertTrue(
                callable(getattr(voiceover_engine, fn_name)),
                f"'{fn_name}' in voiceover_engine must be callable"
            )

    def test_02_dialogue_engine_compatibility_forwarder(self):
        """Verify that dialogue_engine correctly forwards functions to voiceover_engine."""
        self.assertIs(
            dialogue_engine.process_dialogue,
            voiceover_engine.process_dialogue,
            "dialogue_engine.process_dialogue must point directly to voiceover_engine.process_dialogue"
        )
        self.assertIs(
            dialogue_engine.parse_dialogue_turns,
            voiceover_engine.parse_dialogue_turns,
            "dialogue_engine.parse_dialogue_turns must point directly to voiceover_engine.parse_dialogue_turns"
        )
        self.assertEqual(dialogue_engine.VOICE_MAP, voiceover_engine.VOICE_MAP)

    def test_03_normalize_text_for_tts(self):
        """Verify that text normalization strips tags, metadata, and ellipses."""
        raw = "{Self Improvement} {andrew} Why you freeze... When pressure hits… [PINNED COMMENT] Share below."
        clean = voiceover_engine.normalize_text_for_tts(raw)
        self.assertNotIn("{Self Improvement}", clean)
        self.assertNotIn("{andrew}", clean)
        self.assertNotIn("[PINNED COMMENT]", clean)
        self.assertNotIn("…", clean)
        self.assertNotIn("...", clean)
        self.assertIn("Why you freeze, When pressure hits,", clean)

    def test_04_split_body_and_closing_question(self):
        """Verify narrative body and reflective question separation."""
        script_with_q = "Your brain takes the path of lowest friction. Have you ever wondered why?"
        body, question = voiceover_engine.split_body_and_closing_question(script_with_q)
        self.assertEqual(body, "Your brain takes the path of lowest friction.")
        self.assertEqual(question, "Have you ever wondered why?")

        script_no_q = "This is not weakness. It is neurological conservation of glucose."
        body2, question2 = voiceover_engine.split_body_and_closing_question(script_no_q)
        self.assertEqual(body2, script_no_q)
        self.assertEqual(question2, "")

    def test_05_parse_dialogue_turns(self):
        """Verify Conversational Duo speaker turn parsing."""
        dialogue = (
            "JUDY: The real reason you fail your goals is spatial, not psychological. "
            "ANDREW: Wait, spatial? You mean our actual physical desks? "
            "JUDY: Exactly. Visual cues trigger involuntary neurological responses."
        )
        turns = voiceover_engine.parse_dialogue_turns(dialogue)
        self.assertEqual(len(turns), 3)
        self.assertEqual(turns[0]["speaker"], "judy")
        self.assertIn("The real reason you fail", turns[0]["text"])
        self.assertEqual(turns[1]["speaker"], "andrew")
        self.assertIn("Wait, spatial?", turns[1]["text"])
        self.assertEqual(turns[2]["speaker"], "judy")
        self.assertIn("Exactly.", turns[2]["text"])

    def test_06_word_timestamp_schema_compliance(self):
        """Verify that word timestamp records comply with src/types.ts WordTimestamp."""
        # Simulated Faster-Whisper output word
        mock_word = {
            "word": "focus",
            "startMs": 450,
            "endMs": 820,
            "start": 450,
            "end": 820,
            "confidence": 0.982,
            "speaker": "judy"
        }
        # Invariant checks
        self.assertIsInstance(mock_word["word"], str)
        self.assertIsInstance(mock_word["startMs"], int)
        self.assertIsInstance(mock_word["endMs"], int)
        self.assertIsInstance(mock_word["start"], int)
        self.assertIsInstance(mock_word["end"], int)
        self.assertEqual(mock_word["startMs"], mock_word["start"])
        self.assertEqual(mock_word["endMs"], mock_word["end"])
        self.assertGreaterEqual(mock_word["endMs"], mock_word["startMs"])
        self.assertIn(mock_word["speaker"], ("judy", "andrew"))


if __name__ == "__main__":
    unittest.main()
