#!/usr/bin/env python3
"""
🎬 RightClips Professional After Effects Motion Design Planner
Analyzes a topic and script like a Senior After Effects / Cinema 4D Motion Director,
producing a high-end scene-by-scene motion design storyboard before clip scaffolding.

Enforces:
1. Dynamic Archetype Variety: Eliminates repetitive cookie-cutter graphics!
   Intelligently selects from 9 bespoke archetypes based on script semantics.
   Enforces strict anti-repetition across beats.
2. Mandatory Judy Intro Pop-Up (0.0s - ~3.8s):
   Waist-up presenter delivers the opening problem hook, backed by atmospheric back-glow
   and downward wet-floor mirror reflection, then gently glides out for the graphics.
3. Fast-Paced yet Gentle Non-Linear Easing:
   Zero linear animations; variable-speed cubic bezier path trimming, living wave oscillations,
   damped spring torque, and smooth settling.
4. The 10/10 Dark Glossy Reflection Master Standard:
   Zero small pills, zero text walls, pitch black void (#000000) with atmospheric radial back-auras.
"""

import argparse
import json
import re
import sys
from typing import Dict, Any, List, Set, Tuple


def extract_punchy_title(sentence: str, fallback: str = "THE PARADOX") -> str:
    """Extracts 1-2 uppercase focal words for the floating 3D neon title."""
    clean = re.sub(r"[^\w\s]", "", sentence)
    stop_words = {
        "notice", "how", "youre", "when", "with", "have", "ever", "that", "this",
        "what", "from", "into", "your", "they", "them", "about", "which", "there",
        "their", "then", "just", "because", "being", "does", "cant", "wont"
    }
    words = [w.upper() for w in clean.split() if len(w) > 3 and w.lower() not in stop_words]
    if len(words) >= 2:
        return f"{words[0]} {words[1]}"
    elif len(words) == 1:
        return words[0]
    return fallback


def score_archetypes_for_beat(
    beat_num: int,
    text: str,
    domain: str,
    used_archetypes: Set[str]
) -> str:
    """
    Semantically scores archetypes based on keywords, conceptual metaphors, and beat role.
    Strictly excludes already used archetypes to guarantee visual diversity!
    """
    lower = text.lower()
    scores: Dict[str, float] = {
        "GlossyGlowGraph": 1.0,
        "GlossyBarChart": 1.0,
        "GlossyRadialDial": 1.0,
        "GlossyBalanceScale": 1.0,
        "GlossyFrictionSlider": 1.0,
        "GlossyToggleBoard": 1.0,
        "SteppedProgressionStairs": 1.0,
        "GlossyFeatureGrid": 0.8,
        "PolishStickerFloat": 0.8,
    }

    # Filter out already used archetypes
    for used in used_archetypes:
        scores[used] = -999.0

    # BEAT-SPECIFIC ROLE BIASES
    if beat_num == 1:
        # Hook & Problem
        scores["GlossyGlowGraph"] += 2.5
        scores["PolishStickerFloat"] += 2.0
        scores["GlossyBarChart"] += 1.5
    elif beat_num == 2:
        # The System Mechanism / Explain Logic
        scores["GlossyToggleBoard"] += 2.5
        scores["GlossyFrictionSlider"] += 2.5
        scores["GlossyRadialDial"] += 2.0
        scores["GlossyFeatureGrid"] += 1.8
    elif beat_num == 3:
        # The Trap & Comparative Breakdown
        scores["GlossyBalanceScale"] += 3.5
        scores["GlossyGlowGraph"] += 3.0
        scores["GlossyBarChart"] += 2.5
    elif beat_num == 4:
        # The High-Leverage Solution & Protocol
        scores["SteppedProgressionStairs"] += 3.5
        scores["GlossyFrictionSlider"] += 2.8
        scores["GlossyRadialDial"] += 2.5
        scores["GlossyFeatureGrid"] += 2.0

    # KEYWORD & METAPHOR HEURISTICS
    # 1. Circular / Time / Thresholds / Rhythms
    if any(k in lower for k in ["window", "hour", "minute", "clock", "timer", "sleep", "melatonin", "countdown", "schedule", "cycle", "threshold"]):
        scores["GlossyRadialDial"] += 4.0

    # 2. Scale / Weighing / Choices / Trade-offs / Versus / Ego vs Income
    if any(k in lower for k in ["versus", "vs", "balance", "trade", "ego", "scale", "anxiety", "peace", "alone", "together", "shrink", "contract", "weigh"]):
        scores["GlossyBalanceScale"] += 4.0

    # 3. Sliders / Friction / Drag / Momentum / Flow State / Resistance
    if any(k in lower for k in ["friction", "slide", "drag", "threshold", "kinetic", "barrier", "resistance", "momentum", "easy", "effortless", "start"]):
        scores["GlossyFrictionSlider"] += 4.0

    # 4. Bars / Columns / Percentages / Spending / Ratios / Disparity
    if any(k in lower for k in ["percent", "ratio", "income", "expense", "budget", "spend", "wealth", "invest", "spike", "drop", "compare", "measure"]):
        scores["GlossyBarChart"] += 3.5

    # 5. Steps / Ladders / Stages / Milestones / Roadmap / Evolution
    if any(k in lower for k in ["step", "stage", "ladder", "floor", "baseline", "progress", "chain", "protocol", "first", "second", "third", "goal"]):
        scores["SteppedProgressionStairs"] += 3.5

    # 6. Switches / Neuro / Toggles / Triggers / Circuits
    if any(k in lower for k in ["switch", "toggle", "circuit", "trigger", "automated", "cue", "dopamine", "neuro", "activate", "turn on", "turn off"]):
        scores["GlossyToggleBoard"] += 3.5

    # 7. Curves / Surges / Crashes / Spikes / Trajectories
    if any(k in lower for k in ["curve", "spike", "crash", "surge", "flat", "peak", "cortisol", "inverted", "trajectory", "wave"]):
        scores["GlossyGlowGraph"] += 3.5

    # Pick highest scoring available archetype
    sorted_archetypes = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    best = sorted_archetypes[0][0]
    return best


