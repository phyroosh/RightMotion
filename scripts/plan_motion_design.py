#!/usr/bin/env python3
"""
🎬 RightClips Professional After Effects Motion Design Planner
Analyzes a topic and script like a Senior After Effects / Cinema 4D Motion Director,
producing a high-end scene-by-scene motion design storyboard before clip scaffolding.
Enforces the 10/10 Dark Glossy Reflection System:
- Zero small pills, zero diagnostic badges, zero text walls.
- Pitch black obsidian void (#000000) with atmospheric radial back-auras.
- Downward glossy wet-floor mirror reflections.
- High-precision glowing vector curves, frosted switchboards, and stepped progress stairs.
"""

import argparse
import json
import re
import sys
from typing import Dict, Any, List


def analyze_topic_and_script(topic: str, script: str) -> Dict[str, Any]:
    clean_topic = re.sub(r"\{\s*[^}]+\s*\}", "", topic).strip()
    full_text = f"{clean_topic} {script}".strip()
    lower_text = full_text.lower()

    # Split into sentences
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", script) if s.strip()]
    if not sentences:
        sentences = [script]

    hook_sentence = sentences[0] if len(sentences) > 0 else clean_topic
    closing_sentence = sentences[-1] if len(sentences) > 1 else ""

    # Determine topic domain
    is_health = any(k in lower_text for k in ["cortisol", "hormone", "circadian", "sleep", "sunlight", "glucose", "dopamine", "energy", "biology", "body", "brain"])
    is_finance = any(k in lower_text for k in ["money", "wealth", "invest", "compound", "dividend", "debt", "cash", "budget", "rich", "market"])
    is_mindset = not is_health and not is_finance

    # --- BEAT 1: HOOK & PARADOX ---
    # Extract punchy 1-2 word focus title
    if is_health:
        s1_title = "CORTISOL INVERSION" if "cortisol" in lower_text else "CIRCADIAN CLASH"
        s1_glow = "rgba(244, 63, 94, 0.18)" # crimson
        s1_curve_color = "#f43f5e"
    elif is_finance:
        s1_title = "THE COMPOUND LEAK" if "compound" in lower_text else "WEALTH FRICTION"
        s1_glow = "rgba(239, 68, 68, 0.18)"
        s1_curve_color = "#ef4444"
    else:
        # Mindset / Psychology
        words = [w for w in re.sub(r"[^\w\s]", "", hook_sentence).split() if len(w) > 3 and w.lower() not in ["notice", "youre", "when", "with", "have", "ever"]]
        s1_title = f"{words[0].upper()} {words[1].upper()}" if len(words) >= 2 else "THE PARADOX"
        s1_glow = "rgba(244, 63, 94, 0.16)"
        s1_curve_color = "#f43f5e"

    scene_1 = {
        "scene": 1,
        "name": "The Root Paradox & Disruption",
        "timing": "0.0s - 4.8s (Frames 0 - 145)",
        "archetype": "GlossyGlowGraph",
        "title": s1_title,
        "titleColor": "#ffffff",
        "lighting": {
            "backdrop": "#000000",
            "glowColor": s1_glow,
            "glowCenterY": 42
        },
        "motion": {
            "component": "GlossyGlowGraph",
            "type": "Single Rising/Spike Curve",
            "curveColor": s1_curve_color,
            "yLabel": "INTENSITY",
            "xLabels": ["START", "MID-DAY", "EVENING", "PEAK"],
            "beaconHead": True,
            "areaGradient": True,
            "showFloorReflection": True,
            "reflectionOpacity": 0.38
        },
        "sfx": [
            {"frame": 0, "type": "whoosh_deep", "volume": 0.32},
            {"frame": 15, "type": "whoosh_fast", "volume": 0.28}
        ]
    }

    # --- BEAT 2: THE MECHANISM & BIOLOGICAL/COGNITIVE SYSTEM ---
    if is_health:
        s2_title = "ENERGY DEPLOYMENT"
        s2_header_bg = "rgba(16, 185, 129, 0.28)"
        s2_items = [
            {"id": "toggle_1", "label": "GLUCOSE RELEASE", "activeColor": "#10b981"},
            {"id": "toggle_2", "label": "PHYSICAL DRIVE", "activeColor": "#10b981"},
            {"id": "toggle_3", "label": "CELLULAR ENERGY", "activeColor": "#10b981"}
        ]
    elif is_finance:
        s2_title = "CAPITAL DEPLOYMENT"
        s2_header_bg = "rgba(16, 185, 129, 0.28)"
        s2_items = [
            {"id": "toggle_1", "label": "AUTOMATED DCA", "activeColor": "#10b981"},
            {"id": "toggle_2", "label": "DIVIDEND REINVEST", "activeColor": "#10b981"},
            {"id": "toggle_3", "label": "COMPOUND VELOCITY", "activeColor": "#10b981"}
        ]
    else:
        s2_title = "NEURAL SHIFT"
        s2_header_bg = "rgba(56, 189, 248, 0.28)"
        s2_items = [
            {"id": "toggle_1", "label": "IDENTITY ANCHOR", "activeColor": "#38bdf8"},
            {"id": "toggle_2", "label": "FRICTION REDUCTION", "activeColor": "#38bdf8"},
            {"id": "toggle_3", "label": "DOPAMINE RESET", "activeColor": "#38bdf8"}
        ]

    scene_2 = {
        "scene": 2,
        "name": "The System Mechanism",
        "timing": "4.8s - 9.8s (Frames 145 - 295)",
        "archetype": "GlossyToggleBoard",
        "title": s2_title,
        "titleColor": "#ffffff",
        "headerBg": s2_header_bg,
        "lighting": {
            "backdrop": "#000000",
            "glowColor": "rgba(16, 185, 129, 0.20)" if not is_mindset else "rgba(56, 189, 248, 0.20)",
            "glowCenterY": 42
        },
        "motion": {
            "component": "GlossyToggleBoard",
            "width": 620,
            "showCursor": True,
            "cursorClickFrame": 180,
            "toggles": s2_items,
            "showFloorReflection": True,
            "reflectionOpacity": 0.35
        },
        "sfx": [
            {"frame": 145, "type": "whoosh_deep", "volume": 0.30},
            {"frame": 180, "type": "click", "volume": 0.28},
            {"frame": 220, "type": "click", "volume": 0.28},
            {"frame": 250, "type": "click", "volume": 0.28}
        ]
    }

    # --- BEAT 3: THE TWIST & COMPARATIVE DUAL CURVE ---
    scene_3 = {
        "scene": 3,
        "name": "The Comparative Breakthrough",
        "timing": "9.8s - 16.8s (Frames 295 - 505)",
        "archetype": "GlossyGlowGraph",
        "title": "OPTIMAL vs INVERTED" if not is_health else "SUNLIGHT vs DARKNESS",
        "titleColor": "#ffffff",
        "lighting": {
            "backdrop": "#000000",
            "glowColor": "rgba(56, 189, 248, 0.16)",
            "glowCenterY": 42
        },
        "motion": {
            "component": "GlossyGlowGraph",
            "type": "Dual Comparative Curves (Reference 1 Style)",
            "curves": [
                {
                    "id": "optimal",
                    "label": "OPTIMAL (REWIRE)",
                    "color": "#10b981",
                    "glow": "#10b981",
                    "behavior": "Surging early peak with graceful natural taper",
                    "beaconHead": True
                },
                {
                    "id": "trap",
                    "label": "THE TRAP (INVERTED)",
                    "color": "#f43f5e",
                    "glow": "#f43f5e",
                    "behavior": "Flatlined lethargy followed by emergency spike",
                    "beaconHead": True
                }
            ],
            "showFloorReflection": True,
            "reflectionOpacity": 0.38
        },
        "sfx": [
            {"frame": 295, "type": "whoosh_sparkle", "volume": 0.32},
            {"frame": 360, "type": "whoosh_fast", "volume": 0.28}
        ]
    }

    # --- BEAT 4: THE ACTION PROTOCOL & SPOKEN CTA ---
    steps = [
        {"id": "step_1", "label": "AWARENESS"},
        {"id": "step_2", "label": "PAUSE"},
        {"id": "step_3", "label": "RESET"},
        {"id": "step_4", "label": "OPTIMAL", "isGoal": True}
    ]
    if is_health:
        steps = [
            {"id": "step_1", "label": "WAKE UP"},
            {"id": "step_2", "label": "60 MIN"},
            {"id": "step_3", "label": "LIGHT"},
            {"id": "step_4", "label": "OPTIMAL", "isGoal": True}
        ]

    scene_4 = {
        "scene": 4,
        "name": "The Action Protocol & Spoken CTA",
        "timing": "16.8s - 24.0s (Frames 505 - 720)",
        "archetype": "SteppedProgressionStairs",
        "title": "THE REWIRE PROTOCOL" if not is_health else "60-MINUTE PROTOCOL",
        "titleColor": "#ffffff",
        "lighting": {
            "backdrop": "#000000",
            "glowColor": "rgba(251, 191, 36, 0.20)",
            "glowCenterY": 42
        },
        "motion": {
            "component": "SteppedProgressionStairs",
            "orbColor": "#fbbf24",
            "physics": "Parabolic ballistic jump with radial bloom onto steps",
            "steps": steps,
            "showFloorReflection": True,
            "reflectionOpacity": 0.35
        },
        "sfx": [
            {"frame": 505, "type": "whoosh_deep", "volume": 0.32},
            {"frame": 540, "type": "click", "volume": 0.24},
            {"frame": 580, "type": "click", "volume": 0.24},
            {"frame": 620, "type": "whoosh_sparkle", "volume": 0.35}
        ]
    }

    return {
        "topic": clean_topic,
        "domain": "Health/Biology" if is_health else ("Finance/Wealth" if is_finance else "Psychology/Mindset"),
        "artDirection": {
            "aesthetic": "10/10 Dark Obsidian Void & Wet-Floor Mirror Reflection",
            "canvasBackground": "#000000",
            "typographyDirective": "Zero text walls; exactly 1-2 uppercase glowing focus words per scene",
            "captionsDirective": "Spoken dialogue handled 100% by AppleKineticCaptions in dark mode with neon glow",
            "antiPillDirective": "STRICT BAN on decorative pills, status badges, and diagnostic tags"
        },
        "storyboard": [scene_1, scene_2, scene_3, scene_4]
    }


def print_storyboard_table(plan: Dict[str, Any]):
    print("\n" + "=" * 80)
    print(f"🎬 AFTER EFFECTS MOTION DESIGN STORYBOARD: {plan['topic']}")
    print(f"🏛️  Domain: {plan['domain']} | Aesthetic: {plan['artDirection']['aesthetic']}")
    print("=" * 80)

    for sc in plan["storyboard"]:
        print(f"\n[SCENE {sc['scene']}: {sc['name']}]")
        print(f"  ⏱️  Timing: {sc['timing']}")
        print(f"  ✨ Archetype: {sc['archetype']}")
        print(f"  🔤 Glowing Focus Title: {sc['title']}")
        print(f"  💡 Lighting Aura: {sc['lighting']['glowColor']} over pitch-black")
        print(f"  🌊 Reflection: Downward glossy wet-floor mirror (opacity: {sc['motion']['reflectionOpacity']})")
        sfx_strs = [f"Frame {s['frame']} ({s['type']})" for s in sc['sfx']]
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
