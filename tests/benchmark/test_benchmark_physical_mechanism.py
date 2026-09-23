#!/usr/bin/env python3
"""
🧪 Benchmark B — Physical Mechanism & Biological Causal System
=============================================================
Story requirements:
  - Script: "Six hours of sleep for seven days equals a 24-hour total cognitive deficit. Memory retention drops by 40 percent. Calibrate your biological schedule."
  - Health/Physiological dynamic niche.
  - Verifies:
    1. Primary mechanism is physiological/data-driven (e.g. allostatic load, circadian curve).
    2. Visual objective focuses on data/system behavior rather than conversational presenter banter.
    3. References discover data/health clips (the_dopamine_sugar_trap, cortisol_energy_engine).
"""

import sys
import unittest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from script_intelligence import ScriptIntelligence
from creative_brief_compiler import CreativeBriefCompiler


class TestBenchmarkPhysicalMechanism(unittest.TestCase):

    def test_benchmark_b_physical_mechanism(self):
        script = (
            "Six hours of sleep for seven days equals a 24-hour total cognitive deficit. "
            "Your prefrontal cortex slows down, and memory consolidation drops by 40 percent. "
            "Protect your biological recovery window."
        )
        topic = "The Mathematics of Sleep Debt"

        intel = ScriptIntelligence()
        story_model = intel.analyze(script, topic=topic, channel="health")

        creative_plan = {
            "visualConcept": {
                "primaryMechanism": "allostatic_debt_accumulation",
                "centralTransformation": "Baseline cognitive capacity depletes as sleep deficit compounds",
                "conceptName": topic,
                "whyThisMechanism": "Quantifies physiological deficit through biometric curve",
                "championCandidate": {
                    "physicalDescription": "Biometric depletion gauge with cumulative deficit curve",
                    "visibleTransformation": "Metric drops through critical threshold",
                    "visibleConsequence": "Compounded 24-hour deficit manifest",
                    "persistentState": "Stabilized sleep schedule",
                },
            },
            "scenePlans": [],
        }

        compiler = CreativeBriefCompiler(fps=60)
        words = [
            {"word": "Six", "startMs": 0, "endMs": 300},
            {"word": "deficit", "startMs": 3500, "endMs": 4000},
            {"word": "Your", "startMs": 4200, "endMs": 4500},
            {"word": "percent", "startMs": 7500, "endMs": 8000},
            {"word": "Protect", "startMs": 8200, "endMs": 8600},
            {"word": "window", "startMs": 9500, "endMs": 10000},
        ]
        brief = compiler.compile_brief(
            clip_name="sleep_debt_math",
            topic=topic,
            niche="health",
            clean_script=script,
            words=words,
            story_model=story_model,
            creative_plan=creative_plan,
            motion_ast={},
            duration_sec=10.0,
        )

        self.assertEqual(brief["niche"], "health")
        shots = brief["shots"]
        self.assertGreaterEqual(len(shots), 3)

        # In health niche, references should include health benchmarks
        ref_clips = brief["visualLanguage"]["referenceClips"]
        self.assertTrue(
            any(k in ref_clips for k in ["the_dopamine_sugar_trap", "cortisol_energy_engine"]),
            f"Reference clips must include health benchmarks: {ref_clips}"
        )


if __name__ == "__main__":
    unittest.main()
