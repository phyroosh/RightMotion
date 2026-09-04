#!/usr/bin/env python3
"""
RightClips Illustration Prompt Generator
Generates high-converting, stylistic prompts for bespoke painterly surreal illustrations.
Matches the exact signature aesthetic: textured impasto oil brushstrokes, atmospheric chiaroscuro,
and glowing prismatic/neon cognitive distortion trails.
"""

import argparse
import json
import re
from typing import Dict, Any

# Curated thematic scenes tailored to core psychology & habit patterns
THEME_SCENE_MAPPING = [
    {
        "keywords": ["phone", "scroll", "2 am", "bed", "night", "doomscroll", "loop", "app"],
        "subject": "A young person lying in bed or sitting at the edge of a bed in a dark bedroom late at night, holding a smartphone with an intense introspective expression",
        "light_source": "Cool ambient blue glow from the smartphone screen illuminating their weary face and hands",
        "metaphor": "vibrant glowing prismatic neon trails and colorful holographic light swirling from the screen and radiating around their eyes and temples (electric cyan, vivid magenta, soft glowing turquoise), visually representing an automated dopamine loop and subconscious wandering thoughts"
    },
    {
        "keywords": ["desk", "laptop", "work", "burnout", "overthinking", "office", "tired", "freeze", "procrastination"],
        "subject": "A professional or student sitting alone at a clean minimalist desk with a laptop in a dimly lit dark room, resting their head on one hand in deep contemplation",
        "light_source": "Soft cool directional light from the laptop screen and an adjacent window with subtle ambient shadows",
        "metaphor": "vivid glowing chromatic ribbons of neon light and prismatic energy gracefully leaking from their eyes and temples into the shadowy room (glowing cyan, hot pink, violet, and electric teal), visually capturing inner cognitive overload and mental fatigue"
    },
    {
        "keywords": ["mask", "trying", "social", "crowd", "friends", "performance", "fitting in", "judgment"],
        "subject": "A young person standing in a shadowy high school hallway or urban space, wearing a clean modern coat, holding a neutral stoic expression while looking slightly away",
        "light_source": "Moody atmospheric dusk lighting with cool cinematic rim-light separating them from the dark backdrop",
        "metaphor": "a delicate semi-translucent glowing neon geometric mask and chromatic light contours floating an inch off their face (electric turquoise, magenta, and amber luminescence), visually depicting the psychological social mask and the emotional weight of performing indifference"
    },
    {
        "keywords": ["habit", "discipline", "consistent", "minimum", "start", "inertia", "small"],
        "subject": "A person sitting beside an open notebook and a pen on a wooden table in a quiet, dark atmospheric room at dawn, contemplating taking a single small action",
        "light_source": "A single soft warm desk lamp creating deep cinematic chiaroscuro contrast against deep slate and navy tones",
        "metaphor": "a delicate pulsating neon thread of glowing turquoise and electric emerald light connecting their fingertips to the pen and paper, representing neuroplastic momentum and shrinking the initiation threshold"
    }
]

DEFAULT_SCENE = {
    "subject": "An introspective person in a dark, atmospheric room contemplating their thoughts and habits",
    "light_source": "Subtle, cinematic cool rim-lighting creating dramatic chiaroscuro contrast with deep charcoal shadows",
    "metaphor": "vibrant glowing prismatic neon light trails and ethereal chromatic distortions swirling around their eyes and temples (electric cyan, luminous magenta, and warm amber), visually representing psychological self-awareness and subconscious cognitive patterns"
}

def build_illustration_prompt(topic: str) -> Dict[str, Any]:
    """
    Synthesizes a complete image generation prompt matching the user's signature reference style.
    """
    clean_topic = re.sub(r"\{\s*[^}]+\s*\}", "", topic).strip()
    topic_lower = clean_topic.lower()

    # Find matching scenario
    matched_scene = None
    for item in THEME_SCENE_MAPPING:
        if any(kw in topic_lower for kw in item["keywords"]):
            matched_scene = item
            break

    if not matched_scene:
        matched_scene = DEFAULT_SCENE

    # Full prompt formulation
    prompt = (
        f"A stylized digital painterly illustration with thick expressive impasto brushstrokes and rich textured oil canvas finish, moody concept art aesthetic. "
        f"{matched_scene['subject']}. "
        f"Atmospheric chiaroscuro lighting, deep cinematic shadows, dark slate, charcoal, and obsidian background tones. "
        f"{matched_scene['light_source']}. "
        f"Surreal conceptual element: {matched_scene['metaphor']}. "
        f"Cinematic wide 16:9 composition, emotionally grounded, quiet, introspective atmosphere. Highly detailed painted textures, visible oil brushwork, mature fine-art finish. "
        f"No anime faces, no 3D CGI cartoon look, no glossy flat photorealism, no text, no watermark, no border."
    )

    image_name = re.sub(r"[^a-z0-9]+", "_", clean_topic.lower()).strip("_")[:28]
    if not image_name:
        image_name = "psychological_scene"

    return {
        "topic": clean_topic,
        "image_name": f"{image_name}_scene",
        "prompt": prompt,
        "aspect_ratio": "16:9",
        "reference_aesthetic": "painterly_surreal_chiaroscuro"
    }

def main():
    parser = argparse.ArgumentParser(description="Generate bespoke painterly illustration prompt")
    parser.add_argument("--topic", required=True, help="Video topic or title")
    parser.add_argument("--json", action="store_true", help="Output JSON format")
    args = parser.parse_args()

    result = build_illustration_prompt(args.topic)
    if args.json:
        print(json.dumps(result, indent=2))
    else:
        print(f"\n{'='*60}")
        print(f"🎨 Bespoke Painterly Illustration Prompt for: '{result['topic']}'")
        print(f"{'='*60}\n")
        print(f"Image Name: {result['image_name']}")
        print(f"Aspect Ratio: {result['aspect_ratio']}\n")
        print(f"PROMPT:\n{result['prompt']}\n")
        print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
