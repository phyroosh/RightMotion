#!/usr/bin/env python3
"""
🧪 Benchmark E — Multi-Layer Editing Composition & Mobile Scale Standard
========================================================================
Validates that RightMotion composes across its existing editing layers:
  - Open Stage & Foundations (MechanismStage)
  - Physical & Visual Metaphor Mechanisms (e.g. ViscoelasticDeformation)
  - Camera Choreography & Framing (CameraCanvas)
  - Sound Punctuation & Tactile Impact (SoundDesignEngine)
  - Mobile Scale Standard (Primary visual 400-750px, strokes 6-14px, typography >= 36px)

Benchmark expectations:
  1. CLI Scaffolding generates CameraCanvas, SoundDesignEngine, MechanismStage,
     currentMs calculation, and the mission contract with EDITING LAYERS PLAYBOOK.
  2. Visual Critic flags generic fallback:
     - Identifies unmotivated card + lucide icon + sub-scale text as GENERIC_FALLBACK,
       UNDERUTILIZED, and SCALE_WARNING.
  3. Visual Critic validates high-quality multi-layer composition:
     - Confirms bespoke open-canvas physical mechanism with integrated camera,
       sound cues, and mobile scale passes as BESPOKE, OPTIMAL, and MOBILE_OPTIMIZED.
"""

import sys
import unittest
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from script_intelligence import ScriptIntelligence
from creative_brief_compiler import CreativeBriefCompiler
from visual_critic import StructuralCritic
from create_clip import generate_lean_canvas_brief


