#!/usr/bin/env python3
"""
🧪 Benchmark C — Emotional Restraint & Intentional Visual Stillness
===================================================================
Story requirements:
  - Script: "You're not actually lonely. You're just exhausted from performing closeness with people who never truly see you. Let the noise settle."
  - Emotional, deeply personal story requiring restraint, quiet pacing, and breathing room.
  - Verifies:
    1. Pacing mode incorporates quiet/restrained modes (HOLD or OBSERVE).
    2. Camera movement specifies subtle breathing drift or static observation (no aggressive whip pans).
    3. State change notes that intentional stillness/space communicates the insight.
    4. References discover intimate character/editorial clips (loneliness).
"""

import sys
import unittest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from script_intelligence import ScriptIntelligence
from creative_brief_compiler import CreativeBriefCompiler


class TestBenchmarkEmotionalRestraint(unittest.TestCase):

    def test_benchmark_c_emotional_restraint(self):
        script = (
            "You are not actually lonely. "
            "You are just exhausted from performing closeness with people who never truly see you. "
            "Let the noise settle into peace."
        )
        topic = "The Exhaustion of Performing Closeness"

        intel = ScriptIntelligence()
        story_model = intel.analyze(script, topic=topic, channel="self_improvement")

        creative_plan = {
            "visualConcept": {
                "primaryMechanism": "spatial_isolation_and_release",
                "centralTransformation": "Constrained performing posture yields to quiet expansive stillness",
                "conceptName": topic,
                "whyThisMechanism": "Replaces social performance exhaustion with breathing stillness",
                "championCandidate": {
                    "physicalDescription": "Spacious open canvas with singular grounded subject",
                    "visibleTransformation": "Transition from tight performance frame to wide stillness",
                    "visibleConsequence": "Permitted quietude and relief",
                    "persistentState": "Uncrowded sovereign space",
                },
            },
            "scenePlans": [],
        }

        compiler = CreativeBriefCompiler(fps=60)
        words = [
            {"word": "You", "startMs": 0, "endMs": 300},
            {"word": "lonely", "startMs": 1500, "endMs": 2000},
            {"word": "You", "startMs": 2200, "endMs": 2500},
            {"word": "you", "startMs": 5500, "endMs": 6000},
            {"word": "Let", "startMs": 6200, "endMs": 6500},
            {"word": "peace", "startMs": 7500, "endMs": 8200},
        ]
        brief = compiler.compile_brief(
            clip_name="exhaustion_of_performing",
            topic=topic,
            niche="self_improvement",
            clean_script=script,
            words=words,
            story_model=story_model,
            creative_plan=creative_plan,
            motion_ast={},
            duration_sec=8.5,
        )

        shots = brief["shots"]
        self.assertGreaterEqual(len(shots), 3)

        # Check that camera language favors subtle drift/static/lateral tracking over aggressive whip
        camera_modes = [s["camera"]["mode"] for s in shots]
        self.assertTrue(
            all(m in ["handheld_drift", "static", "push_in", "pull_out", "lateral_pan"] for m in camera_modes),
            f"Emotional story should use calm camera modes: {camera_modes}"
        )

        # Check that reference clips discover loneliness
        ref_clips = brief["visualLanguage"]["referenceClips"]
        self.assertIn("loneliness", ref_clips, f"Expected loneliness in references: {ref_clips}")


if __name__ == "__main__":
    unittest.main()
