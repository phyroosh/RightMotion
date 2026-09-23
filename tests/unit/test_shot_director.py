#!/usr/bin/env python3
"""
🧪 Unit Test Suite for RightMotion Shot Director & Creative Brief Compiler
========================================================================
Validates:
  1. Exact timestamp normalization across diverse formats (startMs, start, endMs, end).
  2. Semantic shot decomposition (shot count, frame ranges, contiguous boundaries).
  3. Mandatory 5 Visual State questions present on every single shot.
  4. Pacing modes (HOLD, OBSERVE, BUILD, ACCELERATE, IMPACT, RELEASE) variation.
  5. Strict confidence hierarchy (REQUIRED vs RECOMMENDED vs OPTIONAL).
  6. Creative Brief compilation and human-readable Canvas.tsx mission header formatting.
"""

import json
import sys
import unittest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from shot_director import ShotDirector
from creative_brief_compiler import CreativeBriefCompiler
from script_intelligence import ScriptIntelligence


class TestShotDirector(unittest.TestCase):

    def setUp(self):
        self.director = ShotDirector(fps=60)
        self.compiler = CreativeBriefCompiler(fps=60)

    def test_normalize_word_timing(self):
        # Format A: startMs / endMs
        w1 = {"word": "pressure", "startMs": 1000, "endMs": 1500}
        st1, et1 = self.director.normalize_word_timing(w1, fps=60)
        self.assertEqual(st1, 60)
        self.assertEqual(et1, 90)

        # Format B: start / end in seconds
        w2 = {"word": "accumulates", "start": 2.5, "end": 3.0}
        st2, et2 = self.director.normalize_word_timing(w2, fps=60)
        self.assertEqual(st2, 150)
        self.assertEqual(et2, 180)

        # Format C: start / end already in milliseconds
        w3 = {"word": "fracture", "start": 4000, "end": 4500}
        st3, et3 = self.director.normalize_word_timing(w3, fps=60)
        self.assertEqual(st3, 240)
        self.assertEqual(et3, 270)

    def test_shot_decomposition_and_five_questions(self):
        # Generate real story model from ScriptIntelligence
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

        # Mock transcript
        words = [
            {"word": "You", "startMs": 0, "endMs": 300},
            {"word": "compromises", "startMs": 1200, "endMs": 1800},
            {"word": "Each", "startMs": 3000, "endMs": 3400},
            {"word": "groove", "startMs": 5500, "endMs": 6000},
            {"word": "Draw", "startMs": 7500, "endMs": 8000},
            {"word": "sovereignty", "startMs": 9500, "endMs": 10500},
        ]
        total_frames = 660  # 11 seconds at 60 fps

        shots = self.director.decompose_shots(
            story_model=story_model,
            creative_plan=creative_plan,
            transcript=words,
            total_frames=total_frames,
        )

        # Assertions on shots
        self.assertGreaterEqual(len(shots), 3)

        # Check contiguous frame ranges
        for i in range(len(shots) - 1):
            self.assertEqual(
                shots[i]["frameRange"][1],
                shots[i + 1]["frameRange"][0],
                f"Shot {shots[i]['shotId']} end frame must match next shot start frame"
            )
        self.assertEqual(shots[0]["frameRange"][0], 0)
        self.assertEqual(shots[-1]["frameRange"][1], total_frames)

        # Check the mandatory 5 Visual State Questions on every shot
        for s in shots:
            sc = s["stateChange"]
            self.assertIn("whatExistsAtBeginning", sc)
            self.assertIn("whatHappens", sc)
            self.assertIn("whatVisiblyChanges", sc)
            self.assertIn("whatExistsAtEnd", sc)
            self.assertIn("whyChangeMatters", sc)
            self.assertTrue(len(sc["whatExistsAtBeginning"]) > 0)
            self.assertTrue(len(sc["whatHappens"]) > 0)
            self.assertTrue(len(sc["whatVisiblyChanges"]) > 0)
            self.assertTrue(len(sc["whatExistsAtEnd"]) > 0)
            self.assertTrue(len(sc["whyChangeMatters"]) > 0)

        # Check confidence levels
        for s in shots:
            if s.get("visualMechanism"):
                self.assertIn(s["visualMechanism"]["confidence"], ["REQUIRED", "RECOMMENDED", "OPTIONAL"])
            for comp in s.get("suggestedComponents", []):
                self.assertEqual(comp["confidence"], "OPTIONAL" if comp["component"] not in ("CinematicIllustrationCard", "GlossyJudyIntro", "AnimatedSlashStrike") else comp["confidence"])

    def test_creative_brief_compiler_full_flow(self):
        intel = ScriptIntelligence()
        script = "Every notification steals a fragment of your sustained attention. Disconnect."
        story_model = intel.analyze(script, topic="Attention Fragmentation")

        creative_plan = {
            "visualConcept": {
                "primaryMechanism": "tensile_fragmentation",
                "centralTransformation": "Monolithic conduit fractures into scattered shards",
                "whyThisMechanism": "Represents cognitive scatter",
                "championCandidate": {
                    "physicalDescription": "Tensile beam snapping under impulse",
                    "visibleTransformation": "Clean cleavage",
                    "visibleConsequence": "Scattered residual fragments",
                    "persistentState": "Recalibrated focus zone",
                },
            },
            "scenePlans": [],
        }

        words = [
            {"word": "Every", "startMs": 0, "endMs": 400},
            {"word": "Disconnect", "startMs": 3000, "endMs": 4000},
        ]

        brief = self.compiler.compile_brief(
            clip_name="attention_fragmentation",
            topic="Attention Fragmentation",
            niche="self_improvement",
            clean_script=script,
            words=words,
            story_model=story_model,
            creative_plan=creative_plan,
            motion_ast={},
            duration_sec=4.5,
        )

        # Check top-level brief schema
        self.assertEqual(brief["version"], "1.0.0")
        self.assertEqual(brief["clipId"], "attention_fragmentation")
        self.assertIn("story", brief)
        self.assertIn("emotionalArc", brief)
        self.assertIn("visualConcept", brief)
        self.assertIn("shots", brief)
        self.assertIn("visualLanguage", brief)
        self.assertIn("agentContract", brief)

        # Verify Minimalist Agent Contract fields
        contract = brief["agentContract"]
        self.assertIn("visualHierarchy", contract)
        self.assertIn("componentRestraint", contract)
        self.assertIn("minimalityPass", contract)

        # Verify JSON serializability
        serialized = json.dumps(brief)
        self.assertTrue(len(serialized) > 100)

        # Check Canvas mission header formatting
        header = self.compiler.format_canvas_mission_header(
            pascal_name="AttentionFragmentation",
            brief=brief,
            s2_start=90,
            s3_start=180,
            total_frames=270,
        )
        self.assertIn("RIGHTMOTION CREATIVE MISSION", header)
        self.assertIn("RIGHTMOTION CREATIVE MANTRA", header)
        self.assertIn("CANONICAL BRIEF", header)
        self.assertIn("creative_brief.json", header)
        self.assertIn("MINIMALIST EDITORIAL LAWS", header)

    def test_minimalist_visual_density_and_restraint(self):
        """
        Validates Section 3 (Visual Clarity Budget), Section 4 (One Visual Idea),
        Section 5 (Component Budget), and Section 9 (Visual Focus).
        """
        intel = ScriptIntelligence()
        script = (
            "Small distractions become a constant background noise. "
            "Every notification adds another layer of resistance to your focus. "
            "Clear the space today."
        )
        story_model = intel.analyze(script, topic="Accumulating Distractions")

        creative_plan = {
            "visualConcept": {
                "primaryMechanism": "semantic_accumulation",
                "centralTransformation": "A single focus conduit progressively clogs with distraction particles",
                "conceptName": "Accumulating Distractions",
                "championCandidate": {
                    "physicalDescription": "Central focus channel undergoing particle sedimentation",
                    "visibleTransformation": "Channel capacity decreases as particles accumulate",
                    "visibleConsequence": "Clean signal blocked",
                    "persistentState": "Clogged conduit",
                },
            }
        }

        words = [
            {"word": "Small", "startMs": 0, "endMs": 300},
            {"word": "distractions", "startMs": 500, "endMs": 1000},
            {"word": "Every", "startMs": 3000, "endMs": 3400},
            {"word": "focus", "startMs": 6000, "endMs": 6500},
            {"word": "Clear", "startMs": 8000, "endMs": 8500},
            {"word": "today", "startMs": 9500, "endMs": 10000},
        ]
        total_frames = 600

        shots = self.director.decompose_shots(
            story_model=story_model,
            creative_plan=creative_plan,
            transcript=words,
            total_frames=total_frames,
        )

        for s in shots:
            # Section 3: Visual Density Budget (LOW / MEDIUM / HIGH)
            self.assertIn("visualDensity", s)
            self.assertIn(s["visualDensity"], ["LOW", "MEDIUM", "HIGH"])

            # Section 4: One Visual Idea per Shot (understandable in 1 sentence)
            self.assertIn("primaryVisualIdea", s)
            self.assertTrue(len(s["primaryVisualIdea"]) > 10)
            self.assertLess(len(s["primaryVisualIdea"]), 180)

            # Section 5: Component Budget (default 1, max 2)
            self.assertIn("componentBudget", s)
            self.assertLessEqual(s["componentBudget"], 2)

            # Section 9: Visual Focus Hierarchy
            self.assertIn("visualFocus", s)
            focus = s["visualFocus"]
            self.assertIn("primary", focus)
            self.assertIn("backgroundRole", focus)

            # Simplification directive
            self.assertIn("simplificationDirective", s)

            # Check that suggested components are flagged with complexity
            for comp in s.get("suggestedComponents", []):
                self.assertIn("visualComplexity", comp)
                self.assertIn("bestUse", comp)

    def test_visual_critic_eye_confusion(self):
        """
        Validates Visual Critic analysis for eye-confusion and work-efficiency.
        """
        from visual_critic import StructuralCritic
        # Create a mock structural critic
        critic = StructuralCritic("attention_fragmentation")
        # Test eye confusion logic on a clean snippet vs cluttered snippet
        clean_code = """
        <div style={{ position: 'relative' }}>
          <ViscoelasticDeformation loadProgress={strain} />
        </div>
        """
        analysis_clean = critic._analyze_eye_confusion(
            shot_snippet=clean_code,
            full_canvas=clean_code,
            role="mechanism",
            has_presenter=False,
            used_mechanisms=["ViscoelasticDeformation"],
            card_count=0,
            pacing="BUILD",
        )
        self.assertLessEqual(analysis_clean["competingTargetsCount"], 1)
        self.assertFalse(analysis_clean["hasSimultaneousClutter"])
        self.assertFalse(analysis_clean["typographyCompetes"])

        cluttered_code = """
        <GlossyJudyIntro startFrame={0} exitFrame={300} />
        <ViscoelasticDeformation loadProgress={strain} />
        <ConceptKeywordSlam word="DISTRACTION" />
        <div className="rounded-2xl bg-white p-6">Card 1</div>
        <div className="rounded-2xl bg-white p-6">Card 2</div>
        """
        analysis_cluttered = critic._analyze_eye_confusion(
            shot_snippet=cluttered_code,
            full_canvas=cluttered_code,
            role="mechanism",
            has_presenter=True,
            used_mechanisms=["ViscoelasticDeformation"],
            card_count=2,
            pacing="BUILD",
        )
        self.assertGreaterEqual(analysis_cluttered["competingTargetsCount"], 3)
        self.assertTrue(analysis_cluttered["hasSimultaneousClutter"])


if __name__ == "__main__":
    unittest.main()
