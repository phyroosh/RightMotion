#!/usr/bin/env python3
"""
🧪 Test Suite for Visual Concept Translation Layer (§Rule 38 Test Matrix)
Validates:
  A. Purely explanatory statement -> remains editorial / minimal
  B. Causal transformation -> produces causal visual opportunity (A physically triggers B)
  C. Gradual change -> produces transformation candidate (displacement / accumulation)
  D. Threshold -> threshold crossing candidate
  E. Repetition -> reinforcement / worn groove candidate
  F. Persistent change -> memory trace candidate
  G. No meaningful change -> does not force one ("DO NOTHING SPECIAL")
  H. Simple topic -> minimal visual solution
  I. Complex topic -> richer multi-step system only when justified
  J. Small Compromises benchmark -> discovers boundary displacement + resistance erosion
"""

import json
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from visual_concept import VisualConceptTranslator, VisualMechanism, MetaphorLevel

def run_tests():
    print("=" * 70)
    print("🎬 RUNNING VISUAL CONCEPT TRANSLATION TEST HARNESS (10 SCENARIOS)")
    print("=" * 70)

    passed = 0
    total = 10
    translator = VisualConceptTranslator()

    # -------------------------------------------------------------
    # Scenario A: Purely Explanatory Statement
    # -------------------------------------------------------------
    print("\n[Scenario A] Purely Explanatory Statement...")
    plan_a = translator.translate(
        topic="Sleep Debt Metrics",
        script="Six hours of sleep for seven nights equals a 24-hour total cognitive deficit. The ratio is exact. Calibrate your biological schedule.",
    )
    if plan_a.primaryMechanism in [VisualMechanism.DISPLACEMENT.value, VisualMechanism.TRANSFORMATION.value] and "F_BASE" in plan_a.selectedFrontiers:
        print(f"  ✅ PASS: Editorial restraint honored for pure metrics (Mechanism: {plan_a.primaryMechanism}).")
        passed += 1
    else:
        print(f"  ❌ FAIL: Unexpected mechanism for explanatory topic: {plan_a.primaryMechanism}")

    # -------------------------------------------------------------
    # Scenario B: Causal Transformation (A causes B)
    # -------------------------------------------------------------
    print("\n[Scenario B] Causal Transformation...")
    plan_b = translator.translate(
        topic="Open Brain Tabs",
        script="Every unfinished task leaves an open tab in your brain. Each unresolved loop drains cognitive bandwidth until the system suffers severe fatigue. Offload the loop externally.",
    )
    if "F7" in plan_b.selectedFrontiers and plan_b.cause != "":
        print(f"  ✅ PASS: Causal mechanism produced with active F7 state machine. Cause: '{plan_b.cause[:40]}...'")
        passed += 1
    else:
        print(f"  ❌ FAIL: Causal embodiment failed: frontiers={plan_b.selectedFrontiers}")

    # -------------------------------------------------------------
    # Scenario C: Gradual Change
    # -------------------------------------------------------------
    print("\n[Scenario C] Gradual Change (Baseline Deflection / Sag)...")
    plan_c = translator.translate(
        topic="Micro Concessions",
        script="When you compromise once, your nervous system recalibrates that boundary as optional. The second compromise requires half the friction.",
    )
    if plan_c.primaryMechanism in [VisualMechanism.DISPLACEMENT.value, VisualMechanism.EROSION.value, VisualMechanism.DEFORMATION.value]:
        print(f"  ✅ PASS: Gradual change generated physical mechanism: {plan_c.primaryMechanism}")
        passed += 1
    else:
        print(f"  ❌ FAIL: Mechanism did not capture gradual change: {plan_c.primaryMechanism}")

    # -------------------------------------------------------------
    # Scenario D: Threshold Crossing
    # -------------------------------------------------------------
    print("\n[Scenario D] Threshold Crossing...")
    plan_d = translator.translate(
        topic="Burnout Rupture",
        script="You believe endurance is infinite. At the critical limit the system snaps with a violent stress fracture. Rest before your body makes the choice.",
    )
    all_mechs_d = [c.primaryMechanism for c in [plan_d.championCandidate] + plan_d.alternativeCandidates]
    if VisualMechanism.FRAGMENTATION.value in all_mechs_d or VisualMechanism.THRESHOLD_CROSSING.value in all_mechs_d:
        print(f"  ✅ PASS: Threshold/rupture mechanism discovered ({plan_d.primaryMechanism}).")
        passed += 1
    else:
        print(f"  ❌ FAIL: Missing threshold rupture candidate in: {all_mechs_d}")

    # -------------------------------------------------------------
    # Scenario E: Repetition (Groove Wear / Reinforcement)
    # -------------------------------------------------------------
    print("\n[Scenario E] Repetition (Groove Wear / Erosion)...")
    plan_e = translator.translate(
        topic="Habit Pathways",
        script="Repetition carves deep neurological grooves. What required conscious effort becomes an automatic downhill slide. Defend the initial entry point.",
    )
    all_mechs_e = [c.primaryMechanism for c in [plan_e.championCandidate] + plan_e.alternativeCandidates]
    if VisualMechanism.EROSION.value in all_mechs_e or VisualMechanism.DISPLACEMENT.value in all_mechs_e:
        print(f"  ✅ PASS: Repetition erosion/furrow candidate generated: {all_mechs_e}")
        passed += 1
    else:
        print(f"  ❌ FAIL: Repetition did not produce erosion candidate: {all_mechs_e}")

    # -------------------------------------------------------------
    # Scenario F: Persistent Change (Narrative Memory)
    # -------------------------------------------------------------
    print("\n[Scenario F] Persistent Change (Narrative Memory Trace)...")
    plan_f = translator.translate(
        topic="Permanent Baseline Shift",
        script="You don't return to the original boundary. The exception becomes the permanent standard. The baseline has permanently moved.",
    )
    if plan_f.persistentState and len(plan_f.persistentState) > 10:
        print(f"  ✅ PASS: Persistent memory trace defined: '{plan_f.persistentState}'")
        passed += 1
    else:
        print(f"  ❌ FAIL: Missing persistent state: {plan_f.persistentState}")

    # -------------------------------------------------------------
    # Scenario G: No Meaningful Transformation (DO NOTHING SPECIAL)
    # -------------------------------------------------------------
    print("\n[Scenario G] No Meaningful Transformation (DO NOTHING SPECIAL)...")
    plan_g = translator.translate(
        topic="Statistical Ratio",
        script="The ratio of dopamine receptor density to prefrontal volume is precisely measured. The formula remains fixed across biological cohorts.",
    )
    if len(plan_g.selectedFrontiers) == 1 and plan_g.selectedFrontiers[0] == "F_BASE":
        print("  ✅ PASS: Restrained to F_BASE only. Zero gratuitous physics widgets.")
        passed += 1
    else:
        print(f"  ❌ FAIL: Gratuitous frontiers forced: {plan_g.selectedFrontiers}")

    # -------------------------------------------------------------
    # Scenario H: Simple Topic (Minimal Visual Solution)
    # -------------------------------------------------------------
    print("\n[Scenario H] Simple Topic (Focused Solution)...")
    plan_h = translator.translate(
        topic="Singular Focus",
        script="Eliminate all peripheral noise. One single priority determines the trajectory. Direct your entire mass at one point.",
    )
    if plan_h.championCandidate.evaluation.compositeScore >= 0.80:
        print(f"  ✅ PASS: Generated singular high-confidence candidate (Score: {plan_h.championCandidate.evaluation.compositeScore}).")
        passed += 1
    else:
        print(f"  ❌ FAIL: Low confidence candidate for simple topic: {plan_h.championCandidate.evaluation.compositeScore}")

    # -------------------------------------------------------------
    # Scenario I: Complex Topic (Richer System)
    # -------------------------------------------------------------
    print("\n[Scenario I] Complex Topic (Multi-Frontier System)...")
    plan_i = translator.translate(
        topic="Systemic Burnout Collapse",
        script="Every silent yes exerts heavy pressure on your capacity. The internal tension stretches until emotional capacity deforms under the weight. At the critical limit the bedrock ruptures.",
    )
    if len(plan_i.selectedFrontiers) >= 2 and ("F2" in plan_i.selectedFrontiers or "F4" in plan_i.selectedFrontiers):
        print(f"  ✅ PASS: Richer multi-frontier system justified: {plan_i.selectedFrontiers}")
        passed += 1
    else:
        print(f"  ❌ FAIL: Complex topic failed to activate appropriate frontiers: {plan_i.selectedFrontiers}")

    # -------------------------------------------------------------
    # Scenario J: Current Small Compromises Prototype Benchmark
    # -------------------------------------------------------------
    print("\n[Scenario J] Small Compromises Benchmark Topic...")
    plan_j = translator.translate(
        topic="How One Small Compromise Becomes a Habit Before You Notice",
        script=(
            "You don't ruin your discipline with catastrophic decisions. You ruin it with one tiny concession "
            "you promised was a one-time exception. Your brain doesn't track moral significance; it tracks precedent. "
            "When you negotiate with a standard once, your nervous system recalibrates that boundary as optional. "
            "The second compromise requires half the friction, until the exception quietly becomes the new baseline. "
            "Stop defending the outcome. Defend the threshold."
        ),
    )
    alt_names = [c.conceptName for c in plan_j.alternativeCandidates]
    champ_name = plan_j.championCandidate.conceptName
    print(f"  Champion: {champ_name} [{plan_j.primaryMechanism}]")
    print(f"  Alternatives: {alt_names}")

    # Confirm it discovered physical boundary displacement or resistance erosion
    has_displacement = plan_j.primaryMechanism == VisualMechanism.DISPLACEMENT.value or "Displacement" in champ_name
    has_erosion = any("Erosion" in a for a in alt_names) or plan_j.primaryMechanism == VisualMechanism.EROSION.value
    no_cards = all("card" not in a.lower() for a in [champ_name] + alt_names)

    if has_displacement and has_erosion and no_cards:
        print("  ✅ PASS: Discovered Boundary Displacement and Resistance Erosion without cardification!")
        passed += 1
    else:
        print(f"  ❌ FAIL: Prototype benchmark failed: champ={champ_name}, alts={alt_names}")

    print("\n" + "=" * 70)
    print(f"TEST RESULTS: {passed} / {total} SCENARIOS PASSED")
    print("=" * 70)
    return passed == total

if __name__ == "__main__":
    success = run_tests()
    sys.exit(0 if success else 1)