def build_scene_motion_plan(
    scene_num: int,
    archetype: str,
    timing_str: str,
    title: str,
    text: str,
    domain: str,
    start_frame: int,
    end_frame: int
) -> Dict[str, Any]:
    """Generates detailed configuration parameters for each selected archetype."""
    fps = 30
    duration_frames = end_frame - start_frame

    # Base lighting by domain & beat
    if domain == "Health/Biology":
        glow_accent = "rgba(244, 63, 94, 0.18)" if scene_num in [1, 3] else "rgba(16, 185, 129, 0.20)"
        neon_color = "#f43f5e" if scene_num in [1, 3] else "#10b981"
    elif domain == "Finance/Wealth":
        glow_accent = "rgba(239, 68, 68, 0.18)" if scene_num in [1, 3] else "rgba(16, 185, 129, 0.22)"
        neon_color = "#ef4444" if scene_num in [1, 3] else "#10b981"
    else:
        glow_accent = "rgba(244, 63, 94, 0.16)" if scene_num in [1, 3] else "rgba(56, 189, 248, 0.20)"
        neon_color = "#f43f5e" if scene_num in [1, 3] else "#38bdf8"

    scene_data: Dict[str, Any] = {
        "scene": scene_num,
        "timing": timing_str,
        "startFrame": start_frame,
        "endFrame": end_frame,
        "archetype": archetype,
        "title": title,
        "titleColor": "#ffffff",
        "lighting": {
            "backdrop": "#000000",
            "glowColor": glow_accent,
            "glowCenterY": 42
        }
    }

    # Configure bespoke motion attributes per archetype
    if archetype == "GlossyGlowGraph":
        is_comparative = (scene_num == 3)
        if is_comparative:
            scene_data["motion"] = {
                "component": "GlossyGlowGraph",
                "type": "Dual Comparative Curves",
                "curves": [
                    {
                        "id": "optimal",
                        "label": "OPTIMAL PROTOCOL",
                        "color": "#10b981",
                        "glow": "#10b981",
                        "startFrame": start_frame + 6,
                        "beaconHead": True
                    },
                    {
                        "id": "trap",
                        "label": "THE TRAP (INVERTED)",
                        "color": "#f43f5e",
                        "glow": "#f43f5e",
                        "startFrame": start_frame + 18,
                        "beaconHead": True
                    }
                ],
                "showFloorReflection": True,
                "reflectionOpacity": 0.38
            }
            scene_data["sfx"] = [
                {"frame": start_frame, "type": "whoosh_sparkle", "volume": 0.32},
                {"frame": start_frame + 20, "type": "whoosh_fast", "volume": 0.26}
            ]
        else:
            scene_data["motion"] = {
                "component": "GlossyGlowGraph",
                "type": "Single Rising Spike Curve",
                "curveColor": neon_color,
                "beaconHead": True,
                "areaGradient": True,
                "showFloorReflection": True,
                "reflectionOpacity": 0.38
            }
            scene_data["sfx"] = [
                {"frame": start_frame, "type": "whoosh_deep", "volume": 0.30},
                {"frame": start_frame + 15, "type": "whoosh_fast", "volume": 0.26}
            ]

    elif archetype == "GlossyBarChart":
        scene_data["motion"] = {
            "component": "GlossyBarChart",
            "bars": [
                {"id": "b1", "label": "INVERTED TRAP", "value": 25, "isOptimal": False},
                {"id": "b2", "label": "OPTIMAL REWIRE", "value": 90, "isOptimal": True}
            ],
            "showFloorReflection": True,
            "reflectionOpacity": 0.38
        }
        scene_data["sfx"] = [
            {"frame": start_frame, "type": "whoosh_deep", "volume": 0.30},
            {"frame": start_frame + 12, "type": "click", "volume": 0.28},
            {"frame": start_frame + 22, "type": "click", "volume": 0.28}
        ]

    elif archetype == "GlossyRadialDial":
        is_countdown = "hour" in text.lower() or "16" in text.lower()
        val_str = "16 HRS" if is_countdown else ("60 MIN" if "60" in text.lower() else "95%")
        sub_str = "MELATONIN TIMER" if is_countdown else ("SUNLIGHT WINDOW" if "sunlight" in text.lower() else "AUTONOMY")
        scene_data["motion"] = {
            "component": "GlossyRadialDial",
            "targetPercent": 80,
            "valueText": val_str,
            "labelText": sub_str,
            "accentColor": "#38bdf8",
            "showFloorReflection": True,
            "reflectionOpacity": 0.38
        }
        scene_data["sfx"] = [
            {"frame": start_frame, "type": "whoosh_sparkle", "volume": 0.32},
            {"frame": start_frame + 25, "type": "click", "volume": 0.26}
        ]

    elif archetype == "GlossyBalanceScale":
        scene_data["motion"] = {
            "component": "GlossyBalanceScale",
            "leftLabel": "THE TRAP",
            "leftSub": "Comfort & Freeze",
            "leftColor": "#f43f5e",
            "rightLabel": "THE SOLUTION",
            "rightSub": "Freedom & Focus",
            "rightColor": "#10b981",
            "winner": "right",
            "showFloorReflection": True,
            "reflectionOpacity": 0.38
        }
        scene_data["sfx"] = [
            {"frame": start_frame, "type": "whoosh_deep", "volume": 0.30},
            {"frame": start_frame + 18, "type": "click", "volume": 0.32}
        ]

    elif archetype == "GlossyFrictionSlider":
        scene_data["motion"] = {
            "component": "GlossyFrictionSlider",
            "startLabel": "HIGH FRICTION",
            "endLabel": "FLOW STATE",
            "startPercent": 15,
            "endPercent": 94,
            "accentColor": "#10b981",
            "showCursor": True,
            "showFloorReflection": True,
            "reflectionOpacity": 0.38
        }
        scene_data["sfx"] = [
            {"frame": start_frame, "type": "whoosh_deep", "volume": 0.30},
            {"frame": start_frame + 18, "type": "click", "volume": 0.28}
        ]

    elif archetype == "GlossyToggleBoard":
        scene_data["motion"] = {
            "component": "GlossyToggleBoard",
            "showCursor": True,
            "cursorClickFrame": start_frame + 24,
            "toggles": [
                {"id": "t1", "label": "TRIGGER IDENTIFIED", "activeColor": "#10b981"},
                {"id": "t2", "label": "KINETIC SHIFT", "activeColor": "#10b981"},
                {"id": "t3", "label": "LOOP COLLAPSED", "activeColor": "#10b981"}
            ],
            "showFloorReflection": True,
            "reflectionOpacity": 0.35
        }
        scene_data["sfx"] = [
            {"frame": start_frame, "type": "whoosh_deep", "volume": 0.30},
            {"frame": start_frame + 24, "type": "click", "volume": 0.28},
            {"frame": start_frame + 44, "type": "click", "volume": 0.28}
        ]

    elif archetype == "SteppedProgressionStairs":
        scene_data["motion"] = {
            "component": "SteppedProgressionStairs",
            "orbColor": "#fbbf24",
            "steps": [
                {"id": "s1", "label": "AWARENESS"},
                {"id": "s2", "label": "PAUSE"},
                {"id": "s3", "label": "ACTION"},
                {"id": "s4", "label": "OPTIMAL", "isGoal": True}
            ],
            "showFloorReflection": True,
            "reflectionOpacity": 0.35
        }
        scene_data["sfx"] = [
            {"frame": start_frame, "type": "whoosh_deep", "volume": 0.32},
            {"frame": start_frame + 20, "type": "click", "volume": 0.24},
            {"frame": start_frame + 40, "type": "click", "volume": 0.24},
            {"frame": start_frame + 60, "type": "whoosh_sparkle", "volume": 0.35}
        ]

    else:
        # Fallback / Feature Grid
        scene_data["motion"] = {
            "component": "GlossyFeatureGrid",
            "showFloorReflection": True,
            "reflectionOpacity": 0.35
        }
        scene_data["sfx"] = [
            {"frame": start_frame, "type": "whoosh_deep", "volume": 0.30}
        ]

    return scene_data


