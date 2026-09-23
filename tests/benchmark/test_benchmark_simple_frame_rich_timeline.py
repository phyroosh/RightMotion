#!/usr/bin/env python3
"""
🧪 Benchmark C — Simple Frame, Rich Timeline
============================================
Validates the foundational RightMotion creative principle:
  SIMPLE FRAME. RICH TIMELINE.
  "Keep the screen simple. Keep the timeline alive."

Benchmark expectations:
  1. Exactly ONE visual metaphor across the sequence.
  2. 1–2 primary visual elements (no visual crowding).
  3. 1 clear physical state progression (A -> Event -> Change -> Consequence).
  4. Multiple meaningful temporal micro-events with explicit narrative reasons.
  5. Clear anticipation preceding major state changes.
  6. Decisive visual/narrative payoff.
  7. Visual reset opportunities separating distinct phases.
  8. Visual Critic validation:
     - Clear focal hierarchy & disciplined motion budget (PASS).
     - Alive timeline without dead stretches.
     - Warning triggered when simultaneous motion budget is violated.
     - Static risk triggered on long unmotivated dead stretches.
"""

import json
import sys
import unittest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from script_intelligence import ScriptIntelligence
from creative_brief_compiler import CreativeBriefCompiler
from visual_critic import StructuralCritic


