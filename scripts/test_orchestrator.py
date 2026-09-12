#!/usr/bin/env python3
"""
🧪 Test Harness for Frontier #0: Creative Intelligence Orchestrator
Executes 12 comprehensive scenarios validating:
  - Multi-dimensional capability selection
  - Minimum sufficient capability sets ("DO NOTHING SPECIAL")
  - Budget capping & effect-soup pruning
  - Conflict resolution
  - F3 dormancy guardrail
  - Determinism
"""

import json
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from orchestrator import CreativeOrchestrator

def run_tests():
    print("=" * 70)
    print("🎬 RUNNING FRONTIER #0 TEST HARNESS (12 SCENARIOS)")
    print("=" * 70)

    passed = 0
    total = 12

    # -------------------------------------------------------------
    # Scenario 1: Pure Minimalist Scene (Data/Metrics)
    # Expected: F_BASE only, all advanced frontiers rejected.
    # -------------------------------------------------------------
    print("\n[Scenario 1] Pure Minimalist Metric Scene...")
    orch1 = CreativeOrchestrator()
    plan1 = orch1.generate_plan(
        clip_name="sleep_debt_metrics",
        topic="Sleep Debt Mathematics",
        script="Six hours of sleep for seven days equals a 24-hour total cognitive deficit. The study confirms memory retention drops by 40 percent. Calibrate your biological schedule.",
    )
    s1_acts = [a["frontierCode"] for a in plan1["scenePlans"][0]["activeCapabilities"]]
    s2_acts = [a["frontierCode"] for a in plan1["scenePlans"][1]["activeCapabilities"]]
    if s1_acts == ["F_BASE"] and s2_acts == ["F_BASE"]:
        print("  ✅ PASS: Successfully selected 'DO NOTHING SPECIAL' (F_BASE only) for pure data.")
        passed += 1
    else:
        print(f"  ❌ FAIL: Unexpected active frontiers: s1={s1_acts}, s2={s2_acts}")

    # -------------------------------------------------------------
    # Scenario 2: Compressive Mechanical Load
    # Expected: F2 (ViscoelasticDeformation) selected, F5 rejected as redundant.
    # -------------------------------------------------------------
    print("\n[Scenario 2] Compressive Mechanical Load...")
    orch2 = CreativeOrchestrator()
    plan2 = orch2.generate_plan(
        clip_name="boundary_pressure",
        topic="The Law of Load",
        script="Every silent yes exerts heavy pressure on your capacity. The internal tension stretches until emotional capacity deforms under the weight. Reclaim your calendar.",
    )
    s2 = plan2["scenePlans"][1]
    s2_acts = [a["frontierCode"] for a in s2["activeCapabilities"]]
    s2_rejs = [r["frontierCode"] for r in s2["rejectedCapabilities"]]
    if "F2" in s2_acts and "F5" in s2_rejs:
        print("  ✅ PASS: Selected F2 (Viscoelastic Strain) and rejected F5 (redundant diorama).")
        passed += 1
    else:
        print(f"  ❌ FAIL: s2_acts={s2_acts}, s2_rejs={s2_rejs}")

    # -------------------------------------------------------------
    # Scenario 3: Catastrophic Rupture
    # Expected: F2 (StressFractureEngine) selected at EVENT_LEVEL.
    # -------------------------------------------------------------
    print("\n[Scenario 3] Catastrophic Rupture Scene...")
    orch3 = CreativeOrchestrator()
    plan3 = orch3.generate_plan(
        clip_name="burnout_break",
        topic="The Burnout Fracture",
        script="You believe endurance is infinite. At the critical limit the system snaps with a violent stress fracture. Rest before your body makes the choice for you.",
    )
    s2 = plan3["scenePlans"][1]
    f2_act = next((a for a in s2["activeCapabilities"] if a["frontierCode"] == "F2"), None)
    if f2_act and f2_act["capabilityConcept"] == "brittle_stress_fracture_rupture":
        print("  ✅ PASS: Selected F2 brittle_stress_fracture_rupture at EVENT_LEVEL.")
        passed += 1
    else:
        print(f"  ❌ FAIL: F2 rupture not properly configured: {f2_act}")

    # -------------------------------------------------------------
    # Scenario 4: Causal Torque & Consequence
    # Expected: F4 (KineticFulcrumBeam) selected, F5 pruned.
    # -------------------------------------------------------------
    print("\n[Scenario 4] Causal Torque & Consequence Scene...")
    orch4 = CreativeOrchestrator()
    plan4 = orch4.generate_plan(
        clip_name="counterweight_law",
        topic="The Counterweight",
        script="Freedom has an unavoidable counterweight. The fulcrum tilts when responsibility arrives with the heavy torque of systemic consequence. Balance the beam with intent.",
    )
    s2 = plan4["scenePlans"][1]
    s2_acts = [a["frontierCode"] for a in s2["activeCapabilities"]]
    s2_rejs = [r["frontierCode"] for r in s2["rejectedCapabilities"]]
    if "F4" in s2_acts and "F5" in s2_rejs:
        print("  ✅ PASS: Selected F4 (Fulcrum Torque) and pruned F5 (visual clutter).")
        passed += 1
    else:
        print(f"  ❌ FAIL: s2_acts={s2_acts}, s2_rejs={s2_rejs}")

    # -------------------------------------------------------------
    # Scenario 5: Multi-Chamber Spatial Journey
    # Expected: F1 (InfiniteWorldCanvas) selected in Scene 2.
    # -------------------------------------------------------------
    print("\n[Scenario 5] Multi-Chamber Spatial Journey...")
    orch5 = CreativeOrchestrator()
    plan5 = orch5.generate_plan(
        clip_name="habit_architecture",
        topic="Habit Architecture",
        script="A routine is an architectural sequence. The journey moves through the cue chamber into the automated action compartment. Design your physical doorways.",
    )
    s2 = plan5["scenePlans"][1]
    s2_acts = [a["frontierCode"] for a in s2["activeCapabilities"]]
    if "F1" in s2_acts:
        print("  ✅ PASS: Selected F1 (InfiniteWorldCanvas) for spatial chambers.")
        passed += 1
    else:
        print(f"  ❌ FAIL: F1 missing from s2_acts={s2_acts}")

    # -------------------------------------------------------------
    # Scenario 6: Dramatic Climax Freeze
    # Expected: F6 (Breath Hold) selected in Scene 3.
    # -------------------------------------------------------------
    print("\n[Scenario 6] Dramatic Climax Freeze...")
    orch6 = CreativeOrchestrator()
    plan6 = orch6.generate_plan(
        clip_name="cortisol_truth",
        topic="The Cortisol Truth",
        script="You think caffeine creates focus. In reality it only mimics an acute panic state. In this sudden freeze moment you realize the biological fuel was missing.",
    )
    s3 = plan6["scenePlans"][2]
    s3_acts = [a["frontierCode"] for a in s3["activeCapabilities"]]
    if "F6" in s3_acts:
        print("  ✅ PASS: Selected F6 (Breath Hold Freeze) for sudden epiphany.")
        passed += 1
    else:
        print(f"  ❌ FAIL: F6 missing from s3_acts={s3_acts}")

    # -------------------------------------------------------------
    # Scenario 7: Capability Stacking Attempt (Trimming Effect Soup)
    # Expected: Budget cap prevents running F1 + F2 + F4 + F5 + F6.
    # -------------------------------------------------------------
    print("\n[Scenario 7] Capability Stacking / Budget Cap...")
    # Attempt to force all frontiers
    overrides7 = {
        "global": {
            "forceFrontiers": ["F1", "F2", "F4", "F5", "F6"],
        }
    }
    orch7 = CreativeOrchestrator(overrides=overrides7)
    plan7 = orch7.generate_plan(
        clip_name="stacking_test",
        topic="Overload Test",
        script="A simple statement about habits. Mechanistic logic breakdown. Decisive ending shift.",
    )
    s1_score = plan7["scenePlans"][0]["complexityBudget"]["calculatedScore"]
    s1_cap = plan7["scenePlans"][0]["complexityBudget"]["maxScoreAllowed"]
    # Scene 1 hook cap is 2.5
    if s1_score <= s1_cap:
        print(f"  ✅ PASS: Trimming prevented score blowout. Score {s1_score} <= {s1_cap}.")
        passed += 1
    else:
        print(f"  ❌ FAIL: Budget cap exceeded: {s1_score} > {s1_cap}")

    # -------------------------------------------------------------
    # Scenario 8: Attempted F3 Activation (Dormant Guardrail)
    # Expected: F3 strictly rejected with DORMANT notice.
    # -------------------------------------------------------------
    print("\n[Scenario 8] Attempted F3 Activation Guardrail...")
    orch8 = CreativeOrchestrator()
    plan8 = orch8.generate_plan(
        clip_name="cinematic_depth_test",
        topic="Cinematic Observer",
        script="Looking through the near-lens foreground. Deep rack focus reveals the distant background. Clarity arrives.",
    )
    s2 = plan8["scenePlans"][1]
    f3_rej = next((r for r in s2["rejectedCapabilities"] if r["frontierCode"] == "F3"), None)
    s2_acts = [a["frontierCode"] for a in s2["activeCapabilities"]]
    if f3_rej and "DORMANT_EXPERIMENTAL" in f3_rej["reason"] and "F3" not in s2_acts:
        print("  ✅ PASS: F3 strictly rejected as DORMANT_EXPERIMENTAL with clear fallback reason.")
        passed += 1
    else:
        print(f"  ❌ FAIL: F3 guardrail violated: acts={s2_acts}, rej={f3_rej}")

    # -------------------------------------------------------------
    # Scenario 9: Micro-Detail Mobile Constraints
    # Expected: Mobile constraints enforced on all scene plans.
    # -------------------------------------------------------------
    print("\n[Scenario 9] Mobile Constraints Enforcement...")
    orch9 = CreativeOrchestrator()
    plan9 = orch9.generate_plan(
        clip_name="mobile_test",
        topic="Mobile Test",
        script="Small text is invisible on phone screens. High contrast is non-negotiable. Always design for 720p.",
    )
    constraints = plan9["scenePlans"][0]["mobileConstraints"]
    has_type_floor = any("56px" in c for c in constraints)
    has_safe_zone = any("top 6%" in c for c in constraints)
    if has_type_floor and has_safe_zone:
        print("  ✅ PASS: Mobile constraints (type floor, safe zones, contrast) present.")
        passed += 1
    else:
        print(f"  ❌ FAIL: Incomplete mobile constraints: {constraints}")

    # -------------------------------------------------------------
    # Scenario 10: Short Scene Guard (<60 frames)
    # Expected: Heavy frontiers blocked if scene duration < 60 frames.
    # -------------------------------------------------------------
    print("\n[Scenario 10] Short Scene Guard (<60 frames)...")
    orch10 = CreativeOrchestrator()
    # Micro pillar with only 45 frames
    micro_intent = {
        "sceneId": "scene_2_logic",
        "startFrame": 100,
        "endFrame": 145, # 45 frames (<60)
        "durationSeconds": 0.75,
        "narrationText": "Quick transition.",
        "coreIdea": "Quick transition.",
        "emotionalTone": "analytical_clarity",
        "viewerReaction": "Speed",
        "visualQuestion": "What happens?",
        "dominantMetaphor": "spatial_chambers",
        "compositionApproach": "continuous_world_chamber",
    }
    active, rejected, budget = orch10.evaluate_capabilities(micro_intent)
    rej_codes = [r["frontierCode"] for r in rejected]
    if "F1" in rej_codes:
        print("  ✅ PASS: F1 blocked from micro-scene (<60 frames) to prevent disorientation.")
        passed += 1
    else:
        print(f"  ❌ FAIL: F1 not blocked from short scene: rej={rej_codes}")

    # -------------------------------------------------------------
    # Scenario 11: Human Override Test
    # Expected: Disable F5 and force F2.
    # -------------------------------------------------------------
    print("\n[Scenario 11] Human Override Test...")
    overrides11 = {
        "global": {
            "disabledFrontiers": ["F5"],
            "forceFrontiers": ["F2"],
        }
    }
    orch11 = CreativeOrchestrator(overrides=overrides11)
    plan11 = orch11.generate_plan(
        clip_name="override_test",
        topic="Override Test",
        script="A baseline statement. Mechanistic loop chamber. Decisive takeaway.",
    )
    s2 = plan11["scenePlans"][1]
    s2_acts = [a["frontierCode"] for a in s2["activeCapabilities"]]
    s2_rejs = [r["frontierCode"] for r in s2["rejectedCapabilities"]]
    if "F2" in s2_acts and "F5" in s2_rejs:
        print("  ✅ PASS: Human override honored (F2 forced active, F5 forced disabled).")
        passed += 1
    else:
        print(f"  ❌ FAIL: Overrides not respected: acts={s2_acts}, rejs={s2_rejs}")

    # -------------------------------------------------------------
    # Scenario 12: Determinism Test
    # Expected: Running the exact same script twice yields identical JSON plans.
    # -------------------------------------------------------------
    print("\n[Scenario 12] Deterministic Repeatability Test...")
    orch12 = CreativeOrchestrator()
    script12 = "The quiet erosion of self-respect begins with small concessions. Each unnoticed compromise creates a hidden fault line in your integrity. Draw your line today."
    run_a = orch12.generate_plan("det_test", "Integrity Erosion", script12)
    run_b = orch12.generate_plan("det_test", "Integrity Erosion", script12)
    json_a = json.dumps(run_a, sort_keys=True)
    json_b = json.dumps(run_b, sort_keys=True)
    if json_a == json_b:
        print("  ✅ PASS: Exact deterministic repeatability verified (bit-for-bit identical plans).")
        passed += 1
    else:
        print("  ❌ FAIL: Non-deterministic output detected across identical runs!")

    print("\n" + "=" * 70)
    print(f"TEST RESULTS: {passed} / {total} SCENARIOS PASSED")
    print("=" * 70)

    return passed == total

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