def analyze_topic_and_script(topic: str, script: str) -> Dict[str, Any]:
    clean_topic = re.sub(r"\{\s*[^}]+\s*\}", "", topic).strip()
    full_text = f"{clean_topic} {script}".strip()
    lower_text = full_text.lower()

    # Split into narrative sentences
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", script) if s.strip()]
    if not sentences:
        sentences = [script]

    hook_sentence = sentences[0] if len(sentences) > 0 else clean_topic
    logic_sentence = sentences[1] if len(sentences) > 1 else full_text
    trap_sentence = sentences[2] if len(sentences) > 2 else full_text
    solution_sentence = sentences[-1] if len(sentences) > 3 else sentences[-1]

    # Determine topic domain
    is_health = any(k in lower_text for k in ["cortisol", "hormone", "circadian", "sleep", "sunlight", "glucose", "dopamine", "energy", "biology", "body", "brain"])
    is_finance = any(k in lower_text for k in ["money", "wealth", "invest", "compound", "dividend", "debt", "cash", "budget", "rich", "market"])
    domain = "Health/Biology" if is_health else ("Finance/Wealth" if is_finance else "Psychology/Mindset")

    # Anti-Repetition Tracking Set
    used_archetypes: Set[str] = set()

    # 🎬 MANDATORY JUDY INTRO POP-UP (0.0s - 3.8s / Frames 0 - 110)
    judy_intro_plan = {
        "hasJudyIntro": True,
        "startFrame": 0,
        "exitFrame": 110,
        "timing": "0.0s - 3.8s (Frames 0 - 110)",
        "pose": "character_pointing.png",
        "title": extract_punchy_title(hook_sentence, fallback="THE PARADOX"),
        "glowColor": "rgba(244, 63, 94, 0.22)" if not is_finance else "rgba(239, 68, 68, 0.22)",
        "reflectionOpacity": 0.36,
        "notes": "Judy waist-up delivers opening problem hook with eye contact, backed by radial glow and floor reflection, then non-linearly glides down."
    }

    # 1. SCENE 1: HOOK & PARADOX (0.0s - 7.0s / Frames 0 - 210)
    # Sits alongside/behind Judy's intro and expands fully as Judy glides out
    s1_title = judy_intro_plan["title"]
    s1_arch = score_archetypes_for_beat(1, hook_sentence, domain, used_archetypes)
    used_archetypes.add(s1_arch)
    scene_1 = build_scene_motion_plan(
        1, s1_arch, "0.0s - 7.0s (Frames 0 - 210)", s1_title, hook_sentence, domain, 0, 210
    )

    # 2. SCENE 2: EXPLAIN THE LOGIC - MECHANISM (7.0s - 14.5s / Frames 210 - 435)
    s2_title = extract_punchy_title(logic_sentence, fallback="THE MECHANISM")
    s2_arch = score_archetypes_for_beat(2, logic_sentence, domain, used_archetypes)
    used_archetypes.add(s2_arch)
    scene_2 = build_scene_motion_plan(
        2, s2_arch, "7.0s - 14.5s (Frames 210 - 435)", s2_title, logic_sentence, domain, 210, 435
    )

    # 3. SCENE 3: LOGIC DEEP-DIVE - THE TRAP & COMPARATIVE SHIFT (14.5s - 22.0s / Frames 435 - 660)
    s3_title = extract_punchy_title(trap_sentence, fallback="THE TRAP")
    s3_arch = score_archetypes_for_beat(3, trap_sentence, domain, used_archetypes)
    used_archetypes.add(s3_arch)
    scene_3 = build_scene_motion_plan(
        3, s3_arch, "14.5s - 22.0s (Frames 435 - 660)", s3_title, trap_sentence, domain, 435, 660
    )

    # 4. SCENE 4: DELIVER THE SOLUTION - HIGH-LEVERAGE PROTOCOL (22.0s - 30.0s / Frames 660 - 900)
    s4_title = extract_punchy_title(solution_sentence, fallback="THE PROTOCOL")
    s4_arch = score_archetypes_for_beat(4, solution_sentence, domain, used_archetypes)
    used_archetypes.add(s4_arch)
    scene_4 = build_scene_motion_plan(
        4, s4_arch, "22.0s - 30.0s (Frames 660 - 900)", s4_title, solution_sentence, domain, 660, 900
    )

    return {
        "topic": clean_topic,
        "domain": domain,
        "artDirection": {
            "aesthetic": "10/10 Dark Obsidian Void & Wet-Floor Mirror Reflection",
            "canvasBackground": "#000000",
            "narrativeStructure": "Introduce Problem > Explain the Logic > Give the Solution (25-35s runtime, ZERO CTA)",
            "judyIntroDirective": "Mandatory Judy pop-up at Frame 0 (0-3.8s) with floor reflection, smoothly exiting down before Scene 2",
            "antiRepetitionDirective": "Strictly enforces 4 distinct motion graphic archetypes across all 4 scenes",
            "easingDirective": "Fast-paced yet gentle non-linear cubic-bezier trimming and damped spring torque"
        },
        "judyIntro": judy_intro_plan,
        "storyboard": [scene_1, scene_2, scene_3, scene_4]
    }


