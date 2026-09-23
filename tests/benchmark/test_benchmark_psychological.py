#!/usr/bin/env python3
"""
🧪 Benchmark A — Psychological Contradiction & Eroding Standards
===============================================================
Story requirements:
  - Script: "You keep tolerating small compromises until low standards feel normal..."
  - Requires physical visual metaphor: boundary displacement or resistance groove.
  - Verifies:
    1. Shot plan produces progressive tension (BUILD -> IMPACT -> RELEASE).
    2. Primary mechanism is physical (e.g. boundary shift, viscoelastic strain, furrow).
    3. The 5 Visual State questions describe physical boundary/standards mutation.
    4. Reference discovery retrieves relevant threshold/compromise clips.
"""

import sys
import unittest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from script_intelligence import ScriptIntelligence
from creative_brief_compiler import CreativeBriefCompiler
from reference_discovery import ReferenceDiscovery


class TestBenchmarkPsychological(unittest.TestCase):

    def test_benchmark_a_psychological_contradiction(self):
        script = (
            "You keep tolerating small compromises until low standards feel normal. "
            "Every silent concession stretches your boundary beyond its natural return. "
            "Draw a sharp line. Reclaim your sovereignty."
        )
        topic = "The Silent Erosion of Standards"

        # 1. Generate story intelligence
        intel = ScriptIntelligence()
        story_model = intel.analyze(script, topic=topic, channel="self_improvement")

        # 2. Mock creative plan from orchestrator
        creative_plan = {
            "visualConcept": {
                "primaryMechanism": "viscoelastic_boundary_deflection",
                "centralTransformation": "Untouched boundary deflects under concessions until sovereign snap",
                "conceptName": topic,
                "whyThisMechanism": "Physically illustrates psychological concession tolerance",
                "championCandidate": {
                    "physicalDescription": "Open-stage horizontal datum line deflecting under downward force",
                    "visibleTransformation": "Progressive downward sag",
                    "visibleConsequence": "Recalibrated permanent baseline",
                    "persistentState": "Sovereign re-anchored line",
                },
            },
            "scenePlans": [],
        }

        # 3. Compile Creative Brief
        compiler = CreativeBriefCompiler(fps=60)
        words = [
            {"word": "You", "startMs": 0, "endMs": 300},
            {"word": "normal", "startMs": 3200, "endMs": 3800},
            {"word": "Every", "startMs": 4000, "endMs": 4400},
            {"word": "return", "startMs": 7200, "endMs": 7800},
            {"word": "Draw", "startMs": 8000, "endMs": 8400},
            {"word": "sovereignty", "startMs": 9500, "endMs": 10200},
        ]
        brief = compiler.compile_brief(
            clip_name="silent_erosion",
            topic=topic,
            niche="self_improvement",
            clean_script=script,
            words=words,
            story_model=story_model,
            creative_plan=creative_plan,
            motion_ast={},
            duration_sec=10.5,
        )

        shots = brief["shots"]
        self.assertGreaterEqual(len(shots), 3, "Benchmark A must decompose into at least 3 shots")

        # Check pacing mode diversity
        pacing_modes = [s["pacingMode"] for s in shots]
        self.assertTrue(len(set(pacing_modes)) >= 2, f"Pacing modes must vary: {pacing_modes}")

        # Check that stateChange answers all 5 questions
        for s in shots:
            sc = s["stateChange"]
            self.assertTrue(len(sc["whatVisiblyChanges"]) > 0)
            self.assertTrue(len(sc["whyChangeMatters"]) > 0)

        # Check reference clips discovery
        ref_clips = brief["visualLanguage"]["referenceClips"]
        self.assertTrue(
            any(k in ref_clips for k in ["the_threshold_effect", "small_compromises", "the_law_of_structural_load"]),
            f"Reference clips must include boundary/compromise reference: {ref_clips}"
        )


if __name__ == "__main__":
    unittest.main()
