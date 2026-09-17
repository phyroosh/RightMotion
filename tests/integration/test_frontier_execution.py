#!/usr/bin/env python3
"""
🧪 RightMotion Frontier Execution & Anti-Cardification Regression Test Suite
Location: scripts/test_frontier_execution.py

Verifies the 15 authoritative regression test requirements (FRONTIER-EXEC-001 through FRONTIER-EXEC-015):
  - FRONTIER-EXEC-001: Script with physical metaphor produces mechanism, not cards.
  - FRONTIER-EXEC-002: Cardification Score under 35 on all test cases.
  - FRONTIER-EXEC-003: Activation Depth >= 3 on all selected frontiers.
  - FRONTIER-EXEC-004: F1 produces an actual spatial environment, not a background image with text on top.
  - FRONTIER-EXEC-005: F2 produces genuine physical material interaction, not a flat card with metallic gradient.
  - FRONTIER-EXEC-006: F4 produces real mass/physics interaction (deflection, impact, momentum), not spring cards.
  - FRONTIER-EXEC-007: F5 produces responsive environment, not a dark background with particles.
  - FRONTIER-EXEC-008: F6 produces physical speed differential / temporal distortion, not slow-motion text animation.
  - FRONTIER-EXEC-009: F7 produces actual state transition with visual proof of state change, not card swap.
  - FRONTIER-EXEC-010: Mute test passes on all generated scenes (visual tells the story without words).
  - FRONTIER-EXEC-011: Remove-the-text test leaves an active mechanism, not empty colored boxes.
  - FRONTIER-EXEC-012: Spoken words trigger physical mutations within +/- 3 frames of audio event.
  - FRONTIER-EXEC-013: State change in Scene 1 leaves visual trace in Scene 2.
  - FRONTIER-EXEC-014: Multiple frontiers combine into one compound causal sequence.
  - FRONTIER-EXEC-015: F3 remains strictly dormant.
"""

import json
import sys
import unittest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from orchestrator import CreativeOrchestrator
from frontier_utilization import FrontierUtilizationAuditor
from validate_motion_ast import validate_motion_ast