def print_storyboard_table(plan: Dict[str, Any]):
    print("\n" + "=" * 80)
    print(f"🎬 AFTER EFFECTS MOTION DESIGN STORYBOARD: {plan['topic']}")
    print(f"🏛️  Domain: {plan['domain']} | Aesthetic: {plan['artDirection']['aesthetic']}")
    print(f"👤 Judy Intro Pop-Up: {plan['judyIntro']['timing']} (Pose: {plan['judyIntro']['pose']})")
    print("=" * 80)

    for sc in plan["storyboard"]:
        print(f"\n[SCENE {sc['scene']}: {sc['timing']}]")
        print(f"  ✨ Archetype: {sc['archetype']}")
        print(f"  🔤 Glowing Focus Title: {sc['title']}")
        print(f"  💡 Lighting Aura: {sc['lighting']['glowColor']} over pitch-black")
        print(f"  🌊 Reflection: Downward glossy wet-floor mirror")
        sfx_strs = [f"Frame {s['frame']} ({s['type']})" for s in sc.get('sfx', [])]
        print(f"  🔊 SFX Cues: {', '.join(sfx_strs)}")
    print("\n" + "=" * 80 + "\n")


def main():
    parser = argparse.ArgumentParser(description="Plan professional After Effects motion graphics for RightClips")
    parser.add_argument("--topic", required=True, help="Video topic")
    parser.add_argument("--script", required=True, help="Full voiceover script")
    parser.add_argument("--output", help="Optional path to save motion_plan.json")
    args = parser.parse_args()

    plan = analyze_topic_and_script(args.topic, args.script)
    print_storyboard_table(plan)

    if args.output:
        with open(args.output, "w", encoding="utf-8") as f:
            json.dump(plan, f, indent=2)
        print(f"💾 Motion plan saved to: {args.output}")

    return plan


if __name__ == "__main__":
    main()
