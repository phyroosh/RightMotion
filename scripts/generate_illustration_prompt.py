#!/usr/bin/env python3
"""
RightClips Hero Image Prompt Generator
Generates high-converting, stylistic prompts for bespoke Hero visuals.
Defaults to the flagship aesthetic: Clean Modern Editorial 2.5D Conceptual Art
(Vox / The New Yorker / Apple Editorial aesthetic) with warm natural lighting,
crisp lines, sophisticated color blocking, and clear human narrative conflict.
"""

import argparse
import json
import re
from typing import Dict, Any, Optional

def extract_core_narrative(topic: str, script: str = "") -> Dict[str, str]:
    """
    Deconstructs topic and hook text into concrete visual storytelling elements.
    """
    clean_topic = re.sub(r"\{\s*[^}]+\s*\}", "", topic).strip()
    full_text = f"{clean_topic} {script}".lower()

    # Relationship / Dating / Social tension
    if any(k in full_text for k in ["relationship", "dating", "love", "teen", "high school", "single", "crush"]):
        return {
            "setting": "A bright, modern, sunlit minimalist high school hallway or contemporary library",
            "protagonist": "A confident young person walking freely with headphones, a light backpack, and a peaceful, relaxed expression",
            "conflict": "In the background, a couple sits on a wooden bench looking emotionally exhausted, overwhelmed, and silently glued to their phones in quiet tension",
            "metaphor": "Clear visual contrast of independent emotional peace versus relational burnout and anxious attachment",
            "palette": "Clean off-white, warm natural sunlight, sky blue, soft coral, and subtle sage green accents"
        }

    # Phone / Doomscrolling / 3 AM sleep / Autopilot
    elif any(k in full_text for k in ["phone", "scroll", "night", "bed", "sleep", "screen", "dopamine", "loop", "social media", "3 am", "2 am"]):
        return {
            "setting": "A minimalist, aesthetic modern bedroom split cleanly between dawn light and blue screen light",
            "protagonist": "A young person sitting peacefully near an open window enjoying morning sunlight with a steaming cup of tea and a journal",
            "conflict": "Reflected in a translucent glass pane or shadow, the weary nighttime version of themselves trapped in bed under harsh blue smartphone glow",
            "metaphor": "The stark divide between intentional circadian presence and digital dopamine entrapment",
            "palette": "Warm amber morning glow, crisp architectural white, contrasting with cool midnight slate and electric cyan"
        }

    # Desk / Work / Procrastination / Burnout / Overthinking
    elif any(k in full_text for k in ["procrastination", "work", "burnout", "study", "exam", "focus", "overthinking", "freeze", "lazy"]):
        return {
            "setting": "A serene, uncluttered Scandinavian-style study with expansive floor-to-ceiling glass windows overlooking nature",
            "protagonist": "A focused student or creative sitting upright at a clean wooden desk, calmly writing with deep flow state clarity",
            "conflict": "A giant translucent tangled sphere of chaotic scribbles, open browser tabs, and clock hands dissolving peacefully into clean geometric lines",
            "metaphor": "Untangling cognitive friction into streamlined single-task momentum",
            "palette": "Soft neutral cream, warm birch wood tones, calming mist blue, and crisp white"
        }

    # Identity / Performance / Mask / Fitting In / Boundaries
    elif any(k in full_text for k in ["mask", "boundary", "boundaries", "people pleaser", "saying no", "fitting in", "judgment"]):
        return {
            "setting": "A sleek modern architectural courtyard with clean geometric archways and sunlit concrete",
            "protagonist": "A person standing tall and authentic, wearing a vibrant, simple modern outfit, making grounded eye contact",
            "conflict": "Around them, several blurred silhouette mannequins wearing identical rigid gray masks look on in rigid conformity",
            "metaphor": "Stepping out of the exhausting performance mask into unapologetic, authentic self-definition",
            "palette": "Luminous sky blue, architectural white, warm sand tones, and a striking coral or gold focal accent"
        }

    # Habit / Minimum Viable / Momentum / Small steps
    elif any(k in full_text for k in ["habit", "small", "atomic", "routine", "discipline", "minimum", "start", "progress"]):
        return {
            "setting": "A clean, modern minimalist living space with soft morning sunlight streaming across a hardwood floor",
            "protagonist": "A person placing a single perfect stone or minimalist wooden block onto a clean architectural foundation",
            "conflict": "In the distance, an impossible mountain is broken down into clean, manageable floating steps bathed in gentle light",
            "metaphor": "The micro-habit protocol: shrinking friction until daily action becomes effortless",
            "palette": "Warm morning sunlight, pale eucalyptus green, warm oat tones, and crisp modern white"
        }

    # General default
    return {
        "setting": "A clean, bright, modern minimalist architectural space with generous natural daylight",
        "protagonist": "An introspective young person exhibiting quiet self-awareness and confident intentionality",
        "conflict": "Surrounding ambient elements visually represent the shift from chaotic inner overthinking to grounded psychological clarity",
        "metaphor": "Mental clarity and emotional sovereignty overcoming modern cognitive clutter",
        "palette": "Apple Studio off-white, warm sunlight, electric sky blue, and subtle coral/emerald highlights"
    }

