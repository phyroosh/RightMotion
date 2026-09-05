#!/usr/bin/env python3
"""
Autonomous Meme Matcher Engine for RightClips.
Matches video topics and spoken scripts to high-retention iconic memes
using semantic keyword analysis, emotional intent, and contextual scoring.
"""

import os
import re
import json
import argparse
from pathlib import Path
from typing import Optional, Dict, Any, List

ROOT_DIR = Path(__file__).resolve().parent.parent
REGISTRY_PATH = ROOT_DIR / "public" / "memes" / "registry.json"


def load_registry() -> Dict[str, Any]:
    if not REGISTRY_PATH.exists():
        raise FileNotFoundError(f"Meme registry not found at {REGISTRY_PATH}")
    with open(REGISTRY_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def find_best_meme(topic: str, script: str = "", explicit_meme_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
    registry = load_registry()
    memes: List[Dict[str, Any]] = registry.get("memes", [])

    # 1. If explicit meme ID provided, check for exact match
    if explicit_meme_id:
        clean_id = explicit_meme_id.replace(".mp4", "").strip().lower()
        for m in memes:
            if m["id"] == clean_id or m["filename"] == f"{clean_id}.mp4":
                return m
        for m in memes:
            if clean_id in m["id"] or clean_id in m["name"].lower():
                return m

    # 2. Check if topic/script has an explicit tag like {meme: ishowspeed_stare}
    combined_text = f"{topic} {script}".lower()
    tag_match = re.search(r"\{\s*meme\s*:\s*([a-zA-Z0-9_\-]+)\s*\}", combined_text)
    if tag_match:
        tag_id = tag_match.group(1).lower()
        if tag_id != "auto":
            for m in memes:
                if m["id"] == tag_id:
                    return m
                if tag_id in m["id"]:
                    return m

    # 3. Autonomous Semantic Scoring
    scored_memes = []
    tokens = set(re.findall(r"[a-z0-9]+", combined_text))

    for m in memes:
        score = 0.0

        # Check emotion keywords (weight: 3.5)
        for emo in m.get("emotions", []):
            emo_clean = emo.lower().replace("_", " ")
            if emo_clean in combined_text:
                score += 3.5
            for word in emo_clean.split():
                if word in tokens:
                    score += 1.5

        # Check semantic keywords (weight: 3.0)
        for kw in m.get("keywords", []):
            kw_clean = kw.lower()
            if kw_clean in combined_text:
                score += 3.0
            for word in kw_clean.split():
                if word in tokens:
                    score += 1.2

        # Check best hook phrases (weight: 2.0)
        for phrase in m.get("best_hook_phrases", []):
            phrase_words = set(re.findall(r"[a-z0-9]+", phrase.lower()))
            overlap = len(phrase_words.intersection(tokens))
            if overlap >= 3:
                score += 4.0
            elif overlap >= 2:
                score += 2.0

        if score > 0:
            scored_memes.append((score, m))

    if not scored_memes:
        for m in memes:
            if m["id"] == "side_eye_dog":
                return m
        return memes[0] if memes else None

    # Sort descending by score
    scored_memes.sort(key=lambda x: x[0], reverse=True)
    best_score, best_meme = scored_memes[0]
    return best_meme


def main():
    parser = argparse.ArgumentParser(description="Test RightClips Autonomous Meme Matcher")
    parser.add_argument("--topic", required=True, help="Video topic or hook")
    parser.add_argument("--script", default="", help="Spoken script text")
    parser.add_argument("--meme", default=None, help="Explicit meme ID override")
    args = parser.parse_args()

    match = find_best_meme(args.topic, args.script, explicit_meme_id=args.meme)
    if match:
        print(f"\n🎯 Top Meme Match:")
        print(f"   ID:       {match["id"]}")
        print(f"   Name:     {match["name"]}")
        print(f"   HUD:      {match["hud_label"]}")
        print(f"   SFX:      {match["recommended_sfx"]}")
        print(f"   Duration: {match["default_duration_frames"]} frames (~{match["default_duration_frames"]/30:.1f}s)")
        print(f"   Speed:    {match["playback_rate"]}x fast-forward")
    else:
        print("❌ No matching meme found.")


if __name__ == "__main__":
    main()