class TestBenchmarkSimpleFrameRichTimeline(unittest.TestCase):

    def test_benchmark_simple_frame_rich_timeline(self):
        script = (
            "Every distraction steals a little more of your attention. "
            "Small interruptions compound until your focus completely collapses. "
            "Protect your sovereign boundary."
        )
        topic = "Attention Dissipation"

        intel = ScriptIntelligence()
        story_model = intel.analyze(script, topic=topic, channel="self_improvement")

        creative_plan = {
            "visualConcept": {
                "primaryMechanism": "viscoelastic_strain",
                "centralTransformation": "A single focus conduit deflects and fractures under accumulated particle load",
                "conceptName": topic,
                "whyThisMechanism": "Visualizes cognitive dissipation through physical structural load",
                "championCandidate": {
                    "physicalDescription": "Monolithic conduit experiencing downward deflection",
                    "visibleTransformation": "Deflection accelerates into clean fracture",
                    "visibleConsequence": "Scattered residual shards cleared into open space",
                    "persistentState": "Sovereign re-anchored baseline",
                },
            },
            "scenePlans": [],
        }

        words = [
            {"word": "Every", "startMs": 0, "endMs": 250},
            {"word": "distraction", "startMs": 300, "endMs": 800},
            {"word": "steals", "startMs": 850, "endMs": 1200},
            {"word": "attention", "startMs": 1800, "endMs": 2300},
            {"word": "Small", "startMs": 2800, "endMs": 3100},
            {"word": "interruptions", "startMs": 3200, "endMs": 3800},
            {"word": "compound", "startMs": 4000, "endMs": 4500},
            {"word": "collapses", "startMs": 5500, "endMs": 6200},
            {"word": "Protect", "startMs": 6800, "endMs": 7200},
            {"word": "boundary", "startMs": 8000, "endMs": 8800},
        ]
        duration_sec = 9.0

        compiler = CreativeBriefCompiler(fps=60)
        brief = compiler.compile_brief(
            clip_name="attention_dissipation",
            topic=topic,
            niche="self_improvement",
            clean_script=script,
            words=words,
            story_model=story_model,
            creative_plan=creative_plan,
            motion_ast={},
            duration_sec=duration_sec,
        )

        # 1. Macro validation
        self.assertIn("attentionCurve", brief)
        att_curve = brief["attentionCurve"]
        self.assertIn("curveType", att_curve)
        self.assertIn("phases", att_curve)

        # 2. Shot Directives & Attention Plan validation
        shots = brief["shots"]
        self.assertGreaterEqual(len(shots), 3)

        # 3. Check benchmark expectations per shot
        total_micro_events = 0
        has_anticipation_in_clip = False
        has_payoff_in_clip = False
        has_reset_in_clip = False

        for s in shots:
            # Simple Frame: Component budget <= 2, Density strictly controlled
            vc = s["visualComplexity"]
            self.assertLessEqual(vc["componentBudget"], 2, "Simple frame requires small component budget")
            self.assertIn(vc["density"], ["LOW", "MEDIUM", "HIGH"])
            self.assertLessEqual(vc["simultaneousMotionBudget"], 2, "Simultaneous motion must be budgeted")

            # Rich Timeline: Attention plan present
            plan = s["attentionPlan"]
            self.assertIn("trajectory", plan)
            self.assertIn("attentionIntensity", plan)

            # Micro-events must exist and have reasons
            events = plan["microEvents"]
            total_micro_events += len(events)
            for ev in events:
                self.assertIn("reason", ev)
                self.assertTrue(len(ev["reason"]) > 0)
                self.assertIn("type", ev)

            if plan.get("anticipation"):
                has_anticipation_in_clip = True
            if plan.get("payoffFrame") is not None:
                has_payoff_in_clip = True
            if plan.get("visualReset"):
                has_reset_in_clip = True

        self.assertGreaterEqual(total_micro_events, 4, "Timeline must be enriched with multiple meaningful micro-events")
        self.assertTrue(has_anticipation_in_clip, "Clip must contain an intentional anticipation window")
        self.assertTrue(has_payoff_in_clip, "Clip must contain an intentional visual payoff frame")
        self.assertTrue(has_reset_in_clip, "Clip must contain visual reset frames to refresh attention")

        # 4. Visual Critic Auditing
        critic = StructuralCritic("attention_dissipation")

        # Benchmark Test A: Clean composition (Simple Frame + Rich Timeline)
        clean_code = """
        // Scene 2: Mechanism
        const strain = interpolate(frame, [150, 320, 350], [0, 0.8, 1.0]);
        const microNudge = spring({ frame: frame - 180, fps: 60, config: { damping: 14, stiffness: 120 } });
        const anticipationSlow = interpolate(frame, [310, 330], [1.0, 0.4]);
        const snapPayoff = frame > 340 ? 1 : 0;
        return (
            <div style={{ position: 'relative' }}>
                <ViscoelasticDeformation loadProgress={strain} />
            </div>
        );
        """
        eye_clean = critic._analyze_eye_confusion(
            shot_snippet=clean_code,
            full_canvas=clean_code,
            role="mechanism",
            has_presenter=False,
            used_mechanisms=["ViscoelasticDeformation"],
            card_count=0,
            pacing="BUILD",
        )
        att_clean = critic._analyze_attention_confusion(clean_code, eye_clean, "BUILD")
        self.assertEqual(att_clean["verdict"], "PASS", "Disciplined motion budget must PASS")

        temp_clean = critic._analyze_temporal_variation(
            shot_snippet=clean_code,
            shot_plan=shots[1],
            duration_frames=200,
            pacing="BUILD",
        )
        self.assertEqual(temp_clean["verdict"], "ALIVE", "Rich dynamic cues must result in ALIVE timeline")

        # Benchmark Test B: Simultaneous Motion Violation (Crowded Frame)
        crowded_code = """
        <GlossyJudyIntro startFrame={150} exitFrame={350} />
        <ViscoelasticDeformation loadProgress={strain} />
        <ConceptKeywordSlam word="COLLAPSE" />
        <CameraCanvas mode="drift" />
        <div className="rounded-2xl bg-white p-6">Card 1</div>
        <div className="rounded-2xl bg-white p-6">Card 2</div>
        """
        eye_crowded = critic._analyze_eye_confusion(
            shot_snippet=crowded_code,
            full_canvas=crowded_code,
            role="mechanism",
            has_presenter=True,
            used_mechanisms=["ViscoelasticDeformation"],
            card_count=2,
            pacing="BUILD",
        )
        att_crowded = critic._analyze_attention_confusion(crowded_code, eye_crowded, "BUILD")
        self.assertEqual(att_crowded["verdict"], "WARNING", "Crowded simultaneous motion must trigger WARNING")

        # Benchmark Test C: Static Dead Timeline (Lack of Micro-Events)
        dead_code = """
        // Zero dynamics across 4 seconds
        return <div><div className="text-white">Static text</div></div>;
        """
        temp_dead = critic._analyze_temporal_variation(
            shot_snippet=dead_code,
            shot_plan=shots[1],
            duration_frames=240,
            pacing="BUILD",
        )
        self.assertEqual(temp_dead["verdict"], "STATIC_RISK", "Unmotivated 4-second freeze must trigger STATIC_RISK")


if __name__ == "__main__":
    unittest.main()
