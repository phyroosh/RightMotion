#!/usr/bin/env python3
"""
RightClips High-Precision Semantic Meme Matcher Engine (v2.0).
Matches video topics and spoken hooks to iconic internet culture memes
using archetype analysis, multi-token concept clusters, and negative keyword filtering.
Runs in <15ms with zero agent reasoning overhead.
"""

import os
import re
import json
import argparse
from pathlib import Path
from typing import Optional, Dict, Any, List, Tuple

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
    if not memes:
        return None

    # 1. Explicit ID override via CLI or function parameter
    if explicit_meme_id:
        clean_id = explicit_meme_id.replace(".mp4", "").strip().lower()
        # Exact ID match
        for m in memes:
            if m["id"] == clean_id or m["filename"] == f"{clean_id}.mp4":
                return m
        # Substring in ID or Name
        for m in memes:
            if clean_id in m["id"] or clean_id in m["name"].lower():
                return m

    # 2. Check for explicit inline tag: {meme: <id>}
    combined_text = f"{topic} {script}".lower()
    tag_match = re.search(r"\{\s*meme\s*:\s*([a-zA-Z0-9_\-]+)\s*\}", combined_text)
    if tag_match:
        tag_id = tag_match.group(1).lower()
        if tag_id != "auto":
            for m in memes:
                if m["id"] == tag_id or tag_id in m["id"]:
                    return m

    # 3. High-Precision Semantic Archetype Scoring
    text_clean = re.sub(r"[^\w\s]", " ", combined_text)
    tokens = set(text_clean.split())

    scored_memes: List[Tuple[float, Dict[str, Any]]] = []

    for m in memes:
        score = 0.0

        # A. Negative Keyword Filtering (Severe Penalty)
        for neg in m.get("negative_keywords", []):
            neg_clean = neg.lower()
            if neg_clean in tokens or f" {neg_clean} " in f" {text_clean} ":
                score -= 15.0

        # B. Best Hook Phrases Exact Substring Match (+15.0)
        for phrase in m.get("best_hook_phrases", []):
            phrase_clean = re.sub(r"[^\w\s]", " ", phrase.lower()).strip()
            if phrase_clean and phrase_clean in text_clean:
                score += 15.0
            else:
                phrase_tokens = set(phrase_clean.split())
                overlap = len(phrase_tokens.intersection(tokens))
                if len(phrase_tokens) > 0 and overlap >= len(phrase_tokens) - 1 and len(phrase_tokens) >= 3:
                    score += 8.0

        # C. Concept Clusters (+10.0 per full cluster present)
        for cluster in m.get("concept_clusters", []):
            if all(term.lower() in tokens for term in cluster):
                score += 10.0

        # D. Emotions Match (+4.0)
        for emo in m.get("emotions", []):
            emo_clean = emo.lower().replace("_", " ")
            if emo_clean in text_clean:
                score += 4.0
            elif emo_clean in tokens:
                score += 2.0

        # E. Keywords Match (+2.0 per word, +3.5 if exact multi-word)
        for kw in m.get("keywords", []):
            kw_clean = kw.lower()
            if " " in kw_clean:
                if kw_clean in text_clean:
                    score += 3.5
            else:
                if kw_clean in tokens:
                    score += 2.0

        if score > 0:
            scored_memes.append((score, m))

    # 4. Fallback Selection (Safe universal reaction)
    if not scored_memes:
        for m in memes:
            if m["id"] == "ishowspeed_stare":
                return m
        return memes[0]

    # Sort descending by score
    scored_memes.sort(key=lambda x: x[0], reverse=True)
    best_score, best_meme = scored_memes[0]
    return best_meme


def main():
    parser = argparse.ArgumentParser(description="RightClips Autonomous Meme Matcher (v2.0)")
    parser.add_argument("--topic", required=True, help="Video topic or hook")
    parser.add_argument("--script", default="", help="Spoken script text")
    parser.add_argument("--meme", default=None, help="Explicit meme ID override")
    parser.add_argument("--top", type=int, default=1, help="Number of top matches to display")
    args = parser.parse_args()

    match = find_best_meme(args.topic, args.script, explicit_meme_id=args.meme)
    if match:
        print(f"\n🎯 Top Meme Match:")
        print(f"   ID:          {match['id']}")
        print(f"   Name:        {match['name']}")
        print(f"   Archetype:   {match.get('archetype', 'N/A')}")
        print(f"   HUD:         {match['hud_label']}")
        print(f"   SFX:         {match['recommended_sfx']}")
        print(f"   Duration:    {match['default_duration_frames']} frames (~{match['default_duration_frames']/30:.1f}s)")
        print(f"   Speed:       {match['playback_rate']}x fast-forward")
    else:
        print("❌ No matching meme found.")


if __name__ == "__main__":
    main()
