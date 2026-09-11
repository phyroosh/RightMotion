#!/usr/bin/env python3
"""
RightMotion Gen-Z Meme Reaction Sticker Matcher (v1.0).
Matches spoken video beats or topics to the 15 Gen-Z reaction stickers
for mid-video placement (<MemeStickerOverlay />).
Runs in <10ms with zero agent reasoning overhead.
"""

import os
import re
import json
import argparse
from pathlib import Path
from typing import Optional, Dict, Any, List, Tuple

ROOT_DIR = Path(__file__).resolve().parent.parent
REGISTRY_PATH = ROOT_DIR / "public" / "memes" / "stickers" / "stickers_registry.json"


def load_registry() -> List[Dict[str, Any]]:
    if not REGISTRY_PATH.exists():
        raise FileNotFoundError(f"Stickers registry not found at {REGISTRY_PATH}")
    with open(REGISTRY_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def find_best_sticker(text: str, explicit_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
    stickers = load_registry()
    if not stickers:
        return None

    # 1. Explicit ID override
    if explicit_id:
        clean_id = explicit_id.replace(".png", "").strip().lower()
        for s in stickers:
            if s["id"] == clean_id or clean_id in s["id"]:
                return s

    # 2. Check for inline tag: {sticker: <id>}
    combined_text = text.lower()
    tag_match = re.search(r"\{\s*sticker\s*:\s*([a-zA-Z0-9_\-]+)\s*\}", combined_text)
    if tag_match:
        tag_id = tag_match.group(1).lower()
        for s in stickers:
            if s["id"] == tag_id or tag_id in s["id"]:
                return s

    # 3. Semantic keyword & trigger matching
    text_clean = re.sub(r"[^\w\s]", " ", combined_text)
    tokens = set(text_clean.split())

    scored_stickers: List[Tuple[float, Dict[str, Any]]] = []

    for s in stickers:
        score = 0.0
        # Check situational triggers
        for trigger in s.get("situational_triggers", []):
            trigger_words = trigger.lower().split()
            if all(w in tokens for w in trigger_words):
                score += 3.0
            elif any(w in tokens for w in trigger_words):
                score += 1.0

        # Check Gen-Z slang keywords
        for word in s.get("genz_slang", "").lower().split():
            if len(word) > 3 and word in tokens:
                score += 1.5

        # Check archetype
        for word in s.get("archetype", "").lower().split():
            if len(word) > 4 and word in tokens:
                score += 1.0

        if score > 0:
            scored_stickers.append((score, s))

    if not scored_stickers:
        return None

    scored_stickers.sort(key=lambda x: x[0], reverse=True)
    return scored_stickers[0][1]


def main():
    parser = argparse.ArgumentParser(description="RightMotion Gen-Z Meme Sticker Matcher")
    parser.add_argument("--text", type=str, required=True, help="Spoken beat text or topic to match")
    parser.add_argument("--id", type=str, default=None, help="Explicit sticker ID override")
    args = parser.parse_args()

    matched = find_best_sticker(args.text, args.id)
    if matched:
        print(json.dumps(matched, indent=2))
    else:
        print(json.dumps({"error": "No matching sticker found"}))


if __name__ == "__main__":
    main()
