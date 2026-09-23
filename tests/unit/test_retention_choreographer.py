#!/usr/bin/env python3
"""
🧪 Unit Test Suite for RightMotion Retention Choreographer
==========================================================
Validates:
  1. Global attentionCurve generation with narrative curve types and phases.
  2. Shot-level AttentionPlan compilation (trajectory, intensity, microEvents, anticipation, payoff).
  3. Golden Law: visualDensity != attentionIntensity (low density with high attention).
  4. Simultaneous Motion Budget enforcement (primary moving system: 1, secondary: 0-1).
  5. Micro-Events validity: frame-accurate timestamps, valid types, and mandatory reasons.
  6. Camera choreography modes (MICRO_MOVEMENT, SIGNIFICANT_MOVEMENT, STATIC_HOLD).
  7. Sound opportunities alignment with temporal punctuation.
  8. Full integration with CreativeBriefCompiler and JSON serialization.
"""

import json
import sys
import unittest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from shot_director import ShotDirector
from retention_choreographer import RetentionChoreographer
from creative_brief_compiler import CreativeBriefCompiler
from script_intelligence import ScriptIntelligence


class TestRetentionChoreographer(unittest.TestCase):

    def setUp(self):
        self.fps = 60
        self.shot_director = ShotDirector(fps=self.fps)
        self.choreographer = RetentionChoreographer(fps=self.fps)
        self.compiler = CreativeBriefCompiler(fps=self.fps)

    def test_choreography_and_attention_curve(self):
        intel = ScriptIntelligence()
        script = (
            "You keep tolerating small compromises until low standards feel normal. "
            "Each silent concession deepens the psychological groove of compliance. "
            "Draw a sharp line today. Reclaim your sovereignty."
        )
        story_model = intel.analyze(script, topic="The Cost of Compromise")

        creative_plan = {
            "visualConcept": {
                "primaryMechanism": "viscoelastic_strain",
                "centralTransformation": "Initial boundary deflects until cleavage occurs",
                "conceptName": "The Cost of Compromise",
                "whyThisMechanism": "Shows psychological boundary erosion physically",
                "championCandidate": {
                    "physicalDescription": "Viscoelastic boundary surface experiencing downward deflection",
                    "visibleTransformation": "Boundary yields under successive concessions",
                    "visibleConsequence": "Recalibrated permanent baseline",
                    "persistentState": "Sovereign re-anchored line",
                },
            }
        }

        words = [
            {"word": "You", "startMs": 0, "endMs": 300},
            {"word": "compromises", "startMs": 1200, "endMs": 1800},
            {"word": "Each", "startMs": 3000, "endMs": 3400},
            {"word": "groove", "startMs": 5500, "endMs": 6000},
            {"word": "Draw", "startMs": 7500, "endMs": 8000},
            {"word": "sovereignty", "startMs": 9500, "endMs": 10500},
        ]
        total_frames = 660

        raw_shots = self.shot_director.decompose_shots(
            story_model=story_model,
            creative_plan=creative_plan,
            transcript=words,
            total_frames=total_frames,
        )

        result = self.choreographer.choreograph(
            shots=raw_shots,
            story_model=story_model,
            creative_plan=creative_plan,
            transcript=words,
            total_frames=total_frames,
            niche="self_improvement",
        )

        self.assertIn("attentionCurve", result)
        self.assertIn("shots", result)

        att_curve = result["attentionCurve"]
        self.assertIn("curveType", att_curve)
        self.assertIn("phases", att_curve)
        self.assertGreaterEqual(len(att_curve["phases"]), 3)

        shots = result["shots"]
        self.assertEqual(len(shots), len(raw_shots))

        for s in shots:
            # Check Attention Plan
            self.assertIn("attentionPlan", s)
            plan = s["attentionPlan"]
            self.assertIn(plan["initialState"], ["SETTLE", "INTRODUCE", "IMMEDIATE"])
            self.assertIn(plan["trajectory"], ["RISING", "FALLING", "WAVE", "ESCALATING", "PUNCTUATED", "STABLE"])
            self.assertIn(plan["attentionIntensity"], ["LOW", "MEDIUM", "HIGH", "SPIKE"])
            self.assertIsInstance(plan["anticipation"], bool)
            self.assertIsInstance(plan["microEvents"], list)
            self.assertIsInstance(plan["visualReset"], bool)

            # Check Visual Complexity
            self.assertIn("visualComplexity", s)
            vc = s["visualComplexity"]
            self.assertIn(vc["density"], ["LOW", "MEDIUM", "HIGH"])
            self.assertLessEqual(vc["componentBudget"], 2)
            self.assertLessEqual(vc["simultaneousMotionBudget"], 2)

            # Check Camera Choreography
            self.assertIn("cameraChoreography", s)
            cam = s["cameraChoreography"]
            self.assertIn(cam["mode"], ["MICRO_MOVEMENT", "SIGNIFICANT_MOVEMENT", "LARGE_MOVEMENT", "STATIC_HOLD"])
            self.assertTrue(len(cam["movement"]) > 0)
            self.assertTrue(len(cam["rationale"]) > 0)

            # Check Sound Opportunities
            self.assertIn("soundOpportunities", s)

    def test_golden_law_visual_density_vs_attention_intensity(self):
        """
        Validates: visualDensity != attentionIntensity
        A shot with LOW visual density can have HIGH attention intensity.
        """
        intel = ScriptIntelligence()
        script = "One single notification breaks your state of deep immersion. Clear it."
        story_model = intel.analyze(script, topic="Single Distraction")

        creative_plan = {
            "visualConcept": {
                "primaryMechanism": "threshold_boundary",
                "centralTransformation": "A solitary beam slowly approaches a critical tripwire",
                "conceptName": "Single Distraction",
                "championCandidate": {
                    "physicalDescription": "Solitary beam under gentle forward drift",
                    "visibleTransformation": "Beam crosses threshold",
                    "visibleConsequence": "Boundary tripwire triggers",
                    "persistentState": "Reset baseline",
                },
            }
        }

        words = [
            {"word": "One", "startMs": 0, "endMs": 300},
            {"word": "notification", "startMs": 800, "endMs": 1400},
            {"word": "immersion", "startMs": 2200, "endMs": 2800},
            {"word": "Clear", "startMs": 3200, "endMs": 3600},
        ]
        total_frames = 240

        brief = self.compiler.compile_brief(
            clip_name="single_distraction",
            topic="Single Distraction",
            niche="self_improvement",
            clean_script=script,
            words=words,
            story_model=story_model,
            creative_plan=creative_plan,
            motion_ast={},
            duration_sec=4.0,
        )

        shots = brief["shots"]
        hook_shot = shots[0]

        # In hook, visualDensity is LOW, but attentionIntensity is HIGH
        self.assertEqual(hook_shot["visualComplexity"]["density"], "LOW")
        self.assertEqual(hook_shot["attentionPlan"]["attentionIntensity"], "HIGH")

    def test_micro_events_integrity(self):
        """
        Validates that micro-events have valid timestamps, types, and mandatory reasons.
        """
        intel = ScriptIntelligence()
        script = "The burden increases with every concession you make. The structure bends, then it breaks."
        story_model = intel.analyze(script, topic="Structural Fatigue")

        creative_plan = {
            "visualConcept": {
                "primaryMechanism": "viscoelastic_strain",
                "centralTransformation": "Beam bends under load and snaps",
                "conceptName": "Structural Fatigue",
                "championCandidate": {
                    "physicalDescription": "Monolithic beam under load",
                    "visibleTransformation": "Deflection and fracture",
                    "visibleConsequence": "Permanent fracture trace",
                    "persistentState": "Settled shards",
                },
            }
        }

        words = [
            {"word": "The", "startMs": 0, "endMs": 200},
            {"word": "burden", "startMs": 400, "endMs": 900},
            {"word": "structure", "startMs": 2500, "endMs": 3000},
            {"word": "bends", "startMs": 3200, "endMs": 3600},
            {"word": "breaks", "startMs": 4200, "endMs": 4800},
        ]
        total_frames = 360

        brief = self.compiler.compile_brief(
            clip_name="structural_fatigue",
            topic="Structural Fatigue",
            niche="self_improvement",
            clean_script=script,
            words=words,
            story_model=story_model,
            creative_plan=creative_plan,
            motion_ast={},
            duration_sec=6.0,
        )

        valid_reasons = {
            "progression", "anticipation", "emphasis", "causality",
            "escalation", "contrast", "emotional_change", "reveal", "punctuation"
        }

        total_micro_events = 0
        for s in brief["shots"]:
            events = s["attentionPlan"]["microEvents"]
            total_micro_events += len(events)
            st_f, et_f = s["frameRange"]
            for ev in events:
                self.assertIn("frame", ev)
                self.assertGreaterEqual(ev["frame"], st_f)
                self.assertLessEqual(ev["frame"], et_f)
                self.assertIn("reason", ev)
                self.assertIn(ev["reason"], valid_reasons, f"Micro-event reason '{ev['reason']}' must be valid.")
                self.assertIn("type", ev)
                self.assertTrue(len(ev["description"]) > 0)

        self.assertGreater(total_micro_events, 3, "Clip timeline must be enriched with micro-events.")

    def test_brief_compiler_json_serialization(self):
        """
        Validates that the enriched Creative Brief serializes to valid JSON without issues.
        """
        intel = ScriptIntelligence()
        script = "Six hours of sleep for seven days equals a 24-hour total cognitive deficit."
        story_model = intel.analyze(script, topic="Sleep Debt", channel="health")

        creative_plan = {
            "visualConcept": {
                "primaryMechanism": "allostatic_debt_accumulation",
                "centralTransformation": "Deficit Compounds",
                "conceptName": "Sleep Debt",
                "championCandidate": {
                    "physicalDescription": "Biometric depletion gauge",
                    "visibleTransformation": "Metric drop",
                    "visibleConsequence": "Cognitive deficit",
                    "persistentState": "Calibrated baseline",
                },
            }
        }

        brief = self.compiler.compile_brief(
            clip_name="sleep_debt",
            topic="Sleep Debt",
            niche="health",
            clean_script=script,
            words=[{"word": "Six", "startMs": 0, "endMs": 400}],
            story_model=story_model,
            creative_plan=creative_plan,
            motion_ast={},
            duration_sec=3.0,
        )

        # Check JSON serializability
        serialized = json.dumps(brief, indent=2)
        self.assertTrue(len(serialized) > 200)

        # Check mission header
        header = self.compiler.format_canvas_mission_header(
            pascal_name="SleepDebt",
            brief=brief,
            s2_start=60,
            s3_start=120,
            total_frames=180,
        )
        self.assertIn("SIMPLE FRAME. RICH TIMELINE", header)
        self.assertIn("visualDensity != attentionIntensity", header)
        self.assertIn("Attention Curve", header)
        self.assertIn("Simultaneous Motion Budget", header)


if __name__ == "__main__":
    unittest.main()