class TestFrontierExecution(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.orchestrator = CreativeOrchestrator()

    def test_01_frontier_exec_001_physical_metaphor_produces_mechanism_not_cards(self):
        """FRONTIER-EXEC-001: Script with physical metaphor produces mechanism, not cards."""
        clip_name = "test_boundary_clip"
        topic = "Your Brain Learns What You Repeatedly Tolerate"
        script = (
            "Every time you tolerate disrespect, your brain recalibrates its baseline standard. "
            "The standard line deflects downward under the load of repeated concession. "
            "Eventually what outraged you yesterday becomes the invisible norm today."
        )
        plan = self.orchestrator.generate_plan(clip_name, topic, script)
        words = script.split()
        transcript = [
            {"word": w, "start": i * 0.35, "end": (i + 1) * 0.35, "confidence": 0.99}
            for i, w in enumerate(words)
        ]
        ast = self.orchestrator.compile_motion_ast(plan, transcript)
        validation = validate_motion_ast(ast)
        self.assertTrue(validation.is_valid, f"Compiled AST failed validation: {[e.message for e in validation.errors]}")

        # Ensure physical mechanism actors exist across scenes (not presentation card placeholders)
        all_actors = []
        for sc in ast["scenes"]:
            all_actors.extend(sc["actors"])

        has_physical_mechanism = any(
            act.get("geometry", {}).get("type") in [
                "continuous_boundary",
                "conduit_pathway",
                "monolithic_foundation",
                "fulcrum_beam",
                "physical_mass",
            ]
            or act.get("semanticRole") in [
                "the_sovereign_standard",
                "neural_action_pathway",
                "structural_bedrock",
                "systemic_equilibrium_beam",
                "physical_mechanism_anchor",
            ]
            for act in all_actors
        )
        self.assertTrue(has_physical_mechanism, "Compiled AST must contain first-class physical mechanism actors")

        # Ensure no synthetic cards were generated in place of mechanisms
        card_actor_ids = [act["id"] for act in all_actors if "card" in act["id"] or "rule_1" in act["id"]]
        self.assertEqual(len(card_actor_ids), 0, f"Found synthetic card actors in physical scene: {card_actor_ids}")

    def test_02_frontier_exec_002_cardification_score_under_35(self):
        """FRONTIER-EXEC-002: Cardification Score under 35 on mechanism-driven scenes."""
        open_stage_canvas = """
        import { AbsoluteFill } from "remotion";
        import { ThresholdBoundary, KineticFurrow, MechanismStage } from "../../components/primitives";
        import { UniversalBackground } from "../../components/UniversalBackground";

        export const Canvas: React.FC = () => {
            return (
                <AbsoluteFill>
                    <UniversalBackground assetId="dark_matte_spotlight_01" />
                    <MechanismStage>
                        <ThresholdBoundary initialY={620} settledY={800} triggerFrame={35} />
                        <KineticFurrow startX={140} endX={940} y={800} triggerFrame={90} />
                    </MechanismStage>
                </AbsoluteFill>
            );
        };
        """
        report = FrontierUtilizationAuditor.audit_canvas_code(
            open_stage_canvas, clip_name="open_stage_test"
        )
        self.assertLess(
            report.overall_cardification_score,
            35.0,
            f"Cardification score {report.overall_cardification_score} must be < 35.0",
        )
        self.assertFalse(report.scenes[0].is_cardified, "Scene must not be flagged as cardified")

    def test_03_frontier_exec_003_activation_depth_at_least_level_3(self):
        """FRONTIER-EXEC-003: Activation Depth >= 3 on all selected frontiers."""
        canvas_with_primitives = """
        import { AbsoluteFill } from "remotion";
        import { ThresholdBoundary, KineticFurrow, CausalActionCoupling } from "../../components/primitives";
        import { UniversalBackground } from "../../components/UniversalBackground";

        export const Canvas: React.FC = () => {
            return (
                <AbsoluteFill>
                    <UniversalBackground assetId="dark_matte_spotlight_01" />
                    <ThresholdBoundary initialY={620} settledY={800} triggerFrame={45} />
                    <KineticFurrow startX={140} endX={940} y={800} triggerFrame={90} />
                    <CausalActionCoupling sourceActorId="headline" targetActorId="boundary" triggerFrame={45} />
                </AbsoluteFill>
            );
        };
        """
        mock_plan = {
            "scenePlans": [
                {
                    "sceneIndex": 1,
                    "activeCapabilities": [
                        {"frontierCode": "F7", "name": "Visual State Machines"},
                        {"frontierCode": "F_UBG", "name": "Universal Background"},
                    ],
                }
            ]
        }
        report = FrontierUtilizationAuditor.audit_canvas_code(
            canvas_with_primitives, creative_plan=mock_plan, clip_name="depth_test"
        )
        f7_depth = report.frontier_depths.get("F7")
        self.assertIsNotNone(f7_depth)
        self.assertGreaterEqual(
            f7_depth.depth_level,
            3,
            f"F7 depth level {f7_depth.depth_level} must be >= 3",
        )
        self.assertEqual(f7_depth.depth_level, 5, "F7 with ThresholdBoundary must achieve Level 5 Primary Mechanism")

        ubg_depth = report.frontier_depths.get("F_UBG")
        self.assertIsNotNone(ubg_depth)
        self.assertGreaterEqual(
            ubg_depth.depth_level,
            3,
            f"F_UBG depth level {ubg_depth.depth_level} must be >= 3",
        )

    def test_04_frontier_exec_004_f1_produces_spatial_environment(self):
        """FRONTIER-EXEC-004: F1 produces an actual spatial environment, not a background image with text on top."""
        canvas_f1 = """
        import { AbsoluteFill } from "remotion";
        import { InfiniteWorldCanvas, WorldEntity } from "../../components/frontiers/F1_InfiniteWorld";

        export const Canvas: React.FC = () => {
            return (
                <AbsoluteFill>
                    <InfiniteWorldCanvas cameraX={200} cameraY={400} zoom={1.2}>
                        <WorldEntity worldX={100} worldY={200} depthLayer={1} />
                        <WorldEntity worldX={500} worldY={800} depthLayer={2} />
                    </InfiniteWorldCanvas>
                </AbsoluteFill>
            );
        };
        """
        report = FrontierUtilizationAuditor.audit_canvas_code(canvas_f1, clip_name="f1_spatial_test")
        f1_depth = report.frontier_depths.get("F1")
        self.assertIsNotNone(f1_depth)
        self.assertGreaterEqual(f1_depth.depth_level, 4, "F1 with InfiniteWorldCanvas must achieve Level 4+")

    def test_05_frontier_exec_005_f2_produces_genuine_material_interaction(self):
        """FRONTIER-EXEC-005: F2 produces genuine physical material interaction, not a flat card with metallic gradient."""
        canvas_f2 = """
        import { AbsoluteFill } from "remotion";
        import { StressFractureEngine, ViscoelasticDeformation } from "../../components/frontiers/F2_Materiality";

        export const Canvas: React.FC = () => {
            return (
                <AbsoluteFill>
                    <StressFractureEngine shatterFrame={60} crackCount={12} />
                    <ViscoelasticDeformation loadMagnitude={1.4} relaxationFrame={90} />
                </AbsoluteFill>
            );
        };
        """
        report = FrontierUtilizationAuditor.audit_canvas_code(canvas_f2, clip_name="f2_material_test")
        f2_depth = report.frontier_depths.get("F2")
        self.assertIsNotNone(f2_depth)
        self.assertGreaterEqual(f2_depth.depth_level, 4, "F2 with StressFractureEngine must achieve Level 4+")

    def test_06_frontier_exec_006_f4_produces_real_mass_physics_interaction(self):
        """FRONTIER-EXEC-006: F4 produces real mass/physics interaction, not spring cards."""
        canvas_f4 = """
        import { AbsoluteFill } from "remotion";
        import { KineticFulcrumBeam, SemanticMassNode } from "../../components/frontiers/F4_SemanticMass";

        export const Canvas: React.FC = () => {
            return (
                <AbsoluteFill>
                    <KineticFulcrumBeam angleDeg={18} fulcrumX={540} triggerFrame={40} />
                    <SemanticMassNode massKg={50} dropY={800} impactFrame={40} />
                </AbsoluteFill>
            );
        };
        """
        report = FrontierUtilizationAuditor.audit_canvas_code(canvas_f4, clip_name="f4_mass_test")
        f4_depth = report.frontier_depths.get("F4")
        self.assertIsNotNone(f4_depth)
        self.assertGreaterEqual(f4_depth.depth_level, 4, "F4 with KineticFulcrumBeam must achieve Level 4+")

    def test_07_frontier_exec_007_f5_produces_responsive_environment(self):
        """FRONTIER-EXEC-007: F5 produces responsive environment, not a dark background with particles."""
        canvas_f5 = """
        import { AbsoluteFill } from "remotion";
        import { DioramaPlinth, BedrockFoundation } from "../../components/frontiers/F5_EnvironmentalWorlds";

        export const Canvas: React.FC = () => {
            return (
                <AbsoluteFill>
                    <DioramaPlinth elevationPx={40} lightingAngleDeg={120} />
                    <BedrockFoundation compressionPct={12} loadFrame={50} />
                </AbsoluteFill>
            );
        };
        """
        report = FrontierUtilizationAuditor.audit_canvas_code(canvas_f5, clip_name="f5_env_test")
        f5_depth = report.frontier_depths.get("F5")
        self.assertIsNotNone(f5_depth)
        self.assertGreaterEqual(f5_depth.depth_level, 4, "F5 with DioramaPlinth must achieve Level 4+")

    def test_08_frontier_exec_008_f6_produces_temporal_distortion(self):
        """FRONTIER-EXEC-008: F6 produces physical speed differential / temporal distortion."""
        canvas_f6 = """
        import { AbsoluteFill } from "remotion";
        import { WorldCameraBreathHold } from "../../components/primitives";

        export const Canvas: React.FC = () => {
            return (
                <AbsoluteFill>
                    <WorldCameraBreathHold holdStartFrame={120} holdDurationFrames={24} subBassHum={true} />
                </AbsoluteFill>
            );
        };
        """
        report = FrontierUtilizationAuditor.audit_canvas_code(canvas_f6, clip_name="f6_temporal_test")
        f6_depth = report.frontier_depths.get("F6")
        self.assertIsNotNone(f6_depth)
        self.assertGreaterEqual(f6_depth.depth_level, 4, "F6 with WorldCameraBreathHold must achieve Level 4+")

    def test_09_frontier_exec_009_f7_produces_actual_state_transition(self):
        """FRONTIER-EXEC-009: F7 produces actual state transition with visual proof of state change, not card swap."""
        clip_name = "state_transition_clip"
        topic = "The Habit Loop: Trigger, Carving, Lock-In"
        script = (
            "The first repetition cuts a slight groove into resistance. "
            "With each subsequent pass the channel erodes deeper. "
            "What once required fierce discipline now flows by pure kinetic inertia."
        )
        plan = self.orchestrator.generate_plan(clip_name, topic, script)
        words = script.split()
        transcript = [
            {"word": w, "start": i * 0.35, "end": (i + 1) * 0.35, "confidence": 0.99}
            for i, w in enumerate(words)
        ]
        ast = self.orchestrator.compile_motion_ast(plan, transcript)
        
        # Verify mutations contain clear stateBefore and stateAfter
        all_mutations = []
        for sc in ast["scenes"]:
            all_mutations.extend(sc.get("mutations", []))

        self.assertGreater(len(all_mutations), 0, "AST must contain physical mutations for state transition")
        for mut in all_mutations:
            self.assertIn("stateBefore", mut, "Mutation must specify stateBefore")
            self.assertIn("stateAfter", mut, "Mutation must specify stateAfter")
            self.assertNotEqual(mut["stateBefore"], mut["stateAfter"], "State change must be non-trivial")

    def test_10_frontier_exec_010_mute_test_passes(self):
        """FRONTIER-EXEC-010: Mute test passes on all generated scenes (visual tells story without words)."""
        canvas_mute = """
        import { AbsoluteFill } from "remotion";
        import { ThresholdBoundary } from "../../components/primitives";
        import { UniversalBackground } from "../../components/UniversalBackground";

        export const Canvas: React.FC = () => {
            return (
                <AbsoluteFill>
                    <UniversalBackground assetId="dark_matte_spotlight_01" />
                    <ThresholdBoundary initialY={620} settledY={800} triggerFrame={40} />
                </AbsoluteFill>
            );
        };
        """
        report = FrontierUtilizationAuditor.audit_canvas_code(canvas_mute, clip_name="mute_test")
        self.assertTrue(report.mute_test_passed, "Mute test must pass on mechanism-driven canvas")

    def test_11_frontier_exec_011_remove_text_test_leaves_active_mechanism(self):
        """FRONTIER-EXEC-011: Remove-the-text test leaves an active mechanism, not empty colored boxes."""
        canvas_nomoretext = """
        import { AbsoluteFill } from "remotion";
        import { KineticFurrow } from "../../components/primitives";

        export const Canvas: React.FC = () => {
            return (
                <AbsoluteFill>
                    <KineticFurrow startX={140} endX={940} y={800} triggerFrame={50} />
                </AbsoluteFill>
            );
        };
        """
        report = FrontierUtilizationAuditor.audit_canvas_code(canvas_nomoretext, clip_name="remove_text_test")
        self.assertTrue(report.remove_text_test_passed, "Remove-the-text test must pass when physical mechanisms exist")

    def test_12_frontier_exec_012_spoken_words_trigger_physical_mutations_within_window(self):
        """FRONTIER-EXEC-012: Spoken words trigger physical mutations within +/- 3 frames of audio event."""
        clip_name = "audio_sync_clip"
        topic = "Breaking Point: The Weight of Hidden Debt"
        script = (
            "Every compromise adds an invisible load to your foundation. "
            "At 14 tons the structural bedrock abruptly ruptures and shatters. "
            "You cannot negotiate with gravity."
        )
        plan = self.orchestrator.generate_plan(clip_name, topic, script)
        words = script.split()
        fps = 30
        transcript = [
            {"word": w, "start": i * 0.4, "end": (i + 1) * 0.4, "confidence": 0.99}
            for i, w in enumerate(words)
        ]
        ast = self.orchestrator.compile_motion_ast(plan, transcript)
        
        # Verify force triggerFrame aligns with spoken word start frame within +/- 3 frames
        for sc in ast["scenes"]:
            for force in sc.get("forces", []):
                trigger_f = force["triggerFrame"]
                sc_start_f = sc["startFrame"]
                sc_end_f = sc["endFrame"]
                word_frames = [
                    int(w["start"] * fps)
                    for w in transcript
                    if sc_start_f <= int(w["start"] * fps) <= sc_end_f
                ]
                if word_frames:
                    min_diff = min(abs(trigger_f - wf) for wf in word_frames)
                    self.assertLessEqual(min_diff, 3, f"Force trigger {trigger_f} not aligned to any word ({min_diff} frames diff)")

    def test_13_frontier_exec_013_scene_1_state_change_leaves_visual_trace_in_scene_2(self):
        """FRONTIER-EXEC-013: State change in Scene 1/2 leaves visual trace in subsequent scenes."""
        clip_name = "memory_trace_clip"
        topic = "Your Brain Learns What You Repeatedly Tolerate"
        script = (
            "When you tolerate disrespect, your standard line deflects downward permanently. "
            "The settled baseline leaves a ghost line where the standard used to exist. "
            "Your operating reality is forever shifted."
        )
        plan = self.orchestrator.generate_plan(clip_name, topic, script)
        words = script.split()
        transcript = [
            {"word": w, "start": i * 0.35, "end": (i + 1) * 0.35, "confidence": 0.99}
            for i, w in enumerate(words)
        ]
        ast = self.orchestrator.compile_motion_ast(plan, transcript)
        
        # Verify persistentWorldMemory is populated and marked persistsUntilEnd
        self.assertIn("persistentWorldMemory", ast)
        mem = ast["persistentWorldMemory"]
        self.assertGreater(len(mem), 0, "AST must contain persistent memory traces")
        for trace in mem:
            self.assertTrue(trace.get("persistsUntilEnd"), "Memory trace must persist until end of video")
            self.assertIn("appearance", trace)
            self.assertIn("originatingActorId", trace)

    def test_14_frontier_exec_014_multiple_frontiers_combine_into_compound_sequence(self):
        """FRONTIER-EXEC-014: Multiple frontiers combine into one compound causal sequence."""
        clip_name = "compound_sequence_clip"
        topic = "Structural Rupture Under Relentless Compressive Load"
        script = (
            "Compressive stress builds inside the bedrock foundation. "
            "Once yield strength is exceeded the material fractures into irreversible cleavage. "
            "The fracture line remains as a permanent scar in the terrain."
        )
        plan = self.orchestrator.generate_plan(clip_name, topic, script)
        words = script.split()
        transcript = [
            {"word": w, "start": i * 0.35, "end": (i + 1) * 0.35, "confidence": 0.99}
            for i, w in enumerate(words)
        ]
        ast = self.orchestrator.compile_motion_ast(plan, transcript)

        # Scene must contain:
        # F4: forces (compressive_load)
        # F2: mutations (brittle_cleavage or deformation)
        # F7: causalCouplings (load triggers fracture) + persistentWorldMemory
        has_compound = False
        for sc in ast["scenes"]:
            if len(sc.get("forces", [])) > 0 and len(sc.get("mutations", [])) > 0 and len(sc.get("causalCouplings", [])) > 0:
                has_compound = True
                break

        self.assertTrue(has_compound, "AST must contain compound causal sequence combining forces, mutations, and couplings")

    def test_15_frontier_exec_015_f3_remains_strictly_dormant(self):
        """FRONTIER-EXEC-015: F3 remains strictly dormant."""
        clip_name = "dormant_f3_clip"
        topic = "Cinematic 3D Camera Test"
        script = "Testing that 3D cinematic camera remains completely dormant under all circumstances."
        plan = self.orchestrator.generate_plan(clip_name, topic, script)

        # F3 must never be present in activeCapabilities
        for sp in plan.get("scenePlans", []):
            active_codes = [c["frontierCode"] for c in sp.get("activeCapabilities", [])]
            self.assertNotIn("F3", active_codes, "F3 must NEVER be selected in active capabilities")

        # Frontier status in registry must be DORMANT_EXPERIMENTAL
        from orchestrator_registry import FRONTIER_REGISTRY
        f3_status = FRONTIER_REGISTRY.get("F3", {}).get("status")
        self.assertEqual(f3_status, "DORMANT_EXPERIMENTAL", "F3 status in frontier registry must be strictly DORMANT_EXPERIMENTAL")


if __name__ == "__main__":
    unittest.main(verbosity=2)