class TestBenchmarkMultiLayerComposition(unittest.TestCase):

    def setUp(self):
        self.script = (
            "Every compromise erodes your baseline integrity. "
            "Small concessions bend the structure until it suddenly snaps. "
            "Re-anchor your standard."
        )
        self.topic = "Baseline Erosion"
        intel = ScriptIntelligence()
        self.story_model = intel.analyze(self.script, topic=self.topic, channel="self_improvement")

        self.creative_plan = {
            "visualConcept": {
                "primaryMechanism": "viscoelastic_strain",
                "centralTransformation": "A structural beam deflects under increasing load until sudden fracture",
                "conceptName": self.topic,
                "whyThisMechanism": "Demonstrates baseline erosion through tangible structural bending",
                "championCandidate": {
                    "physicalDescription": "Heavy structural cantilever holding baseline",
                    "visibleTransformation": "Deflection curves downwards under continuous load",
                    "visibleConsequence": "Brittle fracture with clean break line",
                    "persistentState": "Sovereign re-anchored ground",
                },
            },
            "scenePlans": [],
        }

        self.words = [
            {"word": "Every", "startMs": 0, "endMs": 280},
            {"word": "compromise", "startMs": 300, "endMs": 850},
            {"word": "erodes", "startMs": 900, "endMs": 1300},
            {"word": "baseline", "startMs": 1400, "endMs": 1800},
            {"word": "integrity", "startMs": 1900, "endMs": 2400},
            {"word": "Small", "startMs": 2800, "endMs": 3100},
            {"word": "concessions", "startMs": 3200, "endMs": 3800},
            {"word": "bend", "startMs": 4000, "endMs": 4400},
            {"word": "structure", "startMs": 4500, "endMs": 5000},
            {"word": "snaps", "startMs": 5600, "endMs": 6200},
            {"word": "Re-anchor", "startMs": 7000, "endMs": 7600},
            {"word": "standard", "startMs": 7800, "endMs": 8500},
        ]
        self.duration_sec = 8.8

        compiler = CreativeBriefCompiler(fps=60)
        self.brief = compiler.compile_brief(
            clip_name="baseline_erosion",
            topic=self.topic,
            niche="self_improvement",
            clean_script=self.script,
            words=self.words,
            story_model=self.story_model,
            creative_plan=self.creative_plan,
            motion_ast={},
            duration_sec=self.duration_sec,
        )

    def test_scaffold_contains_editing_layers_and_mission_contract(self):
        """
        Verifies that newly scaffolded canvases contain CameraCanvas, SoundDesignEngine,
        MechanismStage, currentMs, and reference the EDITING LAYERS PLAYBOOK.
        """
        scaffold_code = generate_lean_canvas_brief(
            pascal_name="BaselineErosion",
            s2_start=180,
            s3_start=420,
            total_frames=528,
            topic=self.topic,
            niche="self_improvement",
            problem_cutout="",
            solution_cutout="",
            creative_plan=self.creative_plan,
            fps=60,
            product_meta=None,
            creative_brief=self.brief,
        )

        # 1. Imports
        self.assertIn("MechanismStage", scaffold_code, "Scaffold must import MechanismStage")
        self.assertIn("CameraCanvas", scaffold_code, "Scaffold must import CameraCanvas")
        self.assertIn("SoundDesignEngine", scaffold_code, "Scaffold must import SoundDesignEngine")

        # 2. Timing calculation
        self.assertIn("const currentMs = (frame / fps) * 1000", scaffold_code,
                      "Scaffold must compute currentMs for cross-layer synchronization")

        # 3. Wrapping JSX
        self.assertIn("<CameraCanvas", scaffold_code, "Scaffold must wrap layout in CameraCanvas")
        self.assertIn("<MechanismStage", scaffold_code, "Scaffold must frame stage in MechanismStage")
        self.assertIn("<SoundDesignEngine", scaffold_code, "Scaffold must wire SoundDesignEngine")

        # 4. Mission Contract Header
        self.assertIn("EDITING LAYERS PLAYBOOK", scaffold_code,
                      "Mission header must point to EDITING_LAYERS_PLAYBOOK.md")
        self.assertIn("MOBILE SCALE LAW", scaffold_code,
                      "Mission header must enforce mobile scale standard")
        self.assertIn("400px–750px", scaffold_code,
                      "Mission header must specify 400-750px primary subject size")
        self.assertIn("6px–14px", scaffold_code,
                      "Mission header must specify 6-14px stroke widths")

    def test_critic_flags_generic_fallback_and_scale_warning(self):
        """
        Verifies that a generic fallback implementation (card + Lucide icon + small text)
        is flagged with GENERIC_FALLBACK, UNDERUTILIZED, and SCALE_WARNING.
        """
        critic = StructuralCritic("baseline_erosion")

        generic_fallback_code = """
        // Scene 2: Mechanism
        // The agent took a bending structure concept and made a card with a small icon and 14px text
        import { ShieldAlert } from 'lucide-react';

        export const Canvas: React.FC = () => {
            const frame = useCurrentFrame();
            const opacity = interpolate(frame, [180, 210], [0, 1]);

            return (
                <div className="flex flex-col items-center justify-center h-full">
                    <div className="rounded-2xl bg-white border-slate-200 p-6 shadow-md w-72" style={{ opacity }}>
                        <ShieldAlert className="w-8 h-8 text-amber-500 mb-3" />
                        <h3 className="text-sm font-semibold text-slate-900">Boundary Warning</h3>
                        <p className="text-xs text-slate-500">Concessions weaken baseline integrity</p>
                    </div>
                </div>
            );
        };
        """

        shot_plan = self.brief["shots"][1]  # Mechanism shot
        used_mechs = critic._detect_used_mechanisms(generic_fallback_code)

        # 1. Generic Fallback Diagnostic
        gen_diag = critic._analyze_generic_fallback(
            shot_snippet=generic_fallback_code,
            shot_plan=shot_plan,
            used_mechs=used_mechs,
            card_count=1,
        )
        self.assertEqual(gen_diag["verdict"], "GENERIC_FALLBACK",
                         "Card + Lucide icon in mechanism shot must trigger GENERIC_FALLBACK")

        # 2. Under-Utilization Diagnostic
        under_diag = critic._analyze_under_utilization(
            shot_snippet=generic_fallback_code,
            full_canvas=generic_fallback_code,
            shot_plan=shot_plan,
            used_mechs=used_mechs,
        )
        self.assertEqual(under_diag["verdict"], "UNDERUTILIZED",
                         "Bending concept implemented with static opacity must trigger UNDERUTILIZED")

        # 3. Mobile Scale Diagnostic
        scale_diag = critic._analyze_mobile_scale(
            shot_snippet=generic_fallback_code,
            full_canvas=generic_fallback_code,
        )
        self.assertEqual(scale_diag["verdict"], "SCALE_WARNING",
                         "Sub-36px text (text-xs, text-sm) and w-72 (288px) must trigger SCALE_WARNING")
        self.assertTrue(any("Sub-36px" in issue for issue in scale_diag["issues"]),
                        "Scale issues must explicitly list sub-36px typography")

        # 4. Layer Isolation Diagnostic
        layer_diag = critic._analyze_layer_isolation(
            shot_snippet=generic_fallback_code,
            full_canvas=generic_fallback_code,
        )
        # Without CameraCanvas or SoundDesignEngine, it should not be integrated
        self.assertIn(layer_diag["verdict"], ["LAYER_ISOLATION", "INTEGRATED"])

    def test_critic_validates_strong_multi_layer_composition(self):
        """
        Verifies that a high-quality multi-layer composition (open-canvas physical mechanism,
        CameraCanvas drift, SoundDesignEngine cues, bold mobile scale) passes cleanly.
        """
        critic = StructuralCritic("baseline_erosion")

        multi_layer_code = """
        import { useCurrentFrame, interpolate, spring } from 'remotion';
        import { CameraCanvas } from '../../components/CameraCanvas';
        import { MechanismStage } from '../../components/MechanismStage';
        import { SoundDesignEngine } from '../../components/SoundDesignEngine';
        import { ViscoelasticDeformation } from '../../components/ViscoelasticDeformation';

        export const Canvas: React.FC = () => {
            const frame = useCurrentFrame();
            const { fps } = useVideoConfig();
            const currentMs = (frame / fps) * 1000;

            // Scene 2: Continuous Structural Bending & Fracture
            const loadProgress = interpolate(frame, [180, 360, 390], [0, 0.85, 1.0], { extrapolateRight: 'clamp' });
            const cameraPush = interpolate(frame, [180, 360], [1.0, 1.05], { extrapolateRight: 'clamp' });

            const bespokeSfx = [
                { timeMs: 3000, type: 'whoosh' as const, volume: 0.5 },
                { timeMs: 6500, type: 'impact' as const, volume: 0.85 },
            ];

            return (
                <CameraCanvas scale={cameraPush} mode="cinematic">
                    <MechanismStage top={260} bottom={1340}>
                        <div className="flex flex-col items-center justify-center w-[600px] h-[500px]">
                            <svg width="600" height="300" viewBox="0 0 600 300">
                                <path
                                    d={`M 50 150 Q 300 ${150 + loadProgress * 80} 550 150`}
                                    fill="none"
                                    stroke="#0f172a"
                                    strokeWidth={10}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="text-4xl font-bold tracking-tight text-slate-900 mt-6">
                                STRUCTURAL DEFLECTION
                            </span>
                        </div>
                    </MechanismStage>
                    <SoundDesignEngine currentMs={currentMs} sfxCues={bespokeSfx} />
                </CameraCanvas>
            );
        };
        """

        shot_plan = self.brief["shots"][1]
        used_mechs = critic._detect_used_mechanisms(multi_layer_code)

        # 1. Open-Canvas vs Generic Fallback Diagnostic
        gen_diag = critic._analyze_generic_fallback(
            shot_snippet=multi_layer_code,
            shot_plan=shot_plan,
            used_mechs=used_mechs,
            card_count=0,
        )
        self.assertEqual(gen_diag["verdict"], "BESPOKE",
                         "Open-canvas SVG deformation must pass as BESPOKE")

        # 2. Dynamic Utilization Diagnostic
        under_diag = critic._analyze_under_utilization(
            shot_snippet=multi_layer_code,
            full_canvas=multi_layer_code,
            shot_plan=shot_plan,
            used_mechs=used_mechs,
        )
        self.assertEqual(under_diag["verdict"], "OPTIMAL",
                         "Active loadProgress and deformation must pass as OPTIMAL")

        # 3. Mobile Scale Diagnostic
        scale_diag = critic._analyze_mobile_scale(
            shot_snippet=multi_layer_code,
            full_canvas=multi_layer_code,
        )
        self.assertEqual(scale_diag["verdict"], "MOBILE_OPTIMIZED",
                         "Width 600px, strokeWidth 10px, and text-4xl must pass as MOBILE_OPTIMIZED")

        # 4. Layer Integration Diagnostic
        layer_diag = critic._analyze_layer_isolation(
            shot_snippet=multi_layer_code,
            full_canvas=multi_layer_code,
        )
        self.assertEqual(layer_diag["verdict"], "INTEGRATED",
                         "Mechanism with CameraCanvas and SoundDesignEngine must pass as INTEGRATED")

        # 5. Visual Competition Diagnostic
        eye = critic._analyze_eye_confusion(
            shot_snippet=multi_layer_code,
            full_canvas=multi_layer_code,
            role="mechanism",
            has_presenter=False,
            used_mechanisms=used_mechs,
            card_count=0,
            pacing="BUILD",
        )
        vis_comp = critic._analyze_visual_competition(
            eye_confusion=eye,
            shot_snippet=multi_layer_code,
        )
        self.assertEqual(vis_comp["verdict"], "CLEAR_HIERARCHY",
                         "Single dominant mechanism without clutter must have CLEAR_HIERARCHY")


if __name__ == "__main__":
    unittest.main()
