#!/usr/bin/env python3
"""
🧪 Test Suite for RightMotion Motion AST & Semantic Validator
Location: scripts/test_ast_schema.py

Validates:
  1. Canonical Small Compromises AST passes all invariants cleanly.
  2. Dangling actor references in mutations are rejected.
  3. Dangling actor references in forces are rejected.
  4. Dangling originating actor references in persistent traces are rejected.
  5. Dangling originating scene references in persistent traces are rejected.
  6. Dangling entities in causal couplings are rejected.
  7. Dangling attached actors in annotations are rejected.
  8. Irreversible mutations without memory traces are rejected.
  9. Temporal scene overlap and invalid frame ranges are rejected.
  10. Out-of-bounds trigger frames in forces and mutations are rejected.
  11. Platform safe bounds horizontal violations are rejected.
  12. Platform safe bounds vertical violations are rejected.
  13. Anti-Cardification invariant: banned geometry types are rejected.
  14. Anti-Cardification invariant: banned container roles are rejected.
  15. Missing semantic intent fields (semanticRole, semanticCause, physicalRationale) are rejected.
  16. Generic semantic roles ("box", "item") are rejected.
  17. Open Extensibility: custom_geometry with parameters passes cleanly.
  18. Open Extensibility: custom_force and custom_mutation pass cleanly.
  19. Multi-scene continuity: persistent actors (isPersistent=True) are accessible in subsequent scenes.
"""

import copy
import json
import sys
import unittest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from validate_motion_ast import validate_motion_ast

FIXTURE_PATH = ROOT_DIR / "scripts" / "fixtures" / "small_compromises_ast.json"


