#!/usr/bin/env python3
"""Script-aware visual reasoning for RightClips scene planning.

This intentionally produces design briefs and composable decisions, not a
template ID.  The canvas author uses the brief to compose primitives.
"""
from __future__ import annotations

import re
from typing import Any

METAPHORS = (
    ("collapse", ("drop", "disappear", "crash", "fade", "decline", "motivation"), "Oversized type loses structure and collapses.", "negative-space", "compress / fracture", "type replacement"),
    ("branch", ("choice", "decide", "path", "option", "uncertain", "avoid"), "A path splits; one route gains visual clarity.", "asymmetric-path", "draw / diverge", "path handoff"),
    ("chain", ("because", "causes", "chain", "trigger", "effect", "loop"), "One action knocks through a visible causal sequence.", "diagonal-flow", "collide / propagate", "continuity push"),
    ("accumulation", ("compound", "repeat", "habit", "small", "build", "grow"), "A small unit duplicates into a stable structure.", "modular-grid", "duplicate / assemble", "assembled reveal"),
    ("comparison", ("versus", "vs", "contrast", "instead", "but", "myth"), "Two competing ideas occupy distinct visual territories.", "split-screen", "counter-move / settle", "match cut"),
    ("archive", ("memory", "evidence", "record", "cookie jar", "survived", "past"), "Evidence is stored, retrieved, and becomes present force.", "editorial-column", "file / retrieve", "object handoff"),
    ("timeline", ("time", "minute", "hour", "schedule", "sequence", "then"), "A sequence advances through clearly spaced markers.", "edge-aligned", "track / advance", "directional wipe"),
    ("isolation", ("focus", "one", "single", "next", "attention"), "Noise recedes until the next action is the only dominant object.", "minimal-center", "mask / isolate", "scale pull"),
)

def _sentences(script: str) -> list[str]:
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", script) if s.strip()] or [script.strip()]

def _pick(text: str, used: set[str]) -> tuple[str, str, str, str, str]:
    lower = text.lower()
    ranked = sorted(METAPHORS, key=lambda item: (sum(word in lower for word in item[1]), item[0] not in used), reverse=True)
    available = [item for item in ranked if item[0] not in used]
    return (available or ranked)[0][0], *(available or ranked)[0][2:]

def build_visual_design_plan(topic: str, script: str) -> dict[str, Any]:
    sentences = _sentences(script)
    used: set[str] = set()
    scenes = []
    for index in range(4):
        text = sentences[min(index, len(sentences) - 1)]
        metaphor, visual, composition, motion, transition = _pick(text, used)
        used.add(metaphor)
        scenes.append({
            "scene": index + 1,
            "concept": text,
            "visualMetaphor": {"id": metaphor, "description": visual},
            "composition": composition,
            "hierarchy": "one dominant object, then supporting relationship, then caption",
            "motionLanguage": motion,
            "transition": transition,
            "typography": "structural: type behaves as an object, not a title card",
            "depth": "one foreground / one background plane only when it clarifies the idea",
            "color": "one semantic accent plus neutral field; glow only when it communicates energy",
            "negativeSpace": "reserve the caption exclusion zone and one intentional breathing area",
            "emotionalTone": "controlled editorial clarity",
        })
    return {"topic": topic, "scenes": scenes, "diversity": diversity_score(scenes)}

def diversity_score(scenes: list[dict[str, Any]]) -> dict[str, Any]:
    metaphors = [s["visualMetaphor"]["id"] for s in scenes]
    layouts = [s["composition"] for s in scenes]
    motions = [s["motionLanguage"] for s in scenes]
    score = round(100 * (len(set(metaphors)) + len(set(layouts)) + len(set(motions))) / max(1, len(scenes) * 3))
    return {"score": score, "metaphors": metaphors, "passes": score >= 75 and len(set(metaphors)) >= min(3, len(scenes))}
