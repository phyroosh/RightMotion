#!/usr/bin/env python3
"""
🎬 Frontier T: Thumbnail Hero Prompt Generator
===================================================================
Translates Frontier T visual concepts into prompt-engineered instructions
for bespoke thumbnail hero visuals via `generate_image`.

Guarantees:
- Impossible visual metaphors and physical narrative conflict.
- Extreme silhouette clarity and razor-sharp focal subjects.
- Clean studio lighting with generous negative space.
- STRICT: Zero text, zero letters, zero watermarks, zero UI pill badges in generated raster.
"""

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Dict, Any

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT_DIR / "scripts"))

from thumbnail_director import ThumbnailDirector

def synthesize_thumbnail_hero_prompt(
    manifest: Dict[str, Any],
    style: str = "editorial_2d",
    aspect_ratio: str = "16:9"
) -> Dict[str, Any]:
    """
    Generates a prompt-engineered hero image request for generate_image.
    """
    chosen = manifest["chosenConcept"]
    metaphor = chosen["visualMetaphor"]
    subject = chosen["focalSubject"]
    ground_color = chosen["groundColor"]
    accent_color = chosen["accentColor"]
    topic = manifest["topic"]

    is_dark = ground_color in ["#080c14", "#060913", "#000000", "#0a0c16"]
    bg_desc = (
        "deep cinematic obsidian dark studio background with subtle luminous rim light"
        if is_dark
        else "pristine off-white Apple Studio architectural background with warm natural ambient daylight"
    )

    clean_slug = re.sub(r"[^a-z0-9]+", "_", topic.lower()).strip("_")[:24]

    if style == "claymorphic_3d":
        prompt = (
            f"A high-definition 3D claymorphic isometric conceptual diorama of an impossible psychological metaphor. "
            f"Focal subject: {subject}. "
            f"Visual mechanism: {metaphor}. "
            f"Setting: {bg_desc}, floating on a clean architectural pedestal with soft ambient occlusion. "
            f"Color palette: {ground_color} ground with striking {accent_color} saturated accents and translucent frosted glass elements. "
            f"Composition: Center-weighted dramatic silhouette, generous empty negative space around upper third, razor-sharp edge definition. "
            f"Strictly NO text, NO words, NO letters, NO numbers, NO watermark, NO logos, NO UI buttons."
        )
        aesthetic_tag = "claymorphic_3d_diorama"
    else:
        # Editorial 2.5D Conceptual Art (Vox / The New Yorker / Apple Editorial)
        prompt = (
            f"A masterwork modern editorial conceptual illustration. "
            f"Focal subject: {subject}. "
            f"Visual metaphor: {metaphor}. "
            f"Background: {bg_desc} with generous empty negative space in the upper portion for visual breathing room. "
            f"Color palette: High-contrast palette using clean {ground_color} ground, deep inky lines, and vivid {accent_color} focal accents. "
            f"Style: The New Yorker and Vox modern editorial art, 2.5D layered depth, crisp geometric silhouettes, elegant architectural lighting, sophisticated tactile textures. "
            f"Strictly NO typography, NO written text, NO words, NO letters, NO labels, NO logos, NO watermarks."
        )
        aesthetic_tag = "clean_modern_editorial_2d"

    return {
        "topic": topic,
        "image_name": f"{clean_slug}_thumb_hero",
        "prompt": prompt,
        "aspect_ratio": aspect_ratio,
        "style": style,
        "aesthetic_tag": aesthetic_tag,
        "target_path": f"public/{clean_slug}/assets/thumbnail_hero.png",
        "visualMetaphor": metaphor,
        "focalSubject": subject,
    }


def main():
    parser = argparse.ArgumentParser(description="Frontier T: Thumbnail Hero Prompt Synthesizer")
    parser.add_argument("--topic", required=True, help="Video topic or title")
    parser.add_argument("--script", default="", help="Video script or voiceover")
    parser.add_argument("--niche", default="self_improvement", help="Channel niche")
    parser.add_argument("--style", choices=["editorial_2d", "claymorphic_3d"], default="editorial_2d", help="Visual art style")
    parser.add_argument("--aspect", choices=["16:9", "1:1", "9:16"], default="16:9", help="Image aspect ratio")
    parser.add_argument("--json", action="store_true", help="Print JSON output")
    args = parser.parse_args()

    director = ThumbnailDirector()
    manifest = director.orchestrate(args.topic, script=args.script, niche=args.niche, aspect_ratio="9:16")
    hero_prompt = synthesize_thumbnail_hero_prompt(manifest, style=args.style, aspect_ratio=args.aspect)

    if args.json:
        print(json.dumps(hero_prompt, indent=2))
    else:
        print("\n" + "=" * 60)
        print(f"🎨 Frontier T Thumbnail Hero Visual Prompt for: '{args.topic}'")
        print("=" * 60)
        print(f"Image Name:   {hero_prompt['image_name']}")
        print(f"Aspect Ratio: {hero_prompt['aspect_ratio']}")
        print(f"Style:        {hero_prompt['style']} ({hero_prompt['aesthetic_tag']})")
        print(f"Target Path:  {hero_prompt['target_path']}\n")
        print("PROMPT:")
        print(hero_prompt['prompt'])
        print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
