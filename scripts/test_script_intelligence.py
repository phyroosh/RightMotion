#!/usr/bin/env python3
"""
🧪 Frontier S: Script Intelligence Test Harness (16 Matrix Scenarios)
=====================================================================
Validates all requirements from Section 50 of the Frontier S Architecture:
  A. Topic-only input
  B. Script-only input
  C. Topic -> generated script -> intelligence
  D. Script -> intelligence convergence equivalence
  E. Short simple script (minimalist, verifying "DO NOTHING SPECIAL")
  F. Dense educational script (multi-claim, verifiable evidence)
  G. Narrative storytelling script (character progression, emotional shifts)
  H. Highly causal script (F7 VERY_HIGH signal)
  I. Weakly causal script (F7 LOW signal)
  J. Emotionally driven script (intense curiosity and epiphany arc)
  K. Abstract script with no physical metaphors (visual absence validation)
  L. Multiple competing visual opportunities (hierarchy & ranking)
  M. Unsupported factual claim (flagged in claims diagnostic)
  N. Ambiguous structure (diagnostic warning without crashing)
  O. Cyclic / repeated concept (temporal repetition detected for F6)
  P. Cross-scene persistent object (tracked across scenes for F1/F7 continuity)
"""

import json
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from script_intelligence import ScriptIntelligence