class TestMotionASTSchema(unittest.TestCase):
    def setUp(self):
        with open(FIXTURE_PATH, "r", encoding="utf-8") as f:
            self.canonical_ast = json.load(f)

    # -------------------------------------------------------------
    # 1. Canonical Fixture Test
    # -------------------------------------------------------------
    def test_canonical_ast_passes(self):
        """Verify the canonical Small Compromises AST passes 100% cleanly."""
        result = validate_motion_ast(self.canonical_ast)
        self.assertTrue(
            result.is_valid,
            f"Canonical AST failed validation: {[e.message for e in result.errors]}",
        )
        self.assertEqual(len(result.errors), 0)

    # -------------------------------------------------------------
    # 2. Entity Referencing Invariants
    # -------------------------------------------------------------
    def test_dangling_mutation_actor_reference(self):
        """Verify mutation referencing an unknown actor is rejected."""
        ast = copy.deepcopy(self.canonical_ast)
        ast["scenes"][1]["mutations"][0]["actorId"] = "non_existent_actor_99"
        result = validate_motion_ast(ast)
        self.assertFalse(result.is_valid)
        self.assertTrue(any(e.code == "DANGLING_ACTOR_REFERENCE" for e in result.errors))

    def test_dangling_force_actor_reference(self):
        """Verify force referencing an unknown target actor is rejected."""
        ast = copy.deepcopy(self.canonical_ast)
        ast["scenes"][1]["forces"][0]["targetActorId"] = "ghost_actor_unknown"
        result = validate_motion_ast(ast)
        self.assertFalse(result.is_valid)
        self.assertTrue(any(e.code == "DANGLING_ACTOR_REFERENCE" for e in result.errors))

    def test_dangling_persistent_trace_actor(self):
        """Verify persistent trace referencing unknown actor is rejected."""
        ast = copy.deepcopy(self.canonical_ast)
        ast["persistentWorldMemory"][0]["originatingActorId"] = "unregistered_actor_id"
        result = validate_motion_ast(ast)
        self.assertFalse(result.is_valid)
        self.assertTrue(any(e.code == "INVALID_TRACE_ORIGIN_ACTOR" for e in result.errors))

    def test_dangling_persistent_trace_scene(self):
        """Verify persistent trace referencing unknown scene is rejected."""
        ast = copy.deepcopy(self.canonical_ast)
        ast["persistentWorldMemory"][0]["originatingSceneId"] = "unregistered_scene_id"
        result = validate_motion_ast(ast)
        self.assertFalse(result.is_valid)
        self.assertTrue(any(e.code == "INVALID_TRACE_ORIGIN_SCENE" for e in result.errors))

    def test_dangling_causal_coupling_entities(self):
        """Verify causal coupling referencing unknown source or target is rejected."""
        ast = copy.deepcopy(self.canonical_ast)
        ast["scenes"][1]["causalCouplings"][0]["sourceEvent"]["actorId"] = "phantom_entity"
        result = validate_motion_ast(ast)
        self.assertFalse(result.is_valid)
        self.assertTrue(any(e.code == "DANGLING_COUPLING_SOURCE" for e in result.errors))

    def test_dangling_annotation_actor_reference(self):
        """Verify annotation with attachedToActorId pointing to unknown actor is rejected."""
        ast = copy.deepcopy(self.canonical_ast)
        ast["scenes"][1]["annotations"][1]["attachedToActorId"] = "phantom_actor"
        result = validate_motion_ast(ast)
        self.assertFalse(result.is_valid)
        self.assertTrue(any(e.code == "DANGLING_ACTOR_REFERENCE" for e in result.errors))

    # -------------------------------------------------------------
    # 3. Irreversible Mutations & Memory Traces
    # -------------------------------------------------------------
    def test_irreversible_mutation_without_memory_trace(self):
        """Verify irreversible mutation lacking createsMemoryTrace and persistentWorldMemory is rejected."""
        ast = copy.deepcopy(self.canonical_ast)
        # Clear global memory trace and remove createsMemoryTrace from mutation
        ast["persistentWorldMemory"] = []
        del ast["scenes"][1]["mutations"][0]["createsMemoryTrace"]
        result = validate_motion_ast(ast)
        self.assertFalse(result.is_valid)
        self.assertTrue(any(e.code == "MISSING_MEMORY_TRACE" for e in result.errors))

    # -------------------------------------------------------------
    # 4. Temporal Ordering & Frame Ranges
    # -------------------------------------------------------------
    def test_temporal_ordering_scene_overlap(self):
        """Verify overlapping scenes are rejected."""
        ast = copy.deepcopy(self.canonical_ast)
        # Scene 2 ends at 950, Scene 3 illegally starts at 900
        ast["scenes"][2]["startFrame"] = 900
        result = validate_motion_ast(ast)
        self.assertFalse(result.is_valid)
        self.assertTrue(any(e.code == "SCENE_FRAME_OVERLAP" for e in result.errors))

    def test_temporal_ordering_out_of_bounds_trigger(self):
        """Verify force trigger frame outside scene bounds is rejected."""
        ast = copy.deepcopy(self.canonical_ast)
        # Scene 2 is frames 420-950; set force trigger to frame 200
        ast["scenes"][1]["forces"][0]["triggerFrame"] = 200
        result = validate_motion_ast(ast)
        self.assertFalse(result.is_valid)
        self.assertTrue(any(e.code == "INVALID_TIMING" for e in result.errors))

    # -------------------------------------------------------------
    # 5. Platform Safe Bounds Enforcement
    # -------------------------------------------------------------
    def test_safe_bounds_violation_x(self):
        """Verify primary actor placed beyond safe horizontal bounds is rejected."""
        ast = copy.deepcopy(self.canonical_ast)
        # Place integrity_boundary at x = 1100 (outside right safe bound 1000)
        ast["scenes"][1]["actors"][0]["resolvedLayout"]["x"] = 1100
        result = validate_motion_ast(ast)
        self.assertFalse(result.is_valid)
        self.assertTrue(any(e.code == "SAFE_BOUNDS_VIOLATION" for e in result.errors))

    def test_safe_bounds_violation_y(self):
        """Verify primary actor placed beyond safe vertical bounds is rejected."""
        ast = copy.deepcopy(self.canonical_ast)
        # Place neural_brain_actor at y = 1550 (outside bottom safe bound 1340)
        ast["scenes"][1]["actors"][1]["resolvedLayout"]["y"] = 1550
        result = validate_motion_ast(ast)
        self.assertFalse(result.is_valid)
        self.assertTrue(any(e.code == "SAFE_BOUNDS_VIOLATION" for e in result.errors))

    # -------------------------------------------------------------
    # 6. Anti-Cardification Invariants
    # -------------------------------------------------------------
    def test_cardification_banned_geometry(self):
        """Verify an actor with banned container geometry (e.g. 'card') is rejected."""
        ast = copy.deepcopy(self.canonical_ast)
        ast["scenes"][1]["actors"][0]["geometry"] = {"type": "card", "width": 800, "height": 400}
        result = validate_motion_ast(ast)
        self.assertFalse(result.is_valid)
        self.assertTrue(any(e.code == "CARDIFICATION_VIOLATION" for e in result.errors))

    def test_cardification_banned_role(self):
        """Verify an actor with banned container role (e.g. 'info_card') is rejected."""
        ast = copy.deepcopy(self.canonical_ast)
        ast["scenes"][1]["actors"][0]["semanticRole"] = "system_info_card"
        result = validate_motion_ast(ast)
        self.assertFalse(result.is_valid)
        self.assertTrue(any(e.code == "CARDIFICATION_VIOLATION" for e in result.errors))

    # -------------------------------------------------------------
    # 7. Semantic Intent Preservation
    # -------------------------------------------------------------
    def test_missing_semantic_intent_fields(self):
        """Verify nodes missing required semantic intent explanations are rejected."""
        ast = copy.deepcopy(self.canonical_ast)
        # Blank out physicalRationale on mutation
        ast["scenes"][1]["mutations"][0]["physicalRationale"] = ""
        result = validate_motion_ast(ast)
        self.assertFalse(result.is_valid)
        self.assertTrue(any(e.code == "MISSING_SEMANTIC_INTENT" for e in result.errors))

    def test_generic_semantic_role(self):
        """Verify generic meaningless semantic roles like 'box' are rejected."""
        ast = copy.deepcopy(self.canonical_ast)
        ast["scenes"][1]["actors"][0]["semanticRole"] = "box"
        result = validate_motion_ast(ast)
        self.assertFalse(result.is_valid)
        self.assertTrue(any(e.code == "GENERIC_SEMANTIC_ROLE" for e in result.errors))

    # -------------------------------------------------------------
    # 8. Open Extensibility
    # -------------------------------------------------------------
    def test_extensibility_custom_geometry(self):
        """Verify custom geometry extensions pass cleanly without schema changes."""
        ast = copy.deepcopy(self.canonical_ast)
        ast["scenes"][1]["actors"].append(
            {
                "id": "torsion_spring_actor",
                "semanticRole": "elastic_resistance_core",
                "narrativeImportance": "SECONDARY",
                "geometry": {
                    "type": "custom_geometry",
                    "geometryName": "elastic_torsion_spring",
                    "parameters": {"coils": 6, "wireThicknessPx": 4, "kConstant": 25.0},
                },
                "visualStyle": {"strokeColor": "#090d16", "opacity": 1.0},
                "resolvedLayout": {
                    "x": 300,
                    "y": 700,
                    "width": 120,
                    "height": 120,
                    "originAnchor": "center",
                    "semanticPlacement": "lateral_balance",
                },
                "zIndex": 18,
                "isPersistent": False,
            }
        )
        result = validate_motion_ast(ast)
        self.assertTrue(result.is_valid, f"Custom geometry extension failed: {[e.message for e in result.errors]}")

    def test_extensibility_custom_force_and_mutation(self):
        """Verify custom force and mutation types pass cleanly."""
        ast = copy.deepcopy(self.canonical_ast)
        ast["scenes"][1]["forces"].append(
            {
                "forceId": "magnetic_attraction_force",
                "targetActorId": "integrity_boundary",
                "type": "custom_force",
                "triggerFrame": 720,
                "durationFrames": 40,
                "magnitude": 150,
                "directionDeg": 270,
                "timingCurve": "viscoelastic_relax",
                "semanticCause": "Subconscious rationalization pulls boundary upward",
                "customParameters": {"magneticPermeability": 1.25},
            }
        )
        ast["scenes"][1]["mutations"].append(
            {
                "mutationId": "magnetic_repolarization",
                "actorId": "integrity_boundary",
                "type": "custom_mutation",
                "triggerFrame": 730,
                "durationFrames": 30,
                "stateBefore": "POLARIZED_STRICT",
                "stateAfter": "REVERSED_CHARGE",
                "physicalRationale": "Reversal of standard alters attraction orientation",
                "parameters": {"polarity": -1},
            }
        )
        result = validate_motion_ast(ast)
        self.assertTrue(result.is_valid, f"Custom force/mutation extension failed: {[e.message for e in result.errors]}")

    # -------------------------------------------------------------
    # 9. Persistent Actors Across Scenes
    # -------------------------------------------------------------
    def test_persistent_actors_across_scenes(self):
        """Verify actors marked isPersistent=True survive into later scenes."""
        ast = copy.deepcopy(self.canonical_ast)
        # integrity_boundary is persistent in scene 2. Add a mutation referencing it in scene 3
        ast["scenes"][2]["mutations"].append(
            {
                "mutationId": "persistent_boundary_fade",
                "actorId": "integrity_boundary",
                "type": "coordinate_displacement",
                "triggerFrame": 1000,
                "durationFrames": 40,
                "stateBefore": "RECALIBRATED_BASELINE",
                "stateAfter": "SUBSURFACE_ANCHOR",
                "physicalRationale": "Previous baseline sinks into deep cognitive bedrock",
                "parameters": {"deltaY": 50},
            }
        )
        result = validate_motion_ast(ast)
        self.assertTrue(result.is_valid, f"Persistent actor across scenes failed: {[e.message for e in result.errors]}")


def run_tests():
    print("=" * 75)
    print("🎬 RUNNING RIGHTMOTION MOTION AST SCHEMA & SEMANTIC VALIDATOR SUITE")
    print("=" * 75)

    suite = unittest.TestLoader().loadTestsFromTestCase(TestMotionASTSchema)
    runner = unittest.TextTestRunner(verbosity=2)
    test_result = runner.run(suite)

    print("\n" + "=" * 75)
    if test_result.wasSuccessful():
        print(f"✅ ALL {test_result.testsRun} AST SCHEMA & INVARIANT TESTS PASSED CLEANLY!")
    else:
        print(f"❌ {len(test_result.failures)} FAILURES, {len(test_result.errors)} ERRORS out of {test_result.testsRun} tests")
    print("=" * 75)
    return test_result.wasSuccessful()


if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
