#!/usr/bin/env python3
"""Fast, non-rendering regression tests for semantic scene planning."""
from visual_design_system import build_visual_design_plan

CASES = {
    "motivation": "Motivation disappears when the hard work starts. Retrieve evidence from a past win. Do one repeatable rep.",
    "habit": "A tiny habit repeats every day. Each repetition compounds. The small action becomes a structure.",
    "psychology": "Your brain avoids uncertainty. It splits every choice into threats. Pick one clear path.",
    "comparison": "Comparison makes someone else's timeline feel like yours. Split the two stories apart. Return to your own measure.",
    "cause_effect": "One late scroll triggers a late bedtime. The late bedtime creates a tired morning. Break the first link.",
    "growth": "Progress is not a leap. Small actions accumulate. The structure gets stronger over time.",
    "science": "Light sets a biological timer. The signal travels through a daily sequence. Protect the timing window.",
    "emotion": "An anxious thought crowds every option. Isolate the next controllable action. Let the noise recede.",
}

for name, script in CASES.items():
    plan = build_visual_design_plan(name, script)
    diversity = plan["diversity"]
    assert diversity["passes"], f"{name}: diversity failed: {diversity}"
    assert len(set(diversity["metaphors"])) >= 3, f"{name}: repeated metaphor: {diversity}"

print(f"validated {len(CASES)} conceptually distinct scene plans without rendering")