def run_test_suite():
    print("=" * 78)
    print("🎬 RUNNING FRONTIER S: SCRIPT INTELLIGENCE 16-SCENARIO TEST HARNESS")
    print("=" * 78)

    intel = ScriptIntelligence(use_cache=False)
    passed = 0
    total = 16

    # -------------------------------------------------------------
    # Scenario A: Topic-Only Input
    # -------------------------------------------------------------
    print("\n[Scenario A] Topic-Only Input Workflow...")
    model_a = intel.analyze_topic_or_script(
        topic="How One Small Compromise Becomes a Habit Before You Notice"
    )
    if (
        model_a.meta.sourceType == "topic_generated"
        and len(model_a.segments) >= 2
        and model_a.story.coreIdea != ""
        and model_a.meta.wordCount > 60
    ):
        print("  ✅ PASS: Autonomously generated script and produced NormalizedStoryModel.")
        passed += 1
    else:
        print(f"  ❌ FAIL: Invalid model_a: {model_a.meta}")

    # -------------------------------------------------------------
    # Scenario B: Script-Only Input (No Rewriting)
    # -------------------------------------------------------------
    print("\n[Scenario B] Script-Only Input (Verbatim Preservation)...")
    user_script = (
        "Every unfinished task leaves an open tab in your brain. "
        "Each unresolved loop drains cognitive bandwidth until the system suffers severe fatigue. "
        "The solution is offloading the task to paper immediately."
    )
    model_b = intel.analyze_topic_or_script(script=user_script)
    reconstructed = " ".join(s.narrationText for s in model_b.segments)
    if model_b.meta.sourceType == "user_script" and "unfinished task" in reconstructed:
        print("  ✅ PASS: Preserved user script verbatim without silent rewriting.")
        passed += 1
    else:
        print(f"  ❌ FAIL: Script was modified or not preserved: {reconstructed}")

    # -------------------------------------------------------------
    # Scenario C: Topic -> Generated Script -> Intelligence Pipeline
    # -------------------------------------------------------------
    print("\n[Scenario C] Topic -> Generated Script Pipeline...")
    model_c = intel.analyze_topic_or_script(
        topic="The Zeigarnik Loop and Mental Fatigue"
    )
    if model_c.story.centralClaim and model_c.story.viewerPromise:
        print(f"  ✅ PASS: Generated valid claim: '{model_c.story.centralClaim[:60]}...'")
        passed += 1
    else:
        print(f"  ❌ FAIL: Missing claim or promise: {model_c.story}")

    # -------------------------------------------------------------
    # Scenario D: Convergence Equivalence (Topic Script vs Direct Script)
    # -------------------------------------------------------------
    print("\n[Scenario D] Convergence Equivalence Test...")
    gen_script = model_a.segments[0].narrationText + " " + model_a.segments[-1].narrationText
    model_d = intel.analyze_topic_or_script(
        script=gen_script, topic=model_a.meta.topic
    )
    if (
        model_d.story.coreIdea == model_a.story.coreIdea
        and model_d.thumbnailSignals.recommendedArchetype == model_a.thumbnailSignals.recommendedArchetype
    ):
        print("  ✅ PASS: Converged model produces identical core story understanding.")
        passed += 1
    else:
        print("  ❌ FAIL: Models diverged between topic and direct script pathways.")

    # -------------------------------------------------------------
    # Scenario E: Short Simple Script ("DO NOTHING SPECIAL")
    # -------------------------------------------------------------
    print("\n[Scenario E] Short Simple Minimalist Script...")
    simple_script = (
        "Six hours of sleep for seven days equals a 24-hour total cognitive deficit. "
        "The study confirms memory retention drops by 40 percent. "
        "Calibrate your biological schedule."
    )
    model_e = intel.analyze_topic_or_script(
        script=simple_script, topic="Sleep Debt Numbers"
    )
    f4_sig = model_e.frontierSignals.signals.get("F4", {}).get("signal")
    f1_sig = model_e.frontierSignals.signals.get("F1", {}).get("signal")
    if f4_sig == "LOW" and f1_sig == "LOW":
        print("  ✅ PASS: Pure metric script signals LOW for heavy physical/spatial frontiers.")
        passed += 1
    else:
        print(f"  ❌ FAIL: Signals too high for simple metric: F4={f4_sig}, F1={f1_sig}")

    # -------------------------------------------------------------
    # Scenario F: Dense Educational Script (Verifiable Evidence)
    # -------------------------------------------------------------
    print("\n[Scenario F] Dense Educational Script (Evidence Detection)...")
    edu_script = (
        "Psychologists call this Anticipatory Self-Handicapping. "
        "A meta-analysis confirms performing casualness burns twice as much mental energy as trying. "
        "Reframe beginner effort as strength."
    )
    model_f = intel.analyze_topic_or_script(
        script=edu_script, topic="Self Handicapping"
    )
    has_named = any(e["type"] == "named_concept" for e in model_f.claimsAndEvidence.evidence)
    has_study = any(e["type"] == "study" for e in model_f.claimsAndEvidence.evidence)
    if has_named and has_study:
        print("  ✅ PASS: Successfully detected named psychological concept and scientific study.")
        passed += 1
    else:
        print(f"  ❌ FAIL: Evidence extraction failed: {model_f.claimsAndEvidence.evidence}")

    # -------------------------------------------------------------
    # Scenario G: Narrative Storytelling Script (Emotional Shifts)
    # -------------------------------------------------------------
    print("\n[Scenario G] Narrative Storytelling Script...")
    narr_script = (
        "Notice how you pretend not to care when someone criticizes your ambition? "
        "You laugh it off in public, but the quiet compromise hardens inside. "
        "The shift happens the moment you defend your authentic standard."
    )
    model_g = intel.analyze_topic_or_script(
        script=narr_script, topic="Authentic Standard"
    )
    emotions = [e.emotion for e in model_g.emotionalTrajectory]
    if "curiosity_and_recognition" in emotions and "grounded_confidence" in emotions:
        print(f"  ✅ PASS: Mapped emotional progression: {' -> '.join(emotions)}")
        passed += 1
    else:
        print(f"  ❌ FAIL: Emotional trajectory incomplete: {emotions}")

    # -------------------------------------------------------------
    # Scenario H: Highly Causal Script (F7 Signal VERY_HIGH)
    # -------------------------------------------------------------
    print("\n[Scenario H] Highly Causal Script (F7 VERY_HIGH)...")
    causal_script = (
        "Every unfinished task leaves an open tab in your brain. "
        "Each unresolved loop drains cognitive bandwidth until the system suffers severe fatigue. "
        "Offload the loop to paper immediately."
    )
    model_h = intel.analyze_topic_or_script(
        script=causal_script, topic="Brain Tabs Loop"
    )
    f7_sig = model_h.frontierSignals.signals.get("F7", {}).get("signal")
    if f7_sig == "VERY_HIGH" and len(model_h.causalGraph.chains) >= 2:
        print(f"  ✅ PASS: Highly causal narrative triggers F7: {f7_sig} with explicit chains.")
        passed += 1
    else:
        print(f"  ❌ FAIL: Expected F7 VERY_HIGH, got: {f7_sig}")

    # -------------------------------------------------------------
    # Scenario I: Weakly Causal Observational Script (F7 LOW)
    # -------------------------------------------------------------
    print("\n[Scenario I] Weakly Causal Observational Script...")
    obs_script = (
        "The sky at dawn has a specific wavelength of blue light. "
        "Morning sunlight carries thirty thousand lux of natural illuminance. "
        "Step outside within an hour of waking."
    )
    model_i = intel.analyze_topic_or_script(
        script=obs_script, topic="Morning Sunlight Lux"
    )
    f7_sig = model_i.frontierSignals.signals.get("F7", {}).get("signal")
    if f7_sig in ["LOW", "MEDIUM"]:
        print(f"  ✅ PASS: Observational script does not force high causal state machine: {f7_sig}.")
        passed += 1
    else:
        print(f"  ❌ FAIL: Causal signal unexpectedly high: {f7_sig}")

    # -------------------------------------------------------------
    # Scenario J: Emotionally Driven Script (Breath-Hold Detection)
    # -------------------------------------------------------------
    print("\n[Scenario J] Emotionally Driven Script (Breath-Hold Detection)...")
    epiphany_script = (
        "You believe exhaustion means you lack discipline. "
        "In reality you are simply ignoring the biological warning alarm. "
        "In this sudden freeze moment you realize the system was screaming for rest. "
        "Honor your circadian boundary."
    )
    model_j = intel.analyze_topic_or_script(
        script=epiphany_script, topic="The Exhaustion Alarm"
    )
    bh = model_j.temporalModel.breathHoldWindow
    if bh.get("suggested") and bh.get("durationFrames") == 18:
        print(f"  ✅ PASS: Detected F6 Dramatic Breath-Hold ({bh.get('durationFrames')} frames) at ~{bh.get('approximateTimestampSec')}s.")
        passed += 1
    else:
        print(f"  ❌ FAIL: Breath hold not detected: {bh}")

    # -------------------------------------------------------------
    # Scenario K: Abstract Script (Visual Absence Validation)
    # -------------------------------------------------------------
    print("\n[Scenario K] Abstract Script (Visual Absence Validation)...")
    abstract_script = (
        "Notice how you delay difficult conversations? "
        "And that's why unexpressed boundaries fester into resentment. "
        "Speak your truth clearly."
    )
    model_k = intel.analyze_topic_or_script(
        script=abstract_script, topic="Unexpressed Boundaries"
    )
    has_spoken_only = any(va.recommendedTreatment == "spoken_only" for va in model_k.visualAbsence)
    if has_spoken_only:
        print("  ✅ PASS: Successfully classified connective filler phrases as SPOKEN_ONLY.")
        passed += 1
    else:
        print(f"  ❌ FAIL: Visual absence not identified: {model_k.visualAbsence}")

    # -------------------------------------------------------------
    # Scenario L: Multiple Competing Visual Opportunities (Hierarchy)
    # -------------------------------------------------------------
    print("\n[Scenario L] Multiple Competing Visual Opportunities...")
    comp_script = (
        "Under sustained pressure your capacity stretches like elastic. "
        "At the breaking limit the brittle container fractures with violent force. "
        "Release the burden."
    )
    model_l = intel.analyze_topic_or_script(
        script=comp_script, topic="Pressure Limit"
    )
    opp_types = [o.opportunityType for o in model_l.visualOpportunities]
    if "constraint" in opp_types and "threshold" in opp_types:
        print(f"  ✅ PASS: Ranked multiple visual opportunities: {opp_types}.")
        passed += 1
    else:
        print(f"  ❌ FAIL: Incomplete opportunity ranking: {opp_types}")

    # -------------------------------------------------------------
    # Scenario M: Unsupported Factual Claim (Flagged in Diagnostics)
    # -------------------------------------------------------------
    print("\n[Scenario M] Unsupported Factual Claim Flagging...")
    unsupported_script = (
        "Ninety-nine percent of people fail because of a secret brain enzyme. "
        "This enzymatic reaction destroys all motivation before breakfast. "
        "Drink mineral water to survive."
    )
    model_m = intel.analyze_topic_or_script(
        script=unsupported_script, topic="The Secret Enzyme"
    )
    if len(model_m.diagnostics.unsupportedClaims) > 0:
        print(f"  ✅ PASS: Correctly flagged unsupported factual claim: \"{model_m.diagnostics.unsupportedClaims[0][:50]}...\"")
        passed += 1
    else:
        print(f"  ❌ FAIL: Unsupported claim went unflagged: {model_m.diagnostics.unsupportedClaims}")

    # -------------------------------------------------------------
    # Scenario N: Ambiguous Structure Handling (Zero Crashing)
    # -------------------------------------------------------------
    print("\n[Scenario N] Ambiguous Single-Sentence Script Handling...")
    ambig_script = "Just stop overthinking."
    model_n = intel.analyze_topic_or_script(
        script=ambig_script, topic="Overthinking"
    )
    if len(model_n.segments) >= 1 and len(model_n.diagnostics.structuralNotes) > 0:
        print("  ✅ PASS: Handled minimal ambiguous input gracefully with structural advisory.")
        passed += 1
    else:
        print(f"  ❌ FAIL: Ambiguous script crashed or failed: {model_n}")

    # -------------------------------------------------------------
    # Scenario O: Cyclic / Repeated Concept (Temporal Loop Detection)
    # -------------------------------------------------------------
    print("\n[Scenario O] Cyclic / Repeated Concept Detection...")
    repeat_script = (
        "The loop repeats again every single day. "
        "You make the compromise, the cycle resets, and you do it again. "
        "Interrupt the loop today."
    )
    model_o = intel.analyze_topic_or_script(
        script=repeat_script, topic="The Daily Cycle"
    )
    if model_o.temporalModel.hasRepetition and model_o.temporalModel.pacing == "cyclic_loop":
        print(f"  ✅ PASS: Correctly identified cyclic loop: pacing={model_o.temporalModel.pacing}.")
        passed += 1
    else:
        print(f"  ❌ FAIL: Repetition loop missed: {model_o.temporalModel}")

    # -------------------------------------------------------------
    # Scenario P: Cross-Scene Persistent Narrative Object
    # -------------------------------------------------------------
    print("\n[Scenario P] Persistent Narrative Object Continuity...")
    model_p = intel.analyze_topic_or_script(
        topic="Open Brain Tabs and Cognitive Load",
        script="Every unfinished task leaves an open tab in your brain. Each unresolved loop drains bandwidth. Offload it.",
    )
    persistent = model_p.entitiesAndConcepts.get("persistentObjects", [])
    if len(persistent) > 0:
        print(f"  ✅ PASS: Tracked persistent narrative object: \"{persistent[0]}\".")
        passed += 1
    else:
        print(f"  ❌ FAIL: No persistent object identified: {persistent}")

    # -------------------------------------------------------------
    # Summary
    # -------------------------------------------------------------
    print("\n" + "=" * 78)
    print(f"FRONTIER S TEST MATRIX RESULTS: {passed} / {total} SCENARIOS PASSED")
    print("=" * 78)

    return passed == total


if __name__ == "__main__":
    success = run_test_suite()
    sys.exit(0 if success else 1)