def build_illustration_prompt(topic: str, script: str = "", style: str = "editorial", niche: str = "self_improvement") -> Dict[str, Any]:
    """
    Synthesizes a complete, high-converting image generation prompt.
    """
    clean_topic = re.sub(r"\{\s*[^}]+\s*\}", "", topic).strip()
    narrative = extract_core_narrative(clean_topic, script)

    if style == "claymorphic_3d":
        prompt = (
            f"A premium 3D claymorphic isometric conceptual illustration. "
            f"Set on a floating minimalist pastel platform: {narrative['setting']}. "
            f"Focal subject: {narrative['protagonist']}. "
            f"Narrative tension: {narrative['conflict']}. "
            f"Concept: {narrative['metaphor']}. "
            f"Tactile smooth matte clay textures, soft rounded edges, warm studio lighting, subtle clean ambient occlusion. "
            f"Color palette: {narrative['palette']}. "
            f"Apple Keynote 3D diorama aesthetic, playful yet sophisticated, pristine minimalist composition. "
            f"No text, no words, no logos, no watermarks."
        )
        aesthetic_tag = "claymorphic_3d_diorama"

    elif style == "cinematic_studio":
        prompt = (
            f"A high-end cinematic editorial studio photograph. "
            f"Setting: {narrative['setting']}. "
            f"Subject: {narrative['protagonist']}. "
            f"Emotional contrast: {narrative['conflict']}. "
            f"Shot on 85mm f/1.8 prime lens, shallow depth of field, natural diffused daylight, authentic human emotion. "
            f"Color palette: {narrative['palette']}. "
            f"Contemporary Kinfolk and Monocle magazine aesthetic, elegant, uncluttered, emotionally resonant. "
            f"No text, no words, no logos, no watermarks."
        )
        aesthetic_tag = "cinematic_studio_editorial"

    else:
        # Default Flagship: Clean Modern Editorial 2.5D Conceptual Art
        prompt = (
            f"A clean modern editorial conceptual illustration. "
            f"Setting: {narrative['setting']}. "
            f"Focal subject: {narrative['protagonist']}. "
            f"Narrative contrast: {narrative['conflict']}. "
            f"Visual concept: {narrative['metaphor']}. "
            f"Crisp lines, sophisticated color blocking, soft pastel gradients, warm natural sunlight, generous negative space. "
            f"Color palette: {narrative['palette']}. "
            f"Apple Studio minimalist aesthetic, The New Yorker and Vox modern conceptual style, uncluttered, emotionally grounded. "
            f"No text, no words, no letters, no logos, no watermarks, no borders."
        )
        aesthetic_tag = "clean_modern_editorial_2d"

    image_name = re.sub(r"[^a-z0-9]+", "_", clean_topic.lower()).strip("_")[:28]
    if not image_name:
        image_name = "editorial_hook"

    return {
        "topic": clean_topic,
        "image_name": f"{image_name}_scene",
        "prompt": prompt,
        "aspect_ratio": "16:9",
        "style": style,
        "reference_aesthetic": aesthetic_tag,
        "narrative": narrative
    }

def main():
    parser = argparse.ArgumentParser(description="Generate bespoke hero visual prompt")
    parser.add_argument("--topic", required=True, help="Video topic or title")
    parser.add_argument("--script", default="", help="Spoken hook or script")
    parser.add_argument("--style", choices=["editorial", "claymorphic_3d", "cinematic_studio"], default="editorial", help="Visual art style")
    parser.add_argument("--niche", default="self_improvement", help="Channel niche")
    parser.add_argument("--json", action="store_true", help="Output JSON format")
    args = parser.parse_args()

    result = build_illustration_prompt(args.topic, script=args.script, style=args.style, niche=args.niche)
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print(f"\n{'='*60}")
        print(f"🎨 Clean Hero Visual Prompt for: '{result['topic']}'")
        print(f"{'='*60}\n")
        print(f"Style:        {result['style']} ({result['reference_aesthetic']})")
        print(f"Image Name:   {result['image_name']}")
        print(f"Aspect Ratio: {result['aspect_ratio']}\n")
        print(f"PROMPT:\n{result['prompt']}\n")
        print(f"{'='*60}\n")

if __name__ == "__main__":
    main()

